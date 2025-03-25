import { render, screen } from '@testing-library/react';
import { EarthquakeSeverityBadge } from './earthquake-severity-badge';
import { describe, it, expect, vi } from 'vitest';

// Mock react's useMemo hook
vi.mock('react', async () => {
  const actual = await vi.importActual('react');
  return {
    ...actual,
    useMemo: vi.fn((callback) => callback()),
  };
});

// Mock the Badge component
vi.mock('@earthquake/ui', () => ({
  Badge: ({ children, variant }: { children: React.ReactNode; variant: string }) => (
    <div data-testid="severity-badge" className={`badge-${variant}`}>
      {children}
    </div>
  ),
}));

describe('EarthquakeSeverityBadge', () => {
  it('should render "Major" for magnitudes >= 7', () => {
    render(<EarthquakeSeverityBadge magnitude={7.5} />);
    expect(screen.getByTestId('severity-badge')).toHaveTextContent('Major');
  });

  it('should render "Moderate" for magnitudes between 5 and 7', () => {
    render(<EarthquakeSeverityBadge magnitude={6.2} />);
    expect(screen.getByTestId('severity-badge')).toHaveTextContent('Moderate');
  });

  it('should render "Minor" for magnitudes between 3 and 5', () => {
    render(<EarthquakeSeverityBadge magnitude={4.1} />);
    expect(screen.getByTestId('severity-badge')).toHaveTextContent('Minor');
  });

  it('should render "Micro" for magnitudes < 3', () => {
    render(<EarthquakeSeverityBadge magnitude={2.5} />);
    expect(screen.getByTestId('severity-badge')).toHaveTextContent('Micro');
  });
});