import * as fs from 'fs';
import csvParser from 'csv-parser';
import { prisma } from './database';
import { z } from 'zod';

// Define strong types for our CSV data structure
interface RawCsvRecord {
  DateTime?: string;
  Latitude?: string;
  Longitude?: string;
  Magnitude?: string;
  [key: string]: string | undefined;
}

interface ValidationSummary {
  totalRecords: number;
  validRecords: number;
  invalidRecords: number;
  errorsByField?: Record<string, number>;
}

// Create a Zod schema for validating earthquake data
const EarthquakeSchema = z.object({
  location: z.string().min(1),
  magnitude: z.number().min(0.1).max(10),
  date: z.date().max(new Date())
}).strict();

type ValidatedEarthquake = z.infer<typeof EarthquakeSchema>;

export async function importEarthquakesFromCSV(filePath: string): Promise<ValidationSummary> {
  console.log(`Reading earthquake data from ${filePath}`);

  const allResults: RawCsvRecord[] = [];
  const validResults: ValidatedEarthquake[] = [];
  const errorsByField: Record<string, number> = {
    location: 0,
    magnitude: 0,
    date: 0
  };

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

  // Process the records
  for (const row of allResults) {
    try {
      const latitude = row.Latitude;
      const longitude = row.Longitude;
      const magnitude = row.Magnitude;
      const dateTime = row.DateTime;

      if (!latitude || !longitude || !magnitude || !dateTime) {
        continue;
      }

      // Format location as "latitude, longitude" with 3 decimal places
      const location = `${parseFloat(latitude).toFixed(3)}, ${parseFloat(longitude).toFixed(3)}`;

      // Parse date - format is "YYYY/MM/DD HH:MM:SS.SS"
      let date: Date;
      try {
        const [datePart, timePart] = dateTime.split(' ');
        const [year, month, day] = datePart.split('/').map(Number);
        const [hours, minutes, seconds] = timePart.split(':').map(val => parseFloat(val));

        date = new Date(year, month - 1, day, hours, minutes, Math.floor(seconds));
        if (isNaN(date.getTime())) {
          errorsByField['date'] = (errorsByField['date'] || 0) + 1;
          continue;
        }
      } catch (error) {
        console.warn(`Error parsing date ${dateTime}:`, error);
        errorsByField['date'] = (errorsByField['date'] || 0) + 1;
        continue;
      }

      // Parse magnitude
      const magnitudeNum = parseFloat(magnitude);
      if (isNaN(magnitudeNum)) {
        errorsByField['magnitude'] = (errorsByField['magnitude'] || 0) + 1;
        continue;
      }

      // Validate using Zod schema
      const validatedData = EarthquakeSchema.safeParse({
        location,
        magnitude: magnitudeNum,
        date
      });

      if (validatedData.success) {
        validResults.push(validatedData.data);
      } else {
        validatedData.error.errors.forEach(err => {
          const field = err.path[0] as string;
          errorsByField[field] = (errorsByField[field] || 0) + 1;
        });
      }
    } catch (error) {
      console.warn('Error processing record:', error);
    }
  }

  console.log(`Validated ${validResults.length} out of ${allResults.length} records`);

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
      // Insert batch with explicit type assertion
      const result = await prisma.earthquake.createMany({
        data: batch as Array<{
          location: string;
          magnitude: number;
          date: Date;
        }>,
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