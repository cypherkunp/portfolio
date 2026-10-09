import type { Meta, StoryObj } from '@storybook/react-vite';

import { ClientOnly } from '../components/client-only';

const meta = {
  title: 'Components/ClientOnly',
  component: ClientOnly,
  tags: ['autodocs'],
} satisfies Meta<typeof ClientOnly>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: <p className="text-sm">Mounted on the client.</p>,
  },
};
