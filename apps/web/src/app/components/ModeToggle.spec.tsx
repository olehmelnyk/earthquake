import { render, screen, waitFor } from '@testing-library/react';
import { ModeToggle } from './ModeToggle';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { userEvent } from '@testing-library/user-event';

// Mock the icons
vi.mock('lucide-react', () => ({
  Moon: () => <div data-testid="moon-icon">Moon</div>,
  Sun: () => <div data-testid="sun-icon">Sun</div>
}));

// Mock the UI components
vi.mock('@earthquake/ui', () => ({
  Button: ({ children, 'aria-label': ariaLabel, ...props }: {
    children: React.ReactNode;
    'aria-label'?: string;
    [key: string]: unknown;
  }) => (
    <button aria-label={ariaLabel} {...props}>
      {children}
    </button>
  ),
  DropdownMenu: ({ children }: { children: React.ReactNode }) => <div data-testid="dropdown-menu">{children}</div>,
  DropdownMenuTrigger: ({ children, asChild }: { children: React.ReactNode; asChild?: boolean }) => (
    <div data-testid="dropdown-trigger">{children}</div>
  ),
  DropdownMenuContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dropdown-content">{children}</div>
  ),
  DropdownMenuItem: ({ children, onClick, className }: {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string
  }) => (
    <button onClick={onClick} className={className} role="menuitem">
      {children}
    </button>
  ),
  useTheme: () => ({
    theme: mockTheme(),
    setTheme: mockSetTheme,
    themes: ['light', 'dark', 'system']
  })
}));

// Mock theme state and setter
const mockSetTheme = vi.fn();
const mockTheme = vi.fn().mockReturnValue('light');

// Mock next-themes if used
vi.mock('next-themes', () => ({
  useTheme: vi.fn(() => ({
    setTheme: vi.fn(),
    theme: 'light',
  })),
}));

describe('ModeToggle', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
    mockTheme.mockReturnValue('light');
  });

  it('should render the theme toggle button with icons', () => {
    render(<ModeToggle />);

    // Check for the toggle button
    const toggleButton = screen.getByRole('button', { name: /toggle theme/i });
    expect(toggleButton).toBeInTheDocument();

    // Check for the sun and moon icons
    const sunIcon = screen.getByTestId('sun-icon');
    const moonIcon = screen.getByTestId('moon-icon');
    expect(sunIcon).toBeInTheDocument();
    expect(moonIcon).toBeInTheDocument();
  });

  it('should open dropdown menu when clicked', async () => {
    render(<ModeToggle />);

    // Click the toggle button
    const button = screen.getByRole('button');
    await user.click(button);

    // Check if dropdown content is visible
    const dropdownContent = screen.getByTestId('dropdown-content');
    expect(dropdownContent).toBeInTheDocument();

    // Check if all theme options are present
    const options = screen.getAllByRole('menuitem');
    expect(options).toHaveLength(3);
    expect(options[0]).toHaveTextContent('Light');
    expect(options[1]).toHaveTextContent('Dark');
    expect(options[2]).toHaveTextContent('System');
  });

  it('should call setTheme when a theme option is clicked', async () => {
    render(<ModeToggle />);

    // Open dropdown
    const button = screen.getByRole('button');
    await user.click(button);

    // Click dark theme option
    const darkOption = screen.getByRole('menuitem', { name: /dark/i });
    await user.click(darkOption);

    // Check if setTheme was called with 'dark'
    expect(mockSetTheme).toHaveBeenCalledTimes(1);
    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });

  it('should highlight the current theme option', async () => {
    // Set initial theme to dark
    mockTheme.mockReturnValue('dark');

    render(<ModeToggle />);

    // Open dropdown
    const button = screen.getByRole('button');
    await user.click(button);

    // Check if dark theme option has the accent background
    const darkOption = screen.getByRole('menuitem', { name: /dark/i });
    expect(darkOption).toHaveClass('bg-accent');

    // Check if other options don't have the accent background
    const lightOption = screen.getByRole('menuitem', { name: /light/i });
    const systemOption = screen.getByRole('menuitem', { name: /system/i });
    expect(lightOption).not.toHaveClass('bg-accent');
    expect(systemOption).not.toHaveClass('bg-accent');
  });

  it('should handle system theme selection', async () => {
    render(<ModeToggle />);

    // Open dropdown
    const button = screen.getByRole('button');
    await user.click(button);

    // Click system theme option
    const systemOption = screen.getByRole('menuitem', { name: /system/i });
    await user.click(systemOption);

    // Check if setTheme was called with 'system'
    expect(mockSetTheme).toHaveBeenCalledTimes(1);
    expect(mockSetTheme).toHaveBeenCalledWith('system');
  });

  it('should match snapshot', () => {
    const { container } = render(<ModeToggle />);
    expect(container).toMatchSnapshot();
  });

  it('should match snapshot with dropdown open', async () => {
    const { container } = render(<ModeToggle />);

    // Open dropdown
    const button = screen.getByRole('button');
    await user.click(button);

    // Wait for dropdown to be visible
    await waitFor(() => {
      expect(screen.getByTestId('dropdown-content')).toBeInTheDocument();
    });

    expect(container).toMatchSnapshot();
  });
});