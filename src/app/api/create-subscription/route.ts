import { NextResponse } from 'next/server';
import stripe from '@/lib/stripe';

// 添加错误检查
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY');
}

export async function POST(request: Request) {
  try {
    const { planId, customerEmail } = await request.json();
    
    if (!planId) {
      return NextResponse.json(
        { error: 'Plan ID is required' },
        { status: 400 }
      );
    }

    // 创建 Stripe Checkout 会话
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],// 支付方式
      customer_email: customerEmail,// 客户邮箱
      line_items: [
        {
          price: planId,// 价格
          quantity: 1,// 数量
        },
      ],
      mode: 'subscription',// 模式
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,// 成功URL
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscription/cancel`,// 取消URL
    });

    return NextResponse.json({ sessionId: session.id });// 返回会话ID
  } catch (error: any) {
    console.error('Stripe error:', error.message);
    return NextResponse.json(
      { error: error.message || 'Error creating subscription' },
      { status: 500 }
    );
  }
} 