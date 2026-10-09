import type { Meta, StoryObj } from '@storybook/react-vite';

import UnderlineText from '../components/underline-text';

const meta = {
  title: 'Components/UnderlineText',
  component: UnderlineText,
  tags: ['autodocs'],
} satisfies Meta<typeof UnderlineText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Posts',
  },
  render: args => (
    <h2 className="text-lg font-bold">
      <UnderlineText {...args} />
    </h2>
  ),
};
