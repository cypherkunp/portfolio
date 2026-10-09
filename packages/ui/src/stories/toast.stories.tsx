import type { Meta, StoryObj } from '@storybook/react-vite';

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '../components/toast';

const meta = {
  title: 'Components/Toast',
  component: Toast,
  tags: ['autodocs'],
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <ToastProvider>
      <Toast open>
        <div className="grid gap-1">
          <ToastTitle>Saved</ToastTitle>
          <ToastDescription>Draft is on disk.</ToastDescription>
        </div>
        <ToastClose />
      </Toast>
      <ToastViewport />
    </ToastProvider>
  ),
};
