import { screen, waitFor } from '@testing-library/react';
import { SidebarFilters } from './SidebarFilters';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { userEvent } from '@testing-library/user-event';
import { renderWithProviders } from '../test-utils';

// Mock zod resolver
vi.mock('@hookform/resolvers/zod', () => ({
  zodResolver: () => ({})
}));

// Mock types
vi.mock('@earthquake/types', () => ({
  earthquakeFilterSchema: {
    parse: vi.fn()
  }
}));

describe('SidebarFilters', () => {
  const mockOnFilterChange = vi.fn();
  const mockInitialFilters = {
    location: '',
    magnitudeFrom: 0,
    magnitudeTo: 10,
    dateFrom: '',
    dateTo: ''
  };

  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render with default values', async () => {
    renderWithProviders(
      <SidebarFilters
        onFilterChange={mockOnFilterChange}
        initialFilters={mockInitialFilters}
      />
    );

    // Check if all filter inputs are present
    expect(screen.getByLabelText(/location/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/magnitude from/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/magnitude to/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date from/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date to/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /apply filters/i })).toBeInTheDocument();
  });

  it('should call onFilterChange when filters are applied', async () => {
    renderWithProviders(
      <SidebarFilters
        onFilterChange={mockOnFilterChange}
        initialFilters={mockInitialFilters}
      />
    );

    // Fill in filter values
    await user.type(screen.getByLabelText(/location/i), 'Test Location');
    await user.type(screen.getByLabelText(/magnitude from/i), '3');
    await user.type(screen.getByLabelText(/magnitude to/i), '7');
    await user.type(screen.getByLabelText(/date from/i), '2024-01-01');
    await user.type(screen.getByLabelText(/date to/i), '2024-12-31');

    // Submit form
    await user.click(screen.getByRole('button', { name: /apply filters/i }));

    // Check if onFilterChange was called with correct values
    expect(mockOnFilterChange).toHaveBeenCalledWith({
      location: 'Test Location',
      magnitudeFrom: 3,
      magnitudeTo: 7,
      dateFrom: '2024-01-01',
      dateTo: '2024-12-31'
    });
  });

  it('should reset filters when reset button is clicked', async () => {
    renderWithProviders(
      <SidebarFilters
        onFilterChange={mockOnFilterChange}
        initialFilters={mockInitialFilters}
      />
    );

    // Fill in filter values
    await user.type(screen.getByLabelText(/location/i), 'Test Location');
    await user.type(screen.getByLabelText(/magnitude from/i), '3');
    await user.type(screen.getByLabelText(/magnitude to/i), '7');

    // Click reset button
    await user.click(screen.getByRole('button', { name: /reset/i }));

    // Check if onFilterChange was called with initial values
    expect(mockOnFilterChange).toHaveBeenCalledWith(mockInitialFilters);
  });
});