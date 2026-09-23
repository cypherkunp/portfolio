import { describe, expect, it } from 'vitest';

import {
  articleJsonLd,
  brandedTitle,
  breadcrumbJsonLd,
  buildSitemapEntries,
  documentTitle,
  faqJsonLd,
  SITE_DESCRIPTION,
  siteJsonLd,
  socialMetadata,
} from '@/lib/seo';

describe('socialMetadata', () => {
  it('advertises a LinkedIn-sized image, site name, locale, and X account', () => {
    const meta = socialMetadata({
      title: 'Devvrat | Portfolio',
      description: SITE_DESCRIPTION,
      url: 'https://www.devvrat.cc',
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
        { '@type': 'WebSite', name: 'Devvrat', url: 'https://www.devvrat.cc' },
        {
          '@type': 'Person',
          name: 'Devvrat Shukla',
          image: 'https://avatars.githubusercontent.com/u/1528663?v=4',
          sameAs: [
            'https://github.com/cypherkunp',
            'https://www.linkedin.com/in/devvratshukla/',
            'https://x.com/devvrathq',
          ],
        },
        { '@type': 'WebPage', url: 'https://www.devvrat.cc', name: 'Devvrat | Portfolio' },
      ],
    });
  });
});

describe('brandedTitle', () => {
  it('leaves a title that already names the site', () => {
    expect(brandedTitle('Devvrat | Portfolio')).toBe('Devvrat | Portfolio');
    expect(documentTitle('Devvrat | About')).toEqual({ absolute: 'Devvrat | About' });
    expect(brandedTitle("Devvrat's Handbook")).toBe("Devvrat's Handbook");
    expect(documentTitle("Devvrat's Handbook")).toEqual({ absolute: "Devvrat's Handbook" });
  });

  it('appends the site name when the page title does not', () => {
    expect(brandedTitle('Hello world')).toBe('Hello world | Devvrat');
    expect(documentTitle('Hello world')).toBe('Hello world');
  });
});

describe('articleJsonLd', () => {
  it('describes a post and skips a missing image', () => {
    expect(
      articleJsonLd({
        title: 'Hello world',
        description: 'The stack behind this site and why each piece is here.',
        slug: 'hello-world',
        publishedOn: '2025-01-01',
      }),
    ).toEqual({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: 'Hello world',
      description: 'The stack behind this site and why each piece is here.',
      datePublished: '2025-01-01',
      author: {
        '@type': 'Person',
        name: 'Devvrat Shukla',
        url: 'https://www.devvrat.cc',
      },
      mainEntityOfPage: 'https://www.devvrat.cc/posts/hello-world',
      url: 'https://www.devvrat.cc/posts/hello-world',
    });
  });
});

describe('faqJsonLd', () => {
  it('maps visible questions to FAQPage entities', () => {
    expect(faqJsonLd([{ question: 'Where are you based?', answer: 'London.' }])).toEqual({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Where are you based?',
          acceptedAnswer: { '@type': 'Answer', text: 'London.' },
        },
      ],
    });
  });
});

describe('breadcrumbJsonLd', () => {
  it('lists the visible trail with absolute urls', () => {
    expect(
      breadcrumbJsonLd([
        { name: 'Bookmarks', path: '/bookmarks' },
        { name: 'Reading List', path: '/bookmarks/reading-list' },
      ]),
    ).toMatchObject({
      '@type': 'BreadcrumbList',
      itemListElement: [
        { position: 1, name: 'Bookmarks', item: 'https://www.devvrat.cc/bookmarks' },
        {
          position: 2,
          name: 'Reading List',
          item: 'https://www.devvrat.cc/bookmarks/reading-list',
        },
      ],
    });
  });
});

describe('buildSitemapEntries', () => {
  const baseUrl = 'https://www.devvrat.cc';

  it('omits lastmod on static paths and dates posts from publishedOn', () => {
    expect(
      buildSitemapEntries({
        baseUrl,
        paths: ['/', '/about', '/posts', '/bookmarks'],
        posts: [
          { slug: 'hello-world', publishedOn: '2025-01-01' },
          { slug: 'draft', publishedOn: '' },
        ],
        collections: [{ id: 'reading-list' }],
      }),
    ).toEqual([
      { url: 'https://www.devvrat.cc' },
      { url: 'https://www.devvrat.cc/about' },
      { url: 'https://www.devvrat.cc/posts' },
      { url: 'https://www.devvrat.cc/bookmarks' },
      { url: 'https://www.devvrat.cc/posts/hello-world', lastModified: '2025-01-01' },
      { url: 'https://www.devvrat.cc/posts/draft' },
      { url: 'https://www.devvrat.cc/bookmarks/reading-list' },
    ]);
  });

  it('leaves collection urls out when bookmarks is not indexable', () => {
    expect(
      buildSitemapEntries({
        baseUrl,
        paths: ['/', '/about', '/posts'],
        posts: [],
        collections: [{ id: 'reading-list' }],
      }).map(entry => entry.url),
    ).toEqual([
      'https://www.devvrat.cc',
      'https://www.devvrat.cc/about',
      'https://www.devvrat.cc/posts',
    ]);
  });
});
