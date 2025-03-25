import { z } from 'zod';

// Helper for date validation
const validateDateTime = (val: string | undefined, allowFuture = false): boolean => {
  if (!val) return true;

  const date = new Date(val);
  if (isNaN(date.getTime())) return false;

  if (!allowFuture && date > new Date()) return false;

  return true;
};

// Reusable validation schema for earthquake data
export const locationSchema = z.string().transform((val) => {
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
    if (!val || !regex.test(val)) return true; // Allow empty for optional filtering

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
);

export const magnitudeRangeSchema = {
  magnitudeFrom: z.number().min(0).max(10).optional(),
  magnitudeTo: z.number().min(0).max(10).optional(),
};

export const dateRangeSchema = {
  dateFrom: z.string().optional().refine(
    (val) => validateDateTime(val, false), // Allow future dates for filtering
    { message: "Date From must be a valid date" }
  ),
  dateTo: z.string().optional().refine(
    (val) => validateDateTime(val, false), // Allow future dates for filtering
    { message: "Date To must be a valid date" }
  ),
};

// Filter schema - used for searching/filtering earthquakes
export const earthquakeFilterSchema = z.object({
  location: locationSchema.optional(),
  ...magnitudeRangeSchema,
  ...dateRangeSchema,
}).refine(
  (data) => {
    // If both dates are provided, ensure dateFrom is not after dateTo
    if (data.dateFrom && data.dateTo) {
      const from = new Date(data.dateFrom);
      const to = new Date(data.dateTo);
      return from <= to;
    }
    return true;
  },
  {
    message: "Date From must be before or equal to Date To",
    path: ["dateFrom"],
  }
).refine(
  (data) => {
    // If both magnitudes are provided, ensure magnitudeFrom is not greater than magnitudeTo
    if (data.magnitudeFrom !== undefined && data.magnitudeTo !== undefined) {
      return data.magnitudeFrom <= data.magnitudeTo;
    }
    return true;
  },
  {
    message: "Magnitude From must be less than or equal to Magnitude To",
    path: ["magnitudeFrom"],
  }
);

// Full schema for earthquake creation/editing
export const earthquakeFormSchema = z.object({
  location: locationSchema,
  magnitude: z.number().min(0.1).max(10),
  date: z.string().refine(
    (val) => validateDateTime(val),
    {
      message: "Date and time must be valid and not in the future",
    }
  ),
});

export type EarthquakeFilterValues = z.infer<typeof earthquakeFilterSchema>;
export type EarthquakeFormValues = z.infer<typeof earthquakeFormSchema>;

// Export an alias for components expecting 'EarthquakeSchema'
export const EarthquakeSchema = earthquakeFormSchema;