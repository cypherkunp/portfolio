import type { Meta, StoryObj } from '@storybook/react-vite';

import { TracingBeam } from '../components/tracing-beam';

const meta = {
  title: 'Components/TracingBeam',
  component: TracingBeam,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof TracingBeam>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    className: 'w-[520px]',
    children: (
      <div className="space-y-24 py-8 pl-8">
        <p className="text-sm">First mark. Scroll the canvas to move the beam.</p>
        <p className="text-sm">Second mark sits further down the line.</p>
        <p className="text-sm">Third mark closes the trace.</p>
      </div>
    ),
  },
};
