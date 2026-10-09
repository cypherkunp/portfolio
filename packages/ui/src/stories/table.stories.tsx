import type { Meta, StoryObj } from '@storybook/react-vite';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/table';

const meta = {
  title: 'Components/Table',
  component: Table,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Table className="w-[480px]">
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Posts</TableCell>
          <TableCell>Live</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Apps</TableCell>
          <TableCell>Draft</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};
