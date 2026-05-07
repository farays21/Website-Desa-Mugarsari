import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import AdminKontakForm from './AdminKontakForm'

export default async function AdminKontakPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).maybeSingle()
  if (profile?.role !== 'admin') redirect('/home')

  const { data } = await supabase
    .from('village_content').select('content').eq('section', 'kontak').maybeSingle()

  let kontak = { phone: '', hours: '', email: '', address: '' }
  if (data?.content) {
    try { kontak = JSON.parse(data.content) } catch {}
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar role="admin" />
      <div className="bg-gray-400 px-4 py-2">
        <h1 className="font-bold text-base">Edit Konten Kontak</h1>
      </div>
      <main className="flex-1 px-4 py-4 bg-gray-200">
        <AdminKontakForm initialData={kontak} />
      </main>
      <Footer />
    </div>
  )
}
