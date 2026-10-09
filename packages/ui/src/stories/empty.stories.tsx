import type { Meta, StoryObj } from '@storybook/react-vite';
import { Inbox } from 'lucide-react';

import { Button } from '../components/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '../components/empty';

const meta = {
  title: 'Components/Empty',
  component: Empty,
  tags: ['autodocs'],
} satisfies Meta<typeof Empty>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Empty className="w-96 border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Inbox />
        </EmptyMedia>
        <EmptyTitle>No posts</EmptyTitle>
        <EmptyDescription>Write the first one.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button>New post</Button>
      </EmptyContent>
    </Empty>
  ),
};
