import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '../components/button';
import { Toaster } from '../components/toaster';
import { useToast } from '../hooks/use-toast';

function ToastDemo() {
  const { toast } = useToast();

  return (
    <>
      <Toaster />
      <Button onClick={() => toast({ title: 'Saved', description: 'Draft is on disk.' })}>
        Show toast
      </Button>
    </>
  );
}

const meta = {
  title: 'Components/Toaster',
  component: Toaster,
  tags: ['autodocs'],
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <ToastDemo />,
};
