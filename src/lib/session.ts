import { SessionOptions } from 'iron-session'
import { cookies } from 'next/headers'
import { getIronSession } from 'iron-session'

export interface SessionData {
  userId?: string
  name?: string
  isLoggedIn?: boolean
}

export const sessionOptions: SessionOptions = {
  password:
    process.env.SESSION_SECRET ||
    'complex_password_at_least_32_characters_long_for_lets_go_app',
  cookieName: 'lets_go_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  },
}

export async function getSession() {
  const cookieStore = await cookies()
  return getIronSession<SessionData>(cookieStore, sessionOptions)
}
