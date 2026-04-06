import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Stripe from "stripe"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const userId = (session.user as any).id
  const user = await prisma.user.findUnique({ where: { id: userId } })

  if (!user?.stripeAccountId) {
    return NextResponse.json({ connected: false, status: "not_connected" })
  }

  // Check live status from Stripe
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-06-20" as any })
    const account = await stripe.accounts.retrieve(user.stripeAccountId)
    const isActive = account.charges_enabled && account.payouts_enabled

    // Update status in DB
    const status = isActive ? "active" : "pending"
    await prisma.user.update({ where: { id: userId }, data: { stripeAccountStatus: status } })

    return NextResponse.json({
      connected: true,
      status,
      chargesEnabled: account.charges_enabled,
      payoutsEnabled: account.payouts_enabled,
      stripeAccountId: user.stripeAccountId,
    })
  } catch (err) {
    return NextResponse.json({ connected: false, status: "error" })
  }
}
