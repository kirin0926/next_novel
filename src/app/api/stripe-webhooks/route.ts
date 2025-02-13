import { NextResponse } from 'next/server';
import stripe from '@/lib/stripe';
import { headers } from 'next/headers';
import supabase from '@/lib/supabase';
import Stripe from 'stripe';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// 处理订阅创建
async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  const priceId = subscription.items.data[0].price.id;
  
  // 1. 获取用户信息
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single();
    
  if (userError) throw userError;
  
  // 2. 创建订阅记录
  const { data: subData, error: subError } = await supabase
    .from('websubscriptions')
    .insert({
      user_id: userData.id,
      platform: 'stripe',
      platform_subscription_id: subscription.id,
      status: subscription.status,
      current_period_start: new Date(subscription.current_period_start * 1000),
      current_period_end: new Date(subscription.current_period_end * 1000),
      cancel_at: subscription.cancel_at ? new Date(subscription.cancel_at * 1000) : null,
      canceled_at: subscription.canceled_at ? new Date(subscription.canceled_at * 1000) : null
    });
    
  if (subError) throw subError;
  console.log('subData', subData);
  // 3. 创建订阅项目记录
  // const { error: itemError } = await supabase
  //   .from('subscription_items')
  //   .insert({
  //     subscription_id: subscription.id,
  //     price_id: priceId,
  //     quantity: subscription.items.data[0].quantity
  //   });
    
  // if (itemError) throw itemError;
}
// 处理订阅更新
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  const priceId = subscription.items.data[0].price.id;
  
  // 更新订阅记录
  const { error: subError } = await supabase
    .from('websubscriptions')
    .update({
      status: subscription.status,
      current_period_start: new Date(subscription.current_period_start * 1000),
      current_period_end: new Date(subscription.current_period_end * 1000),
      cancel_at: subscription.cancel_at ? new Date(subscription.cancel_at * 1000) : null,
      canceled_at: subscription.canceled_at ? new Date(subscription.canceled_at * 1000) : null,
      updated_at: new Date()
    })
    .eq('platform_subscription_id', subscription.id)
    .eq('platform', 'stripe');
    
  if (subError) throw subError;
  
  // 更新订阅项目
  // const { error: itemError } = await supabase
  //   .from('subscription_items')
  //   .update({
  //     price_id: priceId,
  //     quantity: subscription.items.data[0].quantity
  //   })
  //   .eq('subscription_id', subscription.id);
    
  // if (itemError) throw itemError;
}
// 处理订阅删除
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  // 更新订阅状态
  const { error } = await supabase
    .from('websubscriptions')
    .update({
      status: 'canceled',
      canceled_at: new Date(),
      updated_at: new Date()
    })
    .eq('platform_subscription_id', subscription.id)
    .eq('platform', 'stripe');
    
  if (error) throw error;
}

// 处理 webhook 请求
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
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        // const subscription = event.data.object as Stripe.Subscription;// 订阅
        // const customerId = subscription.customer as string;// 客户ID
        // const priceId = subscription.items.data[0].price.id;// 价格ID
        // const status = subscription.status;// 订阅状态

        // // 更新用户订阅状态
        // const { error } = await supabase
        //   .from('users')
        //   .update({
        //     stripe_customer_id: customerId,// 客户ID
        //     stripe_price_id: priceId,// 价格ID
        //     stripe_subscription_id: subscription.id,// 订阅ID
        //     subscription_status: status,// 订阅状态
        //   })
        //   .eq('stripe_customer_id', customerId);

        // if (error) throw error;
        break;
      }

      case 'customer.subscription.updated': {
        // const subscription = event.data.object as Stripe.Subscription;
        // const customerId = subscription.customer as string;
        // const priceId = subscription.items.data[0].price.id;
        // const status = subscription.status;

        // // 更新用户订阅状态
        // const { error } = await supabase
        //   .from('users')
        //   .update({
        //     stripe_customer_id: customerId,// 客户ID
        //     stripe_price_id: priceId,// 价格ID
        //     stripe_subscription_id: subscription.id,// 订阅ID
        //     subscription_status: status,// 订阅状态
        //   })
        //   .eq('stripe_customer_id', customerId);

        // if (error) throw error;
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        // const subscription = event.data.object as Stripe.Subscription;// 订阅
        // const customerId = subscription.customer as string;// 客户ID

        // // 清除用户订阅信息
        // const { error } = await supabase
        //   .from('users')
        //   .update({
        //     stripe_price_id: null,// 价格ID 
        //     stripe_subscription_id: null,// 订阅ID
        //     subscription_status: 'canceled',// 订阅状态
        //   })
        //   .eq('stripe_customer_id', customerId);

        // if (error) throw error;
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
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

