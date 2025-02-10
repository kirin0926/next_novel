// src/lib/stripe-webhook.ts
import { buffer } from 'micro'// 缓冲区
import Stripe from 'stripe'
import supabase from '@/lib/supabase'

export async function handleStripeWebhook(req: any, res: any) {// 处理Stripe Webhook
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)// 创建Stripe实例
  const sig = req.headers['stripe-signature']// 获取Stripe签名
  const buf = await buffer(req)// 缓冲区
  
  let event
  
  try {
    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    
    // 更新数据库中的订阅状态
    const { error } = await supabase
      .from('subscriptions')
      .insert({
        user_id: session.client_reference_id,   
        stripe_subscription_id: session.subscription,
        plan_id: session.metadata?.plan_id,
        status: 'active',
        // current_period_end: new Date(session.subscription?.current_period_end * 1000)
      })
      
    if (error) {
      console.error('Error updating subscription:', error)
      return res.status(500).json({ error: 'Error updating subscription' })
    }
  }

  return res.json({ received: true })
}