'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { useState } from "react";
import { loadStripe } from '@stripe/stripe-js';
import { useUser } from "@clerk/nextjs";
import { useRouter } from 'next/navigation';
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

const plans: Plan[] = [
  {
    id: 'price_1QbJSvDISTrmdpg8xbbHDFJJ',
    name: 'basic membership',
    price: 9.99,
    interval: 'month',
    features: [
      'unlimited reading novels',
      'remove ads',
      'basic membership identifier'
    ],
    description: 'suitable for light reading users'
  },
  {
    id: 'price_1QbJSvDISTrmdpg8Pxx5tL0z',
    name: 'professional membership',
    price: 19.99,
    interval: 'month',
    features: [
      'unlimited reading novels',
      'remove ads',
      'professional membership identifier',
      'offline download',
      'advanced formatting mode'
    ],
    description: 'suitable for heavy reading users'
  },
  {
    id: 'price_1QcoXNDISTrmdpg8GrpPO1LU',
    name: 'premium membership',
    price: 29.99,
    interval: 'month', 
    features: [
      'unlimited reading novels',
      'remove ads',
      'premium membership identifier',
      'offline download',
      'advanced formatting mode',
      'priority updates',
      'exclusive customer service'
    ],
    description: 'enjoy the best reading experience'
  }
];

export function PlanList() {
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();
  const [selectedPlan, setSelectedPlan] = useState<string>('pro');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (planId: string) => {
    try {
      if (!isLoaded) return;
      
      if (!isSignedIn) {
        router.push('/sign-in');
        return;
      }

      setLoading(true);
      
      // 继续订阅流程...
      const response = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          planId: planId,
          customerEmail: user.emailAddresses[0].emailAddress 
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

    } catch (error) {
      console.error('Subscription error:', error);
      // 这里可以添加错误提示
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
      {plans.map((plan) => (
        <Card 
          key={plan.id}
          className={`relative ${
            selectedPlan === plan.id 
              ? 'border-primary shadow-lg scale-105' 
              : 'hover:shadow-md'
          } transition-all duration-200`}
        >
          <CardHeader>
            <CardTitle className="text-2xl">{plan.name}</CardTitle>
            <div className="text-3xl font-bold mt-4">
              ${plan.price}<span className="text-lg font-normal">/{plan.interval}</span>
            </div>
            <p className="text-sm text-gray-600 mt-2">{plan.description}</p>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full"
              variant={selectedPlan === plan.id ? 'default' : 'outline'}
              onClick={() => handleSubscribe(plan.id)}
              disabled={loading}
            >
              {loading ? 'Processing...' : selectedPlan === plan.id ? 'Subscribe Now' : 'Choose Plan'}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
} 