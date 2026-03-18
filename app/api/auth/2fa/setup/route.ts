import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import * as otplib from 'otplib';
import QRCode from 'qrcode';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = (session.user as any).id as string;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const secret = otplib.generateSecret();
  // Save secret but don't enable 2FA yet
  await prisma.user.update({
    where: { id: userId },
    data: { twoFactorSecret: secret },
  });

  const otpauthUrl = otplib.generateURI({ label: user.email, issuer: 'SlateInvoice', secret });
  const qrCodeDataUrl = await QRCode.toDataURL(otpauthUrl);

  return NextResponse.json({ secret, otpauthUrl, qrCodeDataUrl });
}
