import { render, screen, waitFor } from '@testing-library/react';
import { EarthquakeDeleteButton } from './earthquake-delete-button';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { userEvent } from '@testing-library/user-event';
import type { ReactNode } from 'react';

// Mock React hooks
vi.mock('react', async () => {
  const actual = await vi.importActual('react');

  // Mock the useState hook
  const useState = vi.fn().mockImplementation((initialValue) => {
    return [initialValue, vi.fn()];
  });

  return {
    ...actual,
    useState
  };
});

// Mock AlertDialog components
vi.mock('@earthquake/ui', () => {
  const mockToast = {
    toast: vi.fn()
  };

  return {
    Button: ({ children, onClick, ...props }: { children: ReactNode; onClick?: () => void; [key: string]: any }) => (
      <button onClick={onClick} {...props} data-testid="mock-button">
        {children}
      </button>
    ),
    useToast: () => mockToast,
    AlertDialog: ({ children }: { children: ReactNode }) => <div data-testid="alert-dialog">{children}</div>,
    AlertDialogTrigger: ({ children, asChild }: { children: ReactNode; asChild?: boolean }) => (
      <div data-testid="alert-dialog-trigger">{children}</div>
    ),
    AlertDialogContent: ({ children }: { children: ReactNode }) => (
      <div data-testid="alert-dialog-content">{children}</div>
    ),
    AlertDialogHeader: ({ children }: { children: ReactNode }) => (
      <div data-testid="alert-dialog-header">{children}</div>
    ),
    AlertDialogFooter: ({ children }: { children: ReactNode }) => (
      <div data-testid="alert-dialog-footer">{children}</div>
    ),
    AlertDialogTitle: ({ children }: { children: ReactNode }) => (
      <h2 data-testid="alert-dialog-title">{children}</h2>
    ),
    AlertDialogDescription: ({ children }: { children: ReactNode }) => (
      <div data-testid="alert-dialog-description">{children}</div>
    ),
    AlertDialogAction: ({ children, onClick, ...props }: { children: ReactNode; onClick?: () => void; [key: string]: any }) => (
      <button onClick={onClick} data-testid="alert-dialog-action" {...props}>
        {children}
      </button>
    ),
    AlertDialogCancel: ({ children }: { children: ReactNode }) => (
      <button data-testid="alert-dialog-cancel">{children}</button>
    ),
  };
});

// Mock Lucide icons
vi.mock('lucide-react', () => ({
  Trash2: () => <span data-testid="trash-icon" />
}));

// Create a wrapped version of the component for testing
function MockedEarthquakeDeleteButton(props: {
  id: string;
  location: string;
  onDelete: (id: string) => Promise<void>;
}) {
  return <EarthquakeDeleteButton {...props} />;
}

describe('EarthquakeDeleteButton', () => {
  const mockProps = {
    id: '1',
    location: '35.6762, 139.6503',
    onDelete: vi.fn().mockResolvedValue(undefined)
  };

  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render delete button', () => {
    render(<MockedEarthquakeDeleteButton {...mockProps} />);
    expect(screen.getByTestId('mock-button')).toBeInTheDocument();
    expect(screen.getByTestId('trash-icon')).toBeInTheDocument();
  });

  it('should call onDelete when confirmation button is clicked', async () => {
    render(<MockedEarthquakeDeleteButton {...mockProps} />);

    // Click the action button directly since we're mocking the dialog
    const deleteButton = screen.getByTestId('alert-dialog-action');
    await user.click(deleteButton);

    expect(mockProps.onDelete).toHaveBeenCalledWith('1');
  });

  it('should handle error when deletion fails', async () => {
    const errorMock = vi.fn().mockRejectedValue(new Error('Failed to delete'));

    render(
      <MockedEarthquakeDeleteButton
        id="1"
        location="35.6762, 139.6503"
        onDelete={errorMock}
      />
    );

    // Click the action button directly
    const deleteButton = screen.getByTestId('alert-dialog-action');
    await user.click(deleteButton);

    await waitFor(() => {
      expect(errorMock).toHaveBeenCalledWith('1');
    });
  });

  it('should show location in dialog description', () => {
    render(<MockedEarthquakeDeleteButton {...mockProps} />);

    const description = screen.getByTestId('alert-dialog-description');
    expect(description.textContent).toContain('35.6762, 139.6503');
  });
});