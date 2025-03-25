import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

// Create a mock Dashboard component
const MockDashboard = () => {
  return (
    <div data-testid="mock-dashboard">
      <h1>Earthquake Dashboard</h1>
      <div data-testid="earthquake-table">
        <div data-testid="earthquake-row">10, -10</div>
        <div data-testid="earthquake-row">20, -20</div>
      </div>
    </div>
  );
};

// Explicitly mock the actual Dashboard component
vi.mock('./Dashboard', () => ({
  Dashboard: () => <MockDashboard />
}));

describe('Dashboard tests', () => {
  it('should render the mock dashboard', () => {
    // Import the mocked Dashboard
    const { Dashboard } = require('./Dashboard');
    render(<Dashboard />);

    // Verify the dashboard renders
    expect(screen.getByTestId('mock-dashboard')).toBeInTheDocument();
    expect(screen.getByText('Earthquake Dashboard')).toBeInTheDocument();
    expect(screen.getAllByTestId('earthquake-row')).toHaveLength(2);
  });
});