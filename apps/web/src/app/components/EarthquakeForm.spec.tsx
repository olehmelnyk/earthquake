import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { userEvent } from '@testing-library/user-event';

// Mock dayjs
vi.mock('dayjs', () => {
  const mockDayjs = () => ({
    format: vi.fn().mockReturnValue('2024-01-01T00:00'),
    isValid: vi.fn().mockReturnValue(true)
  });
  mockDayjs.mockReturnValue = vi.fn().mockReturnValue('2024-01-01T00:00');
  return { default: mockDayjs };
});

// Mock zod resolver
vi.mock('@hookform/resolvers/zod', () => ({
  zodResolver: vi.fn().mockReturnValue(() => ({ values: {} }))
}));

// Mock types
vi.mock('@earthquake/types', () => ({
  earthquakeFormSchema: {
    parse: vi.fn()
  }
}));

// Mock React hooks
vi.mock('react', async () => {
  const actual = await vi.importActual<typeof import('react')>('react');
  return {
    ...actual,
    useRef: vi
      .fn()
      .mockImplementation((initialValue) => ({ current: initialValue })),
    useState: vi
      .fn()
      .mockImplementation((initialValue) => [initialValue, vi.fn()]),
    useEffect: vi.fn(),
    useCallback: vi.fn().mockImplementation((cb) => cb),
    useMemo: vi.fn().mockImplementation((fn) => fn()),
    useContext: vi.fn().mockReturnValue({ name: '' }),
  };
});

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
  })),
}));

// Mock react-hook-form
vi.mock('react-hook-form', () => {
  return {
    useForm: vi.fn(() => ({
      register: vi.fn(),
      handleSubmit: vi.fn((fn) => fn),
      formState: {
        errors: {},
        isSubmitting: false,
      },
      control: {},
      reset: vi.fn(),
      setValue: vi.fn(),
      watch: vi.fn(),
    })),
    useFormContext: vi.fn(() => ({
      getFieldState: vi.fn(() => ({ invalid: false, error: null })),
      formState: { errors: {} },
    })),
    useController: vi.fn(() => ({
      field: {
        onChange: vi.fn(),
        onBlur: vi.fn(),
        value: '',
        name: '',
        ref: vi.fn(),
      },
      fieldState: { error: null },
      formState: { errors: {} },
    })),
    Controller: ({
      render,
    }: {
      render: (props: {
        field: {
          onChange: () => void;
          onBlur: () => void;
          value: string;
          name: string;
          ref: () => void;
        };
        fieldState: { error: null };
        formState: { errors: Record<string, unknown> };
      }) => React.ReactNode;
    }) =>
      render({
        field: {
          onChange: vi.fn(),
          onBlur: vi.fn(),
          value: '',
          name: '',
          ref: vi.fn(),
        },
        fieldState: { error: null },
        formState: { errors: {} },
      }),
    FormProvider: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
  };
});

// Mock UI components
vi.mock('@earthquake/ui', () => ({
  Form: ({
    children,
    methods,
    onSubmit,
    ...props
  }: {
    children: React.ReactNode;
    methods?: unknown;
    onSubmit?: (data: any) => void;
  }) => (
    <form data-testid="form" onSubmit={(e) => { e.preventDefault(); onSubmit?.({ location: '', magnitude: 0, date: '2024-01-01T00:00' }); }} {...props}>
      {children}
    </form>
  ),
  FormField: ({
    name,
    control,
    render,
  }: {
    name: string;
    control: unknown;
    render: (props: {
      field: { name: string; value: string; onChange: () => void };
    }) => React.ReactNode;
  }) => {
    const field = { name, value: '', onChange: vi.fn() };
    return <div data-testid="form-field">{render({ field })}</div>;
  },
  FormItem: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="form-item">{children}</div>
  ),
  FormLabel: ({ children }: { children: React.ReactNode }) => (
    <label
      htmlFor={
        typeof children === 'string'
          ? children.toLowerCase().replace(/\s/g, '-')
          : ''
      }
    >
      {children}
    </label>
  ),
  FormControl: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="form-control">{children}</div>
  ),
  FormMessage: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="form-message">{children}</div>
  ),
  Input: ({
    name,
    ...props
  }: {
    name?: string;
    id?: string;
    placeholder?: string;
    [key: string]: unknown;
  }) => (
    <input
      id={
        name ??
        props.id ??
        (props.placeholder
          ? String(props.placeholder).toLowerCase().replace(/\s/g, '-')
          : '')
      }
      name={name}
      {...props}
      className="bg-background"
    />
  ),
  Button: ({
    children,
    type = 'button',
    ...props
  }: {
    children: React.ReactNode;
    type?: 'button' | 'submit';
    [key: string]: unknown;
  }) => <button type={type} {...props}>{children}</button>,
  Card: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="card">{children}</div>
  ),
  CardContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="card-content">{children}</div>
  ),
  Separator: () => <hr data-testid="separator" />,
  DateTimePicker: ({
    value,
    onChange,
  }: {
    value?: string;
    onChange?: (value: string) => void;
  }) => (
    <input
      type="datetime-local"
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      className="bg-background"
    />
  ),
}));

// Import types and components from project after mocks
import { EarthquakeForm } from './EarthquakeForm';

describe('EarthquakeForm', () => {
  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render form with default values for adding a new earthquake', () => {
    render(<EarthquakeForm onSubmit={vi.fn()} onCancel={vi.fn()} />);

    // Check that form elements exist
    expect(screen.getByText(/Location/i)).toBeInTheDocument();
    expect(screen.getByText(/Magnitude/i)).toBeInTheDocument();
    expect(screen.getByText(/Date and Time/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /add earthquake/i })
    ).toBeInTheDocument();
  });

  it('should render form with existing values for editing an earthquake', () => {
    const mockEarthquake = {
      id: '1',
      location: '35.6762, 139.6503',
      magnitude: 6.5,
      date: '2023-04-15T10:30:00Z',
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z',
    };

    render(
      <EarthquakeForm
        earthquake={mockEarthquake}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText('Update Earthquake')).toBeInTheDocument();
  });

  it('should call onSubmit with form data when form is submitted', async () => {
    render(<EarthquakeForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /add earthquake/i });
    await user.click(submitButton);

    // Expect onSubmit to have been called with default values
    expect(mockOnSubmit).toHaveBeenCalledWith({
      location: '',
      magnitude: 0,
      date: '2024-01-01T00:00'
    });
  });

  it('should call onCancel when cancel button is clicked', async () => {
    render(<EarthquakeForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    await user.click(screen.getByText('Cancel'));

    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('should match snapshot for add mode', () => {
    const { container } = render(
      <EarthquakeForm onSubmit={vi.fn()} onCancel={vi.fn()} />
    );
    expect(container).toMatchSnapshot();
  });

  it('should match snapshot for edit mode', () => {
    const mockEarthquake = {
      id: '1',
      location: '35.6762, 139.6503',
      magnitude: 6.5,
      date: '2023-04-15T10:30:00Z',
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z',
    };

    const { container } = render(
      <EarthquakeForm
        earthquake={mockEarthquake}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />
    );
    expect(container).toMatchSnapshot();
  });
});
