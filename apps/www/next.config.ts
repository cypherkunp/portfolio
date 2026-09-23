import path from 'path';
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
  redirects: async () => [
    { source: '/connect', destination: 'https://devvrat.uk', permanent: true },
    { source: '/contacts', destination: 'https://devvrat.uk', permanent: true },
  ],
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      ],
    },
  ],
  experimental: {
    viewTransition: true,
  },
  outputFileTracingIncludes: {
    '/photos': ['./public/photos/**/*'],
  },
  transpilePackages: [],
  serverExternalPackages: ['exifr'],
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
    root: path.resolve(__dirname, '../..'),
    resolveExtensions: ['.mdx', '.tsx', '.ts', '.jsx', '.js', '.mjs', '.json', '.md'],
  },
};

const withMDX = createMDX();

export default withBundleAnalyzer(withNextIntl(withMDX(nextConfig)));
