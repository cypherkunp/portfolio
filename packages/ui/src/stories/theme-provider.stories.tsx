import type { Meta, StoryObj } from '@storybook/react-vite';

import { ThemeProvider } from '../components/theme-provider';

const meta = {
  title: 'Components/ThemeProvider',
  component: ThemeProvider,
  tags: ['autodocs'],
} satisfies Meta<typeof ThemeProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    attribute: 'class',
    children: (
      <p className="bg-card w-80 rounded-md border px-4 py-3 text-sm">
        The toolbar theme drives this canvas. Mount one provider at the app root.
      </p>
    ),
  },
};
