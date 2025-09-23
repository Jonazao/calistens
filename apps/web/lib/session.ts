'use server';

import { jwtVerify, SignJWT, decodeJwt } from 'jose';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Nullable, Session } from './type';

const secretKey = process.env.SESSION_SECRET_KEY;
const encodedKey = new TextEncoder().encode(secretKey);

export async function createSession(payload: Session): Promise<void> {
  const decoded = decodeJwt(payload.accessToken);
  const { iat, exp } = decoded;
  if (!iat || !exp) {
    return;
  }
  const issuedAt = new Date(iat * 1000);
  const expiredAt = new Date(exp * 1000);

  const session = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt(issuedAt)
    .setExpirationTime(expiredAt)
    .sign(encodedKey);

  const cookieResponse = await cookies();
  cookieResponse.set('session', session, {
    httpOnly: true,
    secure: true,
    expires: expiredAt,
    sameSite: 'lax',
    path: '/',
  });
}

export async function getSession(): Promise<Nullable<Session>> {
  const cookieResponse = await cookies();
  const cookie = cookieResponse.get('session')?.value;
  if (!cookie) return null;

  try {
    const { payload } = await jwtVerify(cookie, encodedKey, {
      algorithms: ['HS256'],
    });

    return payload as Session;
  } catch (err) {
    console.error('Failed to verify the session', err);
    redirect('/auth/signin');
  }
}

export async function deleteSession() {
  const cookieResponse = await cookies();
  await cookieResponse.delete('session');
}

export async function updateTokens({
  accessToken,
  refreshToken,
}: {
  accessToken: string;
  refreshToken: string;
}) {
  const cookieStore = await cookies();

  const sessionCookie = cookieStore.get('session');
  if (!sessionCookie) return null;

  const { payload } = await jwtVerify<Session>(sessionCookie.value, encodedKey);

  if (!payload) throw new Error('Session not found');

  const newPayload: Session = {
    user: payload.user,
    accessToken,
    refreshToken,
  };

  await createSession(newPayload);
}
