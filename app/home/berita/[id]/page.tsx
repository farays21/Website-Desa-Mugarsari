import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function NewsDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: news } = await supabase
    .from('news')
    .select('*')
    .eq('id', id)
    .single()

  if (!news) {
    notFound()
  }

  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString('id-ID', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar role="user" />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        <Link 
          href="/home" 
          className="inline-flex items-center text-sm text-[#1a7a2e] font-semibold mb-6 hover:underline gap-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
          Kembali ke Beranda
        </Link>

        <article className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="p-6 md:p-8 border-b border-gray-50">
            <div className="flex items-center gap-2 text-xs font-medium text-[#1a7a2e] mb-3 uppercase tracking-wider">
              <span className="bg-[#e8f5e9] px-2 py-1 rounded">Berita Desa</span>
              <span className="text-gray-300">•</span>
              <span className="text-gray-500">{fmtDate(news.created_at)}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight">
              {news.title}
            </h1>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8">
            {news.content ? (
              <div className="prose prose-green max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
                {news.content}
              </div>
            ) : (
              <p className="text-gray-400 italic">Tidak ada isi berita.</p>
            )}
          </div>
        </article>

        {/* Info for Bansos if applicable */}
        {news.title.toLowerCase().includes('bansos') && (
          <div className="mt-8 bg-blue-50 border border-blue-100 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center shrink-0 shadow-lg shadow-blue-200 text-white">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-blue-900 text-lg mb-1">Informasi Pendaftaran</h3>
              <p className="text-sm text-blue-700 leading-relaxed">
                Pendaftaran dan pemutakhiran data penerima bansos dilakukan secara mandiri melalui menu 
                <strong className="mx-1">Profil Saya</strong>. Pastikan data diri Anda sudah lengkap dan sesuai.
              </p>
              <Link 
                href="/profil" 
                className="inline-flex items-center gap-2 mt-3 text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors"
              >
                Menuju Profil Saya
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
