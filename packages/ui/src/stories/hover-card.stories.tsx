import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '../components/button';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../components/hover-card';

const meta = {
  title: 'Components/HoverCard',
  component: HoverCard,
  tags: ['autodocs'],
} satisfies Meta<typeof HoverCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="link">@portfolio</Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-64 text-sm">
        Notes on interfaces, type, and motion.
      </HoverCardContent>
    </HoverCard>
  ),
};
