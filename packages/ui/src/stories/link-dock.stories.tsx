import type { Meta, StoryObj } from '@storybook/react-vite';
import { Folder, Home } from 'lucide-react';

import { LinkDock } from '../components/link-dock';

const meta = {
  title: 'Components/LinkDock',
  component: LinkDock,
  tags: ['autodocs'],
} satisfies Meta<typeof LinkDock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    showLabels: true,
    items: [
      { title: 'Home', href: '/', icon: <Home className="size-4" /> },
      { type: 'separator' },
      { title: 'Posts', href: '/posts', icon: <Folder className="size-4" /> },
    ],
  },
};
