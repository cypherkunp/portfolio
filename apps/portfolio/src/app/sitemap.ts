import { PORTFOLIO_BASE_URL } from '@/data/site-data';
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  let routes = ['', '/resume'].map(route => ({
    url: `${PORTFOLIO_BASE_URL}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }));

  return [...routes];
}
 