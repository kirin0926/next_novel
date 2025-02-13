import stripe from '@/lib/stripe';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const prices = await stripe.prices.list({
      expand: ['data.product'],
      active: true,
    });

    const formattedPrices = prices.data.map(price => {
      const product = price.product as any;
      return {
        id: price.id,
        name: product.name,
        price: price.unit_amount! / 100,
        interval: price.recurring?.interval || 'one-time',
        features: product.metadata.features ? JSON.parse(product.metadata.features) : [],
        description: product.description || '',
      };
    });

    return NextResponse.json({ prices: formattedPrices });
  } catch (error) {
    console.error('Error fetching prices:', error);
    return NextResponse.json(
      { error: 'Failed to fetch prices' },
      { status: 500 }
    );
  }
} 