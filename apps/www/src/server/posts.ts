import { createServerFn } from '@tanstack/react-start';

import { getTimeSortedPosts } from '@/lib/post.utils';
import { blog } from '@/lib/source';

export const loadPostIndex = createServerFn({ method: 'GET' }).handler(async () => {
  return getTimeSortedPosts().map(post => ({
    slug: post.slug,
    title: post.metadata.title,
    publishedOn: post.metadata.publishedOn,
  }));
});

export const loadPost = createServerFn({ method: 'GET' })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    const page = blog.getPage([slug]);
    if (!page) return null;

    const data = page.data;

    return {
      slug,
      title: data.title,
      description: data.summary || data.title,
      publishedOn: data.publishedOn,
      image: data.image,
    };
  });
