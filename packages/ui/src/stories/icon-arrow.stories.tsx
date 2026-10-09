import type { Meta, StoryObj } from '@storybook/react-vite';

import IconArrow from '../components/icon-arrow';

const meta = {
  title: 'Components/IconArrow',
  component: IconArrow,
  tags: ['autodocs'],
} satisfies Meta<typeof IconArrow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <span className="text-primary inline-flex">
      <IconArrow />
    </span>
  ),
};
