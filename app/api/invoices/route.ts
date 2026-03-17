// eslint-disable-next-line @typescript-eslint/no-explicit-any
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id;
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") || "invoice";
  const invoices = await prisma.invoice.findMany({
    where: { userId, type },
    include: { client: true, items: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(invoices);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id;

  // Fetch user from DB to get latest plan
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const plan = user.plan ?? "free";

  // Plan gating: count invoices this calendar month
  if (plan === "free" || plan === "starter") {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthCount = await prisma.invoice.count({
      where: {
        userId,
        createdAt: { gte: monthStart },
      },
    });

    if (plan === "free" && monthCount >= 5) {
      return NextResponse.json(
        { error: "Free plan limit reached. Upgrade to create more invoices.", upgrade: true },
        { status: 409 }
      );
    }
    if (plan === "starter" && monthCount >= 50) {
      return NextResponse.json(
        { error: "Starter plan limit reached (50/month). Upgrade to create more invoices.", upgrade: true },
        { status: 409 }
      );
    }
  }

  const body = await req.json();
  const { items, ...invoiceData } = body;

  // Auto-generate invoice number if not provided
  if (!invoiceData.number) {
    const count = await prisma.invoice.count({ where: { userId } });
    invoiceData.number = `INV-${String(count + 1).padStart(4, "0")}`;
  }

  const invoice = await prisma.invoice.create({
    data: {
      ...invoiceData,
      userId,
      items: { create: items || [] },
    },
    include: { items: true, client: true },
  });

  // Update client total if paid
  if (invoice.clientId && invoice.status === "paid") {
    await prisma.client.update({
      where: { id: invoice.clientId },
      data: { totalEarned: { increment: invoice.total } },
    });
  }

  return NextResponse.json(invoice);
}
