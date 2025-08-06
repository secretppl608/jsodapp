import Image from "next/image";

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[auto,1fr,auto] min-h-screen">
      <header className="px-4 py-6 bg-gray-100">
        <div className="max-w-5xl mx-auto">
          <Image
            className="dark:invert"
            src="/next.svg"
            alt="Next.js logo"
            width={180}
            height={38}
            priority
          />
        </div>
      </header>
      
      <main className="flex-1 px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12">
            <h1 className="text-3xl font-bold mb-6">API 测试中心</h1>
            
            {/* 保留原有的列表 */}
            <ol className="font-mono list-inside list-decimal mb-8 bg-gray-50 p-6 rounded-lg">
              <li className="mb-2 tracking-[-.01em]">
                Get started by editing{" "}
                <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-bold">
                  src/app/page.tsx
                </code>
              </li>
              <li className="mb-2">Your second list item</li>
              {/* 可以保留更多原有项目 */}
            </ol>
          </div>
          
          {/* 添加 API 测试信息部分 */}
          <div className="border-t pt-8">
            <h2 className="text-2xl font-semibold mb-4">已创建的 API 端点</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-medium mb-3">简单 POST 测试</h3>
                <div className="space-y-2">
                  <p><code className="bg-gray-100 px-2 py-1 rounded text-sm">POST /api/simple</code></p>
                  <p className="text-gray-600">返回状态码: <span className="font-bold text-green-600">200</span></p>
                  <p className="text-gray-600">返回内容: <code>{"{ status: \"OK\" }"}</code></p>
                </div>
                
                <div className="mt-4">
                  <h4 className="font-medium mb-2">测试命令:</h4>
                  <pre className="bg-gray-800 text-gray-100 p-3 rounded text-sm overflow-x-auto">
                    curl -X POST http://localhost:3000/api/simple
                  </pre>
                </div>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg border border-dashed">
                <h3 className="text-xl font-medium mb-3">更多 API 端点</h3>
                <p className="text-gray-600">后续将添加:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>用户注册 API</li>
                  <li>Supabase 集成端点</li>
                  <li>EmailJS 邮件发送</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="px-4 py-6 bg-gray-100">
        <div className="max-w-5xl mx-auto text-center text-gray-600">
          <p>API 开发基础已就绪 | 下一步: 集成 Supabase 和 EmailJS</p>
        </div>
      </footer>
    </div>
  );
}
