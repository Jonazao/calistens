import { getSession, updateTokens } from '@/lib/session';
import { NextRequest, NextResponse } from 'next/server';
import { refreshToken } from './lib/auth';
export default async function middleware(req: NextRequest) {
  const session = await getSession();
  if (!session || !session.user)
    return NextResponse.redirect(new URL('/auth/signin', req.nextUrl));

  const { exp, refreshToken: rft } = session;

  // check if the token is expired and refresh it
  const currentTime = Math.floor(Date.now() / 1000);
  // check if access token is expired by decoding it and checking exp time
  if (exp && exp - 10 < currentTime) {
    const response = await refreshToken(rft);
    if (!response) {
      return;
    }
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      response;

    if (newAccessToken && newRefreshToken) {
      // set the new tokens in the cookies
      const res = NextResponse.next();
      res.cookies.set('accessToken', newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
      });
      res.cookies.set('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
      });
      await updateTokens({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });
      return res;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/main', '/dashboard', '/profile'],
};
