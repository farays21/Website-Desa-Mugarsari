import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { createClient } from '@/lib/supabase/server'

export default async function ProfilDesaPage() {
  const supabase = await createClient()

  const { data: visiData } = await supabase
    .from('village_content')
    .select('*')
    .eq('section', 'profil_visi')
    .maybeSingle()

  const { data: misiData } = await supabase
    .from('village_content')
    .select('*')
    .eq('section', 'profil_misi')
    .maybeSingle()

  const { data: orgMembers } = await supabase
    .from('organization_members')
    .select('*')
    .order('created_at', { ascending: true })

  const { data: demographics } = await supabase
    .from('demographics')
    .select('*')
    .maybeSingle()

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar role="user" />

      <main className="flex-1 px-4 py-6 space-y-8">
        {/* Visi Misi Header */}
        <section className="flex gap-4 items-start">
          {/* Logo */}
          <div className="shrink-0 flex flex-col items-center">
            <div className="w-24 h-24 bg-yellow-100 rounded-full border-4 border-yellow-400 flex items-center justify-center overflow-hidden">
              <div className="w-20 h-20 bg-gradient-to-b from-blue-600 to-green-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold text-center leading-tight">KOTA<br/>TASIK</span>
              </div>
            </div>
            <h2 className="font-black text-base mt-2 text-center">DESA MUGARSARI</h2>
            <p className="text-xs text-center text-gray-600">kecamatan Tamansari, Kota Tasikmalaya<br/>Jawa Barat</p>
          </div>

          {/* Visi Misi */}
          <div className="flex-1 border-l-4 border-gray-300 pl-4">
            <h3 className="font-black text-xl text-center mb-1">VISI</h3>
            <p className="text-sm text-justify leading-relaxed mb-4">
              {visiData?.content || 'Visi Desa Mugarsari adalah "MELAYANI MASYARAKAT KHUSUSNYA Desa Mugarsari DENGAN SEBAIK-BAIKNYA"'}
            </p>
            <h3 className="font-black text-xl text-center mb-1">MISI</h3>
            <p className="text-sm text-justify leading-relaxed">
              {misiData?.content || 'Untuk terwujudnya visi tersebut ditetapkan dua upaya/cara atau misi yang akan mendukung pencapaian visi yaitu:\n1. MEMAJUKAN DESA DALAM MISI PEMBANGUNAN\n2. MEMAKMURKAN MASYARAKAT Desa Mugarsari'}
            </p>
          </div>
        </section>

        {/* Struktur Organisasi */}
        <section>
          <h2 className="font-black text-xl text-center mb-4">STRUKTUR ORGANISASI<br/>DESA MUGARSARI</h2>
          <div className="bg-gray-100 rounded-xl p-4">
            {orgMembers && orgMembers.length > 0 ? (
              <div className="space-y-2">
                {orgMembers.map((member) => (
                  <div key={member.id} className="flex items-center gap-3 bg-white rounded-lg px-3 py-2">
                    <div className="w-8 h-8 bg-[#1a7a2e] rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{member.name}</p>
                      <p className="text-xs text-gray-500">{member.position}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center py-4 space-y-2">
                {/* Simple org chart */}
                {[
                  { label: 'KEPALA DESA', sub: 'Aria Muhammad Fahlevi' },
                  { label: 'SEKRETARIS DESA', sub: '' },
                  { label: 'KEUANGAN', sub: 'nadiaz' },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center">
                    {i > 0 && <div className="w-0.5 h-4 bg-gray-400" />}
                    <div className="border-2 border-gray-500 rounded-full px-4 py-1 bg-white">
                      <p className="text-xs font-bold text-center">{item.label}</p>
                      {item.sub && <p className="text-xs text-center text-gray-600">{item.sub}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Jumlah Penduduk */}
        <section>
          <h2 className="font-black text-lg text-center mb-4">JUMLAH PENDUDUK dan KEPALA KELUARGA</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'TOTAL PENDUDUK', value: demographics?.total_penduduk, icon: '👨‍👩‍👧‍👦' },
              { label: 'TOTAL KEPALA KELUARGA', value: demographics?.total_kk, icon: '👨‍👩‍👦' },
              { label: 'TOTAL LAKI-LAKI', value: demographics?.total_laki, icon: '👨' },
              { label: 'TOTAL PEREMPUAN', value: demographics?.total_perempuan, icon: '👩' },
            ].map((item) => (
              <div key={item.label} className="bg-gray-100 rounded-xl p-3 flex items-center gap-3">
                <span className="text-3xl">{item.icon}</span>
                <div>
                  <p className="text-xs font-semibold text-gray-600">{item.label}</p>
                  <p className="font-black text-lg text-[#1a7a2e]">
                    {item.value !== undefined ? item.value.toLocaleString('id-ID') : '-'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
