import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'

export interface SessionData {
  userId?: string
  email?: string
  name?: string
  role?: string
  isLoggedIn: boolean
}

const defaultSession: SessionData = {
  isLoggedIn: false,
}

export async function getSession() {
  const session = await getIronSession<SessionData>(cookies(), {
    password: process.env.SESSION_PASSWORD!,
    cookieName: 'droovo-session',
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7, // 7 days
    },
  })

  if (!session.isLoggedIn) {
    session.isLoggedIn = defaultSession.isLoggedIn
  }

  return session
}