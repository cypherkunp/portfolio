// source.config.ts
import { defineCollections } from 'fumadocs-mdx/config';
import { z } from 'zod';

var blogPosts = defineCollections({
  type: 'doc',
  dir: 'src/content/posts',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    summary: z.string().optional(),
    publishedOn: z.string(),
    version: z.string(),
    tags: z.array(z.string()),
    image: z.string().optional(),
    icon: z.string().optional(),
    full: z.boolean().optional(),
  }),
});
export { blogPosts };
