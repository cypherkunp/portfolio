import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '../components/button';
import { ButtonGroup, ButtonGroupSeparator } from '../components/button-group';

const meta = {
  title: 'Components/ButtonGroup',
  component: ButtonGroup,
  tags: ['autodocs'],
} satisfies Meta<typeof ButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <ButtonGroup>
      <Button variant="outline">Day</Button>
      <Button variant="outline">Week</Button>
      <ButtonGroupSeparator />
      <Button variant="outline">Month</Button>
    </ButtonGroup>
  ),
};
