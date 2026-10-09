import type { Meta, StoryObj } from '@storybook/react-vite';
import { Terminal } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '../components/alert';

const meta = {
  title: 'Components/Alert',
  component: Alert,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Alert className="max-w-lg">
      <Terminal />
      <AlertTitle>Heads up</AlertTitle>
      <AlertDescription>You can run this command from the repo root.</AlertDescription>
    </Alert>
  ),
};

export const Destructive: Story = {
  render: () => (
    <Alert variant="destructive" className="max-w-lg">
      <Terminal />
      <AlertTitle>Build failed</AlertTitle>
      <AlertDescription>Check the type errors and run it again.</AlertDescription>
    </Alert>
  ),
};
