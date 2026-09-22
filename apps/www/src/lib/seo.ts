import type { Metadata } from 'next';

import { PORTFOLIO_BASE_URL } from '@/config/site-data';

export const SITE_NAME = 'Devvrat';
export const SITE_LOCALE = 'en_GB';
export const TWITTER_SITE = '@devvrathq';
export const THEME_COLOR = '#0a0a0a';

export const SITE_DESCRIPTION =
  "Hi, I'm Devvrat, a product engineer based out of London. This is my personal website, where I share my ideas, opinions, and interests.";

export const OG_HOME_IMAGE = {
  url: '/og-home.jpg',
  width: 1200,
  height: 630,
  alt: 'Devvrat',
} as const;

interface SocialImage {
  url: string;
  width: number;
  height: number;
  alt: string;
}

interface SocialMetadataInput {
  title: string;
  description: string;
  url: string;
  type?: 'website' | 'article';
  images?: SocialImage[];
  creator?: string;
  publishedTime?: string;
}

export function socialMetadata({
  title,
  description,
  url,
  type = 'website',
  images = [OG_HOME_IMAGE],
  creator = TWITTER_SITE,
  publishedTime,
}: SocialMetadataInput): Pick<Metadata, 'openGraph' | 'twitter'> {
  const imageUrls = images.map(image => image.url);

  return {
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: SITE_LOCALE,
      images,
      ...(publishedTime ? { type: 'article' as const, publishedTime } : { type }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: imageUrls,
      site: TWITTER_SITE,
      creator,
    },
  };
}

export function siteJsonLd() {
  const personId = `${PORTFOLIO_BASE_URL}/#person`;
  const websiteId = `${PORTFOLIO_BASE_URL}/#website`;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': websiteId,
        url: PORTFOLIO_BASE_URL,
        name: SITE_NAME,
        description: SITE_DESCRIPTION,
        inLanguage: 'en-GB',
        publisher: { '@id': personId },
      },
      {
        '@type': 'Person',
        '@id': personId,
        name: 'Devvrat Shukla',
        alternateName: 'Devvrat',
        url: PORTFOLIO_BASE_URL,
        jobTitle: 'Software engineer',
        image: `${PORTFOLIO_BASE_URL}/apple-touch-icon.png`,
        sameAs: [
          'https://github.com/cypherkunp',
          'https://www.linkedin.com/in/devvratshukla/',
          'https://x.com/devvrathq',
        ],
      },
      {
        '@type': 'WebPage',
        '@id': `${PORTFOLIO_BASE_URL}/#webpage`,
        url: PORTFOLIO_BASE_URL,
        name: 'Devvrat | Portfolio',
        description: SITE_DESCRIPTION,
        isPartOf: { '@id': websiteId },
        about: { '@id': personId },
        inLanguage: 'en-GB',
      },
    ],
  };
}
