import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { brandedTitle, socialMetadata } from '@/lib/seo';
import PageContainer from '@/components/layout/page-container';
import { Section } from '@/components/layout/section';
import PostsBlock from '@/components/posts-block';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Blocks.posts');
  const title = t('title');
  const description = t('description');

  return {
    title,
    description,
    ...socialMetadata({
      title: brandedTitle(title),
      description,
      url: '/posts',
    }),
  };
}

export default async function Page() {
  const t = await getTranslations('Blocks.posts');

  return (
    <PageContainer>
      <Section isFirstSection isLastSection title={t('title')} description={t('description')}>
        <PostsBlock />
      </Section>
    </PageContainer>
  );
}
