import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { createClient } from '@/lib/supabase/server'

export default async function KontakPage() {
  const supabase = await createClient()

  const { data: kontakData } = await supabase
    .from('village_content')
    .select('*')
    .eq('section', 'kontak')
    .maybeSingle()

  let kontak = { phone: '0818216660', hours: '08.00 - 16.00 WIB', email: 'mugarsari123@gmail.com', address: 'Kelurahan Mugarsari\nKota Tasikmalaya\nJawa Barat' }
  if (kontakData?.content) {
    try {
      kontak = JSON.parse(kontakData.content)
    } catch {}
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar role="user" />

      <main className="flex-1 px-4 py-6 space-y-6">
        {/* Info Kontak */}
        <section className="flex gap-4 items-start">
          {/* Logo */}
          <div className="shrink-0 flex flex-col items-center">
            <div className="w-24 h-24 bg-yellow-100 rounded-full border-4 border-yellow-400 flex items-center justify-center">
              <div className="w-20 h-20 bg-gradient-to-b from-blue-600 to-green-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold text-center leading-tight">KOTA<br/>TASIK</span>
              </div>
            </div>
            <h2 className="font-black text-base mt-2 text-center">DESA MUGARSARI</h2>
            <p className="text-xs text-center text-gray-600">kecamatan Tamansari, Kota Tasikmalaya<br/>Jawa Barat</p>
          </div>

          {/* Kontak Info Card */}
          <div className="flex-1 bg-gray-100 rounded-xl p-4">
            <h3 className="font-black text-center mb-3">KONTAK DESA</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-xl">📞</span>
                <span className="text-sm font-medium">{kontak.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xl">🕐</span>
                <span className="text-sm font-medium">{kontak.hours}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xl">✉️</span>
                <span className="text-sm font-medium">{kontak.email}</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xl">📍</span>
                <span className="text-sm font-medium whitespace-pre-line">{kontak.address}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Saran & Masukan */}
        <section className="bg-gray-200 rounded-xl p-5">
          <h2 className="font-black text-xl text-center mb-4">SARAN &amp; MASUKAN</h2>
          <form className="space-y-3">
            <div className="grid grid-cols-1 gap-3">
              <input
                type="text"
                placeholder="Nama *"
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded focus:outline-none focus:border-[#1a7a2e] text-sm"
              />
              <input
                type="email"
                placeholder="Email *"
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded focus:outline-none focus:border-[#1a7a2e] text-sm"
              />
              <input
                type="text"
                placeholder="Perihal *"
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded focus:outline-none focus:border-[#1a7a2e] text-sm"
              />
              <textarea
                placeholder="Isi Pesan *"
                rows={5}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded focus:outline-none focus:border-[#1a7a2e] text-sm resize-none"
              />
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                className="px-10 py-2 bg-[#d4a017] text-white font-bold rounded hover:bg-[#b8860b] transition-colors"
              >
                KIRIM
              </button>
            </div>
          </form>
        </section>
      </main>

      <Footer />
    </div>
  )
}
