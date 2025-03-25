import { graphql, HttpResponse } from 'msw';
import { GET_EARTHQUAKES, ADD_EARTHQUAKE, UPDATE_EARTHQUAKE, DELETE_EARTHQUAKE } from '../hooks/useEarthquakeData';
import dayjs from 'dayjs';

// Define an interface for the earthquake object to avoid any types
interface MockEarthquake {
  id: string;
  location: string;
  magnitude: number;
  date: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: string | number; // Index signature for the sort function
}

// Mock data
const mockEarthquakes: MockEarthquake[] = [
  {
    id: '1',
    location: '37.7749, -122.4194',
    magnitude: 4.5,
    date: '2023-04-15T10:30:00Z',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  },
  {
    id: '2',
    location: '35.6762, 139.6503',
    magnitude: 6.2,
    date: '2023-04-14T08:15:00Z',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  },
  {
    id: '3',
    location: '34.0522, -118.2437',
    magnitude: 3.8,
    date: '2023-04-13T14:45:00Z',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  },
];

// TypeScript types for filter and sort
interface EarthquakeFilterParams {
  location?: string;
  magnitudeFrom?: number;
  magnitudeTo?: number;
  dateFrom?: string;
  dateTo?: string;
}

interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
}

// Define types for the GraphQL responses and variables
interface GetEarthquakesQuery {
  earthquakes: {
    data: MockEarthquake[];
    count: number;
    hasMore: boolean;
  };
}

interface GetEarthquakesVariables {
  page?: number;
  limit?: number;
  filter?: EarthquakeFilterParams;
  sort?: SortConfig;
}

interface AddEarthquakeQuery {
  addEarthquake: MockEarthquake;
}

interface AddEarthquakeVariables {
  location: string;
  magnitude: number;
  date: string;
}

interface UpdateEarthquakeQuery {
  updateEarthquake: MockEarthquake;
}

interface UpdateEarthquakeVariables {
  id: string;
  location?: string;
  magnitude?: number;
  date?: string;
}

interface DeleteEarthquakeQuery {
  deleteEarthquake: boolean;
}

interface DeleteEarthquakeVariables {
  id: string;
}

// Handlers for GraphQL operations
export const handlers = [
  // GET_EARTHQUAKES handler
  graphql.query<GetEarthquakesQuery, GetEarthquakesVariables>(GET_EARTHQUAKES, ({ variables }) => {
    const { page = 1, limit = 10, filter = {} as EarthquakeFilterParams, sort = {} as SortConfig } = variables;

    // Apply filters
    let filteredData = [...mockEarthquakes];

    if (filter.location) {
      filteredData = filteredData.filter(eq =>
        eq.location.toLowerCase().includes(filter.location?.toLowerCase() ?? '')
      );
    }

    if (filter.magnitudeFrom !== undefined) {
      const minMagnitude = filter.magnitudeFrom;
      filteredData = filteredData.filter(eq => eq.magnitude >= minMagnitude);
    }

    if (filter.magnitudeTo !== undefined) {
      const maxMagnitude = filter.magnitudeTo;
      filteredData = filteredData.filter(eq => eq.magnitude <= maxMagnitude);
    }

    if (filter.dateFrom) {
      const fromDate = dayjs(filter.dateFrom);
      filteredData = filteredData.filter(eq => dayjs(eq.date).isAfter(fromDate) || dayjs(eq.date).isSame(fromDate));
    }

    if (filter.dateTo) {
      const toDate = dayjs(filter.dateTo);
      filteredData = filteredData.filter(eq => dayjs(eq.date).isBefore(toDate) || dayjs(eq.date).isSame(toDate));
    }

    // Apply sorting
    if (sort.field) {
      filteredData.sort((a, b) => {
        if (sort.field === 'date' || sort.field === 'createdAt' || sort.field === 'updatedAt') {
          return sort.direction === 'asc'
            ? dayjs(a[sort.field]).unix() - dayjs(b[sort.field]).unix()
            : dayjs(b[sort.field]).unix() - dayjs(a[sort.field]).unix();
        }

        if (typeof a[sort.field] === 'string') {
          return sort.direction === 'asc'
            ? (a[sort.field] as string).localeCompare(b[sort.field] as string)
            : (b[sort.field] as string).localeCompare(a[sort.field] as string);
        }

        return sort.direction === 'asc'
          ? (a[sort.field] as number) - (b[sort.field] as number)
          : (b[sort.field] as number) - (a[sort.field] as number);
      });
    }

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const paginatedData = filteredData.slice(startIndex, startIndex + limit);

    return HttpResponse.json({
      data: {
        earthquakes: {
          data: paginatedData,
          count: filteredData.length,
          hasMore: startIndex + limit < filteredData.length
        }
      }
    });
  }),

  // ADD_EARTHQUAKE handler
  graphql.mutation<AddEarthquakeQuery, AddEarthquakeVariables>(ADD_EARTHQUAKE, ({ variables }) => {
    const { location, magnitude, date } = variables;
    const newEarthquake: MockEarthquake = {
      id: String(mockEarthquakes.length + 1),
      location,
      magnitude,
      date,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // In a real handler, we would add to the mock data
    // mockEarthquakes.push(newEarthquake);

    return HttpResponse.json({
      data: {
        addEarthquake: newEarthquake
      }
    });
  }),

  // UPDATE_EARTHQUAKE handler
  graphql.mutation<UpdateEarthquakeQuery, UpdateEarthquakeVariables>(UPDATE_EARTHQUAKE, ({ variables }) => {
    const { id, location, magnitude, date } = variables;
    const existingIndex = mockEarthquakes.findIndex(eq => eq.id === id);

    if (existingIndex === -1) {
      return HttpResponse.json(
        {
          errors: [
            { message: 'Earthquake not found' }
          ]
        },
        { status: 404 }
      );
    }

    const updatedEarthquake: MockEarthquake = {
      ...mockEarthquakes[existingIndex],
      ...(location !== undefined && { location }),
      ...(magnitude !== undefined && { magnitude }),
      ...(date !== undefined && { date }),
      updatedAt: new Date().toISOString()
    };

    // In a real handler, we would update the mock data
    // mockEarthquakes[existingIndex] = updatedEarthquake;

    return HttpResponse.json({
      data: {
        updateEarthquake: updatedEarthquake
      }
    });
  }),

  // DELETE_EARTHQUAKE handler
  graphql.mutation<DeleteEarthquakeQuery, DeleteEarthquakeVariables>(DELETE_EARTHQUAKE, ({ variables }) => {
    const { id } = variables;
    const existingIndex = mockEarthquakes.findIndex(eq => eq.id === id);

    if (existingIndex === -1) {
      return HttpResponse.json(
        {
          errors: [
            { message: 'Earthquake not found' }
          ]
        },
        { status: 404 }
      );
    }

    // In a real handler, we would remove from the mock data
    // mockEarthquakes.splice(existingIndex, 1);

    return HttpResponse.json({
      data: {
        deleteEarthquake: true
      }
    });
  })
];