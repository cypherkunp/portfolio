import type { Meta, StoryObj } from '@storybook/react-vite';

import { BackgroundGradient } from '../components/background-gradient';

const meta = {
  title: 'Components/BackgroundGradient',
  component: BackgroundGradient,
  tags: ['autodocs'],
} satisfies Meta<typeof BackgroundGradient>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    className: 'bg-background rounded-2xl px-8 py-6',
    children: <p className="text-sm">Gradient frame</p>,
  },
};

export const Static: Story = {
  args: {
    animate: false,
    className: 'bg-background rounded-2xl px-8 py-6',
    children: <p className="text-sm">Still frame</p>,
  },
};
