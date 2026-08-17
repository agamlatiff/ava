import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { sessionOptions, type SessionData } from '@/lib/session'
import { unsealData } from 'iron-session'

const PROTECTED_ROUTES = ['/home', '/hangouts', '/memories']

export async function proxy(request: NextRequest) {
  const cookie = request.cookies.get(sessionOptions.cookieName as string)
  const isProtected = PROTECTED_ROUTES.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  )

  let session: SessionData | null = null

  if (cookie?.value) {
    try {
      session = await unsealData<SessionData>(cookie.value, {
        password: sessionOptions.password as string,
      })
    } catch {
      session = null
    }
  }

  if (isProtected && !session?.isLoggedIn) {
    const loginUrl = new URL('/', request.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/home/:path*', '/hangouts/:path*', '/memories/:path*'],
}
