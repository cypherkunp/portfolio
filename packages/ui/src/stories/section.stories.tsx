import type { Meta, StoryObj } from '@storybook/react-vite';

import { Section } from '../components/layout/section';

const meta = {
  title: 'Components/Section',
  component: Section,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Section>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Posts',
    description: 'Notes from the workshop.',
    className: 'w-[640px]',
    children: <p className="text-sm">Body copy sits under the title.</p>,
  },
};
