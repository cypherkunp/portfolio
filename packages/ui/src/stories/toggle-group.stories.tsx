import type { Meta, StoryObj } from '@storybook/react-vite';
import { Bold, Italic, Underline } from 'lucide-react';

import { ToggleGroup, ToggleGroupItem } from '../components/toggle-group';

const meta = {
  title: 'Components/ToggleGroup',
  component: ToggleGroup,
  tags: ['autodocs'],
} satisfies Meta<typeof ToggleGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { type: 'multiple' },
  render: () => (
    <ToggleGroup type="multiple" aria-label="Text style">
      <ToggleGroupItem value="bold" aria-label="Bold">
        <Bold />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Italic">
        <Italic />
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Underline">
        <Underline />
      </ToggleGroupItem>
    </ToggleGroup>
  ),
};
