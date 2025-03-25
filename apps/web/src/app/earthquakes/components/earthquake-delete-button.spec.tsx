import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { EarthquakeDeleteButton } from './earthquake-delete-button';
import { vi } from 'vitest';
import { MockedProvider } from '@apollo/client/testing';
import { DELETE_EARTHQUAKE } from '../../hooks/useEarthquakeData';

// Mock UI components
vi.mock('@earthquake/ui', () => ({
  AlertDialog: {
    Root: ({ children }: { children: React.ReactNode }) => <div data-testid="alert-dialog-root">{children}</div>,
    Trigger: ({ children }: { children: React.ReactNode }) => <div data-testid="alert-dialog-trigger">{children}</div>,
    Content: ({ children }: { children: React.ReactNode }) => <div data-testid="alert-dialog-content">{children}</div>,
    Header: ({ children }: { children: React.ReactNode }) => <div data-testid="alert-dialog-header">{children}</div>,
    Title: ({ children }: { children: React.ReactNode }) => <div data-testid="alert-dialog-title">{children}</div>,
    Description: ({ children }: { children: React.ReactNode }) => <div data-testid="alert-dialog-description">{children}</div>,
    Footer: ({ children }: { children: React.ReactNode }) => <div data-testid="alert-dialog-footer">{children}</div>,
    Action: (props: any) => <button data-testid="alert-dialog-action" onClick={props.onClick}>{props.children}</button>,
    Cancel: ({ children }: { children: React.ReactNode }) => <button data-testid="alert-dialog-cancel">{children}</button>,
  },
  Button: (props: any) => <button {...props}>{props.children}</button>,
  useToast: () => ({ toast: vi.fn() }),
}));

// Mock Lucide icons
vi.mock('lucide-react', () => ({
  Trash2: () => <div data-testid="trash-icon" />,
}));

describe('EarthquakeDeleteButton', () => {
  const mockOnDelete = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
  });

  const successMock = {
    request: {
      query: DELETE_EARTHQUAKE,
      variables: { id: '1' }
    },
    result: {
      data: {
        deleteEarthquake: { id: '1' }
      }
    }
  };

  const errorMock = {
    request: {
      query: DELETE_EARTHQUAKE,
      variables: { id: 'error-id' }
    },
    error: new Error('Failed to delete earthquake')
  };

  it('should render delete button', () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <EarthquakeDeleteButton id="1" location="San Francisco" onDelete={mockOnDelete} />
      </MockedProvider>
    );

    expect(screen.getByTestId('trash-icon')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Delete earthquake');
  });

  it('should call onDelete when confirmation button is clicked', async () => {
    render(
      <MockedProvider mocks={[successMock]} addTypename={false}>
        <EarthquakeDeleteButton id="1" location="San Francisco" onDelete={mockOnDelete} />
      </MockedProvider>
    );

    // Open the dialog
    fireEvent.click(screen.getByRole('button'));

    // Click the confirm button in the dialog
    fireEvent.click(screen.getByTestId('alert-dialog-action'));

    await waitFor(() => {
      expect(mockOnDelete).toHaveBeenCalledWith('1');
    });
  });

  it('should handle error when deletion fails', async () => {
    render(
      <MockedProvider mocks={[errorMock]} addTypename={false}>
        <EarthquakeDeleteButton id="error-id" location="Error Location" onDelete={mockOnDelete} />
      </MockedProvider>
    );

    // Open the dialog
    fireEvent.click(screen.getByRole('button'));

    // Click the confirm button in the dialog
    fireEvent.click(screen.getByTestId('alert-dialog-action'));

    // The onDelete should not be called when there's an error
    await waitFor(() => {
      expect(mockOnDelete).not.toHaveBeenCalled();
    });
  });

  it('should show location in dialog description', () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <EarthquakeDeleteButton id="1" location="San Francisco" onDelete={mockOnDelete} />
      </MockedProvider>
    );

    // Open the dialog
    fireEvent.click(screen.getByRole('button'));

    expect(screen.getByTestId('alert-dialog-description')).toHaveTextContent('Are you sure you want to delete the earthquake recorded at San Francisco?');
  });
});