'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function submitSocialAssistanceAction(formData: FormData) {
  const supabase = await createClient()

  // Verify session
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { error: 'Sesi habis, silakan login ulang' }
  }

  const payload = {
    user_id:               user.id,
    nama_kepala_keluarga:  formData.get('nama_kepala_keluarga') as string,
    nik_kepala_keluarga:   formData.get('nik_kepala_keluarga') as string,
    no_kartu_keluarga:     formData.get('no_kartu_keluarga') as string,
    pendapatan:            formData.get('pendapatan') as string,
    alamat:                formData.get('alamat') as string,
    no_whatsapp:           formData.get('no_whatsapp') as string,
    status:                'pending' as const,
  }

  // Validate required fields
  if (!payload.nama_kepala_keluarga || !payload.nik_kepala_keluarga || !payload.no_kartu_keluarga) {
    return { error: 'Nama, NIK, dan No KK wajib diisi' }
  }

  const { error } = await supabase
    .from('social_assistance')
    .insert(payload)

  if (error) {
    console.error('Social assistance insert error:', error)
    return { error: `Gagal menyimpan: ${error.message}` }
  }

  revalidatePath('/profil')
  return { success: true }
}

export async function updateAssistanceStatusAction(
  id: string,
  status: 'approved' | 'rejected'
) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { error: 'Tidak terautentikasi' }
  }

  const { error } = await supabase
    .from('social_assistance')
    .update({ status })
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/bantuan-sosial')
  return { success: true }
}
