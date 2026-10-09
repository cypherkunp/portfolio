import type { Meta, StoryObj } from '@storybook/react-vite';

import { References } from '../components/references';

const meta = {
  title: 'Components/References',
  component: References,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof References>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    className: 'w-[520px]',
    items: [
      { author: 'Brad Frost', url: 'https://atomicdesign.bradfrost.com/' },
      { author: 'Storybook', url: 'https://storybook.js.org/docs' },
    ],
  },
};
