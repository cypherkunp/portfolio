import type { Meta, StoryObj } from '@storybook/react-vite';

import { RouteViewTransition } from '../components/layout/route-view-transition';

const meta = {
  title: 'Components/RouteViewTransition',
  component: RouteViewTransition,
  tags: ['autodocs'],
} satisfies Meta<typeof RouteViewTransition>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: <p className="text-sm">Route content</p>,
  },
};
