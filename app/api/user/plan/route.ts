// eslint-disable-next-line @typescript-eslint/no-explicit-any
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { plan: true, stripeCurrentPeriodEnd: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      plan: user.plan ?? "free",
      stripeCurrentPeriodEnd: user.stripeCurrentPeriodEnd,
    });
  } catch (e) {
    console.error("Plan fetch error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
