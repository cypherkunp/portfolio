import { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

import ProfilePic from '@/images/profile.jpg';
import PorfileCircle from '@/images/profile-circle.jpg';

import InfoBlock from '@/components/info-block';
import Feature from '@/components/feature';
import { Section } from '@/components/layout/section';
import PageContainer from '@/components/layout/page-container';
import CompanyCarousel from '@/components/company-carousel';
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
        <InfoBlock
          title={t('HomePage.infoBlock.title')}
          highlight={t('HomePage.infoBlock.highlight')}
          description={t('HomePage.infoBlock.description')}
          avatarUrl={PorfileCircle.src}
          avatarAlt={t('Common.contact.name')}
        />
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
        <CompanyCarousel />
      </Section>
    </PageContainer>
  );
}
