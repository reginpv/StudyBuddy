// @/src/middleware.ts

export { default } from 'next-auth/middleware'
import { NextResponse, NextRequest } from 'next/server'
import { getToken, JWT } from 'next-auth/jwt'

export type Token = JWT & {
  id?: string
}

export async function middleware(req: NextRequest) {
  const token: Token | null = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })

  const { pathname } = req.nextUrl

  // Public only
  if (pathname.startsWith('/login') || pathname.startsWith('/signup')) {
    if (token) {
      return NextResponse.redirect(new URL('/', req.url))
    }

    return NextResponse.next()
  }

  // Private path profile
  if (pathname.startsWith('/profile')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/login', '/signup', '/profile/:path*'],
}
