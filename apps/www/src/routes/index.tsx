import { loadHomeApps } from '@/server/home';
import PageContainer from '@repo/ui/components/layout/page-container';
import { Section } from '@repo/ui/components/layout/section';
import { createFileRoute } from '@tanstack/react-router';
import { useTranslations } from 'next-intl';

import { PORTFOLIO_BASE_URL } from '@/config/site-data';
import { serializeJsonLd, SITE_DESCRIPTION, siteJsonLd } from '@/lib/seo';
import AppsBlock from '@/components/apps-block';
import InfoBlock from '@/components/info-block';
import { PostLinks } from '@/components/post-links';

import { SiteShell } from './-site-shell';

export const Route = createFileRoute('/')({
  loader: () => loadHomeApps(),
  head: () => ({
    meta: [
      { title: 'Devvrat | Portfolio' },
      { name: 'description', content: SITE_DESCRIPTION },
      { property: 'og:title', content: 'Devvrat | Portfolio' },
      { property: 'og:description', content: SITE_DESCRIPTION },
      { property: 'og:url', content: PORTFOLIO_BASE_URL },
    ],
    links: [{ rel: 'canonical', href: PORTFOLIO_BASE_URL }],
  }),
  component: HomePage,
});

function HomePage() {
  const t = useTranslations();
  const { showApps, enabledApps, posts } = Route.useLoaderData();
  const jsonLd = serializeJsonLd(siteJsonLd());
  const showAppsSection = showApps && enabledApps.length > 0;

  return (
    <SiteShell>
      <PageContainer>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
        <Section isFirstSection>
          <InfoBlock />
        </Section>
        <Section title={t('Blocks.posts.title')}>
          <PostLinks posts={posts} />
        </Section>
        {showAppsSection ? (
          <Section isLastSection title={t('Blocks.apps.title')}>
            <AppsBlock enabledApps={enabledApps} />
          </Section>
        ) : null}
      </PageContainer>
    </SiteShell>
  );
}
