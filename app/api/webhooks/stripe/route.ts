// eslint-disable-next-line @typescript-eslint/no-explicit-any
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-06-20" as any });
  const buf = await req.arrayBuffer();
  const rawBody = Buffer.from(buf);
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: `Webhook error: ${err.message}` }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const plan = session.metadata?.plan;
        if (!userId || !plan) break;

        const subscriptionId = session.subscription as string;
        if (!subscriptionId) break;

        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const priceId = subscription.items.data[0]?.price.id;
        const periodEnd = new Date((subscription as any).current_period_end * 1000);

        await prisma.user.update({
          where: { id: userId },
          data: {
            plan,
            stripeSubscriptionId: subscriptionId,
            stripePriceId: priceId,
            stripeCurrentPeriodEnd: periodEnd,
          },
        });
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = (invoice as any).subscription as string;
        if (!subscriptionId) break;

        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const periodEnd = new Date((subscription as any).current_period_end * 1000);

        // Find user by stripeSubscriptionId
        const user = await prisma.user.findFirst({
          where: { stripeSubscriptionId: subscriptionId },
        });
        if (!user) break;

        await prisma.user.update({
          where: { id: user.id },
          data: { stripeCurrentPeriodEnd: periodEnd },
        });
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const subscriptionId = subscription.id;

        const user = await prisma.user.findFirst({
          where: { stripeSubscriptionId: subscriptionId },
        });
        if (!user) break;

        await prisma.user.update({
          where: { id: user.id },
          data: {
            plan: "free",
            stripeSubscriptionId: null,
            stripePriceId: null,
            stripeCurrentPeriodEnd: null,
          },
        });
        break;
      }

      default:
        // Unhandled event type
        break;
    }
  } catch (e) {
    console.error("Webhook handler error:", e);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
