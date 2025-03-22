'use client';

import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { PayPalScriptProvider, PayPalButtons, ReactPayPalScriptOptions } from "@paypal/react-paypal-js";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useStore } from "@/store";


interface Plan {
  id: string;
  productId: string;
  name: string;
  price: number;
  description: string;
  type: string;
}

const plans: Plan[] = [
  {
    id: '1',
    productId: 'prod_4MCgmjaYDjb1oqwNRVbUbE',
    name: '7day_membervip',
    price: 9.9,
    description: 'Free read all svip stories',
    type: 'one-time',
  },
  {
    id: '2',
    productId: 'prod_4MCgmjaYDjb1oqwNRVbUbE',
    name: '15day_membervip',
    price: 14.9,
    description: 'Free read all svip stories',
    type: 'ongoing',
  },
];

export function Plan() {
  const initialOptions: ReactPayPalScriptOptions = {
    "clientId": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "",// 客户端ID
    "enable-funding": "venmo",// 启用支付方式
    "disable-funding": "",// 禁用支付方式
    "buyer-country": "US",// 买家国家
    currency: "USD",// 货币
    "data-page-type": "product-details",// 页面类型
    components: "buttons",// 组件
    "data-sdk-integration-source": "developer-studio",// 集成源
  };

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(false);
  const { setSubscription } = useStore();
  // 打开支付对话框
  const handleSubscribe = async (plan: Plan) => {
      setLoading(true);
      try {
        // 打开支付对话框
        setIsDialogOpen(true);
        setSelectedPlan(plan);
        console.log('selectedPlan',selectedPlan)
      } catch (error) {
        console.error(error);
      } finally {
        // 关闭加载状态
        setLoading(false);
      }
  }

  // 创建订单
  const PayPalCreateOrder = async () => {
    try {
      const response = await fetch("/api/paypal-orders", {
        method: "POST",// 方法
        headers: {
          "Content-Type": "application/json",// 内容类型
        },
        // use the "body" param to optionally pass additional order information
        // like product ids and quantities
        body: JSON.stringify({
          id: selectedPlan?.productId || '',// 商品ID
          quantity: "1",// 商品数量
          price:selectedPlan?.price || 0// 商品价格
        }),
      });

      const orderData = await response.json();
      console.log('orderData',orderData)
      if (orderData.id) {
        return orderData.id;
      } else {
        const errorDetail = orderData?.details?.[0];
        const errorMessage = errorDetail
          ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
          : JSON.stringify(orderData);
        // console.log('errorMessage',errorMessage)
        // throw new Error(errorMessage);
      }
    } catch (error) {
      console.error(error);
    }
  }

  // 支付成功
  const PayPalApprove = async(data: any, actions: any) => {
    try {
      const response = await fetch(
        `/api/paypal-orders-capture`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderID: data.orderID,
          }),
        }
      );
      
      const orderData = await response.json();
      console.log('orderData paypal-orders-capture',orderData)
      if(orderData.status === 'COMPLETED'){
        // 订阅成功
        console.log('订阅成功')
        // 关闭对话框
        setIsDialogOpen(false);
        // 设置订阅状态
        setSubscription({
          plan: selectedPlan?.id || '',
          subscriptionId: orderData.id,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        });
      }else{
        return actions.restart();// 重新开始
      }
      // Three cases to handle:
      //   (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
      //   (2) Other non-recoverable errors -> Show a failure message
      //   (3) Successful transaction -> Show confirmation or thank you message

      // const errorDetail = orderData?.details?.[0];

      // if (errorDetail?.issue === "INSTRUMENT_DECLINED") {// 如果错误是INSTRUMENT_DECLINED
      //   // (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
      //   // recoverable state, per https://developer.paypal.com/docs/checkout/standard/customize/handle-funding-failures/
      //   return actions.restart();
      // } else if (errorDetail) {
      //   // (2) Other non-recoverable errors -> Show a failure message
      //   throw new Error(
      //     `${errorDetail.description} (${orderData.debug_id})`
      //   );
      // } else {
      //   // (3) Successful transaction -> Show confirmation or thank you message
      //   // Or go to another URL:  actions.redirect('thank_you.html');
      //   const transaction =
      //     orderData.purchase_units[0].payments.captures[0];
      //   // setMessage(
      //   //   `Transaction ${transaction.status}: ${transaction.id}. See console for all available details`
      //   // );
      //   console.log(
      //     "Capture result",
      //     orderData,
      //     JSON.stringify(orderData, null, 2)
      //   );
      // }
    } catch (error) {
      console.error(error);
      // setMessage(
      //   `Sorry, your transaction could not be processed...${error}`
      // );
    }
  }

  return (
    <>
      <div  className="grid grid-cols-2 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
        {plans.map((plan) => (
          <Card key={plan.id}>
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="mt-6">
                <span className="text-xl font-bold">${plan.price}</span>
              </div>
              
            </CardHeader> 
            <CardFooter>
                <Button className="w-full text-base font-medium"
                size="lg"
                variant={selectedPlan?.id === plan.id ? 'default' : 'outline'}
                onClick={() => handleSubscribe(plan)}>Subscribe</Button>
              </CardFooter>
          </Card>
        ))}
      </div>

      {/* 支付订阅对话框 */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-center">Paypal Payment</DialogTitle>
              <DialogDescription>
                <PayPalScriptProvider options={initialOptions}>
                  <PayPalButtons 
                    style={{
                      shape: "rect",// 按钮形状
                      layout: "vertical",// 按钮布局
                      color: "gold",// 按钮颜色
                      label: "paypal",// 按钮标签
                    }}
                    createOrder={PayPalCreateOrder}
                    onApprove={async (data, actions) => {
                      await PayPalApprove(data,actions)
                    }}
                    onCancel={() => {
                      console.log('cancel')
                    }}
                    onError={() => {
                      console.log('error')
                    }}/>
                </PayPalScriptProvider>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
    </>
  );
}