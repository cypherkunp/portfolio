import type { Meta, StoryObj } from '@storybook/react-vite';
import { Bold, Italic, Underline } from 'lucide-react';

import { Toggle } from '../components/toggle';

const meta = {
  title: 'Components/Toggle',
  component: Toggle,
  tags: ['autodocs'],
  args: { children: 'Bold', 'aria-label': 'Bold' },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Outline: Story = {
  args: { variant: 'outline' },
};

export const WithIcon: Story = {
  render: () => (
    <div className="flex gap-2">
      <Toggle aria-label="Bold">
        <Bold />
      </Toggle>
      <Toggle aria-label="Italic">
        <Italic />
      </Toggle>
      <Toggle aria-label="Underline">
        <Underline />
      </Toggle>
    </div>
  ),
};
