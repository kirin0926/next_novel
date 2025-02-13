import { NextResponse } from 'next/server';
import stripe from '@/lib/stripe';
import { headers } from 'next/headers';
import supabase from '@/lib/supabase';
import Stripe from 'stripe';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = (await headers()).get('stripe-signature')!;

    // 验证 webhook 签名
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );

    // 处理不同类型的 webhook 事件
    switch (event.type) {
      case 'customer.subscription.created': {
        const subscription = event.data.object as Stripe.Subscription;// 订阅
        const customerId = subscription.customer as string;// 客户ID
        const priceId = subscription.items.data[0].price.id;// 价格ID
        const status = subscription.status;// 订阅状态

        // 更新用户订阅状态
        const { error } = await supabase
          .from('users')
          .update({
            stripe_customer_id: customerId,// 客户ID
            stripe_price_id: priceId,// 价格ID
            stripe_subscription_id: subscription.id,// 订阅ID
            subscription_status: status,// 订阅状态
          })
          .eq('stripe_customer_id', customerId);

        if (error) throw error;
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        const priceId = subscription.items.data[0].price.id;
        const status = subscription.status;

        // 更新用户订阅状态
        const { error } = await supabase
          .from('users')
          .update({
            stripe_customer_id: customerId,// 客户ID
            stripe_price_id: priceId,// 价格ID
            stripe_subscription_id: subscription.id,// 订阅ID
            subscription_status: status,// 订阅状态
          })
          .eq('stripe_customer_id', customerId);

        if (error) throw error;
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;// 订阅
        const customerId = subscription.customer as string;// 客户ID

        // 清除用户订阅信息
        const { error } = await supabase
          .from('users')
          .update({
            stripe_price_id: null,// 价格ID 
            stripe_subscription_id: null,// 订阅ID
            subscription_status: 'canceled',// 订阅状态
          })
          .eq('stripe_customer_id', customerId);

        if (error) throw error;
        break;
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 400 }
    );
  }
}

