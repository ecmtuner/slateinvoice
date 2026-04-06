// eslint-disable-next-line @typescript-eslint/no-explicit-any
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/migrate — run pending schema migrations
// Protect with MIGRATE_SECRET env var to prevent unauthorized use
export async function POST() {
  try {
    // Stripe Connect fields on User
    await prisma.$executeRawUnsafe(
      `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "stripeAccountId" TEXT;`
    );
    await prisma.$executeRawUnsafe(
      `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "stripeAccountStatus" TEXT DEFAULT 'not_connected';`
    );

    return NextResponse.json({ success: true, message: "Migrations complete" });
  } catch (err: any) {
    console.error("Migration error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
