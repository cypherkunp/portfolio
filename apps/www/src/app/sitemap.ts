import { MetadataRoute } from 'next';

import { PORTFOLIO_BASE_URL } from '@/config/site-data';
import { getSitemapPaths } from '@/lib/app-catalog';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date().toISOString().split('T')[0];

  return (await getSitemapPaths()).map(route => ({
    url: `${PORTFOLIO_BASE_URL}${route}`,
    lastModified,
  }));
}
