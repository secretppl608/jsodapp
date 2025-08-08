import type { NextApiRequest, NextApiResponse } from 'next';

interface RequestBody {
  selectedServices: string[];
  selectedTime: TimeSlot;
  number: number;
}

interface ResponseData {
  success: boolean;
  total?: number;
  pm?: number;
  message?: string;
}

type TimeSlot = '15' | '30+5' | '60+15' | '120+30';

interface ServicePricing {
  fixed?: number;
  timeBased?: Record<TimeSlot, number>;
}

// 定价配置 - 集中管理所有服务价格规则
const PRICING_CONFIG: Record<string, ServicePricing> = {
  fixed_service1: { fixed: 2.00 },
  fixed_service2: { fixed: 2.00 },
  fixed_service3: { fixed: 3.00 },
  fixed_service4: { fixed: 2.00 },
  fixed_service5: { fixed: 0.01 },
  
  // 时间相关服务 (1-6 使用相同定价)
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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  // 增强型请求验证
  const validationError = validateRequestBody(req.body);
  if (validationError) {
    return res.status(400).json({
      success: false,
      message: validationError
    });
  }

  const { selectedServices, selectedTime, number } = req.body as RequestBody;

  try {
    const total = calculatePrice(selectedServices, selectedTime, number);
    
    res.status(200).json({
      success: true,
      total,
      pm: Math.round(total * 50) / 100 // 精确的50%计算
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : '价格计算错误';
    console.error('API error:', error);
    res.status(400).json({
      success: false,
      message
    });
  }
}

// 验证请求体函数 (避免使用 any)
function validateRequestBody(body: unknown): string | null {
  if (typeof body !== 'object' || body === null) {
    return '请求体必须是对象';
  }

  const { selectedServices, selectedTime, number } = body as Record<string, unknown>;

  // 验证 selectedServices
  if (!Array.isArray(selectedServices)) {
    return 'selectedServices 必须是数组';
  }
  
  const invalidService = selectedServices.find(
    service => typeof service !== 'string' || !(service in PRICING_CONFIG)
  );
  
  if (invalidService) {
    return `无效的服务ID: ${invalidService}`;
  }

  // 验证 selectedTime
  const validTimes: TimeSlot[] = ['15', '30+5', '60+15', '120+30'];
  if (typeof selectedTime !== 'string' || !validTimes.includes(selectedTime as TimeSlot)) {
    return `无效的时间段: ${selectedTime}`;
  }

  // 验证 number
  if (typeof number !== 'number' || !Number.isInteger(number) || number < 1) {
    return `无效的数量: ${number}，必须是正整数`;
  }

  return null;
}

// 优化后的价格计算函数
function calculatePrice(
  selectedServices: string[], 
  selectedTime: TimeSlot,
  quantity: number
): number {
  let totalPerSession = 0;
  
  for (const serviceId of selectedServices) {
    const pricing = PRICING_CONFIG[serviceId];
    
    if (!pricing) {
      throw new Error(`未配置的服务ID: ${serviceId}`);
    }
    
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
