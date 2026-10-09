import type { Meta, StoryObj } from '@storybook/react-vite';
import { Info } from 'lucide-react';

import { Callout } from '../components/callout';

const meta = {
  title: 'Components/Callout',
  component: Callout,
  tags: ['autodocs'],
  args: {
    title: 'Note',
    children: 'Keep the command idempotent.',
    className: 'w-96',
  },
} satisfies Meta<typeof Callout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Warning: Story = {
  args: {
    variant: 'warning' as 'default',
    title: 'Warning',
    icon: <Info />,
    children: 'This rewrite drops the previous draft.',
  },
};
