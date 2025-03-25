import { render, screen } from '@testing-library/react';
import { EarthquakeEditButton } from './earthquake-edit-button';
import { describe, it, expect, vi } from 'vitest';
import { userEvent } from '@testing-library/user-event';

// Mock Lucide icons
vi.mock('lucide-react', () => ({
  Edit: () => <span data-testid="edit-icon">Edit</span>
}));

// Mock UI components
vi.mock('@earthquake/ui', () => ({
  Button: ({
    children,
    onClick,
    variant,
    size,
    className
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: string;
    size?: string;
    className?: string;
  }) => (
    <button
      onClick={onClick}
      data-variant={variant}
      data-size={size}
      className={className}
      data-testid="edit-button"
    >
      {children}
    </button>
  )
}));

describe('EarthquakeEditButton', () => {
  const mockId = '123';
  const mockOnEdit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the edit button with icon', () => {
    render(<EarthquakeEditButton id={mockId} onEdit={mockOnEdit} />);

    const button = screen.getByTestId('edit-button');
    expect(button).toBeInTheDocument();

    const icon = screen.getByTestId('edit-icon');
    expect(icon).toBeInTheDocument();

    // Use a more specific selector for the sr-only span
    const srOnlyText = screen.getByText('Edit', { selector: 'span.sr-only' });
    expect(srOnlyText).toBeInTheDocument();
  });

  it('should call onEdit with id when button is clicked', async () => {
    const user = userEvent.setup();

    render(<EarthquakeEditButton id={mockId} onEdit={mockOnEdit} />);

    const button = screen.getByTestId('edit-button');
    await user.click(button);

    expect(mockOnEdit).toHaveBeenCalledTimes(1);
    expect(mockOnEdit).toHaveBeenCalledWith(mockId);
  });

  it('should have correct variant and size props', () => {
    render(<EarthquakeEditButton id={mockId} onEdit={mockOnEdit} />);

    const button = screen.getByTestId('edit-button');
    expect(button).toHaveAttribute('data-variant', 'ghost');
    expect(button).toHaveAttribute('data-size', 'icon');
    // Check className property instead of attribute
    expect(button.className).toBe('h-8 w-8');
  });

  it('should match snapshot', () => {
    const { container } = render(<EarthquakeEditButton id={mockId} onEdit={mockOnEdit} />);
    expect(container).toMatchSnapshot();
  });
});