import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  const isPublicPath = path === '/login' || path === '/signup'

  const token = request.cookies.get('mock_user_id')?.value || ''

  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/login', request.nextUrl))
  }
}

export const config = {
  matcher: [
    '/',
    '/dashboard/:path*',
    '/cases/:path*',
    '/approvals/:path*',
    '/pre-qualification/:path*',
    '/tender-issuance/:path*',
    '/pre-bid-meetings/:path*',
    '/risk-radar/:path*',
    '/settings/:path*',
    '/help/:path*',
    '/login',
    '/signup'
  ]
}
