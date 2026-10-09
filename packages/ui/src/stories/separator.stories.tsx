import type { Meta, StoryObj } from '@storybook/react-vite';

import { Separator } from '../components/separator';

const meta = {
  title: 'Components/Separator',
  component: Separator,
  tags: ['autodocs'],
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  render: () => (
    <div className="w-64">
      <p className="text-sm">Posts</p>
      <Separator className="my-3" />
      <p className="text-muted-foreground text-sm">Apps</p>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="flex h-6 items-center gap-3 text-sm">
      <span>Posts</span>
      <Separator orientation="vertical" />
      <span>Apps</span>
    </div>
  ),
};
