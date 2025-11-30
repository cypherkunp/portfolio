import type { NextConfig } from 'next';
import withBundleAnalyzerPlugin from '@next/bundle-analyzer';
import { createMDX } from 'fumadocs-mdx/next';
import createNextIntlPlugin from 'next-intl/plugin';

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

const withMDX = createMDX();

export default withBundleAnalyzer(withNextIntl(withMDX(nextConfig)));
