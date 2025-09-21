import { NextRequest, NextResponse } from 'next/server';
import { serialize } from 'cookie';
import { BACKEND_URL } from '@/lib/constants';
import { LoginFormSchema } from '@/lib/type';
import { SignJWT } from 'jose';

const secretKey = process.env.SESSION_SECRET_KEY;
const encodedKey = new TextEncoder().encode(secretKey);

export async function POST(req: NextRequest): Promise<Response> {
  const body = await req.json();
  const { email, password } = body;
  const validatedFields = LoginFormSchema.safeParse({ email, password });

  if (!validatedFields.success) {
    return NextResponse.json(
      { error: validatedFields.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const loginRes = await fetch(`${BACKEND_URL}/auth/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(validatedFields.data),
  });

  if (!loginRes.ok) {
    const error = await loginRes.json();
    return NextResponse.json(error, {
      status: loginRes.status,
      statusText:
        loginRes.status === 401 ? 'Invalid Credentials!' : error.message,
    });
  }

  const result = await loginRes.json();
  const expiredAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const payload = {
    user: {
      id: result.id,
      name: result.name,
      role: result.role,
      email: result.email,
    },
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
  };

  const session = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey);

  const response = NextResponse.json({ success: true });
  response.headers.set(
    'Set-Cookie',
    serialize('session', session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      expires: expiredAt,
    })
  );

  return response;
}
