import { createSession } from '@/lib/session';
import { NextRequest } from 'next/server';

import { Session } from '@/lib/type';
import { SignJWT } from 'jose';
import { cookies } from 'next/headers';

const secretKey = process.env.SESSION_SECRET_KEY;
const encodedKey = new TextEncoder().encode(secretKey);

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { accessToken, refreshToken, user } = body;
  if (!accessToken || !refreshToken)
    return new Response('Provide Tokens', { status: 401 });

  console.log('UPDATE TOKENS HERE');

  const newPayload: Session = {
    user: user,
    accessToken,
    refreshToken,
  };
  console.log({ newPayload });
  await createSession(newPayload);

  const token = await new SignJWT({ user, accessToken, refreshToken })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey);

  (await cookies()).set('session', token, {
    httpOnly: true,
    secure: true,
    path: '/',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
  });

  return new Response('Session updated', { status: 200 });
}
