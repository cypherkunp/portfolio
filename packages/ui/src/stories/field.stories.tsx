import type { Meta, StoryObj } from '@storybook/react-vite';

import { Field, FieldDescription, FieldGroup, FieldLabel } from '../components/field';
import { Input } from '../components/input';

const meta = {
  title: 'Components/Field',
  component: Field,
  tags: ['autodocs'],
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <FieldGroup className="w-80">
      <Field>
        <FieldLabel htmlFor="name">Name</FieldLabel>
        <Input id="name" placeholder="Ada Lovelace" />
        <FieldDescription>Shown on your profile.</FieldDescription>
      </Field>
    </FieldGroup>
  ),
};
