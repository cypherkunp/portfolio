import { defineCollection, defineConfig } from '@content-collections/core';
import { compileMDX } from '@content-collections/mdx';
import { exec } from 'node:child_process';
import readingDuration from 'reading-duration';

const posts = defineCollection({
  name: 'posts',
  directory: 'src/content/posts',
  include: '**/*.mdx',
  schema: z => ({
    title: z.string(),
    summary: z.string(),
    published: z.boolean(),
  }),
  transform: async (document, context) => {
    const slug = document.title.toLowerCase().replace(/ /g, '-');
    const mdx = await compileMDX(context, document);

    return {
      ...document,
      mdx,
      slug,
    };
  },
});

const handbook = defineCollection({
  name: 'handbook',
  directory: 'src/content/handbook',
  include: '*.mdx',
  schema: z => ({
    title: z.string(),
  }),
  transform: async (document, context) => {
    const mdx = await compileMDX(context, document);
    const readingTime = readingDuration(mdx, {
      wordsPerMinute: 100,
      emoji: false,
    });

    return {
      ...document,
      mdx,
      readingTime,
    };
  },
});

export default defineConfig({
  collections: [posts],
});
