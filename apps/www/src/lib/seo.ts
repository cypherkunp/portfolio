import type { Metadata } from 'next';

import { PORTFOLIO_BASE_URL } from '@/config/site-data';

export const SITE_NAME = 'Devvrat';
export const SITE_LOCALE = 'en_GB';
export const TWITTER_SITE = '@devvrathq';
export const THEME_COLOR = '#0a0a0a';

export const SITE_DESCRIPTION =
  "Hi, I'm Devvrat, a product engineer based out of London. This is my personal website, where I share my ideas, opinions, and interests.";

const PERSON_IMAGE = 'https://avatars.githubusercontent.com/u/1528663?v=4';
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function alreadyBranded(title: string) {
  return (
    title.startsWith(SITE_NAME) || title.endsWith(`| ${SITE_NAME}`)
  );
}

export function brandedTitle(title: string) {
  return alreadyBranded(title) ? title : `${title} | ${SITE_NAME}`;
}

export function documentTitle(title: string): Metadata['title'] {
  return alreadyBranded(title) ? { absolute: title } : title;
}

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
        image: PERSON_IMAGE,
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

export function articleJsonLd(post: {
  title: string;
  description: string;
  slug: string;
  publishedOn?: string;
  image?: string;
}) {
  const url = `${PORTFOLIO_BASE_URL}/posts/${post.slug}`;
  const image = post.image
    ? post.image.startsWith('http')
      ? post.image
      : `${PORTFOLIO_BASE_URL}${post.image}`
    : undefined;

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    ...(post.publishedOn ? { datePublished: post.publishedOn } : {}),
    ...(image ? { image } : {}),
    author: {
      '@type': 'Person',
      name: 'Devvrat Shukla',
      url: PORTFOLIO_BASE_URL,
    },
    mainEntityOfPage: url,
    url,
  };
}

export function faqJsonLd(items: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${PORTFOLIO_BASE_URL}${item.path}`,
    })),
  };
}

export function serializeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

export interface SitemapPost {
  slug: string;
  publishedOn: string;
}

export interface SitemapCollection {
  id: string;
}

export interface SitemapEntry {
  url: string;
  lastModified?: string;
}

export function buildSitemapEntries({
  baseUrl,
  paths,
  posts,
  collections,
}: {
  baseUrl: string;
  paths: string[];
  posts: SitemapPost[];
  collections: SitemapCollection[];
}): SitemapEntry[] {
  const entries: SitemapEntry[] = paths.map(path => ({
    url: path === '/' ? baseUrl : `${baseUrl}${path}`,
  }));

  for (const post of posts) {
    const entry: SitemapEntry = { url: `${baseUrl}/posts/${post.slug}` };
    if (ISO_DATE.test(post.publishedOn)) entry.lastModified = post.publishedOn;
    entries.push(entry);
  }

  if (paths.includes('/bookmarks')) {
    for (const collection of collections) {
      entries.push({ url: `${baseUrl}/bookmarks/${collection.id}` });
    }
  }

  return entries;
}
