import { render, screen, fireEvent } from '@testing-library/react';
import { SidebarFilters } from './SidebarFilters';
import { vi } from 'vitest';
import { MockedProvider } from '@apollo/client/testing';

// Mock react-hook-form
vi.mock('react-hook-form', () => ({
  useForm: () => ({
    register: (name: string) => ({ name, onChange: vi.fn() }),
    handleSubmit: (fn: (data: any) => void) => (e: any) => {
      e.preventDefault();
      fn({
        location: 'Tokyo',
        magnitudeMin: 2,
        magnitudeMax: 5,
        dateFrom: new Date('2023-01-01'),
        dateTo: new Date('2023-12-31')
      });
    },
    reset: vi.fn(),
    watch: vi.fn().mockReturnValue({
      location: '',
      magnitudeMin: 0,
      magnitudeMax: 10,
      dateFrom: null,
      dateTo: null
    }),
    setValue: vi.fn(),
    formState: { errors: {}, isSubmitting: false }
  }),
  Controller: ({ render: renderFn }: any) => renderFn({ field: { value: '', onChange: vi.fn() } })
}));

// Mock zod resolver
vi.mock('@hookform/resolvers/zod', () => ({
  zodResolver: vi.fn()
}));

// Mock earthquake types
vi.mock('@earthquake/types', () => ({
  earthquakeFilterSchema: {
    parse: vi.fn(),
  }
}));

// Mock shadcn components
vi.mock('@earthquake/ui', () => ({
  Input: (props: any) => <input data-testid="input" {...props} />,
  Label: (props: any) => <label data-testid="label" {...props} />,
  Slider: (props: any) => <div data-testid="slider" onChange={props.onValueChange} />,
  Button: (props: any) => <button data-testid="button" {...props} />,
  DateTimePicker: ({ value, onChange }: any) => (
    <input
      data-testid="date-picker"
      type="datetime-local"
      value={value ? value.toISOString() : ''}
      onChange={(e) => onChange(new Date(e.target.value))}
    />
  )
}));

describe('SidebarFilters', () => {
  const mockOnFilterChange = vi.fn();
  const mockInitialFilters = {
    location: '',
    magnitudeMin: 0,
    magnitudeMax: 10,
    dateFrom: null,
    dateTo: null
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render with default values', () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <SidebarFilters
          onFilterChange={mockOnFilterChange}
          initialFilters={mockInitialFilters}
        />
      </MockedProvider>
    );

    expect(screen.getByText('Filter Earthquakes')).toBeInTheDocument();
    expect(screen.getByText('Location')).toBeInTheDocument();
    expect(screen.getByText('Magnitude')).toBeInTheDocument();
    expect(screen.getByText('Date Range')).toBeInTheDocument();
    expect(screen.getByTestId('button')).toHaveTextContent('Reset Filters');
  });

  it('should call onFilterChange when filters are applied', () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <SidebarFilters
          onFilterChange={mockOnFilterChange}
          initialFilters={mockInitialFilters}
        />
      </MockedProvider>
    );

    const form = screen.getByRole('form');
    fireEvent.submit(form);

    expect(mockOnFilterChange).toHaveBeenCalledWith({
      location: 'Tokyo',
      magnitudeMin: 2,
      magnitudeMax: 5,
      dateFrom: new Date('2023-01-01'),
      dateTo: new Date('2023-12-31')
    });
  });

  it('should reset filters when reset button is clicked', () => {
    const resetMock = vi.fn();

    vi.mock('react-hook-form', () => ({
      useForm: () => ({
        register: () => ({}),
        handleSubmit: vi.fn(),
        reset: resetMock,
        watch: vi.fn(),
        setValue: vi.fn(),
        formState: { errors: {}, isSubmitting: false }
      }),
      Controller: ({ render: renderFn }: any) => renderFn({ field: { value: '', onChange: vi.fn() } })
    }));

    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <SidebarFilters
          onFilterChange={mockOnFilterChange}
          initialFilters={mockInitialFilters}
        />
      </MockedProvider>
    );

    const resetButton = screen.getByTestId('button');
    fireEvent.click(resetButton);

    expect(resetMock).toHaveBeenCalledWith(mockInitialFilters);
    expect(mockOnFilterChange).toHaveBeenCalledWith(mockInitialFilters);
  });

  it('should call onFilterChange when location input changes', () => {
    let locationChangeHandler: (value: string) => void;

    // Override the register mock to capture the onChange handler
    vi.mock('react-hook-form', () => ({
      useForm: () => ({
        register: (name: string) => {
          if (name === 'location') {
            return {
              name,
              onChange: (e: any) => {
                locationChangeHandler && locationChangeHandler(e.target.value);
              }
            };
          }
          return { name };
        },
        handleSubmit: vi.fn(),
        reset: vi.fn(),
        watch: vi.fn(),
        setValue: vi.fn(),
        formState: { errors: {}, isSubmitting: false }
      }),
      Controller: ({ render: renderFn }: any) => renderFn({ field: { value: '', onChange: vi.fn() } })
    }));

    // Create a simple debounce implementation for testing
    vi.mock('../utils/debounce', () => ({
      debounce: (fn: (value: string) => void) => (value: string) => {
        locationChangeHandler = fn;
        return fn(value);
      }
    }));

    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <SidebarFilters
          onFilterChange={mockOnFilterChange}
          initialFilters={mockInitialFilters}
        />
      </MockedProvider>
    );

    const locationInput = screen.getByTestId('input');
    fireEvent.change(locationInput, { target: { value: 'San Francisco' } });

    expect(mockOnFilterChange).toHaveBeenCalledWith({
      ...mockInitialFilters,
      location: 'San Francisco'
    });
  });
});