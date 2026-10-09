import type { Meta, StoryObj } from '@storybook/react-vite';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '../components/chart';

const data = [
  { month: 'Jan', visits: 40 },
  { month: 'Feb', visits: 62 },
  { month: 'Mar', visits: 48 },
  { month: 'Apr', visits: 81 },
];

const config = {
  visits: { label: 'Visits', color: 'var(--chart-1)' },
} satisfies ChartConfig;

const meta = {
  title: 'Components/Chart',
  component: ChartContainer,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof ChartContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { config, children: <></> },
  render: () => (
    <ChartContainer config={config} className="h-64 w-[480px]">
      <BarChart data={data}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="visits" fill="var(--color-visits)" radius={4} />
      </BarChart>
    </ChartContainer>
  ),
};
