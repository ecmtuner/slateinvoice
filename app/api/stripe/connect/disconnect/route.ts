// eslint-disable-next-line @typescript-eslint/no-explicit-any
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id;

  await prisma.user.update({
    where: { id: userId },
    data: {
      stripeAccountId: null,
      stripeAccountStatus: "not_connected",
    },
  });

  return NextResponse.json({ success: true });
}
