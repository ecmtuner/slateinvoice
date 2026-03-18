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
    include: { items: true },
  });

  if (!invoice) {
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  }

  if (invoice.status === "paid") {
    return NextResponse.json({ error: "This invoice has already been paid" }, { status: 400 });
  }

  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
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
  });

  return NextResponse.json({ url: session.url });
}
