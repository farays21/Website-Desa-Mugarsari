import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import AdminProfilForm from './AdminProfilForm'

export default async function AdminProfilDesaPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).maybeSingle()
  if (profile?.role !== 'admin') redirect('/home')

  const { data: visiData } = await supabase
    .from('village_content').select('content').eq('section', 'profil_visi').maybeSingle()
  const { data: misiData } = await supabase
    .from('village_content').select('content').eq('section', 'profil_misi').maybeSingle()
  const { data: orgMembers } = await supabase
    .from('organization_members').select('*').order('created_at', { ascending: true })
  const { data: demographics } = await supabase
    .from('demographics').select('*').maybeSingle()

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar role="admin" />
      <div className="bg-gray-400 px-4 py-2">
        <h1 className="font-bold text-base">Edit Konten Profil Desa</h1>
      </div>
      <main className="flex-1 px-4 py-4 bg-gray-200">
        <AdminProfilForm
          visi={visiData?.content ?? ''}
          misi={misiData?.content ?? ''}
          orgMembers={orgMembers ?? []}
          demographics={demographics}
        />
      </main>
      <Footer />
    </div>
  )
}
