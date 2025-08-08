// next.config.ts
import type { NextConfig } from 'next'

const config: NextConfig = {
  output: 'standalone',
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  }
}

export default config

module.exports = {
  output: 'standalone', 
  experimental: {
    optimizeCss: false,
    optimizeFonts: true
  }
}
