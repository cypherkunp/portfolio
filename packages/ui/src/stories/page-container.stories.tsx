import type { Meta, StoryObj } from '@storybook/react-vite';

import PageContainer from '../components/layout/page-container';

const meta = {
  title: 'Components/PageContainer',
  component: PageContainer,
  tags: ['autodocs'],
} satisfies Meta<typeof PageContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    className: 'w-[640px]',
    children: <p className="text-sm">Page body</p>,
  },
};
