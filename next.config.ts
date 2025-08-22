import type { NextConfig } from 'next';

const config: NextConfig = {
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  optimizeFonts: true,
  experimental: {
    optimizeCss: true
    // 可以添加其他实验性功能
  },
  // 可在此添加其他标准配置
};

export default config;
