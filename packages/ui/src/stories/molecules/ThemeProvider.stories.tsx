import type { Meta, StoryObj } from '@storybook/react';
import { ThemeProvider } from '../../lib/molecules/theme-provider';
import { Button } from '../../lib/atoms/button';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';

const meta: Meta<typeof ThemeProvider> = {
  component: ThemeProvider,
  title: 'Molecules/ThemeProvider',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ThemeProvider>;

// Component to demonstrate theme switching
const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="p-8 flex flex-col gap-4 items-center">
      <h2 className="text-xl font-bold">Current theme: {theme}</h2>
      <div className="flex gap-4">
        <Button
          variant={theme === 'light' ? 'default' : 'outline'}
          onClick={() => setTheme('light')}
        >
          <Sun className="h-4 w-4 mr-2" />
          Light
        </Button>
        <Button
          variant={theme === 'dark' ? 'default' : 'outline'}
          onClick={() => setTheme('dark')}
        >
          <Moon className="h-4 w-4 mr-2" />
          Dark
        </Button>
        <Button
          variant={theme === 'system' ? 'default' : 'outline'}
          onClick={() => setTheme('system')}
        >
          System
        </Button>
      </div>
      <div className="rounded-lg border p-4 bg-card text-card-foreground mt-4">
        <p>This card will change appearance based on the selected theme.</p>
      </div>
    </div>
  );
};

export const Example: Story = {
  render: () => (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ThemeSwitcher />
    </ThemeProvider>
  ),
};