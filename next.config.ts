import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '**',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.captureatrip.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'd1zvcmhypeawxj.cloudfront.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'assets-in.bmscdn.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.bmscdn.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'in.bmscdn.com',
        pathname: '/**',
      },
    ],
    qualities: [75, 90],
  },
};

export default nextConfig;
