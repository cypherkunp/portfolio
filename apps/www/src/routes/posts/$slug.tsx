import { Suspense } from 'react';
import { loadPost } from '@/server/posts';
import PageContainer from '@repo/ui/components/layout/page-container';
import { createFileRoute, notFound } from '@tanstack/react-router';

import { postPageHead } from '@/lib/posts-page';
import { serializeJsonLd } from '@/lib/seo';

import { SiteShell } from '../-site-shell';
import browserCollections from '../../../.source/browser';
import { getMDXComponents } from '../../../mdx-components';

const postBody = browserCollections.blogPosts.createClientLoader({
  id: 'blogPosts',
  component: ({ default: Mdx }) => <Mdx components={getMDXComponents()} />,
});

export const Route = createFileRoute('/posts/$slug')({
  loader: async ({ params }) => {
    const post = await loadPost({ data: params.slug });
    if (!post) throw notFound();
    await postBody.preload(`${params.slug}.mdx`);
    return post;
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const head = postPageHead(loaderData);
    return { meta: head.meta, links: head.links };
  },
  component: PostPage,
});

function PostPage() {
  const post = Route.useLoaderData();
  const jsonLd = serializeJsonLd(postPageHead(post).jsonLd);

  return (
    <SiteShell>
      <PageContainer>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
        <Suspense fallback={<p>Loading...</p>}>{postBody.useContent(`${post.slug}.mdx`)}</Suspense>
      </PageContainer>
    </SiteShell>
  );
}
