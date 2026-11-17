import { PORTFOLIO_BASE_URL } from '@/config/site-data';
import { toIsoDate } from '@/lib/format-date';
import { articleJsonLd, brandedTitle } from '@/lib/seo';

import en from '../../messages/en.json';

interface PostHeadInput {
  title: string;
  description: string;
  slug: string;
  publishedOn: string;
  image?: string;
}

function socialMeta(title: string, description: string, url: string) {
  return [
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:url', content: url },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
  ];
}

export function postsIndexHead() {
  const title = brandedTitle(en.Blocks.posts.title);
  const description = en.Blocks.posts.description;
  const url = `${PORTFOLIO_BASE_URL}/posts`;

  return {
    meta: [
      { title },
      { name: 'description', content: description },
      ...socialMeta(title, description, url),
    ],
    links: [{ rel: 'canonical', href: url }],
  };
}

export function postPageHead(post: PostHeadInput) {
  const title = brandedTitle(post.title);
  const url = `${PORTFOLIO_BASE_URL}/posts/${post.slug}`;
  const publishedTime = toIsoDate(post.publishedOn);
  const image = post.image
    ? post.image.startsWith('http')
      ? post.image
      : `${PORTFOLIO_BASE_URL}${post.image}`
    : undefined;

  return {
    meta: [
      { title },
      { name: 'description', content: post.description },
      ...socialMeta(title, post.description, url),
      { property: 'og:type', content: 'article' },
      ...(publishedTime ? [{ property: 'article:published_time', content: publishedTime }] : []),
      ...(image
        ? [
            { property: 'og:image', content: image },
            { name: 'twitter:image', content: image },
          ]
        : []),
    ],
    links: [{ rel: 'canonical', href: url }],
    jsonLd: articleJsonLd({
      title: post.title,
      description: post.description,
      slug: post.slug,
      publishedOn: post.publishedOn,
      image: post.image,
    }),
  };
}
