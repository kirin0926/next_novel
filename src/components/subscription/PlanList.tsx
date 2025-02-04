'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { useState } from "react";

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
    id: 'basic',
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
    id: 'pro',
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
    id: 'premium',
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
  const [selectedPlan, setSelectedPlan] = useState<string>('pro');

  const handleSubscribe = async (planId: string) => {
    // TODO: 实现支付流程
    console.log(`Subscribe to plan: ${planId}`);
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
              ¥{plan.price}<span className="text-lg font-normal">/{plan.interval}</span>
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
            >
              {selectedPlan === plan.id ? 'subscribe now' : 'choose plan'}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
} 