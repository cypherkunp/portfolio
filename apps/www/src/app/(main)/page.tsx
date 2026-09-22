import { Suspense } from 'react';
import { Metadata } from 'next';
import { featureAppsSupport } from '@/flags';
import { getTranslations } from 'next-intl/server';

import { getEnabledApps } from '@/lib/app-catalog';
import { SITE_DESCRIPTION, siteJsonLd, socialMetadata } from '@/lib/seo';
import AppsBlock from '@/components/apps-block';
import InfoBlock from '@/components/info-block';
import PageContainer from '@/components/layout/page-container';
import { Section } from '@/components/layout/section';
import PostsBlock from '@/components/posts-block';

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations();

  const title = t('HomePage.title');

  return {
    title,
    description: SITE_DESCRIPTION,
    ...socialMetadata({
      title,
      description: SITE_DESCRIPTION,
      url: '/',
    }),
  };
};

async function AppsSectionGuard() {
  const t = await getTranslations();
  const [showApps, enabledApps] = await Promise.all([featureAppsSupport(), getEnabledApps()]);

  if (!showApps || enabledApps.length === 0) return null;

  return (
    <Section isLastSection title={t('Blocks.apps.title')}>
      <AppsBlock enabledApps={enabledApps} />
    </Section>
  );
}

export default async function Page() {
  const t = await getTranslations();

  const jsonLd = JSON.stringify(siteJsonLd()).replace(/</g, '\\u003c');

  return (
    <PageContainer>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
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
