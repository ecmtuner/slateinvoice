// eslint-disable @typescript-eslint/no-explicit-any
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
  const plan = (session.user as any).plan ?? "free";

  // Free tier limit: 3 invoices/month
  if (plan === "free") {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    // Reset monthly count if needed
    const resetDate = new Date(user.invoiceResetAt);
    const now = new Date();
    const monthAgo = new Date(now.getFullYear(), now.getMonth(), 1);
    let count = user.invoiceCount;
    if (resetDate < monthAgo) {
      count = 0;
      await prisma.user.update({ where: { id: userId }, data: { invoiceCount: 0, invoiceResetAt: now } });
    }
    if (count >= 3) return NextResponse.json({ error: "Free tier limit reached. Upgrade to Pro for unlimited invoices." }, { status: 403 });
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

  // Increment monthly count
  await prisma.user.update({ where: { id: userId }, data: { invoiceCount: { increment: 1 } } });

  // Update client total if paid
  if (invoice.clientId && invoice.status === "paid") {
    await prisma.client.update({
      where: { id: invoice.clientId },
      data: { totalEarned: { increment: invoice.total } },
    });
  }

  return NextResponse.json(invoice);
}
