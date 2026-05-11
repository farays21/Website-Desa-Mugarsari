'use server'

import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

// ─── Set role cookie (readable by proxy/middleware) ───────────────────────────
async function setRoleCookie(role: string) {
  const cookieStore = await cookies()
  cookieStore.set('x-user-role', role, {
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
    httpOnly: true,   // secure – proxy reads it server-side
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  })
}

// ─── LOGIN ────────────────────────────────────────────────────────────────────
export async function loginAction(formData: FormData) {
  const supabase = await createClient()

  const email    = (formData.get('email')    as string).trim()
  const password =  formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) {
    return { error: 'Email atau password salah. Pastikan akun sudah terdaftar.' }
  }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Login gagal, coba lagi.' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle()

  const role = profile?.role ?? 'user'
  await setRoleCookie(role)

  return { role }
}

// ─── REGISTER ─────────────────────────────────────────────────────────────────
export async function registerAction(formData: FormData) {
  const supabase = await createClient()

  const email       = (formData.get('email')       as string).trim()
  const password    =  formData.get('password')    as string
  const full_name   = (formData.get('full_name')   as string).trim()
  const nik         =  formData.get('nik')         as string
  const no_kk       =  formData.get('no_kk')       as string
  const alamat      =  formData.get('alamat')      as string
  const no_whatsapp =  formData.get('no_whatsapp') as string

  if (!full_name) return { error: 'Nama lengkap wajib diisi' }
  if (!nik)       return { error: 'NIK wajib diisi' }
  if (!no_kk)     return { error: 'No KK wajib diisi' }

  // 1. Create auth user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // Pass extra data — readable in trigger via NEW.raw_user_meta_data
      data: { full_name },
    },
  })

  if (authError) {
    if (authError.message.includes('already registered')) {
      return { error: 'Email sudah terdaftar. Silakan login.' }
    }
    return { error: authError.message }
  }
  if (!authData.user) return { error: 'Registrasi gagal, coba lagi.' }

  const userId = authData.user.id

  // 2. If session exists (email confirm disabled), upsert full profile now
  if (authData.session) {
    await supabase.from('profiles').upsert(
      { id: userId, email, full_name, nik, no_kk, alamat, no_whatsapp, role: 'user' },
      { onConflict: 'id' }
    )
    await setRoleCookie('user')
    return { success: true, requiresConfirmation: false }
  }

  // 3. Email confirmation required — store extra data in a temp table
  //    OR: use admin API (here we use service-role workaround via update after confirm)
  //    For now, return flag so UI can show the "check email" message
  return { success: true, requiresConfirmation: true }
}

// ─── LOGOUT ───────────────────────────────────────────────────────────────────
export async function logoutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()

  const cookieStore = await cookies()
  cookieStore.delete('x-user-role')

  redirect('/login')
}

// ─── UPDATE PROFILE ───────────────────────────────────────────────────────────
export async function updateProfileAction(formData: FormData) {
  const supabase = await createClient()

  const { data: { user }, error: authErr } = await supabase.auth.getUser()
  if (authErr || !user) return { error: 'Sesi habis, silakan login ulang.' }

  const { error } = await supabase
    .from('profiles')
    .update({
      full_name:   (formData.get('full_name')   as string).trim(),
      nik:          formData.get('nik')          as string,
      no_kk:        formData.get('no_kk')        as string,
      alamat:       formData.get('alamat')       as string,
      no_whatsapp:  formData.get('no_whatsapp')  as string,
    })
    .eq('id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/profil')
  return { success: true }
}
