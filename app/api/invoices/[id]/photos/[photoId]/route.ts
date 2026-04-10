// eslint-disable-next-line @typescript-eslint/no-explicit-any
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// DELETE /api/invoices/[id]/photos/[photoId]
export async function DELETE(
  req: Request,
  { params }: { params: { id: string; photoId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = (session.user as any).id;

    // Verify invoice belongs to user
    const invoice = await prisma.invoice.findFirst({
      where: { id: params.id, userId },
    });
    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    // Verify photo belongs to this invoice
    const photo = await prisma.invoicePhoto.findFirst({
      where: { id: params.photoId, invoiceId: params.id },
    });
    if (!photo) {
      return NextResponse.json({ error: "Photo not found" }, { status: 404 });
    }

    await prisma.invoicePhoto.delete({ where: { id: params.photoId } });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Photo delete error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
