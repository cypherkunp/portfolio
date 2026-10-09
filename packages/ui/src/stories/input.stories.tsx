import type { Meta, StoryObj } from '@storybook/react-vite';

import { Input } from '../components/input';
import { Label } from '../components/label';

const meta = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  args: { placeholder: 'Email' },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithLabel: Story = {
  render: () => (
    <div className="grid w-72 gap-2">
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" placeholder="you@example.com" />
    </div>
  ),
};

export const Disabled: Story = {
  args: { disabled: true, value: 'Locked' },
};
