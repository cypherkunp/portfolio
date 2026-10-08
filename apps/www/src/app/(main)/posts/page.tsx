import { Metadata } from 'next';
import PageContainer from '@repo/ui/components/layout/page-container';
import { Section } from '@repo/ui/components/layout/section';
import { getTranslations } from 'next-intl/server';

import { brandedTitle, socialMetadata } from '@/lib/seo';
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
