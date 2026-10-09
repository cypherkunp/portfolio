import type { Meta, StoryObj } from '@storybook/react-vite';

import { AspectRatio } from '../components/aspect-ratio';

const meta = {
  title: 'Components/AspectRatio',
  component: AspectRatio,
  tags: ['autodocs'],
} satisfies Meta<typeof AspectRatio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <AspectRatio ratio={16 / 9} className="bg-muted w-80 rounded-md">
      <div className="text-muted-foreground flex h-full items-center justify-center text-sm">
        16:9
      </div>
    </AspectRatio>
  ),
};
