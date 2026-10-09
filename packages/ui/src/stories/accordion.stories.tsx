import type { Meta, StoryObj } from '@storybook/react-vite';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../components/accordion';

const meta = {
  title: 'Components/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { type: 'single', collapsible: true },
  render: () => (
    <Accordion type="single" collapsible className="w-96">
      <AccordionItem value="one">
        <AccordionTrigger>What is this?</AccordionTrigger>
        <AccordionContent>A single open panel.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="two">
        <AccordionTrigger>Can more than one open?</AccordionTrigger>
        <AccordionContent>Not in this story. The type is single.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};
