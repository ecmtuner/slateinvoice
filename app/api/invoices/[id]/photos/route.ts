// eslint-disable-next-line @typescript-eslint/no-explicit-any
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
// Simple cuid-like ID generator
function createId(): string {
  return 'c' + Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}

// POST /api/invoices/[id]/photos
// Upload a photo URL (already uploaded to Cloudinary client-side) and save to DB
export async function POST(
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
    const invoice = await prisma.invoice.findFirst({
      where: { id: params.id, userId },
      include: { photos: true },
    });
    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    // Check photo limit
    if (invoice.photos.length >= 10) {
      return NextResponse.json({ error: "Maximum 10 photos allowed" }, { status: 400 });
    }

    const body = await req.json();
    const { url } = body;
    if (!url) {
      return NextResponse.json({ error: "url is required" }, { status: 400 });
    }

    const photo = await prisma.invoicePhoto.create({
      data: {
        id: createId(),
        invoiceId: params.id,
        url,
      },
    });

    return NextResponse.json({ id: photo.id, url: photo.url });
  } catch (err: any) {
    console.error("Photo upload error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// GET /api/invoices/[id]/photos — list photos for an invoice
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = (session.user as any).id;

    const invoice = await prisma.invoice.findFirst({
      where: { id: params.id, userId },
    });
    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    const photos = await prisma.invoicePhoto.findMany({
      where: { invoiceId: params.id },
    });

    return NextResponse.json(photos);
  } catch (err: any) {
    console.error("Photos fetch error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
