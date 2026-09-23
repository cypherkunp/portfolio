import { PORTFOLIO_BASE_URL } from '@/config/site-data';

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: '/api/',
      },
    ],
    sitemap: `${PORTFOLIO_BASE_URL}/sitemap.xml`,
    host: PORTFOLIO_BASE_URL,
  };
}
