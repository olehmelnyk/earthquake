export * from './lib/types';

// Re-export schema types from UI package
export type { EarthquakeFilterValues, EarthquakeFormValues } from '@earthquake/ui';

// Re-export schema objects too
export { earthquakeFilterSchema, earthquakeFormSchema } from '@earthquake/ui';
