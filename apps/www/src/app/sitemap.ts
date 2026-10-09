import { MetadataRoute } from 'next';

import { PORTFOLIO_BASE_URL } from '@/config/site-data';
import { getSitemapPaths } from '@/lib/app-catalog';
import { getCollections } from '@/lib/bookmarks';
import { getBlogPosts } from '@/lib/post.utils';
import { buildSitemapEntries } from '@/lib/seo';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const paths = await getSitemapPaths();

  return buildSitemapEntries({
    baseUrl: PORTFOLIO_BASE_URL,
    paths,
    posts: getBlogPosts().map(post => ({
      slug: post.slug,
      publishedOn: post.metadata.publishedOn,
    })),
    collections: getCollections().map(collection => ({ id: collection.id })),
  });
}
