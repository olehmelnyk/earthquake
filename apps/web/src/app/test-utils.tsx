import React from 'react';
import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { vi } from 'vitest';

// Re-export everything
export * from '@testing-library/react';

// Helper function to wait for Apollo operations to complete
export const waitForApolloLoading = async (): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 0));
};

// Create a wrapper that provides the necessary context providers
interface CustomRenderOptions extends RenderOptions {
  mocks?: MockedResponse[];
  addTypename?: boolean;
}

// Mock toast function
const mockToast = vi.fn();

// Mock UI components
vi.mock('@earthquake/ui', () => ({
  useToast: () => ({ toast: mockToast }),
  Toaster: () => null,
  Button: ({ children, onClick }: any) => (
    <button onClick={onClick}>{children}</button>
  ),
  Dialog: ({ children }: any) => <div role="dialog">{children}</div>,
  AlertDialog: ({ children }: any) => <div role="alertdialog">{children}</div>,
}));

// Mock next-themes
vi.mock('next-themes', () => ({
  ThemeProvider: ({ children }: any) => <>{children}</>,
  useTheme: () => ({
    theme: 'light',
    setTheme: vi.fn(),
    resolvedTheme: 'light',
    themes: ['light', 'dark', 'system'],
  }),
}));

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
  }),
  useSearchParams: () => ({
    get: vi.fn(),
    toString: () => '',
  }),
  usePathname: () => '/dashboard',
}));

export const renderWithProviders = (
  ui: React.ReactElement,
  {
    mocks = [],
    addTypename = false,
    ...renderOptions
  }: CustomRenderOptions = {}
): RenderResult => {
  const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
    return (
      <MockedProvider mocks={mocks} addTypename={addTypename}>
        {children}
      </MockedProvider>
    );
  };

  return render(ui, { wrapper: AllTheProviders, ...renderOptions });
};