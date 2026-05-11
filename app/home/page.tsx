import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function HomePage() {
  const supabase = await createClient()

  const { data: greeting } = await supabase
    .from('village_content')
    .select('*')
    .eq('section', 'home_greeting')
    .maybeSingle()

  const { data: history } = await supabase
    .from('village_content')
    .select('*')
    .eq('section', 'home_history')
    .maybeSingle()

  const { data: news } = await supabase
    .from('news')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(4)

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar role="user" />

      {/* Hero */}
      <div
        className="relative h-52 flex items-center justify-center text-center"
        style={{
          background: 'linear-gradient(135deg, #1a7a2e 0%, #2d9e4a 40%, #4caf50 70%, #81c784 100%)',
        }}
      >
        <div className="absolute inset-0 bg-black/25" />
        <div className="relative px-6">
          <h1 className="text-white text-2xl font-black drop-shadow-lg">
            Website Resmi<br />Desa Mugarsari
          </h1>
          <p className="text-white text-sm mt-1 drop-shadow">
            Sumber Informasi tentang pemerintahan di Desa Mugarsari
          </p>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 px-4 py-6 space-y-8">
        {/* Sambutan Kepala Desa */}
        <section className="flex gap-4 items-start">
          <div className="shrink-0 w-20 h-20 rounded-full bg-gray-300 border-4 border-[#1a7a2e] overflow-hidden flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="#555" viewBox="0 0 24 24" className="w-12 h-12">
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
            </svg>
          </div>
          <div>
            <h2 className="font-bold text-lg mb-1">Sambutan Kepala Desa</h2>
            <p className="text-sm text-gray-700 text-justify leading-relaxed">
              {greeting?.content || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam euismod eu lacus et ultrices.'}
            </p>
          </div>
        </section>

        {/* Sejarah Desa */}
        <section className="bg-gray-100 rounded-xl p-4">
          <h2 className="font-bold text-lg text-center mb-2">Sejarah Desa</h2>
          <p className="text-sm text-gray-700 text-justify leading-relaxed">
            {history?.content || 'Kelurahan Mugarsari terbentuk pada tanggal 30 Oktober 2003 dengan Perda Kota Tasikmalaya Nomor 30 Tahun 2003.'}
          </p>
        </section>

        {/* Berita Desa */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-lg">Berita Desa</h2>
            <Link href="/home/berita" className="text-[#1a7a2e] text-xs font-semibold hover:underline">
              Lihat Semua
            </Link>
          </div>
          {news && news.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {news.map((item) => (
                <Link
                  key={item.id}
                  href={`/home/berita/${item.id}`}
                  className="bg-white border border-gray-100 shadow-sm rounded-xl h-32 flex items-center justify-center text-center p-3 hover:shadow-md transition-all active:scale-95 group"
                >
                  <div>
                    <div className="w-10 h-10 bg-[#e8f5e9] group-hover:bg-[#1a7a2e] rounded-full mx-auto mb-2 flex items-center justify-center transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-[#1a7a2e] group-hover:text-white">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                      </svg>
                    </div>
                    <p className="text-xs font-bold text-gray-800 line-clamp-2 leading-tight">{item.title}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {[1, 2].map((i) => (
                <div key={i} className="bg-gray-50 border border-dashed border-gray-300 rounded-xl h-32 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-xs text-gray-400">Belum ada berita</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Letak Geografis */}
        <section>
          <h2 className="font-bold text-lg mb-3">Letak Geografis</h2>
          <div className="w-full h-40 bg-gray-200 rounded-xl flex items-center justify-center mb-3">
            <p className="text-gray-500 text-sm">🗺️ Peta Desa Mugarsari</p>
          </div>
          <div className="text-sm text-gray-700 leading-relaxed">
            <p className="mb-2">
              Kelurahan Mugarsari adalah salah satu Kelurahan di Kecamatan Tamansari Kota Tasikmalaya Jawa Barat
              yang memiliki luas wilayah 257.91 hektar dengan batas-batas sebagai berikut:
            </p>
            <ul className="space-y-1">
              <li>• <strong>UTARA</strong> : Kelurahan Sumelap</li>
              <li>• <strong>TIMUR</strong> : Desa Gunajaya (Kabupaten Tasikmalaya)</li>
              <li>• <strong>SELATAN</strong> : Kelurahan Tamansari</li>
              <li>• <strong>BARAT</strong> : Kelurahan Sukahurip</li>
            </ul>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
