import { PORTFOLIO_BASE_URL } from '@/data/site-data';

export default function sitemap() {
  let routes = ['', '/resume'].map(route => ({
    url: `${PORTFOLIO_BASE_URL}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }));

  return [...routes];
}
