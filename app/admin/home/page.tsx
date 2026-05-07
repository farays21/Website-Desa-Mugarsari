import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import AdminHomeForm from './AdminHomeForm'

export default async function AdminHomePage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).maybeSingle()
  if (profile?.role !== 'admin') redirect('/home')

  const { data: greeting } = await supabase
    .from('village_content').select('content').eq('section', 'home_greeting').maybeSingle()
  const { data: history } = await supabase
    .from('village_content').select('content').eq('section', 'home_history').maybeSingle()
  const { data: news } = await supabase
    .from('news').select('*').order('created_at', { ascending: false })

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar role="admin" />
      <div className="bg-gray-400 px-4 py-2">
        <h1 className="font-bold text-base">Edit Konten Home</h1>
      </div>
      <main className="flex-1 px-4 py-4 bg-gray-200 space-y-4">
        <AdminHomeForm
          greeting={greeting?.content ?? ''}
          history={history?.content ?? ''}
          news={news ?? []}
        />
      </main>
      <Footer />
    </div>
  )
}
