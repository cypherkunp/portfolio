import type { Meta, StoryObj } from '@storybook/react-vite';

import { Avatar, AvatarFallback, AvatarImage } from '../components/avatar';

const meta = {
  title: 'Components/Avatar',
  component: Avatar,
  tags: ['autodocs'],
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Fallback: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="" alt="" />
      <AvatarFallback>DK</AvatarFallback>
    </Avatar>
  ),
};

export const Image: Story = {
  render: () => (
    <Avatar>
      <AvatarImage
        src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64'%3E%3Crect width='64' height='64' fill='%23eab308'/%3E%3C/svg%3E"
        alt="Yellow swatch"
      />
      <AvatarFallback>DK</AvatarFallback>
    </Avatar>
  ),
};
