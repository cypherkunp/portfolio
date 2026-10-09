import type { Meta, StoryObj } from '@storybook/react-vite';

import { CopyButton } from '../components/copy-button';

const meta = {
  title: 'Components/CopyButton',
  component: CopyButton,
  tags: ['autodocs'],
  args: {
    value: 'pnpm storybook',
  },
} satisfies Meta<typeof CopyButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
