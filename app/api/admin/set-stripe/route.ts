import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// One-time endpoint to set stripeAccountId for a user
// GET /api/admin/set-stripe?email=xxx&accountId=acct_xxx&secret=slate2026admin
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const secret = searchParams.get("secret")
  const email = searchParams.get("email")
  const accountId = searchParams.get("accountId")

  if (secret !== "slate2026admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  if (!email || !accountId) return NextResponse.json({ error: "email and accountId required" }, { status: 400 })

  const result = await prisma.user.updateMany({
    where: { email },
    data: { stripeAccountId: accountId, stripeAccountStatus: "active" } as any,
  })

  return NextResponse.json({ ok: true, updated: result.count, email, accountId })
}
