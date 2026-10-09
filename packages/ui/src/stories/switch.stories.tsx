import type { Meta, StoryObj } from '@storybook/react-vite';

import { Label } from '../components/label';
import { Switch } from '../components/switch';

const meta = {
  title: 'Components/Switch',
  component: Switch,
  tags: ['autodocs'],
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Switch id="dark" />
      <Label htmlFor="dark">Dark theme</Label>
    </div>
  ),
};

export const On: Story = {
  render: () => <Switch defaultChecked aria-label="Enabled" />,
};
