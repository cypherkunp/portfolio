import type { Meta, StoryObj } from '@storybook/react-vite';

import SteelCard from '../components/steel-card';

const meta = {
  title: 'Components/SteelCard',
  component: SteelCard,
  tags: ['autodocs'],
} satisfies Meta<typeof SteelCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: <p className="text-sm text-white">Bolted plate</p>,
  },
  render: args => (
    <div className="w-80">
      <SteelCard {...args} />
    </div>
  ),
};
