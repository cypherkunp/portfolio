import { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import ProfilePic from '@/images/profile.jpg';

import InfoBlock from '@/components/info-block';
import Feature from '@/components/feature';
import { Section } from '@/components/section';
import { RESUME_DATA } from '@/data/resume-data';
import PageContainer from '@/components/layout/page-container';

export const metadata: Metadata = {
  title: `${RESUME_DATA.name} | ${RESUME_DATA.about}`,
  description: RESUME_DATA.summary,
};

export default function Page() {
  const t = useTranslations('HomePage');

  return (
    <PageContainer>
      <Section isFirstSection>
        <InfoBlock
          title={t('title')}
          highlight={t('highlight')}
          description={t('description')}
          avatarUrl={ProfilePic.src}
          avatarAlt={RESUME_DATA.name}
        />
      </Section>
      <Feature flag="enable">
        <section className="w-full"></section>
      </Feature>
    </PageContainer>
  );
}
