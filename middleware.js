// middleware.js (位于项目根目录或src目录)
import { NextResponse } from 'next/server'

// 允许访问的域名列表
const allowedOrigins = [
  'https://www.solivagant.site',
  'https://solivagant.site',
  'http://localhost:3000' // 开发环境
]

export function middleware(request) {
  // 获取请求来源
  const origin = request.headers.get('origin') || ''
  
  // 检查请求来源是否在允许列表中
  if (origin && !allowedOrigins.includes(origin)) {
    return new NextResponse(
      JSON.stringify({ 
        success: false, 
        message: 'Access denied. Unauthorized domain.' 
      }),
      {
        status: 403,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    )
  }

  // 如果是允许的域名，设置CORS头
  const response = NextResponse.next()
  
  if (allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin)
  }
  
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  response.headers.set('Access-Control-Allow-Credentials', 'true')
  
  return response
}

// 配置中间件应用于所有API路由
export const config = {
  matcher: '/api/:path*'
}
