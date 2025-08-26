import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const allowedOrigins: string[] = [
  'https://www.solivagant.site',
  'https://solivagant.site',
  'http://localhost:3000'
]

console.log('🔄 Middleware module loaded at', new Date().toISOString());

export function middleware(request: NextRequest) {
  console.log('🔵 Middleware executing for:', request.method, request.url);
  const origin = request.headers.get('origin'); // 移除默认空字符串，保留 null 更准确
  console.log('Request origin:', origin);

  // 1. 仅当 Origin 存在且不在允许列表时，才拦截（修复空 Origin 误判）
  const isOriginAllowed = !origin || allowedOrigins.includes(origin);

  // 2. OPTIONS 预检请求：先校验 Origin，不允许则返回 403（修复安全漏洞）
  if (request.method === 'OPTIONS') {
    if (!isOriginAllowed) {
      return NextResponse.json(
        { success: false, message: '未经允许的访问请求' },
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }
    // 仅对允许的 Origin 设置 CORS 头
    const response = new NextResponse(null, { status: 204 });
    response.headers.set('Access-Control-Allow-Origin', origin || '*'); // 空 Origin 用 *（非带凭证场景）
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    return response;
  }

  // 3. 非 OPTIONS 请求：仅对允许的 Origin 设置 CORS 头（修复矛盾配置）
  const response = NextResponse.next();
  if (isOriginAllowed) {
    response.headers.set('Access-Control-Allow-Origin', origin || '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.headers.set('Access-Control-Allow-Credentials', 'true');
  }

  return response;
}

export const config = {
  matcher: '/:path*',
}


	
