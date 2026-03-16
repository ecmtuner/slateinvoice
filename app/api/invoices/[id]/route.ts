// eslint-disable @typescript-eslint/no-explicit-any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id;
  const invoice = await prisma.invoice.findFirst({
    where: { id: params.id, userId },
    include: { items: true, client: true },
  });
  if (!invoice) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(invoice);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id;
  const body = await req.json();
  const { items, ...data } = body;

  const invoice = await prisma.invoice.findFirst({ where: { id: params.id, userId } });
  if (!invoice) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Handle items update
  if (items) {
    await prisma.invoiceItem.deleteMany({ where: { invoiceId: params.id } });
    await prisma.invoiceItem.createMany({ data: items.map((item: any) => ({ ...item, invoiceId: params.id })) });
  }

  const updated = await prisma.invoice.update({
    where: { id: params.id },
    data,
    include: { items: true, client: true },
  });

  // Update client earnings if marking paid
  if (data.status === "paid" && invoice.status !== "paid" && updated.clientId) {
    await prisma.client.update({
      where: { id: updated.clientId },
      data: { totalEarned: { increment: updated.total } },
    });
  }

  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id;
  await prisma.invoice.deleteMany({ where: { id: params.id, userId } });
  return NextResponse.json({ ok: true });
}
