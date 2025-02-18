'use client'

import { useRouter } from 'next/navigation'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import supabase from "@/lib/supabase"
import { useEffect, useState } from 'react'
import { useUser } from "@clerk/nextjs";



// 定义 PromotionData 接口
interface PromotionData {
  id: number
  promoter_phone: string
  promotion_code: string
  novel_id: string
  promotion_amount: number
  created_at: string
}

// 定义 OrderData 接口
interface OrderData {
  id: number
  promotion_email: string
  promotion_code: string
  status: string
  current_period_start: string
  current_period_end: string
  cancel_at: string
  canceled_at: string
  created_at: string
}

export default function PromotionPage() {
  const router = useRouter()// 路由
  const { user, isLoaded, isSignedIn } = useUser()// 用户
  const [promotionData, setPromotionData] = useState<PromotionData[]>([])
  const [orderData, setOrderData] = useState<OrderData[]>([])

  useEffect(() => {
    const fetchData = async () => {

      // 获取推广数据
      const { data, error } = await supabase
        .from('promotions')
        .select('*')
        .eq('promoter_phone', user?.emailAddresses[0].emailAddress)

      if (error) {
        console.error('Error fetching promotion data:', error)
        return
      }
      setPromotionData(data || [])
      // console.log(data)

      // 获取订单数据
      const { data: orderData, error: orderError } = await supabase
        .from('websubscriptions')
        .select('*')
        .eq('promotion_email', user?.emailAddresses[0].emailAddress)

      if (orderError) {
        console.error('Error fetching order data:', orderError)
        return
      }
      setOrderData(orderData || [])
      console.log(orderData)
        
    }

    if (user) {
      fetchData()
    }
  }, [user])

  if (!user) {
    // 未登录时重定向到登录页面
    router.push('/auth/sign-in')
    return;
  }

  return (
    <div className="container mx-auto min-h-screen pt-20"> 
      <div className="bg-white rounded-lg p-6">
        {/* 我的推广数据 */}
        <div>
            <div className="text-2xl font-bold">推广数据</div>
            <Table>
              <TableCaption>您的推广记录</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>小说id</TableHead>
                  <TableHead>推广码</TableHead>
                  <TableHead className="text-right">推广人</TableHead>
                  <TableHead>创建时间</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {promotionData?.map((promotion: PromotionData) => (
                  <TableRow key={promotion.id}>
                    <TableCell>{promotion.novel_id}</TableCell>
                    <TableCell className="font-medium">{promotion.promotion_code}</TableCell>
                    <TableCell className="text-right">{promotion.promoter_phone}</TableCell>
                    <TableCell>{new Date(promotion.created_at).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              {/* <TableFooter>
                <TableRow>
                  <TableCell colSpan={3}>总计</TableCell>
                  <TableCell className="text-right">
                    ¥{promotionData?.reduce((sum, item: PromotionData) => sum + item.promotion_amount, 0) || 0}
                  </TableCell>
                </TableRow>
              </TableFooter> */}
            </Table>
          </div>
        {/* 我的订单数据 */}
        <div> 
          <div className="text-2xl font-bold">我的订单数据</div>
          <Table>
              <TableCaption>您的订单记录</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>推广码</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>开始时间</TableHead>
                  <TableHead>结束时间</TableHead>
                  <TableHead>取消时间</TableHead>
                  <TableHead>创建时间</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orderData.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.promotion_code}</TableCell>
                      <TableCell>{order.status}</TableCell>
                      <TableCell>{order.current_period_start}</TableCell>
                      <TableCell>{order.current_period_end}</TableCell>
                      <TableCell>{order.cancel_at}</TableCell>
                      <TableCell>{order.canceled_at}</TableCell>
                      <TableCell className="text-right">{order.created_at}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        {/* 这里添加推广相关的内容 */}
      </div>
    </div>
  );
}