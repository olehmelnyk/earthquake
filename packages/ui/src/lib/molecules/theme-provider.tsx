'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps as NextThemesProviderProps } from 'next-themes';

type ThemeProviderProps = Readonly<NextThemesProviderProps>;

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // Set default props if not provided
  const mergedProps: ThemeProviderProps = {
    attribute: 'class',
    defaultTheme: 'system',
    storageKey: 'earthquake-ui-theme',
    enableSystem: true,
    disableTransitionOnChange: false, // This helps with smoother transitions
    ...props,
  };

  return (
    <ClientSideThemeProvider {...mergedProps}>
      {children}
    </ClientSideThemeProvider>
  );
}

function ClientSideThemeProvider({ children, ...props }: ThemeProviderProps) {
  // This component ensures proper hydration
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // During initial server-side rendering and first render,
  // we render with default theme to prevent hydration mismatch
  return (
    <NextThemesProvider {...props}>
      {mounted ? children : <div style={{ visibility: 'hidden' }}>{children}</div>}
    </NextThemesProvider>
  );
}