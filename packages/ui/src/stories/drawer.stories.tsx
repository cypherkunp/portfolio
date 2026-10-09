import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '../components/button';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '../components/drawer';

const meta = {
  title: 'Components/Drawer',
  component: Drawer,
  tags: ['autodocs'],
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Open</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Share</DrawerTitle>
          <DrawerDescription>Copy the link, or send it later.</DrawerDescription>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  ),
};
