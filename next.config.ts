// next.config.ts
import type { NextConfig } from 'next'

const config: NextConfig = {
  output: 'standalone' // 关键：启用独立部署模式
}

export default config

module.exports = {
  output: 'standalone', // 必须的
  // 添加以下配置解决 lightningcss 问题
  experimental: {
    optimizeCss: false,
    optimizeFonts: false,
  }
}
