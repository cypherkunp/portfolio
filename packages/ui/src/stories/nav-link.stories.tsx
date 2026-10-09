import type { Meta, StoryObj } from '@storybook/react-vite';

import NavLink from '../components/nav-link';

const meta = {
  title: 'Components/NavLink',
  component: NavLink,
  tags: ['autodocs'],
} satisfies Meta<typeof NavLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    href: 'posts',
    text: 'Posts',
  },
  render: args => (
    <div className="rounded-md bg-neutral-950 px-4 py-3">
      <NavLink {...args} />
    </div>
  ),
};
