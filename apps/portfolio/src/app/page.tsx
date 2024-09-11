import { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

import CompanyBlock from '@/components/company-block';
import { FaqBlock } from '@/components/faq-block';
import InfoBlock from '@/components/info-block';
import PageContainer from '@/components/layout/page-container';
import { Section } from '@/components/layout/section';
import StackBlock from '@/components/stack-block';

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations('HomePage');
  return {
    title: t('title'),
    description: t('description'),
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
