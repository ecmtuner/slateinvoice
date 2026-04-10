// eslint-disable-next-line @typescript-eslint/no-explicit-any
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// PATCH /api/invoices/[id]/location
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = (session.user as any).id;

    // Check plan
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { plan: true } });
    if (!user || user.plan !== "business") {
      return NextResponse.json({ error: "Business plan required" }, { status: 403 });
    }

    // Verify invoice belongs to user
    const invoice = await prisma.invoice.findFirst({ where: { id: params.id, userId } });
    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    const body = await req.json();
    const { lat, lng, address } = body;

    const updated = await prisma.invoice.update({
      where: { id: params.id },
      data: {
        locationLat: lat !== undefined ? Number(lat) : undefined,
        locationLng: lng !== undefined ? Number(lng) : undefined,
        locationAddress: address ?? undefined,
      },
    });

    return NextResponse.json({
      locationLat: updated.locationLat,
      locationLng: updated.locationLng,
      locationAddress: updated.locationAddress,
    });
  } catch (err: any) {
    console.error("Location update error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
