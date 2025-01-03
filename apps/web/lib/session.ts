'use server'

import { jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Session } from './type'

const secretKey = process.env.SESSION_SECRET_KEY!
const encodedKey = new TextEncoder().encode(secretKey)

export async function getSession() {
  const cookieResponse = await cookies()
  const cookie = cookieResponse.get('session')?.value
  if (!cookie) return null

  try {
    const { payload } = await jwtVerify(cookie, encodedKey, {
      algorithms: ['HS256'],
    })

    return payload as Session
  } catch (err) {
    console.error('Failed to verify the session', err)
    redirect('/auth/sigin')
  }
}
