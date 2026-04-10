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

// GET /api/migrate — run all migrations including new ones
export async function GET() {
  try {
    // Stripe Connect fields on User
    await prisma.$executeRawUnsafe(
      `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "stripeAccountId" TEXT;`
    );
    await prisma.$executeRawUnsafe(
      `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "stripeAccountStatus" TEXT DEFAULT 'not_connected';`
    );

    // GPS location + chargeback protection fields on Invoice
    await prisma.$executeRawUnsafe(
      `ALTER TABLE "Invoice" ADD COLUMN IF NOT EXISTS "locationLat" DOUBLE PRECISION;`
    );
    await prisma.$executeRawUnsafe(
      `ALTER TABLE "Invoice" ADD COLUMN IF NOT EXISTS "locationLng" DOUBLE PRECISION;`
    );
    await prisma.$executeRawUnsafe(
      `ALTER TABLE "Invoice" ADD COLUMN IF NOT EXISTS "locationAddress" TEXT;`
    );

    // InvoicePhoto table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "InvoicePhoto" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "invoiceId" TEXT NOT NULL,
        "url" TEXT NOT NULL,
        FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE CASCADE
      );
    `);

    return NextResponse.json({ success: true, message: "All migrations complete" });
  } catch (err: any) {
    console.error("Migration error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
