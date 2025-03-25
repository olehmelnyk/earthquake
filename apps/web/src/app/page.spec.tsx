import { render, screen } from '@testing-library/react';
import Page from './page';
import { describe, it, expect, vi } from 'vitest';

// Mock the Dashboard component (we've already tested it)
vi.mock('./components/Dashboard', () => ({
  Dashboard: () => <div data-testid="dashboard">Dashboard Component</div>
}));

describe('Page', () => {
  it('should render the Dashboard component', () => {
    render(<Page />);

    expect(screen.getByTestId('dashboard')).toBeInTheDocument();
  });

  it('should match snapshot', () => {
    const { container } = render(<Page />);
    expect(container).toMatchSnapshot();
  });
});