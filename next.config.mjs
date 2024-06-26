/** @type {import('next').NextConfig} */
import { withPlausibleProxy } from 'next-plausible'

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.s3.*.amazonaws.com',
        port: '',
        pathname: '/content/**',
      },
    ],
  },
};

export default withPlausibleProxy()(nextConfig);
