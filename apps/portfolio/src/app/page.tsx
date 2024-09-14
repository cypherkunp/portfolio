import { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

import CompanyBlock from '@/components/company-block';
import { FaqBlock } from '@/components/faq-block';
import InfoBlock from '@/components/info-block';
import PageContainer from '@/components/layout/page-container';
import { Section } from '@/components/layout/section';
import StackBlock from '@/components/stack-block';
import { absoluteUrl } from '@/lib/env.utils';

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations();

  return {
    title: t('HomePage.title'),
    description: t('HomePage.description'),
    openGraph: {
      title: t('HomePage.title'),
      description: t('HomePage.description'),
      type: 'website',
      url: t('HomePage.url'),
      images: [
        {
          url: t('HomePage.ogImage'),
          width: 660,
          height: 240,
          alt: t('Common.contact.name'),
        },
      ],
    },
    twitter: {
      title: t('HomePage.title'),
      description: t('HomePage.description'),
      images: [t('HomePage.ogImage')],
      creator: '@cypherkunp',
    },
  };
};

export default function Page() {
  const t = useTranslations();

  return (
    <PageContainer>
      <Section isFirstSection>
        <InfoBlock />
      </Section>
      <Section
        title={t('HomePage.stackBlock.title')}
        description={t('HomePage.stackBlock.description')}
      >
        <StackBlock />
      </Section>
      <Section
        title={t('HomePage.clientBlock.title')}
        description={t('HomePage.clientBlock.description')}
      >
        <CompanyBlock />
      </Section>
      <Section
        title={t('HomePage.faqBlock.title')}
        description={t('HomePage.faqBlock.description')}
        isLastSection
      >
        <FaqBlock />
      </Section>
    </PageContainer>
  );
}
