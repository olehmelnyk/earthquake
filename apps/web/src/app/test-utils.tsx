import { ReactNode } from 'react';
import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { ThemeProvider } from 'next-themes';

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  mocks?: MockedResponse[];
  theme?: string;
}

export function renderWithProviders(
  ui: React.ReactElement,
  {
    mocks = [],
    theme = 'light',
    ...renderOptions
  }: CustomRenderOptions = {}
): RenderResult {
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <MockedProvider
        mocks={mocks}
        addTypename={false}
        defaultOptions={{
          watchQuery: { fetchPolicy: 'no-cache' },
          query: { fetchPolicy: 'no-cache' },
        }}
      >
        <ThemeProvider defaultTheme={theme} enableSystem={false} data-testid="theme-provider">
          {children}
        </ThemeProvider>
      </MockedProvider>
    );
  }

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}

// Helper function to wait for Apollo operations
export const waitForApolloLoading = async () => {
  await new Promise((resolve) => setTimeout(resolve, 0));
};

// Re-export everything
export * from '@testing-library/react';