import type { Meta, StoryObj } from '@storybook/react-vite';

import { Breadcrumbs } from '../components/breadcrumbs';

const meta = {
  title: 'Components/Breadcrumbs',
  component: Breadcrumbs,
  tags: ['autodocs'],
} satisfies Meta<typeof Breadcrumbs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: [
      { label: 'Home', href: '/' },
      { label: 'Posts', href: '/posts' },
      { label: 'Atomic design' },
    ],
  },
};
