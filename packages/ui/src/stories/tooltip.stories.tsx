import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '../components/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '../components/tooltip';

const meta = {
  title: 'Components/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">Hover</Button>
      </TooltipTrigger>
      <TooltipContent>Copy the command</TooltipContent>
    </Tooltip>
  ),
};
