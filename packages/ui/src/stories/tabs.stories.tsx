import type { Meta, StoryObj } from '@storybook/react-vite';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/tabs';

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  tags: ['autodocs'],
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="posts" className="w-80">
      <TabsList>
        <TabsTrigger value="posts">Posts</TabsTrigger>
        <TabsTrigger value="apps">Apps</TabsTrigger>
      </TabsList>
      <TabsContent value="posts" className="text-sm">
        Writing about the interface.
      </TabsContent>
      <TabsContent value="apps" className="text-sm">
        Small tools, shipped.
      </TabsContent>
    </Tabs>
  ),
};
