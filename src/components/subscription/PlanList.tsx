'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { useState, useEffect, Suspense } from "react";
import { loadStripe } from '@stripe/stripe-js';
import { useUser } from "@clerk/nextjs";
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

// 确保替换为你的 Stripe publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// 订阅计划接口
interface Plan {
  id: string;
  name: string;
  price: number;
  interval: string;
  features: string[];
  description: string;
}

// 将主要逻辑抽取到单独的组件
function PlanListContent({ 
  promotionCode = '', 
  promotionEmail = '' 
}: { 
  promotionCode?: string, 
  promotionEmail?: string 
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isLoaded, isSignedIn, user } = useUser();//获取用户信息
  const [selectedPlan, setSelectedPlan] = useState<string>('pro');//选中的订阅计划
  const [loading, setLoading] = useState(false);//是否加载
  const [plans, setPlans] = useState<Plan[]>([]);//订阅计划
  const [isLoadingPlans, setIsLoadingPlans] = useState(true);//是否加载订阅计划
  
  // 获取订阅计划
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch('/api/get-prices');
        const data = await response.json();
        // console.log('data', data);
        // const datas: Plan[] = [
        //   {id: "price_1QryF6GkZUIlE6IEwTUR8XLu", name: "3day membership", price: 9.9, interval: "month", features: ["Feature 1", "Feature 2", "Feature 3"], description: "Description 1"},
        //   {id: "price_1QryF6GkZUIlE6IEkFn4B32p", name: "7day membership", price: 19.99, interval: "month", features: ["Feature 1", "Feature 2", "Feature 3"], description: "Description 1"},
        //   {id: "price_1QryF6GkZUIlE6IE9Ku8ICqQ", name: "15day membership", price: 39.99, interval: "month", features: ["Feature 1", "Feature 2", "Feature 3"], description: "Description 1"},
        //   {id: "price_1QryF6GkZUIlE6IEgfy9rK5V", name: "30day membership", price: 99.99, interval: "month", features: ["Feature 1", "Feature 2", "Feature 3"], description: "Description 1"},
        //   {id: "price_1QryF6GkZUIlE6IElZvecuUl", name: "90day membership", price: 259.99, interval: "month", features: ["Feature 1", "Feature 2", "Feature 3"], description: "Description 1"},
        // ]
        // setPlans(data);
        if (data.prices) {
          // 按照价格从低到高排序
          const sortedPlans = data.prices.sort((a: Plan, b: Plan) => a.price - b.price);
          setPlans(sortedPlans);
          // console.log('plans', sortedPlans);
        }
      } catch (error) {
        console.error('Error fetching prices:', error);
      } finally {
        setIsLoadingPlans(false);
      }
    };

    fetchPrices();
  }, []);

  
  // 订阅计划
  const handleSubscribe = async (planId: string) => {
    try {
      if (!isLoaded) return;
      // 设置加载状态
      setLoading(true);
      // 继续订阅流程...
      const response = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          planId: planId,
          promotionCode: promotionCode,
          promotionEmail: promotionEmail,
          cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}${pathname}?${searchParams.toString()}`,
        }),
      });

      const { sessionId, error } = await response.json();
      if (error) throw new Error(error);

      // 获取 Stripe 实例
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe failed to initialize');

      // 重定向到 Checkout 页面
      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId,
      });

      if (stripeError) throw stripeError;

    } catch (error: any) {
      console.error('Subscription error:', error);
      // 这里可以添加错误提示
    } finally {
      setLoading(false);
    }
  };

  if (isLoadingPlans) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
      {plans.map((plan) => (
        <Card
          key={plan.id}
          className={`relative flex flex-col ${
            selectedPlan === plan.id 
              ? 'border-primary shadow-xl  z-10' 
              : 'hover:shadow-lg hover:scale-102'
          } transition-all duration-300`}
        >
          {plan.name === 'professional membership' && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
              Most Popular
            </div>
          )}
          <CardHeader className="text-center">
            <CardTitle className="text-xl font-bold capitalize">{plan.name}</CardTitle>
            <div className="mt-6">
              <span className="text-xl font-bold">${plan.price}</span>
              <span className="text-lg text-muted-foreground">/{plan.interval}</span>
            </div>
            {/* <p className="text-sm text-muted-foreground mt-2">{plan.description}</p> */}
          </CardHeader>
          {/* <CardContent className="flex-grow">
            <ul className="space-y-4">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>  handleSubscribe(plan.id) */}
          <CardFooter>
            <Button 
              className="w-full text-base font-medium"
              size="lg"
              variant={selectedPlan === plan.id ? 'default' : 'outline'}
              onClick={() => handleSubscribe(plan.id)}
              // onClick={() => handleDialogOpen(plan.id)}
              disabled={loading}
              data-umami-event={`subscribe-${plan.name}`}
            >
              {loading ? 
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Processing...
                </span> : 
                selectedPlan === plan.id ? 'Subscribe Now' : 'Choose Plan'
              }
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

// 导出的主组件使用 Suspense 包裹内容组件
export function PlanList({ 
  promotionCode = '', 
  promotionEmail = '' 
}: { 
  promotionCode?: string, 
  promotionEmail?: string 
}) {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <PlanListContent promotionCode={promotionCode} promotionEmail={promotionEmail} />
    </Suspense>
  );
} 