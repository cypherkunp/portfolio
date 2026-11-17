import { loadPostIndex } from '@/server/posts';
import PageContainer from '@repo/ui/components/layout/page-container';
import { Section } from '@repo/ui/components/layout/section';
import { createFileRoute } from '@tanstack/react-router';
import { useTranslations } from 'next-intl';

import { postsIndexHead } from '@/lib/posts-page';
import { PostLinks } from '@/components/post-links';

import { SiteShell } from '../-site-shell';

export const Route = createFileRoute('/posts/')({
  loader: () => loadPostIndex(),
  head: () => postsIndexHead(),
  component: PostsIndexPage,
});

function PostsIndexPage() {
  const t = useTranslations('Blocks.posts');
  const posts = Route.useLoaderData();

  return (
    <SiteShell>
      <PageContainer>
        <Section isFirstSection isLastSection title={t('title')} description={t('description')}>
          <PostLinks posts={posts} />
        </Section>
      </PageContainer>
    </SiteShell>
  );
}
