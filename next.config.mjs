/** @type {import('next').NextConfig} */

const nextConfig = {
  experimental: {
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.s3.*.amazonaws.com',
        port: '',
        pathname: '/content/**',
      },
    ],
    domains: ['cdn.bsky.app', 'av-cdn.bsky.app'],
  },
};

export default nextConfig;
