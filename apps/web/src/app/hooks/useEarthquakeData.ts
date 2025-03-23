import { gql, useQuery, useMutation } from '@apollo/client';
import { ApolloError } from '@apollo/client';
import { useToast } from '@earthquake/ui';
import { Earthquake } from '../components/EarthquakeTable';
import dayjs from 'dayjs';
import { SortConfig } from './useQueryParams';
import { type EarthquakeFormValues } from '@earthquake/ui';

export const GET_EARTHQUAKES = gql`
  query GetEarthquakes(
    $page: Int
    $limit: Int
    $filter: EarthquakeFilter
    $sort: EarthquakeSort
  ) {
    earthquakes(
      page: $page
      limit: $limit
      filter: $filter
      sort: $sort
    ) {
      data {
        id
        magnitude
        location
        date
        createdAt
        updatedAt
      }
      count
      hasMore
    }
  }
`;

export const ADD_EARTHQUAKE = gql`
  mutation AddEarthquake($location: String!, $magnitude: Float!, $date: String!) {
    addEarthquake(location: $location, magnitude: $magnitude, date: $date) {
      id
      magnitude
      location
      date
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_EARTHQUAKE = gql`
  mutation UpdateEarthquake(
    $id: ID!
    $location: String
    $magnitude: Float
    $date: String
  ) {
    updateEarthquake(
      id: $id
      location: $location
      magnitude: $magnitude
      date: $date
    ) {
      id
      magnitude
      location
      date
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_EARTHQUAKE = gql`
  mutation DeleteEarthquake($id: ID!) {
    deleteEarthquake(id: $id)
  }
`;

export interface EarthquakeQueryResult {
  earthquakes: {
    data: Earthquake[];
    count: number;
    hasMore: boolean;
  };
}

export interface EarthquakeFilterVariables {
  page: number;
  limit: number;
  filter: {
    location?: string;
    magnitudeFrom?: number;
    magnitudeTo?: number;
    dateFrom?: string;
    dateTo?: string;
  };
  sort: SortConfig;
}

// Using EarthquakeFormValues as the base type for form data
type EarthquakeFormData = EarthquakeFormValues;

// Helper for formatting date strings consistently for the API
const formatDateForAPI = (dateString: string): string => {
  if (!dateString) return '';

  try {
    // Check if it's a numeric string (potential timestamp)
    if (/^\d+$/.test(dateString)) {
      // Try parsing as a timestamp in milliseconds
      const millisDate = dayjs(parseInt(dateString, 10));

      // Check if resulting date is reasonable (between 1900-2100)
      if (millisDate.isValid() && millisDate.year() >= 1900 && millisDate.year() <= 2100) {
        return millisDate.toISOString();
      }

      // Try parsing as a timestamp in seconds
      const secondsDate = dayjs(parseInt(dateString, 10) * 1000);
      if (secondsDate.isValid() && secondsDate.year() >= 1900 && secondsDate.year() <= 2100) {
        return secondsDate.toISOString();
      }
    }

    // Regular date string parsing with dayjs
    const date = dayjs(dateString);

    // Check if date is valid
    if (!date.isValid()) {
      console.warn('Invalid date for API:', dateString);
      return '';
    }

    // Validate the year is reasonable
    if (date.year() < 1900 || date.year() > 2100) {
      console.warn('Year out of reasonable range:', date.year(), 'from', dateString);
      return '';
    }

    // Return ISO format
    return date.toISOString();
  } catch (error) {
    console.error('Error formatting date for API:', dateString, error);
    return '';
  }
};

export function useEarthquakeData(filters: EarthquakeFilterVariables) {
  const { toast } = useToast();

  // Prepare filter variables with properly formatted dates
  const preparedFilters = {
    ...filters,
    filter: {
      ...filters.filter,
      dateFrom: filters.filter.dateFrom ? formatDateForAPI(filters.filter.dateFrom) : undefined,
      dateTo: filters.filter.dateTo ? formatDateForAPI(filters.filter.dateTo) : undefined,
    }
  };

  const queryResult = useQuery<EarthquakeQueryResult>(GET_EARTHQUAKES, {
    variables: preparedFilters,
    fetchPolicy: 'cache-and-network',
  });

  const [addEarthquake, addResult] = useMutation(ADD_EARTHQUAKE, {
    onCompleted: () => {
      toast({
        title: 'Success',
        description: 'Earthquake record added successfully',
      });
      queryResult.refetch();
    },
    onError: (error: ApolloError) => {
      toast({
        title: 'Error',
        description: `Failed to add earthquake: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  const [updateEarthquake, updateResult] = useMutation(UPDATE_EARTHQUAKE, {
    onCompleted: () => {
      toast({
        title: 'Success',
        description: 'Earthquake record updated successfully',
      });
      queryResult.refetch();
    },
    onError: (error: ApolloError) => {
      toast({
        title: 'Error',
        description: `Failed to update earthquake: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  const [deleteEarthquake, deleteResult] = useMutation(DELETE_EARTHQUAKE, {
    onCompleted: () => {
      toast({
        title: 'Success',
        description: 'Earthquake record deleted successfully',
      });
      queryResult.refetch();
    },
    onError: (error: ApolloError) => {
      toast({
        title: 'Error',
        description: `Failed to delete earthquake: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  const addEarthquakeRecord = async (data: EarthquakeFormData) => {
    try {
      // Ensure date is in ISO format
      const formattedData = {
        ...data,
        date: formatDateForAPI(data.date),
      };

      const result = await addEarthquake({
        variables: formattedData,
        update: (cache, { data }) => {
          // Update cache after mutation
          const existingData = cache.readQuery<EarthquakeQueryResult>({
            query: GET_EARTHQUAKES,
            variables: preparedFilters,
          });

          if (existingData && data?.addEarthquake) {
            // Create new data with the added earthquake
            const newData = {
              earthquakes: {
                ...existingData.earthquakes,
                data: [data.addEarthquake, ...existingData.earthquakes.data],
                count: existingData.earthquakes.count + 1,
              },
            };

            // Write the updated data back to the cache
            cache.writeQuery({
              query: GET_EARTHQUAKES,
              variables: preparedFilters,
              data: newData,
            });
          }
        },
      });

      return result;
    } catch (error) {
      console.error('Error in addEarthquakeRecord:', error);
      throw error;
    }
  };

  const updateEarthquakeRecord = async (id: string, data: Partial<EarthquakeFormData>) => {
    try {
      // Ensure date is in ISO format if provided
      const formattedData = {
        ...data,
        date: data.date ? formatDateForAPI(data.date) : undefined,
      };

      const result = await updateEarthquake({
        variables: {
          id,
          ...formattedData,
        },
        update: (cache, { data }) => {
          // Update cache after mutation
          if (data?.updateEarthquake) {
            const existingData = cache.readQuery<EarthquakeQueryResult>({
              query: GET_EARTHQUAKES,
              variables: preparedFilters,
            });

            if (existingData) {
              // Create new data with the updated earthquake
              const newData = {
                earthquakes: {
                  ...existingData.earthquakes,
                  data: existingData.earthquakes.data.map(eq =>
                    eq.id === id ? data.updateEarthquake : eq
                  ),
                },
              };

              // Write the updated data back to the cache
              cache.writeQuery({
                query: GET_EARTHQUAKES,
                variables: preparedFilters,
                data: newData,
              });
            }
          }
        },
      });

      return result;
    } catch (error) {
      console.error('Error in updateEarthquakeRecord:', error);
      throw error;
    }
  };

  const deleteEarthquakeRecord = async (id: string) => {
    try {
      const result = await deleteEarthquake({
        variables: { id },
        update: (cache, { data }) => {
          // Update cache after mutation
          if (data?.deleteEarthquake) {
            const existingData = cache.readQuery<EarthquakeQueryResult>({
              query: GET_EARTHQUAKES,
              variables: preparedFilters,
            });

            if (existingData) {
              // Create new data without the deleted earthquake
              const newData = {
                earthquakes: {
                  ...existingData.earthquakes,
                  data: existingData.earthquakes.data.filter(eq => eq.id !== id),
                  count: existingData.earthquakes.count - 1,
                },
              };

              // Write the updated data back to the cache
              cache.writeQuery({
                query: GET_EARTHQUAKES,
                variables: preparedFilters,
                data: newData,
              });
            }
          }
        },
      });

      return result;
    } catch (error) {
      console.error('Error in deleteEarthquakeRecord:', error);
      throw error;
    }
  };

  return {
    earthquakeData: queryResult.data?.earthquakes,
    loading: queryResult.loading,
    error: queryResult.error,
    refetch: queryResult.refetch,
    addEarthquakeRecord,
    updateEarthquakeRecord,
    deleteEarthquakeRecord,
    addLoading: addResult.loading,
    updateLoading: updateResult.loading,
    deleteLoading: deleteResult.loading,
  };
}