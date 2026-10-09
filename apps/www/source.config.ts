import { defineCollections, defineConfig } from 'fumadocs-mdx/config';
import { z } from 'zod';

export const blogPosts = defineCollections({
  type: 'doc',
  dir: 'src/content/posts',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    summary: z.string().optional(),
    publishedOn: z.string().regex(/^\d{2}-\d{2}-\d{4}$/),
    version: z.string(),
    tags: z.array(z.string()),
    image: z.string().optional(),
    icon: z.string().optional(),
    full: z.boolean().optional(),
  }),
});

export default defineConfig({
  mdxOptions: {
    rehypeCodeOptions: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      transformers: [
        {
          name: 'rehype-code:language',
          pre(node) {
            const lang = this.options.lang;
            if (lang) node.properties['data-language'] = lang;

            const meta = this.options.meta;
            const raw =
              meta &&
              typeof meta === 'object' &&
              '__raw' in meta &&
              typeof meta.__raw === 'string'
                ? meta.__raw
                : '';
            const wrap = raw.match(/(?:^|\s)wrap=(?:"([^"]+)"|'([^']+)'|(\S+))/);
            const value = wrap?.[1] ?? wrap?.[2] ?? wrap?.[3];
            if (value) node.properties['data-wrap'] = value;
          },
        },
      ],
    },
  },
});
