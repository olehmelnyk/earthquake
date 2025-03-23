import type { Metadata } from 'next';
import { ApolloWrapper } from './apollo-provider';
import { Toaster, ThemeProvider } from '@earthquake/ui';

import './global.css';

export const metadata: Metadata = {
  title: 'Earthquake Tracker',
  description: 'Track and monitor earthquake data',
};

export default function RootLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem={true}
          storageKey="earthquake-ui-theme"
          forcedTheme={undefined}
        >
          <ApolloWrapper>
            {children}
            <Toaster />
          </ApolloWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
