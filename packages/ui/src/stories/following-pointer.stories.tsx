import type { Meta, StoryObj } from '@storybook/react-vite';

import { FollowerPointerCard } from '../components/following-pointer';

const meta = {
  title: 'Components/FollowingPointer',
  component: FollowerPointerCard,
  tags: ['autodocs'],
} satisfies Meta<typeof FollowerPointerCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Open the note',
    className: 'bg-card w-80 rounded-xl border p-6',
    children: <p className="text-sm">Move the pointer over this card.</p>,
  },
};
