'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

import { LinkPreview } from '@/components/ui/link-preview';
import { RenderIf } from '@/components/render-if';
import UnderlineText from '@/components/underline-text';

interface Company {
  name: string;
  url: string;
  imageUrl: string;
}

const CompanyBlock: React.FC = () => {
  const t = useTranslations('HomePage.clientBlock');
  const companies = t.raw('list') as unknown as Company[];

  return (
    <div className="flex w-full flex-wrap justify-start font-bold md:items-center">
      {companies.map((company, index) => (
        <LinkPreview key={company.url} url={company.url} className="z-99">
          <UnderlineText className="text-sm">{company.name}</UnderlineText>
          <RenderIf condition={index !== companies.length - 1}>
            <span className="px-2 text-lg">/</span>
          </RenderIf>
        </LinkPreview>
      ))}
    </div>
  );
};

export default CompanyBlock;
