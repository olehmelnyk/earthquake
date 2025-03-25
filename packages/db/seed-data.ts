import { importEarthquakesFromCSV } from './src/lib/seed';
import * as path from 'path';

// Path to sample earthquake data CSV file
const csvFilePath = path.resolve(__dirname, './data/earthquakes.csv');

// Run the import function
importEarthquakesFromCSV(csvFilePath)
  .then((summary) => {
    console.log('Seed completed successfully');
    console.log(`Summary: ${summary.validRecords} valid out of ${summary.totalRecords} total records`);
    console.log(`${summary.invalidRecords} invalid records were skipped`);
    if (summary.errorsByField) {
      console.log('Errors by field:', summary.errorsByField);
    }
    process.exit(0);
  })
  .catch((error: unknown) => {
    console.error('Seed failed:', error);
    process.exit(1);
  });