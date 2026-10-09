import type { Meta, StoryObj } from '@storybook/react-vite';

import { HoverEffect } from '../components/card-hover-effect';

const meta = {
  title: 'Components/CardHoverEffect',
  component: HoverEffect,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof HoverEffect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    className: 'w-[720px]',
    items: [
      { title: 'Posts', description: 'Notes from the workshop.', link: '/posts' },
      { title: 'Apps', description: 'Small tools shipped on the side.', link: '/apps' },
      { title: 'Bookmarks', description: 'Pages worth keeping.', link: '/bookmarks' },
    ],
  },
};
