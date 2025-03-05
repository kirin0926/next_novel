import { NextResponse } from 'next/server';
import stripe from '@/lib/stripe';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('session_id');

  if (!sessionId) {
    return NextResponse.json(
      { error: 'Session ID is required' },
      { status: 400 }
    );
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return NextResponse.json({
      session:session,
      customer_email: session.customer_email,
      subscription: session.subscription,
      amount_total: session.amount_total
    });
  } catch (error: any) {
    console.error('Error retrieving session:', error);
    return NextResponse.json(
      { error: 'Error retrieving subscription details' },
      { status: 500 }
    );
  }
} 