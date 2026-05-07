import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
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
          <h2 className="font-bold text-lg mb-3">Berita Desa</h2>
          {news && news.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {news.map((item) => (
                <div
                  key={item.id}
                  className="bg-blue-100 rounded-xl h-28 flex items-center justify-center text-center p-2"
                >
                  <div>
                    <div className="w-10 h-10 bg-blue-400 rounded-full mx-auto mb-1 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" className="w-5 h-5">
                        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                      </svg>
                    </div>
                    <p className="text-xs font-semibold text-gray-700 line-clamp-2">{item.title}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {[1, 2].map((i) => (
                <div key={i} className="bg-blue-100 rounded-xl h-28 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-orange-400 rounded mx-auto mb-1 flex items-center justify-center">
                      <span className="text-white font-bold text-xs">NEWS</span>
                    </div>
                    <p className="text-xs text-gray-500">Belum ada berita</p>
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
