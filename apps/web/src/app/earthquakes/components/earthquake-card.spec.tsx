import { render, screen } from '@testing-library/react';
import { EarthquakeCard } from './earthquake-card';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { userEvent } from '@testing-library/user-event';

// Mock child components
vi.mock('./earthquake-severity-badge', () => ({
  EarthquakeSeverityBadge: ({ magnitude }: { magnitude: number }) => {
    let severity = 'Micro';
    if (magnitude >= 7) severity = 'Major';
    else if (magnitude >= 5) severity = 'Moderate';
    else if (magnitude >= 3) severity = 'Minor';

    return <span data-testid="severity">{severity}</span>;
  }
}));

vi.mock('./earthquake-edit-button', () => ({
  EarthquakeEditButton: ({ id, onEdit }: { id: string; onEdit: (id: string) => void }) => (
    <button onClick={() => onEdit(id)}>Edit</button>
  )
}));

vi.mock('./earthquake-delete-button', () => ({
  EarthquakeDeleteButton: ({
    id,
    location,
    onDelete
  }: {
    id: string;
    location: string;
    onDelete: (id: string) => Promise<void>
  }) => {
    const handleClick = () => {
      // Simulate opening the dialog
      document.body.innerHTML += `
        <div>
          <div>Are you sure?</div>
          <div>permanently delete the earthquake record for <strong>${location}</strong></div>
        </div>
      `;
    };

    return <button onClick={handleClick}>Delete</button>;
  }
}));

// Mock UI components
vi.mock('@earthquake/ui', () => ({
  Card: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={`card ${className || ''}`}>{children}</div>
  ),
  CardHeader: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={`card-header ${className || ''}`}>{children}</div>
  ),
  CardContent: ({ children }: { children: React.ReactNode }) => (
    <div className="card-content">{children}</div>
  ),
  CardFooter: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={`card-footer ${className || ''}`}>{children}</div>
  ),
  CardTitle: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div data-testid="location" className={`card-title ${className || ''}`}>{children}</div>
  ),
}));

// Mock date-fns
vi.mock('date-fns', () => ({
  formatDistance: () => 'about 1 hour ago',
}));

describe('EarthquakeCard', () => {
  const mockProps = {
    id: '1',
    location: '35.6762, 139.6503',
    magnitude: 6.5,
    date: new Date('2023-04-15T10:30:00'),
    onDelete: vi.fn().mockResolvedValue(undefined),
    onEdit: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = '';
  });

  it('should render earthquake information correctly', () => {
    render(<EarthquakeCard {...mockProps} />);

    expect(screen.getByTestId('location')).toHaveTextContent('35.6762, 139.6503');
    expect(screen.getByTestId('magnitude')).toHaveTextContent('6.5');
    expect(screen.getByTestId('severity')).toHaveTextContent('Moderate');
  });

  it('should call onEdit when edit button is clicked', async () => {
    const user = userEvent.setup();
    render(<EarthquakeCard {...mockProps} />);

    const editButton = screen.getByRole('button', { name: /edit/i });
    await user.click(editButton);

    expect(mockProps.onEdit).toHaveBeenCalledWith('1');
  });

  it('should display delete confirmation dialog when delete button is clicked', async () => {
    const user = userEvent.setup();
    render(<EarthquakeCard {...mockProps} />);

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    await user.click(deleteButton);

    expect(screen.getByText('Are you sure?')).toBeInTheDocument();
    expect(screen.getByText(/permanently delete the earthquake record for/i)).toBeInTheDocument();
    expect(screen.getByText('35.6762, 139.6503', { selector: 'strong' })).toBeInTheDocument();
  });

  it('should match snapshot', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2023-04-15T10:30:00'));

    const { container } = render(<EarthquakeCard {...mockProps} />);
    expect(container).toMatchSnapshot();

    vi.useRealTimers();
  });
});