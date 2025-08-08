 import type { NextApiRequest, NextApiResponse } from 'next';
  
 interface RequestBody {
   selectedServices: string[];
   selectedTime: string;
   number: number;
 }
  
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
   if (req.method !== 'POST') {
     return res.status(405).json({ success: false, message: 'Method not allowed' });
   }
  
   try {
     const { selectedServices, selectedTime, number } = req.body as RequestBody;
  
 
 if (!selectedServices || !selectedTime || number === undefined) {
       return res.status(400).json({
         success: false,
         message: 'Missing required parameters'
       });
     }
  
     // 验证时间段有效性
     const validTimes = ['15', '30+5', '60+15', '120+30'];
     if (!validTimes.includes(selectedTime)) {
       return res.status(400).json({
         success: false,
         message: `Invalid time slot: ${selectedTime}`
       });
     }
  
     // 验证数量有效性
     if (number < 1 || !Number.isInteger(number)) {
       return res.status(400).json({
         success: false,
         message: `Invalid quantity: ${number}`
       });
     }
  
     const calculatedPrice = calculatePrice(selectedServices, selectedTime, number);
     
     res.status(200).json({
       success: true,
       total: calculatedPrice,
       pm: parseFloat((calculatedPrice * 0.5).toFixed(2))
     });
  
   } catch (error) {
     console.error('API error:', error);
     res.status(500).json({
       success: false,
       message: 'Internal server error'
     });
   }
 }
  
 // === 重构的价格计算函数 - 完全使用条件判断 === 
 function calculatePrice(
   selectedServices: string[], 
   selectedTime: string,
   number: number 
 ): number {
   let pricePerSession = 0.00;
  
   // 遍历每个选中的服务 
   for (const serviceId of selectedServices) {
     // === 固定价格服务 === 
     if (serviceId === 'fixed_service1') {
       pricePerSession += 2.00;
     }
     else if (serviceId === 'fixed_service2') {
       pricePerSession += 2.00;
     }
     else if (serviceId === 'fixed_service3') {
       pricePerSession += 3.00;
     }
     else if (serviceId === 'fixed_service4') {
       pricePerSession += 2.00;
     }
     else if (serviceId === 'fixed_service5') {
       pricePerSession += 0.01;
     }
     
     // === 时间相关服务（服务1-6）===
     else if (serviceId.startsWith('time_service') && 
              ['time_service1', 'time_service2', 'time_service3', 
               'time_service4', 'time_service5', 'time_service6'].includes(serviceId)) {
       if (selectedTime === '15') {
         pricePerSession += 2.00;
       } else if (selectedTime === '30+5') {
         pricePerSession += 4.00;
       } else if (selectedTime === '60+15') {
         pricePerSession += 6.00;
       } else if (selectedTime === '120+30') {
         pricePerSession += 8.00;
       }
     }
     
     // === 特殊时间服务 === 
     else if (serviceId === 'time_service7') {
       if (selectedTime === '15') {
         pricePerSession += 1.00;
       } else if (selectedTime === '30+5') {
         pricePerSession += 3.00;
       } else if (selectedTime === '60+15') {
         pricePerSession += 5.00;
       } else if (selectedTime === '120+30') {
         pricePerSession += 7.00;
       }
     }
     else if (serviceId === 'time_service8') {
       if (selectedTime === '15') {
         pricePerSession += 3.00;
       } else if (selectedTime === '30+5') {
         pricePerSession += 3.00;
       } else if (selectedTime === '60+15') {
         pricePerSession += 4.50;
       } else if (selectedTime === '120+30') {
         pricePerSession += 7.50;
       }
     }
     
     // === 夜间补贴 === 
     else if (serviceId === 'night_subsidy') {
       if (selectedTime === '15') {
         pricePerSession += 0.50;
       } else if (selectedTime === '30+5') {
         pricePerSession += 1.00;
       } else if (selectedTime === '60+15') {
         pricePerSession += 2.00;
       } else if (selectedTime === '120+30') {
         pricePerSession += 4.00;
       }
     }
     
     // === 未知服务异常处理 === 
     else {
       throw new Error(`Invalid service ID: ${serviceId}`);
     }
   }
  
   // 计算总价 = 单次服务总价 × 数量 
   return parseFloat((pricePerSession * number).toFixed(2));
 }
