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
          <h2 className="font-black text-xl text-center mb-6">STRUKTUR ORGANISASI<br/>DESA MUGARSARI</h2>
          
          <div className="flex flex-col items-center space-y-6">
            {orgMembers && orgMembers.length > 0 ? (
              <>
                {/* 1. Kepala Desa */}
                {orgMembers.filter(m => m.position.toLowerCase().includes('kepala desa')).map(m => (
                  <div key={m.id} className="w-full max-w-xs bg-gradient-to-br from-[#1a7a2e] to-[#2d9e4a] p-1 rounded-2xl shadow-lg">
                    <div className="bg-white rounded-[14px] p-4 text-center">
                      <div className="w-16 h-16 bg-[#1a7a2e] rounded-full mx-auto mb-3 flex items-center justify-center text-white text-xl font-black shadow-inner">
                        {m.name.charAt(0)}
                      </div>
                      <p className="font-black text-gray-900 uppercase tracking-tight leading-tight mb-1">{m.name}</p>
                      <p className="text-xs font-bold text-[#1a7a2e] uppercase">{m.position}</p>
                    </div>
                  </div>
                ))}

                <div className="w-0.5 h-6 bg-gray-300" />

                {/* 2. Sekretaris Desa */}
                {orgMembers.filter(m => m.position.toLowerCase().includes('sekretaris desa')).map(m => (
                  <div key={m.id} className="w-full max-w-[280px] bg-gray-100 p-1 rounded-2xl">
                    <div className="bg-white rounded-[14px] p-4 text-center border border-gray-100 shadow-sm">
                      <p className="font-bold text-gray-800 text-sm mb-1">{m.name}</p>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{m.position}</p>
                    </div>
                  </div>
                ))}

                <div className="w-full max-w-sm flex items-center gap-0">
                  <div className="flex-1 h-0.5 bg-gray-300" />
                  <div className="w-0.5 h-6 bg-gray-300" />
                  <div className="flex-1 h-0.5 bg-gray-300" />
                </div>

                {/* 3. Kasi & Kaur (Grid) */}
                <div className="grid grid-cols-2 gap-3 w-full">
                  {orgMembers
                    .filter(m => 
                      !m.position.toLowerCase().includes('kepala desa') && 
                      !m.position.toLowerCase().includes('sekretaris desa')
                    )
                    .map(m => (
                      <div key={m.id} className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-[#e8f5e9] text-[#1a7a2e] rounded-lg flex items-center justify-center text-xs font-black shrink-0">
                            {m.name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-gray-800 text-[11px] truncate leading-tight mb-0.5">{m.name}</p>
                            <p className="text-[9px] text-gray-500 font-medium uppercase tracking-tighter truncate">{m.position}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  }
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-500 italic py-8 text-center">Data struktur organisasi belum tersedia.</p>
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
