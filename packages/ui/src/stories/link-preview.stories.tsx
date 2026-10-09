import type { Meta, StoryObj } from '@storybook/react-vite';

import { LinkPreview } from '../components/link-preview';

const imageSrc = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="125"><rect width="100%" height="100%" fill="#161b22"/><text x="16" y="68" fill="#facc15" font-family="monospace" font-size="14">preview</text></svg>`,
)}`;

const meta = {
  title: 'Components/LinkPreview',
  component: LinkPreview,
  tags: ['autodocs'],
} satisfies Meta<typeof LinkPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    url: 'https://example.com',
    isStatic: true,
    imageSrc,
    children: 'example.com',
  },
};
