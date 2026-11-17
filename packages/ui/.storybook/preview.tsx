import { useEffect, useState, type ReactNode } from 'react';
import type { Decorator, Preview } from '@storybook/react-vite';
import {
  createMemoryHistory,
  createRootRoute,
  createRouter,
  RouterContextProvider,
} from '@tanstack/react-router';

import { ThemeProvider } from '../src/components/theme-provider';
import { TooltipProvider } from '../src/components/tooltip';

import '../src/styles/storybook.css';

function ThemeFrame({ theme, children }: { theme: 'dark' | 'light'; children: ReactNode }) {
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  return (
    <ThemeProvider
      attribute="class"
      forcedTheme={theme}
      enableSystem={false}
      disableTransitionOnChange
    >
      <TooltipProvider>
        <div className="bg-background text-foreground font-mono antialiased">{children}</div>
      </TooltipProvider>
    </ThemeProvider>
  );
}

function RouterFrame({ children }: { children: ReactNode }) {
  const [router] = useState(() =>
    createRouter({
      routeTree: createRootRoute(),
      history: createMemoryHistory({ initialEntries: ['/'] }),
    }),
  );

  return <RouterContextProvider router={router}>{children}</RouterContextProvider>;
}

const withTheme: Decorator = (Story, context) => {
  const theme = context.globals.theme === 'light' ? 'light' : 'dark';
  return (
    <ThemeFrame theme={theme}>
      <RouterFrame>
        <Story />
      </RouterFrame>
    </ThemeFrame>
  );
};

const preview: Preview = {
  decorators: [withTheme],
  initialGlobals: {
    theme: 'dark',
  },
  globalTypes: {
    theme: {
      description: 'Color theme',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'dark', title: 'Dark' },
          { value: 'light', title: 'Light' },
        ],
        dynamicTitle: true,
      },
    },
  },
  parameters: {
    layout: 'centered',
    backgrounds: { disable: true },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: {
        method: 'alphabetical',
      },
    },
  },
};

export default preview;
