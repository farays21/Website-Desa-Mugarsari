import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ProfileInfoForm from './ProfileInfoForm'
import AssistanceSection from './AssistanceSection'

export default async function ProfilPage() {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) redirect('/login')

  // Fetch profile data server-side (reliable)
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()

  // Fetch assistance applications
  const { data: assistances } = await supabase
    .from('social_assistance')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar role="user" />

      <main className="flex-1 px-4 py-6 space-y-5 bg-gray-50">
        {/* Profile Info - pass data as props */}
        <ProfileInfoForm profile={profile} />

        {/* Social Assistance */}
        <AssistanceSection assistances={assistances ?? []} userId={user.id} />
      </main>

      <Footer />
    </div>
  )
}
