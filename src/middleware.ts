import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const allowedOrigins: string[] = [
  'https://www.solivagant.site',
  'https://solivagant.site',
  'http://localhost:3000'
]

export function middleware(request: NextRequest) {
  console.log('Middleware triggered for:', request.nextUrl.pathname)
  const origin = request.headers.get('origin') || ''
  console.log('Request origin:', origin)

  // 检查来源是否在允许列表中
  if (origin && !allowedOrigins.includes(origin)) {
    return NextResponse.json(
      {
        success: false,
        message: '这是一个未经允许的访问请求，该请求已被阻止。'
      },
      {
        status: 403,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    )
  }

  // 处理预检请求
  if (request.method === 'OPTIONS') {
    const response = NextResponse.json(null, { status: 204 })
    // 设置CORS头
    response.headers.set('Access-Control-Allow-Origin', origin)
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    response.headers.set('Access-Control-Allow-Credentials', 'true')
    return response
  }

  // 对于非OPTIONS请求，继续处理并设置CORS头
  const response = NextResponse.next()
  if (allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin)
  }
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  response.headers.set('Access-Control-Allow-Credentials', 'true')

  return response
}

export const config = {
  matcher: '/api/:path*'
}
