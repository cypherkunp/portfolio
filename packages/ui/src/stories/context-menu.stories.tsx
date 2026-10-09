import type { Meta, StoryObj } from '@storybook/react-vite';

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '../components/context-menu';

const meta = {
  title: 'Components/ContextMenu',
  component: ContextMenu,
  tags: ['autodocs'],
} satisfies Meta<typeof ContextMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger className="border-border flex h-28 w-64 items-center justify-center rounded-md border border-dashed text-sm">
        Right click
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>Copy</ContextMenuItem>
        <ContextMenuItem>Rename</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
};
