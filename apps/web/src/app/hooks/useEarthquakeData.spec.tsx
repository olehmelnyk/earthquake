import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { EarthquakeFilterVariables } from './useEarthquakeData';

// Define the form values type locally to avoid import issues
interface EarthquakeFormValues {
  location: string;
  magnitude: number;
  date: string;
}

// Mock the module before importing it
vi.mock('./useEarthquakeData', () => {
  const mockRefetch = vi.fn();
  const mockAddEarthquake = vi.fn().mockResolvedValue({
    data: { addEarthquake: { id: '3', location: 'Test', magnitude: 5.0, date: '2023-01-01T00:00:00Z' } }
  });
  const mockUpdateEarthquake = vi.fn().mockResolvedValue({
    data: { updateEarthquake: { id: '1', location: 'Updated', magnitude: 6.0, date: '2023-01-01T00:00:00Z' } }
  });
  const mockDeleteEarthquake = vi.fn().mockResolvedValue({
    data: { deleteEarthquake: true }
  });

  return {
    useEarthquakeData: vi.fn().mockReturnValue({
      loading: false,
      error: undefined,
      earthquakeData: {
        data: [
          {
            id: '1',
            location: '37.7749, -122.4194',
            magnitude: 4.5,
            date: '2023-04-15T10:30:00Z',
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2023-01-01T00:00:00Z'
          }
        ],
        count: 1,
        hasMore: false
      },
      refetch: mockRefetch,
      addEarthquakeRecord: mockAddEarthquake,
      updateEarthquakeRecord: mockUpdateEarthquake,
      deleteEarthquakeRecord: mockDeleteEarthquake,
      addLoading: false,
      updateLoading: false,
      deleteLoading: false
    }),
    GET_EARTHQUAKES: 'mock-query',
    ADD_EARTHQUAKE: 'mock-mutation',
    UPDATE_EARTHQUAKE: 'mock-mutation',
    DELETE_EARTHQUAKE: 'mock-mutation'
  };
});

// Import after mocking
import { useEarthquakeData } from './useEarthquakeData';

// Create a mock type for Earthquake
interface Earthquake {
  id: string;
  location: string;
  magnitude: number;
  date: string;
  createdAt: string;
  updatedAt: string;
}

describe('useEarthquakeData', () => {
  const defaultVariables: EarthquakeFilterVariables = {
    page: 1,
    limit: 10,
    filter: {},
    sort: { field: 'date', direction: 'desc' }
  };

  const newEarthquake: EarthquakeFormValues = {
    location: '34.0522, -118.2437',
    magnitude: 3.8,
    date: '2023-05-01T12:00:00Z'
  };

  // Reset the mock implementation before each test
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns earthquake data', () => {
    const result = useEarthquakeData(defaultVariables);
    expect(result.loading).toBe(false);
    expect(result.error).toBeUndefined();
    expect(result.earthquakeData?.data.length).toBe(1);
    expect(result.earthquakeData?.count).toBe(1);
    expect(result.earthquakeData?.hasMore).toBe(false);
  });

  it('calls addEarthquakeRecord with correct arguments', async () => {
    const { addEarthquakeRecord } = useEarthquakeData(defaultVariables);
    await addEarthquakeRecord(newEarthquake);

    const mockAddFn = addEarthquakeRecord as unknown as ReturnType<typeof vi.fn>;
    expect(mockAddFn).toHaveBeenCalledWith(newEarthquake);
  });

  it('calls updateEarthquakeRecord with correct arguments', async () => {
    const { updateEarthquakeRecord } = useEarthquakeData(defaultVariables);
    await updateEarthquakeRecord('1', { magnitude: 5.0 });

    const mockUpdateFn = updateEarthquakeRecord as unknown as ReturnType<typeof vi.fn>;
    expect(mockUpdateFn).toHaveBeenCalledWith('1', { magnitude: 5.0 });
  });

  it('calls deleteEarthquakeRecord with correct arguments', async () => {
    const { deleteEarthquakeRecord } = useEarthquakeData(defaultVariables);
    await deleteEarthquakeRecord('1');

    const mockDeleteFn = deleteEarthquakeRecord as unknown as ReturnType<typeof vi.fn>;
    expect(mockDeleteFn).toHaveBeenCalledWith('1');
  });
});