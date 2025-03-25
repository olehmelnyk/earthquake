'use client';

import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { ReactNode, useMemo } from 'react';

export function ApolloWrapper({ children }: { children: ReactNode }) {
  const client = useMemo(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4224/graphql';
    return new ApolloClient({
      uri: apiUrl,
      cache: new InMemoryCache(),
    });
  }, []);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}