import type { Meta, StoryObj } from '@storybook/react-vite';
import { Folder, Home, Search } from 'lucide-react';

import { FloatingDock } from '../components/floating-dock';

const items = [
  { title: 'Home', href: '/', icon: <Home /> },
  { title: 'Posts', href: '/posts', icon: <Folder /> },
  { title: 'Search', href: '/search', icon: <Search /> },
];

const meta = {
  title: 'Components/FloatingDock',
  component: FloatingDock,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof FloatingDock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items,
    desktopClassName: '!flex',
    mobileClassName: '!hidden',
  },
};
