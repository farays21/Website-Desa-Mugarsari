'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// ─── Helper: verify caller is admin ──────────────────────────────────────────
async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { supabase: null, error: 'Tidak terautentikasi' }

  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).maybeSingle()
  if (profile?.role !== 'admin') return { supabase: null, error: 'Akses ditolak' }

  return { supabase, error: null }
}

// ─── VILLAGE CONTENT ─────────────────────────────────────────────────────────
export async function updateVillageContentAction(section: string, formData: FormData) {
  const { supabase, error: authError } = await requireAdmin()
  if (authError || !supabase) return { error: authError }

  const content = formData.get('content') as string
  const title   = formData.get('title')   as string | null

  const { error } = await supabase
    .from('village_content')
    .upsert({ section, content, title: title || null }, { onConflict: 'section' })

  if (error) return { error: error.message }

  revalidatePath('/home')
  revalidatePath('/profil-desa')
  revalidatePath('/kontak')
  revalidatePath('/admin/home')
  revalidatePath('/admin/profil-desa')
  revalidatePath('/admin/kontak')
  return { success: true }
}

export async function updateKontakAction(formData: FormData) {
  const { supabase, error: authError } = await requireAdmin()
  if (authError || !supabase) return { error: authError }

  const content = JSON.stringify({
    phone:   formData.get('phone')   as string,
    hours:   formData.get('hours')   as string,
    email:   formData.get('email')   as string,
    address: formData.get('address') as string,
  })

  const { error } = await supabase
    .from('village_content')
    .upsert({ section: 'kontak', content }, { onConflict: 'section' })

  if (error) return { error: error.message }
  revalidatePath('/kontak')
  revalidatePath('/admin/kontak')
  return { success: true }
}

// ─── NEWS ─────────────────────────────────────────────────────────────────────
export async function addNewsAction(formData: FormData) {
  const { supabase, error: authError } = await requireAdmin()
  if (authError || !supabase) return { error: authError }

  const title = (formData.get('title') as string).trim()
  if (!title) return { error: 'Judul tidak boleh kosong' }

  const { data, error } = await supabase.from('news').insert({ title }).select().single()
  if (error) return { error: error.message }

  revalidatePath('/home')
  revalidatePath('/admin/home')
  return { success: true, item: data }
}

export async function deleteNewsAction(id: string) {
  const { supabase, error: authError } = await requireAdmin()
  if (authError || !supabase) return { error: authError }

  const { error } = await supabase.from('news').delete().eq('id', id)
  if (error) return { error: error.message }

  revalidatePath('/home')
  revalidatePath('/admin/home')
  return { success: true }
}

// ─── ORGANIZATION MEMBERS ─────────────────────────────────────────────────────
export async function addOrgMemberAction(formData: FormData) {
  const { supabase, error: authError } = await requireAdmin()
  if (authError || !supabase) return { error: authError }

  const name     = (formData.get('name')     as string).trim()
  const position = (formData.get('position') as string).trim()
  if (!name || !position) return { error: 'Nama dan jabatan wajib diisi' }

  const { data, error } = await supabase
    .from('organization_members').insert({ name, position }).select().single()
  if (error) return { error: error.message }

  revalidatePath('/profil-desa')
  revalidatePath('/admin/profil-desa')
  return { success: true, item: data }
}

export async function updateOrgMemberAction(id: string, formData: FormData) {
  const { supabase, error: authError } = await requireAdmin()
  if (authError || !supabase) return { error: authError }

  const { error } = await supabase
    .from('organization_members')
    .update({
      name:     (formData.get('name')     as string).trim(),
      position: (formData.get('position') as string).trim(),
    })
    .eq('id', id)

  if (error) return { error: error.message }
  revalidatePath('/profil-desa')
  revalidatePath('/admin/profil-desa')
  return { success: true }
}

export async function deleteOrgMemberAction(id: string) {
  const { supabase, error: authError } = await requireAdmin()
  if (authError || !supabase) return { error: authError }

  const { error } = await supabase.from('organization_members').delete().eq('id', id)
  if (error) return { error: error.message }

  revalidatePath('/profil-desa')
  revalidatePath('/admin/profil-desa')
  return { success: true }
}

// ─── DEMOGRAPHICS ─────────────────────────────────────────────────────────────
export async function updateDemographicsAction(formData: FormData) {
  const { supabase, error: authError } = await requireAdmin()
  if (authError || !supabase) return { error: authError }

  const payload = {
    total_penduduk:  parseInt(formData.get('total_penduduk')  as string) || 0,
    total_kk:        parseInt(formData.get('total_kk')        as string) || 0,
    total_laki:      parseInt(formData.get('total_laki')      as string) || 0,
    total_perempuan: parseInt(formData.get('total_perempuan') as string) || 0,
  }

  // Check if a row already exists
  const { data: existing } = await supabase
    .from('demographics').select('id').maybeSingle()

  let error
  if (existing?.id) {
    ;({ error } = await supabase.from('demographics').update(payload).eq('id', existing.id))
  } else {
    ;({ error } = await supabase.from('demographics').insert(payload))
  }

  if (error) return { error: error.message }
  revalidatePath('/profil-desa')
  revalidatePath('/admin/profil-desa')
  return { success: true }
}
