import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // force Next.js to use Webpack instead of Turbopack
  webpack: (config) => {
    return config
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '/images/**',
      },
    ],
  },
}

export default nextConfig
