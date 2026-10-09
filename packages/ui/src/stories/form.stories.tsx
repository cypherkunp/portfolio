import type { Meta, StoryObj } from '@storybook/react-vite';
import { useForm } from 'react-hook-form';

import { Button } from '../components/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../components/form';
import { Input } from '../components/input';

interface EmailValues {
  email: string;
}

function EmailForm() {
  const form = useForm<EmailValues>({ defaultValues: { email: '' } });

  return (
    <Form {...form}>
      <form className="w-80 space-y-4" onSubmit={form.handleSubmit(() => undefined)}>
        <FormField
          control={form.control}
          name="email"
          rules={{ required: 'Email is required.' }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="you@example.com" {...field} />
              </FormControl>
              <FormDescription>We will not share this.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Save</Button>
      </form>
    </Form>
  );
}

const meta: Meta = {
  title: 'Components/Form',
  component: Form,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <EmailForm />,
};
