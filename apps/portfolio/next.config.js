import MillionLint from '@million/lint';

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@portfolio/ui'],
};

const nextConfigWithMillionLint = MillionLint.next({ rsc: true })(nextConfig);

module.exports = withBundleAnalyzer(nextConfigWithMillionLint);
