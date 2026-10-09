import type { Meta, StoryObj } from '@storybook/react-vite';

import ExternalLink from '../components/external-link';

const meta = {
  title: 'Components/ExternalLink',
  component: ExternalLink,
  tags: ['autodocs'],
  args: {
    href: 'https://example.com',
    text: 'Example',
  },
} satisfies Meta<typeof ExternalLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Mail: Story = {
  args: {
    href: 'mailto:hello@example.com',
    text: 'Email',
  },
};
