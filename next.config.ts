import type { NextConfig } from 'next';

const config: NextConfig = {
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    useLightningcss: false,
  },
};

export default config;
