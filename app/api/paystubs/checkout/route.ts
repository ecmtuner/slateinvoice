// eslint-disable @typescript-eslint/no-explicit-any
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const origin = req.headers.get('origin') || 'http://localhost:3002';
  const body = await req.json().catch(() => ({}));
  const stubToken = body?.stubToken;

  // Mock mode — Stripe not configured
  if (!stripeKey || stripeKey === 'sk_test_placeholder') {
    return NextResponse.json({ url: `/dashboard/paystubs/download?token=${stubToken}&mock=1` });
  }

  try {
    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(stripeKey);

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { name: 'Pay Stub — InvoiceBuddy', description: 'One professional pay stub PDF' },
          unit_amount: 500, // $5.00
        },
        quantity: 1,
      }],
      success_url: `${origin}/dashboard/paystubs/download?token=${stubToken}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/dashboard/paystubs`,
    });

    return NextResponse.json({ url: session.url });
  } catch (e) {
    console.error('Stripe paystub error:', e);
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 });
  }
}
