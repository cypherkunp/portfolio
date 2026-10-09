import type { Meta, StoryObj } from '@storybook/react-vite';

import { TextGenerateEffect } from '../components/text-generate-effect';

const meta = {
  title: 'Components/TextGenerateEffect',
  component: TextGenerateEffect,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof TextGenerateEffect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    words: 'Write the sentence you mean, then stop.',
    className: 'w-[480px]',
  },
};
