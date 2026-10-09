import type { Meta, StoryObj } from '@storybook/react-vite';

import { Label } from '../components/label';
import { Textarea } from '../components/textarea';

const meta = {
  title: 'Components/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  args: { placeholder: 'Write a note' },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithLabel: Story = {
  render: () => (
    <div className="grid w-80 gap-2">
      <Label htmlFor="note">Note</Label>
      <Textarea id="note" placeholder="What changed?" />
    </div>
  ),
};
