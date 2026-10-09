import type { Meta, StoryObj } from '@storybook/react-vite';

import { Input } from '../components/input';
import { Label } from '../components/label';

const meta = {
  title: 'Components/Label',
  component: Label,
  tags: ['autodocs'],
  args: { children: 'Name' },
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithControl: Story = {
  render: () => (
    <div className="grid w-72 gap-2">
      <Label htmlFor="name">Name</Label>
      <Input id="name" placeholder="Ada" />
    </div>
  ),
};
