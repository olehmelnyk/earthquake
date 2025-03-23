'use client';

import { useTheme } from '@earthquake/ui';
import { useEffect } from 'react';

export function ThemeDebugger() {
  const { theme, resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    // Check if the HTML element has the 'dark' class
    const hasDarkClass = document.documentElement.classList.contains('dark');

    console.log('Theme state:', {
      theme,
      resolvedTheme,
      hasDarkClass,
      htmlClassList: Array.from(document.documentElement.classList),
      localStorage: localStorage.getItem('earthquake-ui-theme'),
    });

    // Add observer to watch for class changes on HTML element
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          console.log('HTML classes changed:', Array.from(document.documentElement.classList));
          console.log('localStorage theme:', localStorage.getItem('earthquake-ui-theme'));
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => {
      observer.disconnect();
    };
  }, [theme, resolvedTheme]);

  const forceTheme = (newTheme: string) => {
    setTheme(newTheme);
    // Manually add/remove dark class for testing
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // Force update localStorage too
    localStorage.setItem('earthquake-ui-theme', newTheme);

    // Reload page to see if theme persists
    // window.location.reload();
  };

  // Direct localStorage manipulation
  const directlySetLocalStorage = (theme: string) => {
    localStorage.setItem('earthquake-ui-theme', theme);
    console.log(`Directly set localStorage theme to: ${theme}`);
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  // Clear localStorage
  const clearLocalStorage = () => {
    localStorage.removeItem('earthquake-ui-theme');
    console.log('Cleared theme from localStorage');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <div className="fixed bottom-4 right-4 p-4 bg-card border border-border rounded-md shadow-md z-50">
      <h3 className="font-semibold mb-2">Theme Debugger</h3>
      <div className="space-y-1 text-sm">
        <p>Theme: {theme || 'undefined'}</p>
        <p>Resolved: {resolvedTheme || 'undefined'}</p>
        <p>Has dark class: {document.documentElement.classList.contains('dark') ? 'Yes' : 'No'}</p>
        <p>LocalStorage: {typeof window !== 'undefined' ? localStorage.getItem('earthquake-ui-theme') || 'null' : 'SSR'}</p>

        {/* Test elements for dark mode */}
        <div className="mt-2 p-2 bg-white dark:bg-gray-800 text-black dark:text-white border rounded">
          This text should be black in light mode and white in dark mode
        </div>
        <div className="mt-2 p-2 bg-primary text-primary-foreground border rounded">
          This uses theme variables
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          onClick={() => forceTheme('light')}
          className="px-2 py-1 bg-primary text-primary-foreground text-xs rounded"
        >
          Force Light
        </button>
        <button
          onClick={() => forceTheme('dark')}
          className="px-2 py-1 bg-primary text-primary-foreground text-xs rounded"
        >
          Force Dark
        </button>
        <button
          onClick={() => directlySetLocalStorage('light')}
          className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded"
        >
          LS → Light
        </button>
        <button
          onClick={() => directlySetLocalStorage('dark')}
          className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded"
        >
          LS → Dark
        </button>
        <button
          onClick={clearLocalStorage}
          className="px-2 py-1 bg-destructive text-destructive-foreground text-xs rounded"
        >
          Clear LS
        </button>
      </div>
    </div>
  );
}