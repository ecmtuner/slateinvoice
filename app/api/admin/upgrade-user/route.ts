import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// One-time admin endpoint to upgrade a user plan
// Usage: GET /api/admin/upgrade-user?email=xxx&secret=slate2026admin
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const email = searchParams.get("email")
  const secret = searchParams.get("secret")

  if (secret !== "slate2026admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (!email) {
    return NextResponse.json({ error: "email required" }, { status: 400 })
  }

  const user = await prisma.user.updateMany({
    where: { email },
    data: { plan: "pro" },
  })

  return NextResponse.json({ ok: true, updated: user.count, email, plan: "pro" })
}
