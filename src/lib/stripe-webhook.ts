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
    const { error: subscriptionError } = await supabase
      .from('subscriptions')
      .insert({
        user_id: session.client_reference_id,   
        stripe_subscription_id: session.subscription,
        plan_id: session.metadata?.plan_id,
        status: 'active',
      })

    // 如果存在推广码,保存推广记录
    if (session.metadata?.promotion_code) {
      const { error: websubError } = await supabase
        .from('websubscriptions')
        .insert({
          subscription_id: session.subscription,
          promotion_code: session.metadata.promotion_code,
          customer_email: session.customer_email,
          created_at: new Date().toISOString()
        })

      if (websubError) {
        console.error('Error saving promotion record:', websubError)
      }
    }
      
    if (subscriptionError) {
      console.error('Error updating subscription:', subscriptionError)
      return res.status(500).json({ error: 'Error updating subscription' })
    }
  }

  return res.json({ received: true })
}