import type { Meta, StoryObj } from '@storybook/react-vite';

import { CodeBlock } from '../components/code-block';

const sample = `export function greet(name: string) {
  return \`hello \${name}\`;
}`;

const meta = {
  title: 'Components/CodeBlock',
  component: CodeBlock,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof CodeBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    language: 'ts',
    title: 'greet.ts',
    children: <code>{sample}</code>,
  },
  render: args => (
    <div className="w-[520px]">
      <CodeBlock {...args} />
    </div>
  ),
};

export const NoWrap: Story = {
  args: {
    language: 'bash',
    wrapAt: false,
    children: <code>pnpm --filter @repo/ui storybook</code>,
  },
  render: args => (
    <div className="w-[520px]">
      <CodeBlock {...args} />
    </div>
  ),
};
