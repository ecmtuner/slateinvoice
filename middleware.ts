import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    if (path.startsWith('/admin') && token?.email !== 'sergeybirioukov@gmail.com') {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    if (
      token?.twoFactorPending &&
      !path.startsWith('/auth/2fa') &&
      !path.startsWith('/api/')
    ) {
      return NextResponse.redirect(new URL('/auth/2fa', req.url));
    }
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
};
