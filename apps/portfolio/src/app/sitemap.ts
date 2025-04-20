import { MetadataRoute } from 'next';

import { PORTFOLIO_BASE_URL } from '@/config/site-data';

export default function sitemap(): MetadataRoute.Sitemap {
  let routes = ['/', '/resume', '/handbook'].map(route => ({
    url: `${PORTFOLIO_BASE_URL}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }));

  return [...routes];
}
  