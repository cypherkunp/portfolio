const createNextIntlPlugin = require('next-intl/plugin');
const withNextIntl = createNextIntlPlugin();
const { withContentCollections } = require('@content-collections/next');

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [],
};

module.exports = withContentCollections(withBundleAnalyzer(withNextIntl(nextConfig)));
