import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session if expired
  const { data: { user } } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // ─── Public routes ────────────────────────────────────────────────────────
  const isPublic = pathname === '/' || pathname === '/login' || pathname === '/register'

  if (isPublic) {
    // If already logged in, redirect to appropriate dashboard
    if (user) {
      // Read role from cookie (set at login time) to avoid DB query in middleware
      const roleCookie = request.cookies.get('x-user-role')?.value
      if (roleCookie === 'admin') {
        return NextResponse.redirect(new URL('/admin/home', request.url))
      }
      return NextResponse.redirect(new URL('/home', request.url))
    }
    return supabaseResponse
  }

  // ─── All protected routes require login ───────────────────────────────────
  if (!user) {
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // ─── Role-based protection using cookie (set at login, fast) ─────────────
  const roleCookie = request.cookies.get('x-user-role')?.value ?? 'user'

  // Admin-only paths
  if (pathname.startsWith('/admin')) {
    if (roleCookie !== 'admin') {
      return NextResponse.redirect(new URL('/home', request.url))
    }
  }

  // User-only paths (prevent admin from using user pages)
  const userPaths = ['/home', '/profil-desa', '/kontak', '/profil']
  if (userPaths.some((p) => pathname.startsWith(p))) {
    if (roleCookie === 'admin') {
      return NextResponse.redirect(new URL('/admin/home', request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
