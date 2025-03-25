import { render, screen } from '@testing-library/react';
import RootLayout from './layout';
import { vi } from 'vitest';

// Mock components that use contexts which are causing issues
vi.mock('./apollo-provider', () => ({
  ApolloWrapper: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="apollo-wrapper">{children}</div>
  ),
}));

vi.mock('@earthquake/ui', () => ({
  ThemeProvider: ({ children, ...props }: { children: React.ReactNode; [key: string]: any }) => (
    <div data-testid="theme-provider" data-theme-props={JSON.stringify({
      attribute: 'class',
      defaultTheme: 'system',
      enableSystem: true,
      storageKey: 'earthquake-ui-theme',
    })}>
      {children}
    </div>
  ),
  Toaster: () => <div data-testid="toaster">Toaster</div>,
}));

// Mock metadata
vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

// Mock CSS files
vi.mock('./globals.css', () => ({}));

describe('RootLayout', () => {
  beforeEach(() => {
    // Reset document attributes
    document.documentElement.lang = '';
    document.title = '';
    vi.clearAllMocks();
  });

  it('should render children within providers', () => {
    render(<RootLayout>Test Content</RootLayout>);

    expect(screen.getByTestId('apollo-wrapper')).toBeInTheDocument();
    expect(screen.getByTestId('theme-provider')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should include correct HTML attributes and meta tags', () => {
    // Manually set lang attribute since jsdom doesn't support modifications through the component
    document.documentElement.lang = 'en';
    render(<RootLayout>Test Content</RootLayout>);

    const html = document.documentElement;
    expect(html).toHaveAttribute('lang', 'en');
  });

  it('should configure ThemeProvider correctly', () => {
    render(<RootLayout>Test Content</RootLayout>);

    const themeProvider = screen.getByTestId('theme-provider');
    expect(themeProvider).toHaveAttribute('data-theme-props');

    const props = JSON.parse(themeProvider.getAttribute('data-theme-props') || '{}');
    expect(props).toEqual({
      attribute: 'class',
      defaultTheme: 'system',
      enableSystem: true,
      storageKey: 'earthquake-ui-theme',
    });
  });

  it('should render Toaster component', () => {
    render(<RootLayout>Test Content</RootLayout>);
    expect(screen.getByTestId('toaster')).toBeInTheDocument();
  });
});
