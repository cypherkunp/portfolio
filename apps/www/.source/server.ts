// @ts-nocheck
/// <reference types="vite/client" />
import { server } from 'fumadocs-mdx/runtime/server';
import type * as Config from '../source.config';

const create = server<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>({"doc":{"passthroughs":["extractedReferences"]}});

export const blogPosts = await create.doc("blogPosts", "src/content/posts", import.meta.glob(["./**/*.{mdx,md}"], {
  "base": "./../src/content/posts",
  "query": {
    "collection": "blogPosts"
  },
  "eager": true
}));