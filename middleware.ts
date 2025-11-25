import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Public path patterns (using :param syntax for dynamic segments)
const publicPathPatterns = [
  /^\/api\/[^/]+\/auth\/signup$/,
  /^\/api\/[^/]+\/auth\/verify-signup$/,
  /^\/api\/[^/]+\/auth\/send-code$/,
  /^\/api\/[^/]+\/auth\/verify-code$/,
  /^\/api\/health$/,
]

// Check if path matches any public path pattern
function isPublicPath(pathname: string): boolean {
  return publicPathPatterns.some((regex) => regex.test(pathname))
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for non-API routes
  if (!pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  // Allow public API routes without auth
  if (isPublicPath(pathname)) {
    return NextResponse.next()
  }

  // For protected routes, check for Authorization header
  const authHeader = request.headers.get('Authorization')

  if (!authHeader) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized', code: 'NO_AUTH_HEADER' },
      { status: 401 }
    )
  }

  // Token validation is done in the route handlers
  // Middleware just checks for presence of auth header
  // This keeps middleware lightweight (edge runtime compatible)

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Match all API routes
    '/api/:path*',
  ],
}
