import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from './ui/carousel';
import CompanyCard from './company-card';
import { Circle, LandmarkIcon, PiggyBank } from 'lucide-react';

const companies = [
  { name: 'Unilever', Icon: Circle, color: 'bg-blue-600' },
  { name: 'PTC Inc', Icon: Circle, color: 'bg-green-600' },
  { name: 'Publicis Sapient', Icon: Circle, color: 'bg-purple-600' },
  { name: "Lloyd's Bank", Icon: Circle, color: 'bg-yellow-600' },
  { name: 'DGDA', Icon: Circle, color: 'bg-red-600' },
];

const CompanyCarousel: React.FC = () => (
  <Carousel className="mx-auto w-full">
    <CarouselContent className="-ml-4">
      {companies.map((company, index) => (
        <CarouselItem key={index} className="basis-2/3 pl-4 md:basis-1/3 lg:basis-1/4">
          <CompanyCard name={company.name} Icon={Circle} />
        </CarouselItem>
      ))}
    </CarouselContent>
    <CarouselPrevious className="left-0 hidden bg-white/50 hover:bg-white md:flex" />
    <CarouselNext className="right-0 hidden bg-white/50 hover:bg-white md:flex" />
  </Carousel>
);

export default CompanyCarousel;
