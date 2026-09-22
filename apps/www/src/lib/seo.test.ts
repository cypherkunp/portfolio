import { describe, expect, it } from 'vitest';

import { SITE_DESCRIPTION, siteJsonLd, socialMetadata } from '@/lib/seo';

describe('socialMetadata', () => {
  it('advertises a LinkedIn-sized image, site name, locale, and X account', () => {
    const meta = socialMetadata({
      title: 'Devvrat | Portfolio',
      description: SITE_DESCRIPTION,
      url: 'https://devvrat.cc',
    });

    expect(meta.openGraph).toMatchObject({
      siteName: 'Devvrat',
      locale: 'en_GB',
      images: [{ url: '/og-home.jpg', width: 1200, height: 630, alt: 'Devvrat' }],
    });
    expect(meta.twitter).toMatchObject({
      card: 'summary_large_image',
      site: '@devvrathq',
      creator: '@devvrathq',
    });
    expect(SITE_DESCRIPTION.length).toBeGreaterThanOrEqual(120);
    expect(SITE_DESCRIPTION.length).toBeLessThanOrEqual(160);
  });
});

describe('siteJsonLd', () => {
  it('describes the site, the person, and the homepage', () => {
    expect(siteJsonLd()).toMatchObject({
      '@context': 'https://schema.org',
      '@graph': [
        { '@type': 'WebSite', name: 'Devvrat', url: 'https://devvrat.cc' },
        {
          '@type': 'Person',
          name: 'Devvrat Shukla',
          sameAs: [
            'https://github.com/cypherkunp',
            'https://www.linkedin.com/in/devvratshukla/',
            'https://x.com/devvrathq',
          ],
        },
        { '@type': 'WebPage', url: 'https://devvrat.cc', name: 'Devvrat | Portfolio' },
      ],
    });
  });
});
