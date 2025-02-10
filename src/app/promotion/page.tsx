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

const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV004",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV005",
    paymentStatus: "Paid",
    totalAmount: "$550.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV006",
    paymentStatus: "Pending",
    totalAmount: "$200.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV007",
    paymentStatus: "Unpaid",
    totalAmount: "$300.00",
    paymentMethod: "Credit Card",
  },
]

// 定义 PromotionData 接口
interface PromotionData {
  id: number
  promoter_phone: string
  promotion_code: string
  novel_id: string
  promotion_amount: number
  created_at: string
}

export default function PromotionPage() {
  const router = useRouter()// 路由
  const { user, isLoaded, isSignedIn } = useUser()// 用户
  const [promotionData, setPromotionData] = useState<PromotionData[]>([])

  useEffect(() => {
    const fetchData = async () => {

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
            <p>推广数据</p>
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
          <p>我的订单数据</p>
          <Table>
              <TableCaption>A list of your recent invoices.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.invoice}>
                    <TableCell className="font-medium">{invoice.invoice}</TableCell>
                    <TableCell>{invoice.paymentStatus}</TableCell>
                    <TableCell>{invoice.paymentMethod}</TableCell>
                    <TableCell className="text-right">{invoice.totalAmount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={3}>Total</TableCell>
                  <TableCell className="text-right">$2,500.00</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        {/* 这里添加推广相关的内容 */}
      </div>
    </div>
  );
}