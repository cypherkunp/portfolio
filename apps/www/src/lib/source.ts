import { loader } from 'fumadocs-core/source';
import { toFumadocsSource } from 'fumadocs-mdx/runtime/server';

import { blogPosts } from '../../.source/server';

// Use the generated server collection from Fumadocs
export const blog = loader({
  baseUrl: '/posts',
  source: toFumadocsSource(blogPosts, []),
});
