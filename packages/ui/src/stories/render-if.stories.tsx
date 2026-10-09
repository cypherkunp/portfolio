import type { Meta, StoryObj } from '@storybook/react-vite';

import { RenderIf } from '../components/render-if';

const meta = {
  title: 'Components/RenderIf',
  component: RenderIf,
  tags: ['autodocs'],
  args: {
    condition: true,
    children: <p className="text-sm">Visible when the condition is true.</p>,
  },
} satisfies Meta<typeof RenderIf>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Shown: Story = {};

export const Hidden: Story = {
  args: {
    condition: false,
    children: <p className="text-sm">This stays out of the tree.</p>,
  },
};
