import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '../components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../components/card';

const meta = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Draft</CardTitle>
        <CardDescription>Last edit was two minutes ago.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm">Ship the outline before you polish the prose.</p>
      </CardContent>
      <CardFooter>
        <Button size="sm">Open</Button>
      </CardFooter>
    </Card>
  ),
};
