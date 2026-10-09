import type { Meta, StoryObj } from '@storybook/react-vite';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../components/carousel';

const meta = {
  title: 'Components/Carousel',
  component: Carousel,
  tags: ['autodocs'],
} satisfies Meta<typeof Carousel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Carousel className="w-64">
      <CarouselContent>
        {['One', 'Two', 'Three'].map(label => (
          <CarouselItem key={label}>
            <div className="bg-muted flex h-32 items-center justify-center rounded-md text-sm">
              {label}
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ),
};
