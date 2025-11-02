import type { NextConfig } from 'next';
import withBundleAnalyzerPlugin from '@next/bundle-analyzer';
import createNextIntlPlugin from 'next-intl/plugin';

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
  // Add markdown plugins here, as desired
});

export default withBundleAnalyzer(withNextIntl(withMDX(nextConfig)));
