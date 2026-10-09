import type { Meta, StoryObj } from '@storybook/react-vite';

import { CodeBlockCommand } from '../components/code-block-command';

const meta = {
  title: 'Components/CodeBlockCommand',
  component: CodeBlockCommand,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof CodeBlockCommand>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    __pnpm__: 'pnpm add @repo/ui',
    __npm__: 'npm install @repo/ui',
    __yarn__: 'yarn add @repo/ui',
    __bun__: 'bun add @repo/ui',
  },
  render: args => (
    <div className="w-[520px]">
      <CodeBlockCommand {...args} />
    </div>
  ),
};
