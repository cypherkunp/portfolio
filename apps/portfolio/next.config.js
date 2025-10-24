const createNextIntlPlugin = require('next-intl/plugin');
const withNextIntl = createNextIntlPlugin();
const createMDX = require('@next/mdx');

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
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
    // Turbopack is now default in v16
  },
};

const withMDX = createMDX({
  // Add markdown plugins here, as desired
});

module.exports = withBundleAnalyzer(withNextIntl(withMDX(nextConfig)));
