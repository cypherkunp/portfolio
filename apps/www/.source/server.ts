// @ts-nocheck
import { server } from 'fumadocs-mdx/runtime/server';

import type * as Config from '../source.config';
import * as __fd_glob_0 from '../src/content/posts/handbook.mdx?collection=blogPosts';
import * as __fd_glob_1 from '../src/content/posts/post1.mdx?collection=blogPosts';

const create = server<
  typeof Config,
  import('fumadocs-mdx/runtime/types').InternalTypeConfig & {
    DocData: {};
  }
>({ doc: { passthroughs: ['extractedReferences'] } });

export const blogPosts = await create.doc('blogPosts', 'src/content/posts', {
  'handbook.mdx': __fd_glob_0,
  'post1.mdx': __fd_glob_1,
});
