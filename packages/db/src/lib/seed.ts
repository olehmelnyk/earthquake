import * as fs from 'fs';
import csvParser from 'csv-parser';
import { prisma } from './database';
import { z } from 'zod';

// Define strong types for our CSV data structure
interface RawCsvRecord {
  [key: string]: string | undefined;
}

// Create a Zod schema for validating earthquake data
const EarthquakeSchema = z.object({
  location: z.string().transform((val) => {
    // Convert 3rd party location format to our required format
    // Expecting something like "34.0522,-118.2437" (no space after comma)
    if (val.includes(', ')) {
      // Format already has space after comma
      return val;
    } else if (val.includes(',')) {
      // Format has no space after comma, so add one
      const [lat, long] = val.split(',');
      return `${lat}, ${long}`;
    }
    return val;
  }).refine(
    (val) => {
      // Check if location is in format "latitude, longitude" with optional space after comma
      const regex = /^(-?\d+(\.\d+)?),\s*(-?\d+(\.\d+)?)$/;
      if (!regex.test(val)) return false;

      // Extract and validate latitude and longitude values
      const [latStr, longStr] = val.split(',').map(s => s.trim());
      const lat = parseFloat(latStr);
      const long = parseFloat(longStr);

      // Latitude: -90 to 90, Longitude: -180 to 180
      return !isNaN(lat) && !isNaN(long) &&
             lat >= -90 && lat <= 90 && // -90° (South Pole), +90° (North Pole)
             long >= -180 && long <= 180; // -180° (west of the Prime Meridian), +180° (east of the Prime Meridian)
    },
    {
      message: "Location must be in format 'latitude, longitude' with values in valid ranges (lat: -90 to 90, long: -180 to 180)",
    }
  ),
  magnitude: z.string().or(z.number()).transform(val =>
    typeof val === 'number' ? String(val) : val
  ).refine(
    (val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num >= 0.1 && num <= 10;
    },
    {
      message: "Magnitude must be a number between 0.1 and 10",
    }
  ),
  date: z.string().refine(
    (val) => {
      const date = new Date(val);
      return !isNaN(date.getTime()) && date <= new Date();
    },
    {
      message: "Date must be valid and not in the future",
    }
  ),
});

// Type that represents the validated earthquake data
type ValidatedEarthquake = z.infer<typeof EarthquakeSchema>;

// Type for our database record preparation
interface EarthquakeRecord {
  location: string;
  magnitude: number;
  date: Date;
}

interface ValidationSummary {
  totalRecords: number;
  validRecords: number;
  invalidRecords: number;
  errorsByField: Record<string, number>;
}

/**
 * Import earthquake data from CSV
 * @param filePath Path to the CSV file
 */
export async function importEarthquakesFromCSV(filePath: string): Promise<ValidationSummary> {
  const allResults: RawCsvRecord[] = [];
  const validResults: ValidatedEarthquake[] = [];
  const errorsByField: Record<string, number> = {};

  // Read and parse the CSV file
  await new Promise<void>((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (data: RawCsvRecord) => {
        // Log first few records to debug
        if (allResults.length < 3) {
          console.log('Sample record:', data);
        }
        allResults.push(data);
      })
      .on('end', () => resolve())
      .on('error', (error: Error) => reject(error));
  });

  console.log(`Found ${allResults.length} entries in CSV file`);

  // Validate each record
  for (const row of allResults) {
    try {
      // Parse and validate the data
      const validData = EarthquakeSchema.parse(row);
      validResults.push(validData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Track validation errors by field
        error.errors.forEach((err) => {
          const field = err.path.join('.') || 'unknown';
          errorsByField[field] = (errorsByField[field] || 0) + 1;
        });
      }
    }
  }

  console.log(`Validated ${validResults.length} out of ${allResults.length} records`);
  Object.entries(errorsByField).forEach(([field, count]) => {
    console.log(`- ${field}: ${count} errors`);
  });

  // Process data in batches to avoid memory issues
  const batchSize = 1000;
  const batches = Math.ceil(validResults.length / batchSize);

  console.log(`Processing ${batches} batches of up to ${batchSize} records each`);

  let totalInserted = 0;
  for (let i = 0; i < batches; i++) {
    const start = i * batchSize;
    const end = Math.min(start + batchSize, validResults.length);
    const batch = validResults.slice(start, end);

    try {
      // Transform the batch data
      const data: EarthquakeRecord[] = batch.map(row => ({
        location: row.location,
        magnitude: parseFloat(row.magnitude),
        date: new Date(row.date),
      }));

      // Insert batch
      const result = await prisma.earthquake.createMany({
        data,
        skipDuplicates: true, // Skip records that might cause unique constraint violations
      });

      totalInserted += result.count;
      console.log(`Batch ${i + 1}/${batches}: Inserted ${result.count} records`);
    } catch (error) {
      console.error(`Error importing batch ${i + 1}:`, error);
    }
  }

  console.log(`Import completed. Inserted ${totalInserted} records.`);

  return {
    totalRecords: allResults.length,
    validRecords: validResults.length,
    invalidRecords: allResults.length - validResults.length,
    errorsByField
  };
}

/**
 * Run the seed function if this file is executed directly
 */
if (require.main === module) {
  const csvPath = process.argv[2];

  if (!csvPath) {
    console.error('Please provide a path to the CSV file: node seed.js path/to/earthquakes.csv');
    process.exit(1);
  }

  importEarthquakesFromCSV(csvPath)
    .then((summary) => {
      console.log('Seed completed successfully');
      console.log(`Summary: ${summary.validRecords} valid out of ${summary.totalRecords} total records`);
      console.log(`${summary.invalidRecords} invalid records were skipped`);
      process.exit(0);
    })
    .catch((error: unknown) => {
      console.error('Seed failed:', error);
      process.exit(1);
    });
}