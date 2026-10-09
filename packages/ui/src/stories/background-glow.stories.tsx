import type { Meta, StoryObj } from '@storybook/react-vite';

import { BackgroundGlow } from '../components/background-glow';

const meta = {
  title: 'Components/BackgroundGlow',
  component: BackgroundGlow,
  tags: ['autodocs'],
} satisfies Meta<typeof BackgroundGlow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    className: 'size-48 bg-primary/40 blur-2xl',
    children: <span className="relative z-10 px-8 py-10 text-sm">Glow</span>,
  },
};
