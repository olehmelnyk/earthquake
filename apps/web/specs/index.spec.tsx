import React from 'react';
import { render } from '@testing-library/react';
import Page from '../src/app/page';

// Mock the Dashboard component to avoid hook issues
jest.mock('../src/app/components/Dashboard', () => ({
  Dashboard: () => <div data-testid="mocked-dashboard">Dashboard Component</div>
}));

describe('Page', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Page />);
    expect(baseElement).toBeTruthy();
  });
});
