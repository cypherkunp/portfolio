import type { Meta, StoryObj } from '@storybook/react-vite';

import { InfiniteMovingCards } from '../components/infinite-moving-cards';

const meta = {
  title: 'Components/InfiniteMovingCards',
  component: InfiniteMovingCards,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof InfiniteMovingCards>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    className: 'w-[640px]',
    speed: 'slow',
    items: [
      { quote: 'Ship the small version.', name: 'Ada', title: 'Engineer' },
      { quote: 'Write the sentence you mean.', name: 'Grace', title: 'Editor' },
      { quote: 'Leave the interface quiet.', name: 'Dieter', title: 'Designer' },
    ],
  },
};
