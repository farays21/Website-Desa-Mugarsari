export type Role = 'user' | 'admin'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  nik: string | null
  no_kk: string | null
  alamat: string | null
  no_whatsapp: string | null
  role: Role
  created_at: string
}

export interface VillageContent {
  id: string
  section: 'home_greeting' | 'home_history' | 'profil_visi' | 'profil_misi' | 'kontak'
  title: string | null
  content: string
  image_url: string | null
  updated_at: string
}

export interface NewsItem {
  id: string
  title: string
  created_at: string
  image_url: string | null
}

export interface OrganizationMember {
  id: string
  name: string
  position: string
  created_at: string
}

export interface DemographicData {
  id: string
  total_penduduk: number
  total_kk: number
  total_laki: number
  total_perempuan: number
  updated_at: string
}

export type AssistanceStatus = 'pending' | 'approved' | 'rejected'

export interface SocialAssistance {
  id: string
  user_id: string
  nama_kepala_keluarga: string
  nik_kepala_keluarga: string
  no_kartu_keluarga: string
  pendapatan: string
  alamat: string
  no_whatsapp: string
  foto_kk_url: string | null
  foto_rumah_depan_url: string | null
  foto_ruang_tamu_url: string | null
  foto_kamar_mandi_url: string | null
  status: AssistanceStatus
  created_at: string
  profiles?: Profile
}
