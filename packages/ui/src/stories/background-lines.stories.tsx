import type { Meta, StoryObj } from '@storybook/react-vite';

import { BackgroundLines } from '../components/background-lines';

const meta = {
  title: 'Components/BackgroundLines',
  component: BackgroundLines,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof BackgroundLines>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    className: 'flex h-64 w-[520px] items-center justify-center',
    children: <p className="relative z-10 text-sm">Lines behind the type</p>,
  },
};
