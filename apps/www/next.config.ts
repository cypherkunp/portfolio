import type { NextConfig } from 'next';
import withBundleAnalyzerPlugin from '@next/bundle-analyzer';
import createNextIntlPlugin from 'next-intl/plugin';
// remark plugins to handle and strip frontmatter from rendered MDX
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - types may not be available
import remarkFrontmatter from 'remark-frontmatter';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - optional but handy; ignore types if missing
import remarkGfm from 'remark-gfm';

import createMDX from '@next/mdx';

const withNextIntl = createNextIntlPlugin();

const withBundleAnalyzer = withBundleAnalyzerPlugin({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  transpilePackages: [],
  images: {
    formats: ['image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.microlink.io',
      },
    ],
  },
  // Next.js 16 features
  cacheComponents: true,
  reactCompiler: true,
  turbopack: {
    resolveExtensions: ['.mdx', '.tsx', '.ts', '.jsx', '.js', '.mjs', '.json', '.md'],
  },
};

const withMDX = createMDX({
  // Parse and strip YAML frontmatter so it never renders on the page
  remarkPlugins: [
    remarkFrontmatter,
    // Remove any parsed frontmatter nodes from the AST
    function remarkRemoveFrontmatter() {
      return (tree: any) => {
        if (!tree || !Array.isArray(tree.children)) return;
        tree.children = tree.children.filter((node: any) => node.type !== 'yaml');
      };
    },
    // GitHub-flavored markdown (lists, tables, etc.)
    remarkGfm,
  ],
});

export default withBundleAnalyzer(withNextIntl(withMDX(nextConfig)));
