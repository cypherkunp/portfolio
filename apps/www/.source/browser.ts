// @ts-nocheck
import { browser } from 'fumadocs-mdx/runtime/browser';
import type * as Config from '../source.config';

const create = browser<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>();
const browserCollections = {
  blogPosts: create.doc("blogPosts", {"agent-skills-101.mdx": () => import("../src/content/posts/agent-skills-101.mdx?collection=blogPosts"), "atomic-design-in-react.mdx": () => import("../src/content/posts/atomic-design-in-react.mdx?collection=blogPosts"), "branch-naming-conventions.mdx": () => import("../src/content/posts/branch-naming-conventions.mdx?collection=blogPosts"), "build-better-agent-skills.mdx": () => import("../src/content/posts/build-better-agent-skills.mdx?collection=blogPosts"), "claude-code-mcp.mdx": () => import("../src/content/posts/claude-code-mcp.mdx?collection=blogPosts"), "factory-mindset.mdx": () => import("../src/content/posts/factory-mindset.mdx?collection=blogPosts"), "github-stacked-prs.mdx": () => import("../src/content/posts/github-stacked-prs.mdx?collection=blogPosts"), "handbook.mdx": () => import("../src/content/posts/handbook.mdx?collection=blogPosts"), "hello-world.mdx": () => import("../src/content/posts/hello-world.mdx?collection=blogPosts"), }),
};
export default browserCollections;