import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Stripe from "stripe"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const userId = (session.user as any).id
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-06-20" as any })
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"

    // Get existing user to check if they already have a stripe account
    const user = await prisma.user.findUnique({ where: { id: userId } })

    let accountId = (user as any)?.stripeAccountId as string | null | undefined

    // Create a new Express account if they don't have one
    if (!accountId) {
      const account = await stripe.accounts.create({
        type: "express",
        email: (session.user as any).email || undefined,
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
      })
      accountId = account.id
      // Save to user
      await prisma.user.update({
        where: { id: userId },
        data: { stripeAccountId: accountId, stripeAccountStatus: "pending" } as any,
      })
    }

    // Create account link for onboarding
    const accountLink = await stripe.accountLinks.create({
      account: accountId!,
      refresh_url: `${baseUrl}/api/stripe/connect/refresh?accountId=${accountId}`,
      return_url: `${baseUrl}/dashboard/settings?stripe=connected`,
      type: "account_onboarding",
    })

    return NextResponse.redirect(accountLink.url)
  } catch (err: any) {
    console.error("[stripe/connect] Error:", err.message)
    return NextResponse.json({ error: err.message || "Failed to connect Stripe" }, { status: 500 })
  }
}
