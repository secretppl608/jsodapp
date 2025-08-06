import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // 简单的日志记录，便于调试
  console.log('POST /api/simple received request');
  
  return NextResponse.json(
    { status: "OK", message: "API is working" },
    { status: 200 }
  );
}
