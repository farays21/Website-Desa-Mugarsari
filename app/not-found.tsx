import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <div className="text-8xl mb-4">🏘️</div>
        <h1 className="text-6xl font-black text-[#1a7a2e] mb-2">404</h1>
        <h2 className="text-xl font-bold text-gray-700 mb-2">Halaman Tidak Ditemukan</h2>
        <p className="text-gray-500 mb-6">
          Halaman yang Anda cari tidak ada atau telah dipindahkan.
        </p>
        <Link
          href="/login"
          className="px-6 py-3 bg-[#1a7a2e] text-white font-bold rounded-full hover:bg-[#155a22] transition-colors"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  )
}
