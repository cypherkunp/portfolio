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
    'post1.mdx': () => import('../src/content/posts/post1.mdx?collection=blogPosts'),
  }),
};
export default browserCollections;
