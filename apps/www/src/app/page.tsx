import { Suspense } from 'react';
import { Metadata } from 'next';
import { featureAppsSupport } from '@/flags';
import { getTranslations } from 'next-intl/server';

import AppsBlock from '@/components/apps-block';
import InfoBlock from '@/components/info-block';
import PageContainer from '@/components/layout/page-container';
import { Section } from '@/components/layout/section';
import PostsBlock from '@/components/posts-block';

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
      creator: '@devvrathq',
    },
  };
};

async function AppsSectionGuard() {
  const t = await getTranslations();
  const showApps = await featureAppsSupport();

  if (!showApps) return null;

  return (
    <Section isLastSection title={t('Blocks.apps.title')}>
      <AppsBlock />
    </Section>
  );
}

export default async function Page() {
  const t = await getTranslations();

  return (
    <PageContainer>
      <Section isFirstSection>
        <InfoBlock />
      </Section>
      <Section title={t('Blocks.posts.title')}>
        <PostsBlock />
      </Section>
      <Suspense>
        <AppsSectionGuard />
      </Suspense>
    </PageContainer>
  );
}
