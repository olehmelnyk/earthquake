'use client';

import { useTheme as useNextTheme } from 'next-themes';
import { useEffect, useState } from 'react';

const STORAGE_KEY = 'earthquake-ui-theme';

export function useTheme() {
  const nextTheme = useNextTheme();
  const [isMounted, setIsMounted] = useState(false);

  // Handle initialization and changes
  useEffect(() => {
    setIsMounted(true);

    // Handle theme changes
    if (nextTheme.theme && typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, nextTheme.theme);

        // Apply class directly for immediate visual feedback
        const doc = document.documentElement;
        const isDark =
          nextTheme.theme === 'dark' ||
          (nextTheme.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

        if (isDark) {
          doc.classList.add('dark');
        } else {
          doc.classList.remove('dark');
        }
      } catch (e) {
        console.error('Failed to manage theme:', e);
      }
    }
  }, [nextTheme.theme]);

  // If we haven't mounted yet, return a simplified version
  // to avoid hydration mismatches
  if (!isMounted) {
    return {
      ...nextTheme,
      theme: undefined,
      resolvedTheme: undefined,
    };
  }

  return nextTheme;
}