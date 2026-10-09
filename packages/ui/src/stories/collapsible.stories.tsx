import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '../components/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../components/collapsible';

const meta = {
  title: 'Components/Collapsible',
  component: Collapsible,
  tags: ['autodocs'],
} satisfies Meta<typeof Collapsible>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Collapsible className="w-72 space-y-2">
      <CollapsibleTrigger asChild>
        <Button variant="outline" size="sm">
          Show files
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="text-muted-foreground text-sm">
        button.tsx, badge.tsx, card.tsx
      </CollapsibleContent>
    </Collapsible>
  ),
};
