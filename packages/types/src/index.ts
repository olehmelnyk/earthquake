export * from './lib/types';

// Export earthquake schema types directly
export {
  locationSchema,
  magnitudeRangeSchema,
  dateRangeSchema,
  earthquakeFilterSchema,
  earthquakeFormSchema,
  EarthquakeSchema,
  type EarthquakeFilterValues,
  type EarthquakeFormValues
} from './lib/schemas/earthquake';
