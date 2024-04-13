import { PORTFOLIO_BASE_URL } from '@/data/site-data';

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
      },
    ],
    sitemap: `${PORTFOLIO_BASE_URL}/sitemap.xml`,
    host: PORTFOLIO_BASE_URL,
  };
}
