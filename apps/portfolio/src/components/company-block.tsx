'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { InfiniteMovingCards } from './ui/infinite-moving-cards';
import { FlipWords } from './ui/flip-words';
import { TextGenerateEffect } from './ui/text-generate-effect';
import { BackgroundLines } from './ui/background-lines';
import { LinkPreview } from './ui/link-preview';
import Image from 'next/image';

import CardBackground from '@/images/card-background.jpg';

interface Company {
  name: string;
  url: string;
  imageUrl: string;
}

const CompanyBlock: React.FC = () => {
  const t = useTranslations('HomePage.clientBlock');
  const companies = t.raw('list') as unknown as Company[];

  return (
    <div className="flex w-full flex-wrap justify-center gap-2 font-bold md:items-center">
      {companies.map((company, index) => (
        <LinkPreview url={company.url} className="z-99 font-bold">
          <div
            key={index}
            className="relative z-[-99] flex h-[100px] w-[150px] items-center justify-center overflow-hidden rounded-md
              border-[1px] border-yellow-500 md:h-[100px] md:w-[200px]"
          >
            <Image
              priority={false}
              src={CardBackground.src}
              alt={`${company.name} background`}
              fill
              className="object-cover"
            />
            <p className="text-md text-center text-white drop-shadow-md md:text-xl">
              {company.name}
            </p>
          </div>
        </LinkPreview>
      ))}
    </div>
  );
};

export default CompanyBlock;
