// eslint-disable-next-line @typescript-eslint/no-explicit-any
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

export async function POST(
  req: NextRequest,
  { params }: { params: { invoiceId: string } }
) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-06-20" as any,
  });

  const { invoiceId } = params;

  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: { items: true, user: true },
  });

  if (!invoice) {
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  }

  if (invoice.status === "paid") {
    return NextResponse.json({ error: "This invoice has already been paid" }, { status: 400 });
  }

  const user = invoice.user;
  if (!user) {
    return NextResponse.json({ error: "Invoice owner not found" }, { status: 404 });
  }

  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  // Get platform's own Stripe account ID to avoid self-transfer
  const platformAccount = await stripe.accounts.retrieve().then(a => a.id).catch(() => "");

  // Only use Connect transfer if user has an Express/Custom account that is NOT the platform itself
  const isConnectedAccount =
    !!user.stripeAccountId &&
    user.stripeAccountStatus === "active" &&
    user.stripeAccountId !== platformAccount;

  const paymentIntentData: Stripe.Checkout.SessionCreateParams.PaymentIntentData = {};
  if (isConnectedAccount && user.stripeAccountId) {
    paymentIntentData.application_fee_amount = Math.round(invoice.total * 100 * 0.01);
    paymentIntentData.transfer_data = { destination: user.stripeAccountId };
  }

  let session;
  try {
    session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: (invoice.currency || "USD").toLowerCase(),
          product_data: {
            name: `Invoice #${invoice.number}`,
            description: invoice.fromName ? `From ${invoice.fromName}` : undefined,
          },
          unit_amount: Math.round(invoice.total * 100),
        },
        quantity: 1,
      },
    ],
    success_url: `${baseUrl}/pay/${invoiceId}/success`,
    cancel_url: `${baseUrl}/pay/${invoiceId}`,
    metadata: { invoiceId },
    ...(invoice.toEmail ? { customer_email: invoice.toEmail } : {}),
    ...(Object.keys(paymentIntentData).length > 0 ? { payment_intent_data: paymentIntentData } : {}),
    });
  } catch (err: any) {
    console.error("[checkout] Stripe error:", err?.message, err?.code, err?.type);
    return NextResponse.json({ error: err?.message || "Stripe error" }, { status: 500 });
  }

  return NextResponse.json({ url: session.url });
}
