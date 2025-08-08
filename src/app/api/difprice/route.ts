 import type { NextApiRequest, NextApiResponse } from 'next';
  
 // 定义请求体类型
 interface RequestBody {
   selectedServices: string[];
   selectedTime: string;
   number: number;
 }
  
 // 定义响应体类型 
 interface ResponseData {
   success: boolean;
   total?: number;
   pm?: number;
   message?: string;
 }
  
 // 定义服务价格类型 
 type TimePrice = {
   '15': number;
   '30+5': number;
   '60+15': number;
   '120+30': number;
 };
  
 interface ServicePrices {
   fixed_service1: number;
   fixed_service2: number;
   fixed_service3: number;
   fixed_service4: number;
   fixed_service5: number;
   night_subsidy: TimePrice;
   time_service1: TimePrice;
   time_service2: TimePrice;
   time_service3: TimePrice;
   time_service4: TimePrice;
   time_service5: TimePrice;
   time_service6: TimePrice;
   time_service7: TimePrice;
   time_service8: TimePrice;
   // 允许其他字符串键，但值必须是 number 或 TimePrice
   [key: string]: number | TimePrice;
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
     // 解析请求体 - 包含 number
     const { selectedServices, selectedTime, number }: RequestBody = req.body;
  
     // 验证参数 
 
 if (!selectedServices || !selectedTime || number === undefined) {
       return res.status(400).json({
         success: false,
         message: 'Missing required parameters'
       });
     }
  
     // 调用计算函数 
     const calculatedPrice = calculatePrice(selectedServices, selectedTime, number);
  
     // 返回成功响应
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
  
 // 使用严格类型的计算函数 
 function calculatePrice(
   selectedServices: string[], 
   selectedTime: string,
   number: number 
 ): number {
   // 使用严格类型定义的服务价格
   const servicePrices: ServicePrices = {
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
  
   // === 新增输入验证 ===
   const validTimes: (keyof TimePrice)[] = ['15', '30+5', '60+15', '120+30'];
   if (!validTimes.includes(selectedTime as keyof TimePrice)) {
     throw new Error(`Invalid time slot: ${selectedTime}`);
   }
  
   if (number < 1 || !Number.isInteger(number)) {
     throw new Error(`Invalid quantity: ${number}`);
   }
  
   let allPriceSum = 0.00;
   
   selectedServices.forEach(serviceId => {
     // 检查服务ID是否存在
     if (!(serviceId in servicePrices)) {
       throw new Error(`Invalid service ID: ${serviceId}`);
     }
     
     const priceInfo = servicePrices[serviceId];
     
     if (typeof priceInfo === 'number') {
       allPriceSum += priceInfo;
     } else if (isTimePrice(priceInfo)) {
       const timePrice = priceInfo[selectedTime as keyof TimePrice];
       if (typeof timePrice === 'number') {
         allPriceSum += timePrice;
       }
     }
   });
  
   const total = parseFloat(allPriceSum.toFixed(2)) * number;
   return total;
 }
  
 // === 修复的类型守卫函数 ===
 function isTimePrice(obj: unknown): obj is TimePrice {
   // 1. 检查基础对象类型 
   if (typeof obj !== "object" || obj === null) return false;
  
   // 2. 安全类型转换
   const candidate = obj as Record<string, unknown>;
   
   // 3. 键值存在性 + 类型验证 
   return (
     typeof candidate["15"] === "number" &&
     typeof candidate["30+5"] === "number" &&
     typeof candidate["60+15"] === "number" &&
     typeof candidate["120+30"] === "number"
   );
   }
