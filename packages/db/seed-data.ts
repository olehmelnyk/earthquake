import { prisma } from './src/lib/database';
import * as fs from 'fs';
import csvParser from 'csv-parser';
import * as path from 'path';

// Define types for our CSV data structure
interface RawCsvRecord {
  [key: string]: string | undefined;
  DateTime?: string;
  Latitude?: string;
  Longitude?: string;
  Depth?: string;
  Magnitude?: string;
  MagType?: string;
  NbStations?: string;
  Gap?: string;
  Distance?: string;
  RMS?: string;
  Source?: string;
  EventID?: string;
}

interface EarthquakeRecord {
  location: string;
  magnitude: number;
  date: Date;
}

interface ValidationSummary {
  totalRecords: number;
  validRecords: number;
  invalidRecords: number;
}

/**
 * Import earthquake data from CSV
 * @param filePath Path to the CSV file
 */
async function importEarthquakesFromCSV(filePath: string): Promise<ValidationSummary> {
  console.log(`Reading earthquake data from ${filePath}`);

  const allResults: RawCsvRecord[] = [];
  const validResults: EarthquakeRecord[] = [];

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
      // Extract data based on the actual CSV format
      const latitude = row.Latitude ?? '';
      const longitude = row.Longitude ?? '';
      const magnitude = row.Magnitude ?? '';
      const dateTime = row.DateTime ?? '';

      // Simple validation
      if (!latitude || !longitude || !magnitude || !dateTime) {
        continue;
      }

      // Format the location as "latitude, longitude"
      const location = `${parseFloat(latitude)}, ${parseFloat(longitude)}`;

      // Parse date - format is "YYYY/MM/DD HH:MM:SS.SS"
      let date: Date;
      try {
        date = new Date(dateTime);
        if (isNaN(date.getTime())) {
          // Try alternative parsing if standard Date constructor fails
          const [datePart, timePart] = dateTime.split(' ');
          const [year, month, day] = datePart.split('/').map(Number);
          const [hour, minute, second] = timePart.split(':').map(val => {
            // Handle seconds with decimal part
            return parseFloat(val);
          });

          date = new Date(year, month - 1, day, hour, minute, Math.floor(second));

          if (isNaN(date.getTime())) {
            console.warn(`Invalid date format: ${dateTime}`);
            continue;
          }
        }
      } catch (error) {
        console.warn(`Error parsing date ${dateTime}:`, error);
        continue;
      }

      // Validate magnitude
      const magnitudeNum = parseFloat(magnitude);
      if (isNaN(magnitudeNum) || magnitudeNum < 0.1 || magnitudeNum > 10) {
        console.warn(`Invalid magnitude: ${magnitude}`);
        continue;
      }

      // Add valid record
      validResults.push({
        location,
        magnitude: magnitudeNum,
        date
      });
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
      // Insert batch
      const result = await prisma.earthquake.createMany({
        data: batch,
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
    invalidRecords: allResults.length - validResults.length
  };
}

// Path to sample earthquake data CSV file
const csvFilePath = path.resolve(__dirname, './data/earthquakes.csv');

// Run the import function
importEarthquakesFromCSV(csvFilePath)
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