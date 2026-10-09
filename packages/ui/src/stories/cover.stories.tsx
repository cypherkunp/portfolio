import type { Meta, StoryObj } from '@storybook/react-vite';

import { Cover } from '../components/cover';

const meta = {
  title: 'Components/Cover',
  component: Cover,
  tags: ['autodocs'],
} satisfies Meta<typeof Cover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: <span className="text-sm">Hover the cover</span>,
  },
};
