import { Metadata } from 'next';
import { useTranslations } from 'next-intl';
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

export default function Page() {
  const t = useTranslations();

  return (
    <PageContainer>
      <Section isFirstSection>
        <InfoBlock />
      </Section>
      <Section title={t('Blocks.posts.title')}>
        <PostsBlock />
      </Section>
      <Section isLastSection title={t('Blocks.apps.title')}>
        <AppsBlock />
      </Section>
    </PageContainer>
  );
}
