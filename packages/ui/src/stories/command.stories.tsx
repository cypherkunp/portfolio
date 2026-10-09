import type { Meta, StoryObj } from '@storybook/react-vite';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../components/command';

const meta = {
  title: 'Components/Command',
  component: Command,
  tags: ['autodocs'],
} satisfies Meta<typeof Command>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Command className="border-border w-80 rounded-lg border">
      <CommandInput placeholder="Search" />
      <CommandList>
        <CommandEmpty>No results.</CommandEmpty>
        <CommandGroup heading="Pages">
          <CommandItem>Posts</CommandItem>
          <CommandItem>Apps</CommandItem>
          <CommandItem>Bookmarks</CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
};
