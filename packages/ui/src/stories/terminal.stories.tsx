import type { Meta, StoryObj } from '@storybook/react-vite';

import { Terminal } from '../components/terminal';

const meta = {
  title: 'Components/Terminal',
  component: Terminal,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: {
    title: 'Terminal',
    command: 'pnpm --filter @repo/ui storybook',
  },
} satisfies Meta<typeof Terminal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: args => (
    <div className="w-[520px]">
      <Terminal {...args} />
    </div>
  ),
};
