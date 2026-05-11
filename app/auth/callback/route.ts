import { createClient } from '@/lib/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code  = searchParams.get('code')
  const next  = searchParams.get('next') ?? '/home'

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      // Set role cookie after email confirmation login
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .maybeSingle()

      const role = profile?.role ?? 'user'
      const cookieStore = await cookies()
      cookieStore.set('x-user-role', role, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      })

      const redirectTo = role === 'admin' ? '/admin/home' : next
      return NextResponse.redirect(`${origin}${redirectTo}`)
    }
  }

  // Fallback
  return NextResponse.redirect(`${origin}/login?error=confirmation_failed`)
}
