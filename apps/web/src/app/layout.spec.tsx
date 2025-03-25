import { render, screen } from '@testing-library/react';
import RootLayout from './layout';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MockedProvider } from '@apollo/client/testing';
import { ApolloClient, InMemoryCache } from '@apollo/client';

// Mock the Apollo provider
vi.mock('./apollo-provider', () => ({
  ApolloWrapper: ({ children }: { children: React.ReactNode }) => {
    return (
      <div data-testid="apollo-wrapper">
        <MockedProvider mocks={[]} addTypename={false}>
          {children}
        </MockedProvider>
      </div>
    );
  },
}));

// Mock the UI components
vi.mock('@earthquake/ui', () => ({
  Toaster: () => <div data-testid="toaster">Toaster</div>,
  ThemeProvider: ({
    children,
    ...props
  }: {
    children: React.ReactNode;
    attribute?: string;
    defaultTheme?: string;
    enableSystem?: boolean;
    storageKey?: string;
    forcedTheme?: string;
  }) => (
    <div data-testid="theme-provider" data-theme-props={JSON.stringify(props)}>
      {children}
    </div>
  ),
}));

// Mock global CSS
vi.mock('./global.css', () => ({}));

describe('RootLayout', () => {
  beforeEach(() => {
    // Set up document attributes
    document.documentElement.lang = '';
    document.documentElement.removeAttribute('suppressHydrationWarning');

    // Clear meta tags
    const metaTags = document.head.querySelectorAll('meta');
    metaTags.forEach(tag => tag.remove());
  });

  it('should render children within providers', () => {
    render(
      <RootLayout>
        <div data-testid="test-content">Test Content</div>
      </RootLayout>
    );

    // Check if providers are rendered
    const apolloWrapper = screen.getByTestId('apollo-wrapper');
    const themeProvider = screen.getByTestId('theme-provider');
    expect(apolloWrapper).toBeInTheDocument();
    expect(themeProvider).toBeInTheDocument();

    // Check if children are rendered
    const content = screen.getByTestId('test-content');
    expect(content).toBeInTheDocument();
    expect(content).toHaveTextContent('Test Content');

    // Check if Toaster is rendered
    expect(screen.getByTestId('toaster')).toBeInTheDocument();
  });

  it('should include correct HTML attributes and meta tags', () => {
    render(
      <RootLayout>
        <div>Test Content</div>
      </RootLayout>
    );

    // Check if HTML element has the correct attributes
    const html = document.documentElement;
    expect(html).toHaveAttribute('lang', 'en');
    expect(html).toHaveAttribute('suppressHydrationWarning');

    // Check if meta tags are present
    const metaTags = document.head.querySelectorAll('meta');
    expect(metaTags).toHaveLength(2);
    expect(metaTags[0]).toHaveAttribute('charSet', 'utf-8');
    expect(metaTags[1]).toHaveAttribute('name', 'viewport');
    expect(metaTags[1]).toHaveAttribute(
      'content',
      'width=device-width, initial-scale=1'
    );
  });

  it('should configure ThemeProvider correctly', () => {
    render(
      <RootLayout>
        <div>Test Content</div>
      </RootLayout>
    );

    const themeProvider = screen.getByTestId('theme-provider');
    const themeProps = JSON.parse(
      themeProvider.getAttribute('data-theme-props') ?? '{}'
    );

    expect(themeProps).toEqual({
      attribute: 'class',
      defaultTheme: 'system',
      enableSystem: true,
      storageKey: 'earthquake-ui-theme',
      forcedTheme: undefined,
    });
  });

  it('should apply correct body classes', () => {
    const { container } = render(
      <RootLayout>
        <div>Test Content</div>
      </RootLayout>
    );

    const body = container.querySelector('body');
    expect(body).toHaveClass(
      'min-h-screen',
      'bg-background',
      'font-sans',
      'antialiased'
    );
  });

  it('should match snapshot', () => {
    const { container } = render(
      <RootLayout>
        <div data-testid="test-content">Test Content</div>
      </RootLayout>
    );

    expect(container).toMatchSnapshot();
  });
});
