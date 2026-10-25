import { describe, expect, it } from 'vitest';

import { postPageHead, postsIndexHead } from '@/lib/posts-page';

describe('postsIndexHead', () => {
  it('matches the current posts index title and description', () => {
    const head = postsIndexHead();

    expect(head.meta).toContainEqual({ title: 'Posts | Devvrat' });
    expect(head.meta).toContainEqual({
      name: 'description',
      content: 'I write about my experiences and learnings in the software engineering field.',
    });
    expect(head.links).toContainEqual({
      rel: 'canonical',
      href: 'https://www.devvrat.cc/posts',
    });
  });
});

describe('postPageHead', () => {
  it('matches the Hello world title, description, and article structured data', () => {
    const head = postPageHead({
      title: 'Hello world',
      description: 'The stack behind this site and why each piece is here.',
      slug: 'hello-world',
      publishedOn: '01-01-2025',
    });

    expect(head.meta).toContainEqual({ title: 'Hello world | Devvrat' });
    expect(head.meta).toContainEqual({
      name: 'description',
      content: 'The stack behind this site and why each piece is here.',
    });
    expect(head.links).toContainEqual({
      rel: 'canonical',
      href: 'https://www.devvrat.cc/posts/hello-world',
    });
    expect(head.jsonLd).toMatchObject({
      '@type': 'BlogPosting',
      headline: 'Hello world',
      description: 'The stack behind this site and why each piece is here.',
      datePublished: '2025-01-01',
      url: 'https://www.devvrat.cc/posts/hello-world',
    });
  });

  it('keeps a title that already names the site', () => {
    const head = postPageHead({
      title: "Devvrat's Handbook",
      description: 'Values, work habits, and engineering rules I use when building software.',
      slug: 'handbook',
      publishedOn: '01-01-2024',
    });

    expect(head.meta).toContainEqual({ title: "Devvrat's Handbook" });
  });
});
