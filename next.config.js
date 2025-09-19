/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'export', // enables static HTML export
  // optional: trailingSlash: true,
};

module.exports = nextConfig;
