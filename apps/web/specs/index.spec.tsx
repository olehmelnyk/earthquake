import React from 'react';
import { render } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import Page from '../src/app/page';
import { gql } from '@apollo/client';

// Define the same query used in the page component
const GET_EARTHQUAKES = gql`
  query GetEarthquakes {
    earthquakes {
      id
      magnitude
      location
      date
    }
  }
`;

// Mock the GraphQL responses
const mocks = [
  {
    request: {
      query: GET_EARTHQUAKES,
    },
    result: {
      data: {
        earthquakes: [
          {
            id: '1',
            magnitude: 5.5,
            location: 'Test Location',
            date: '2023-01-01T00:00:00Z',
          },
        ],
      },
    },
  },
];

describe('Page', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Page />
      </MockedProvider>
    );
    expect(baseElement).toBeTruthy();
  });
});
