import { NextRequest, NextResponse } from 'next/server';

// 类型定义
type TimeSlot = '15' | '30+5' | '60+15' | '120+30';

interface ServicePricing {
  fixed?: number;
  timeBased?: Record<TimeSlot, number>;
}

interface PriceRequest {
  selectedServices: string[];
  selectedTime: TimeSlot;
  quantity: number;
}

interface PriceResponse {
  success: boolean;
  total?: number;
  pm?: number;
  message?: string;
}

// 定价配置
const PRICING_CONFIG: Record<string, ServicePricing> = {
  fixed_service1: { fixed: 2.00 },
  fixed_service2: { fixed: 2.00 },
  fixed_service3: { fixed: 3.00 },
  fixed_service4: { fixed: 2.00 },
  fixed_service5: { fixed: 0.01 },
  
  // 时间相关服务 (1-6)
  time_service1: { timeBased: { '15': 2.00, '30+5': 4.00, '60+15': 6.00, '120+30': 8.00 }},
  time_service2: { timeBased: { '15': 2.00, '30+5': 4.00, '60+15': 6.00, '120+30': 8.00 }},
  time_service3: { timeBased: { '15': 2.00, '30+5': 4.00, '60+15': 6.00, '120+30': 8.00 }},
  time_service4: { timeBased: { '15': 2.00, '30+5': 4.00, '60+15': 6.00, '120+30': 8.00 }},
  time_service5: { timeBased: { '15': 2.00, '30+5': 4.00, '60+15': 6.00, '120+30': 8.00 }},
  time_service6: { timeBased: { '15': 2.00, '30+5': 4.00, '60+15': 6.00, '120+30': 8.00 }},
  
  // 特殊时间服务
  time_service7: { timeBased: { '15': 1.00, '30+5': 3.00, '60+15': 5.00, '120+30': 7.00 }},
  time_service8: { timeBased: { '15': 3.00, '30+5': 3.00, '60+15': 4.50, '120+30': 7.50 }},
  
  // 夜间补贴 
  night_subsidy: { timeBased: { '15': 0.50, '30+5': 1.00, '60+15': 2.00, '120+30': 4.00 }}
};

// 验证请求数据
function validateRequest(data: unknown): data is PriceRequest {
  if (typeof data !== 'object' || data === null) {
    return false;
  }
  
  const requestData = data as Record<string, unknown>;
  const { selectedServices, selectedTime, quantity } = requestData;
  
  // 验证 selectedServices
  if (!Array.isArray(selectedServices) || selectedServices.length === 0) {
    return false;
  }
  
  // 验证每个服务ID是否有效
  const isValidService = selectedServices.every(
    service => typeof service === 'string' && service in PRICING_CONFIG 
  );
  
  if (!isValidService) {
    return false;
  }
  
  // 验证时间段
  const validTimes: TimeSlot[] = ['15', '30+5', '60+15', '120+30'];
  if (typeof selectedTime !== 'string' || !validTimes.includes(selectedTime as TimeSlot)) {
    return false;
  }
  
  // 验证数量
  if (typeof quantity !== 'number' || !Number.isInteger(quantity) || quantity < 1) {
    return false;
  }
  
  return true;
}

// 计算总价
function calculateTotal(selectedServices: string[], selectedTime: TimeSlot, quantity: number): number {
  let totalPerSession = 0;
  
  for (const serviceId of selectedServices) {
    const pricing = PRICING_CONFIG[serviceId];
    
    if (pricing.fixed !== undefined) {
      totalPerSession += pricing.fixed;
    } 
    else if (pricing.timeBased) {
      totalPerSession += pricing.timeBased[selectedTime];
    }
  }
  
  // 使用整数运算避免浮点误差
  return Math.round(totalPerSession * quantity * 100) / 100;
}

// 处理 OPTIONS 预检请求
export async function OPTIONS() {
  // 不再处理 OPTIONS 请求，由中间件统一处理
  return NextResponse.json({}, { status: 200 });
}

// 处理 POST 请求
export async function POST(request: NextRequest) {
  try {
    // 解析请求体
    const requestData = await request.json();
    
    // 验证请求数据
    if (!validateRequest(requestData)) {
      return NextResponse.json(
        { success: false, message: '无效的请求参数' },
        { status: 400 }
      );
    }
    
    // 类型安全的请求数据
    const { selectedServices, selectedTime, quantity } = requestData as PriceRequest;
    
    // 计算总价
    const total = calculateTotal(selectedServices, selectedTime, quantity);
    
    // 计算预付金额 (50%)
    const prepayment = Math.round(total * 50) / 100;
    
    // 返回成功响应
    return NextResponse.json({
      success: true,
      total,
      pm: prepayment 
    });
    
  } catch (error) {
    // 错误处理
    let errorMessage = '服务器处理请求时出错';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    console.error('API Error:', error);
    
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}

// 处理 GET 请求
export async function GET() {
  return NextResponse.json(
    { success: false, message: '仅支持POST请求' },
    { status: 405 }
  );
}

