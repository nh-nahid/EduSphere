import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_ROUTES = ['/login', '/forgot-password']
const ROLE_ROUTES: Record<string, string[]> = {
  '/schools': ['super_admin'],
  '/admin': ['super_admin', 'admin'],
  '/sms-logs': ['super_admin', 'admin'],
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  // Allow public routes
  if (PUBLIC_ROUTES.some(r => pathname.startsWith(r))) return NextResponse.next()
  // Redirect root to dashboard
  if (pathname === '/') return NextResponse.redirect(new URL('/dashboard', request.url))
  return NextResponse.next()
}

export const config = { matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'] }
