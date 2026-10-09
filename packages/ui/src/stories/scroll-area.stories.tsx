import type { Meta, StoryObj } from '@storybook/react-vite';

import { ScrollArea } from '../components/scroll-area';

const meta = {
  title: 'Components/ScrollArea',
  component: ScrollArea,
  tags: ['autodocs'],
} satisfies Meta<typeof ScrollArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <ScrollArea className="border-border h-40 w-64 rounded-md border p-3">
      <div className="grid gap-2 text-sm">
        {Array.from({ length: 16 }, (_, index) => (
          <p key={index}>Row {index + 1}</p>
        ))}
      </div>
    </ScrollArea>
  ),
};
