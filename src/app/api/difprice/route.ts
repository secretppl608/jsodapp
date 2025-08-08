import type { NextApiRequest, NextApiResponse } from 'next';

// 定义请求体类型
interface RequestBody {
  selectedServices: string[];
  selectedTime: string;
  number:number;
}

// 定义响应体类型
interface ResponseData {
  success: boolean;
  total?: number;
  pm?: number;
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
    if (!selectedServices || !selectedTime || !number) {
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
      total: calculatedPrice,
      pm: parseFloat(( calculatedPrice * 0.5).toFixed(2));
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
function calculatePrice(selectedServices: string[], selectedTime: string): number {
  // 这里添加你的实际价格计算逻辑
  const servicePrices = {
    fixed_service1: 2.00,
    fixed_service2: 2.00,
    fixed_service3: 3.00,
    fixed_service4: 2.00,
    fixed_service5: 0.01,
    night_subsidy: {
        '15': 0.50,
        '30+5': 1.00,
        '60+15': 2.00,
        '120+30': 4.00
    },
    time_service1: {
        '15': 2.00,
        '30+5': 4.00,
        '60+15': 6.00,
        '120+30': 8.00
    },
    time_service2: {
        '15': 2.00,
        '30+5': 4.00,
        '60+15': 6.00,
        '120+30': 8.00
    },
    time_service3: {
        '15': 2.00,
        '30+5': 4.00,
        '60+15': 6.00,
        '120+30': 8.00
    },
    time_service4: {
        '15': 2.00,
        '30+5': 4.00,
        '60+15': 6.00,
        '120+30': 8.00
    },
    time_service5: {
        '15': 2.00,
        '30+5': 4.00,
        '60+15': 6.00,
        '120+30': 8.00
    },
    time_service6: {
        '15': 2.00,
        '30+5': 4.00,
        '60+15': 6.00,
        '120+30': 8.00
    },
    time_service7: {
        '15': 1.00,
        '30+5': 3.00,
        '60+15': 5.00,
        '120+30': 7.00
    },
    time_service8: {
        '15': 3.00,
        '30+5': 3.00,
        '60+15': 4.50,
        '120+30': 7.50
    }
};
     let allPriceSum = 0.00;
    
    selectedServices.forEach(serviceId => {
        const priceInfo = servicePrices[serviceId];
        
        if (typeof priceInfo === 'number') {
            allPriceSum += priceInfo;
        } else if (typeof priceInfo === 'object' && priceInfo[selectedTime] !== undefined) {
            allPriceSum += priceInfo[selectedTime];
        }
    });

    const total = parseFloat(allPriceSum.toFixed(2)) * parseFloat(number.value || 1);
    return total;
}
