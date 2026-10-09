import type { Meta, StoryObj } from '@storybook/react-vite';

import { SparklesCore } from '../components/sparkles';

const meta = {
  title: 'Components/Sparkles',
  component: SparklesCore,
  tags: ['autodocs'],
} satisfies Meta<typeof SparklesCore>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    className: 'h-full w-full',
    background: 'transparent',
    particleColor: '#facc15',
    particleDensity: 80,
  },
  render: args => (
    <div className="bg-background relative h-48 w-80 overflow-hidden rounded-xl border">
      <SparklesCore {...args} />
    </div>
  ),
};
