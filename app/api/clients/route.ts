// eslint-disable @typescript-eslint/no-explicit-any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id;
  const clients = await prisma.client.findMany({ where: { userId }, orderBy: { name: "asc" } });
  return NextResponse.json(clients);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id;
  const plan = (session.user as any).plan ?? "free";

  if (plan === "free") {
    const count = await prisma.client.count({ where: { userId } });
    if (count >= 3) return NextResponse.json({ error: "Free tier limit: 3 clients max. Upgrade to Pro for unlimited clients." }, { status: 403 });
  }

  const body = await req.json();
  const client = await prisma.client.create({ data: { ...body, userId } });
  return NextResponse.json(client);
}
