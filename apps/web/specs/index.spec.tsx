import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Page from '../src/app/page';

// Mock the Apollo provider
vi.mock('../src/app/apollo-provider', () => ({
  ApolloWrapper: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="apollo-wrapper">{children}</div>
  )
}));

// Mock the UI components
vi.mock('@earthquake/ui', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="theme-provider">{children}</div>
  ),
  Toaster: () => <div data-testid="toaster">Toaster</div>
}));

// Mock the Dashboard component
vi.mock('../src/app/components/Dashboard', () => ({
  Dashboard: () => <div data-testid="dashboard">Dashboard Component</div>
}));

describe('HomePage', () => {
  it('should render successfully', () => {
    render(<Page />);

    // Check if Dashboard component is rendered
    const dashboard = screen.getByTestId('dashboard');
    expect(dashboard).toBeInTheDocument();
    expect(dashboard).toHaveTextContent('Dashboard Component');
  });

  it('should match snapshot', () => {
    const { container } = render(<Page />);
    expect(container).toMatchSnapshot();
  });
});
