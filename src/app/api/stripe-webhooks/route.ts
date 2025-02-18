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
  
  // // 1. 获取用户信息
  // const { data: userData, error: userError } = await supabase
  //   .from('users')
  //   .select('id')
  //   .eq('stripe_customer_id', customerId)
  //   .single();
    
  // if (userError) throw userError;
  
  // 2. 获取 checkout session 以获取推广码
  const { data: sessions } = await stripe.checkout.sessions.list({
    limit: 1,
    subscription: subscription.id
  });
  console.log('handleSubscriptionCreated sessions', sessions);
  const session = sessions[0];
  const promotionCode = session?.metadata?.promotion_code;
  const promotionEmail = session?.metadata?.promotion_email;
  
  // 3. 创建订阅记录
  const { data: subData, error: subError } = await supabase
    .from('websubscriptions')
    .insert({
      // user_id: userData.id,
      platform: 'stripe',// 平台
      platform_subscription_id: subscription.id,// 平台订阅ID
      status: session?.status,// 订阅状态
      current_period_start: new Date(subscription.current_period_start * 1000),// 当前周期开始时间
      current_period_end: new Date(subscription.current_period_end * 1000),// 当前周期结束时间
      cancel_at: subscription.cancel_at ? new Date(subscription.cancel_at * 1000) : null,// 取消时间
      canceled_at: subscription.canceled_at ? new Date(subscription.canceled_at * 1000) : null,// 取消时间
      promotion_code: promotionCode || null,// 推广码
      promotion_email: promotionEmail || null// 客户邮箱
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
  
  console.log('handleSubscriptionUpdated subscription', subscription);
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

// 处理 checkout session 完成
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log('handleCheckoutSessionCompleted session', session);
  // 存储数据到supabase
  // const { error } = await supabase
  //   .from('websubscriptions')
  //   .insert({
  //     platform: 'stripe',
  //     platform_subscription_id: session.id,
  //     status: session.status,
  //     customer_email: session.customer_email,
  //     promotion_code: session.metadata?.promotion_code,
  //     current_period_start: new Date(session.subscription?.current_period_start * 1000),// 当前周期开始时间
  //     current_period_end: new Date(session.subscription?.current_period_end * 1000),// 当前周期结束时间
  //     created_at: new Date(),
  //     updated_at: new Date()
  //   });

  // if (error) throw error;
}

// 处理 invoice 支付
async function handleInvoicePaid(invoice: Stripe.Invoice) {
  // console.log('handleInvoicePaid invoice', invoice);
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

      case 'checkout.session.completed': {
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      }

      case 'invoice.paid': {
        // await handleInvoicePaid(event.data.object as Stripe.Invoice);
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

