import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import Stripe from "stripe"

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.redirect(new URL("/login", req.url))

  const { searchParams } = new URL(req.url)
  const accountId = searchParams.get("accountId")
  if (!accountId) return NextResponse.redirect(new URL("/dashboard/settings", req.url))

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-06-20" as any })
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"

  // Generate a fresh account link
  const accountLink = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: `${baseUrl}/api/stripe/connect/refresh?accountId=${accountId}`,
    return_url: `${baseUrl}/dashboard/settings?stripe=connected`,
    type: "account_onboarding",
  })

  return NextResponse.redirect(accountLink.url)
}
