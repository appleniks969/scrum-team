/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    // Environment variables that will be available at build time and runtime
    // These would typically come from your deployment environment
    JIRA_BASE_URL: process.env.JIRA_BASE_URL,
    GITHUB_ORG: process.env.GITHUB_ORG
  },
  async redirects() {
    return [
      // Add any redirects here
    ];
  },
  async headers() {
    return [
      {
        // Apply these headers to all routes
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
