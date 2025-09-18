

import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";

// // Define auth routes that require being logged out
const AUTH_ROUTES = new Set([
  '/login',
  '/signup',
  '/reset-password',
  '/update-password',
  '/auth/callback',
  '/auth/redirect',
])

// Define protected routes that require authentication
const PROTECTED_ROUTES = new Set([
  '/dashboard',
  '/annotate',
  '/moderation',
  '/analytics',
  '/dataset',
  '/videos',
  '/settings',
])

// Define admin-only routes
const ADMIN_ROUTES = new Set([
  '/analytics',
  '/settings',
])

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // Skip middleware for static files and certain API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/auth') ||
    pathname.includes('.') ||
    pathname.startsWith('/favicon')
  ) {
    return res
  }

  const {
    data: { session },
  } = await supabase.auth.getSession()

  console.log("session", session)

  const isAuthenticated = !!session
  const isAuthRoute = AUTH_ROUTES.has(pathname)
  const isProtectedRoute = PROTECTED_ROUTES.has(pathname)
  const isAdminRoute = ADMIN_ROUTES.has(pathname)

  // Debug logging
  console.log('Auth middleware:', {
    path: pathname,
    isAuthenticated,
    isAuthRoute,
    isProtectedRoute,
    isAdminRoute,
    userRole: session?.user?.user_metadata?.role
  })

  // Handle auth routes - redirect authenticated users to dashboard
  if (isAuthRoute) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
    return res
  }

  // Handle root route
  if (pathname === '/') {
    const redirectUrl = isAuthenticated ? '/dashboard' : '/login'
    return NextResponse.redirect(new URL(redirectUrl, req.url))
  }

  // Handle protected API routes
  if (pathname.startsWith('/api/')) {
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return res
  }

  // Handle protected routes
  if (isProtectedRoute) {
    if (!isAuthenticated) {
      const redirectUrl = new URL('/login', req.url)
      if (pathname !== '/') {
        redirectUrl.searchParams.set('then', pathname)
      }
      return NextResponse.redirect(redirectUrl)
    }

    // Check admin permissions for admin-only routes
    if (isAdminRoute) {
      const userRole = session?.user?.user_metadata?.role
      if (userRole !== 'admin') {
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }
    }
  }

  // Allow access for authenticated users to non-protected routes
  if (!isAuthenticated && !isAuthRoute && pathname !== '/') {
    const redirectUrl = new URL('/login', req.url)
    redirectUrl.searchParams.set('then', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  return res
}

export const config = {
  matcher: [
    {
      // Auth routes
      source: '/(login|signup|reset-password|update-password|auth/:path*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
    {
      // Protected routes
      source: '/(dashboard|annotate|moderation|analytics|dataset|videos|settings)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
    {
      // Protected API routes
      source: '/api/(comments|predictions|videos)/:path*',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
    {
      // Root route
      source: '/',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
}

// export async function middleware() {
//     const res = NextResponse.next()
//     return res
// } 