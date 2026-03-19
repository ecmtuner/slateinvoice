import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { authenticator } from 'otplib';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = (session.user as any).id as string;
  const body = await req.json();
  const { token, secret } = body as { token: string; secret?: string };

  if (!token) {
    return NextResponse.json({ success: false, error: 'Token required' }, { status: 400 });
  }

  if (secret) {
    // Setup verification: verify against the provided secret
    const isValid = authenticator.verify({ token, secret });
    if (!isValid) {
      return NextResponse.json({ success: false });
    }
    await prisma.user.update({
      where: { id: userId },
      data: { twoFactorEnabled: true, twoFactorSecret: secret },
    });
    return NextResponse.json({ success: true });
  } else {
    // Login verification: verify against stored secret
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user?.twoFactorSecret) {
      return NextResponse.json({ success: false, error: '2FA not configured' }, { status: 400 });
    }
    const isValid = authenticator.verify({ token, secret: user.twoFactorSecret });
    return NextResponse.json({ success: isValid });
  }
}
