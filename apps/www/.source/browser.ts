// @ts-nocheck
/// <reference types="vite/client" />
import { browser } from 'fumadocs-mdx/runtime/browser';
import type * as Config from '../source.config';

const create = browser<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>();
const browserCollections = {
  blogPosts: create.doc("blogPosts", import.meta.glob(["./**/*.{mdx,md}"], {
    "base": "./../src/content/posts",
    "query": {
      "collection": "blogPosts"
    },
    "eager": false
  })),
};
export default browserCollections;