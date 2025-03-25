import { screen, waitFor } from '@testing-library/react';
import { Dashboard } from './Dashboard';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { userEvent } from '@testing-library/user-event';
import { renderWithProviders, waitForApolloLoading } from '../test-utils';
import { GET_EARTHQUAKES } from '../hooks/useEarthquakeData';
import { server } from '../mocks/server';

const mockEarthquakes = {
  data: [
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
    }
  ],
  count: 2,
  hasMore: false
};

const mocks = [
  {
    request: {
      query: GET_EARTHQUAKES,
      variables: {
        filter: {
          location: '',
          magnitudeFrom: 0,
          magnitudeTo: 10,
          dateFrom: '',
          dateTo: ''
        },
        page: 1,
        sort: { field: 'date', direction: 'desc' }
      }
    },
    result: {
      data: {
        earthquakes: mockEarthquakes
      }
    }
  }
];

describe('Dashboard', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    server.resetHandlers();
    vi.clearAllMocks();
  });

  it('should render the dashboard with earthquake data', async () => {
    renderWithProviders(<Dashboard />, { mocks });

    // Check loading state
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();

    // Wait for data to load
    await waitForApolloLoading();
    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    });

    // Check if table rows are rendered
    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(3); // Header + 2 data rows
  });

  // Add more test cases here...
});