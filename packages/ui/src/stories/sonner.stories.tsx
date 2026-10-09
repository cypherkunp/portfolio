import type { Meta, StoryObj } from '@storybook/react-vite';
import { toast } from 'sonner';

import { Button } from '../components/button';
import { Toaster } from '../components/sonner';

function SonnerDemo() {
  return (
    <>
      <Toaster />
      <Button
        onClick={() => toast.success('Copied', { description: 'The command is on the clipboard.' })}
      >
        Notify
      </Button>
    </>
  );
}

const meta = {
  title: 'Components/Sonner',
  component: Toaster,
  tags: ['autodocs'],
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <SonnerDemo />,
};
