import type { Meta, StoryObj } from '@storybook/react-vite';

import { FlipWords } from '../components/flip-words';

const meta = {
  title: 'Components/FlipWords',
  component: FlipWords,
  tags: ['autodocs'],
} satisfies Meta<typeof FlipWords>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    words: ['build', 'ship', 'teach'],
    className: 'text-primary',
  },
  render: args => (
    <p className="text-2xl">
      I <FlipWords {...args} /> interfaces.
    </p>
  ),
};
