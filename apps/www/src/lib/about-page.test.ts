import { describe, expect, it } from 'vitest';

import { aboutPageHead } from '@/lib/about-page';

describe('aboutPageHead', () => {
  it('matches the current about document title, description, and canonical URL', () => {
    const head = aboutPageHead();

    expect(head.meta).toContainEqual({ title: 'Devvrat | About' });
    expect(head.meta).toContainEqual({
      name: 'description',
      content:
        'Lead Experience Engineer at Publicis Sapient in London. Work history since 2019, earlier tech lead at PTC, and how to get in touch.',
    });
    expect(head.links).toContainEqual({
      rel: 'canonical',
      href: 'https://www.devvrat.cc/about',
    });
  });
});
