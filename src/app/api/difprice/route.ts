import type { NextApiRequest, NextApiResponse } from 'next';

// 定义请求体类型
interface RequestBody {
  selectedServices: string[];
  selectedTime: string;
}

// 定义响应体类型
interface ResponseData {
  success: boolean;
  price?: number;
  message?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  // 只处理 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    // 解析请求体
    const { selectedServices, selectedTime }: RequestBody = req.body;

    // 验证参数
    if (!selectedServices || !selectedTime) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters'
      });
    }

    // 这里调用你的实际价格计算逻辑
    // 替换下面的 calculatePrice 函数为你的真实计算逻辑
    const calculatedPrice = calculatePrice(selectedServices, selectedTime);

    // 返回成功响应
    res.status(200).json({
      success: true,
      price: calculatedPrice
    });

  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

// 示例计算函数（替换为你的实际逻辑）
function calculatePrice(services: string[], time: string): number {
  // 这里添加你的实际价格计算逻辑
  console.log('Received services:', services);
  console.log('Received time:', time);
  
  // 示例：简单返回一个随机价格
  return Math.floor(Math.random() * 1000) + 100;
}
