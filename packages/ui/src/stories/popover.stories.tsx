import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '../components/button';
import { Popover, PopoverContent, PopoverTrigger } from '../components/popover';

const meta = {
  title: 'Components/Popover',
  component: Popover,
  tags: ['autodocs'],
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open</Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 text-sm">Pick a date, or leave it blank.</PopoverContent>
    </Popover>
  ),
};
