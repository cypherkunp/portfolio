import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from './ui/carousel';
import CompanyCard from './company-card';
import { useTranslations } from 'next-intl';
import { Building2 } from 'lucide-react';

interface Company {
  name: string;
  icon: string;
}

const CompanyCarousel: React.FC = () => {
  const t = useTranslations('HomePage.clientBlock');
  const companies = t.raw('list') as unknown as Company[];

  return (
    <Carousel className="mx-auto w-full">
      <CarouselContent className="-ml-4">
        {companies.map((company, index: number) => (
          <CarouselItem key={index} className="basis-2/3 pl-4 md:basis-1/3 lg:basis-1/4">
            <CompanyCard name={company.name} Icon={Building2} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-0 hidden bg-white/50 hover:bg-white md:flex" />
      <CarouselNext className="right-0 hidden bg-white/50 hover:bg-white md:flex" />
    </Carousel>
  );
};

export default CompanyCarousel;
