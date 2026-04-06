// eslint-disable-next-line @typescript-eslint/no-explicit-any
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id;
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error || !code) {
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    return NextResponse.redirect(`${baseUrl}/dashboard/settings?stripe=error`);
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-06-20" as any,
  });

  try {
    const response = await stripe.oauth.token({
      grant_type: "authorization_code",
      code,
    });

    const stripeAccountId = response.stripe_user_id;

    await prisma.user.update({
      where: { id: userId },
      data: {
        stripeAccountId,
        stripeAccountStatus: "active",
      },
    });
  } catch (err) {
    console.error("Stripe Connect callback error:", err);
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    return NextResponse.redirect(`${baseUrl}/dashboard/settings?stripe=error`);
  }

  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  return NextResponse.redirect(`${baseUrl}/dashboard/settings?stripe=connected`);
}
