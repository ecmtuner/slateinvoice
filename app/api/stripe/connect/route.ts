// STRIPE_CLIENT_ID must be set in Railway (Stripe Connect platform client ID, e.g. ca_xxxx)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Stripe from "stripe";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-06-20" as any,
  });

  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const redirectUri = `${baseUrl}/api/stripe/connect/callback`;

  const authorizeUrl = stripe.oauth.authorizeUrl({
    response_type: "code",
    client_id: process.env.STRIPE_CLIENT_ID!,
    scope: "read_write",
    redirect_uri: redirectUri,
  });

  return NextResponse.redirect(authorizeUrl);
}
