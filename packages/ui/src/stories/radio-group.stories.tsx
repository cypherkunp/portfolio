import type { Meta, StoryObj } from '@storybook/react-vite';

import { Label } from '../components/label';
import { RadioGroup, RadioGroupItem } from '../components/radio-group';

const meta = {
  title: 'Components/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <RadioGroup defaultValue="system" className="grid gap-3">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="system" id="system" />
        <Label htmlFor="system">System</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="dark" id="dark" />
        <Label htmlFor="dark">Dark</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="light" id="light" />
        <Label htmlFor="light">Light</Label>
      </div>
    </RadioGroup>
  ),
};
