'use client';

import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { ReactNode } from 'react';

const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3333/graphql',
  cache: new InMemoryCache(),
});

interface ApolloWrapperProps {
  readonly children: ReactNode;
}

export function ApolloWrapper({ children }: ApolloWrapperProps): React.ReactElement {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}