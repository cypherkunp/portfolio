// @ts-nocheck
import { browser } from 'fumadocs-mdx/runtime/browser';

import type * as Config from '../source.config';

const create = browser<
  typeof Config,
  import('fumadocs-mdx/runtime/types').InternalTypeConfig & {
    DocData: {};
  }
>();
const browserCollections = {
  blogPosts: create.doc('blogPosts', {
    'claude-code-mcp.mdx': () =>
      import('../src/content/posts/claude-code-mcp.mdx?collection=blogPosts'),
    'handbook.mdx': () => import('../src/content/posts/handbook.mdx?collection=blogPosts'),
    'hello-world.mdx': () => import('../src/content/posts/hello-world.mdx?collection=blogPosts'),
    'site-architecture.mdx': () =>
      import('../src/content/posts/site-architecture.mdx?collection=blogPosts'),
  }),
};
export default browserCollections;
