import type { Meta, StoryObj } from '@storybook/react-vite';

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '../components/resizable';

const meta = {
  title: 'Components/Resizable',
  component: ResizablePanelGroup,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof ResizablePanelGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <ResizablePanelGroup
      orientation="horizontal"
      className="border-border h-40 w-[480px] rounded-md border"
    >
      <ResizablePanel defaultSize="40%">
        <div className="flex h-full items-center justify-center text-sm">List</div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize="60%">
        <div className="flex h-full items-center justify-center text-sm">Detail</div>
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
};
