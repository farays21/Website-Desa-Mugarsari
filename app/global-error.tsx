'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <html lang="id">
      <body className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-black text-gray-700 mb-2">Terjadi Kesalahan</h2>
          <p className="text-gray-500 mb-6">
            Maaf, terjadi kesalahan yang tidak terduga.
          </p>
          <button
            onClick={reset}
            className="px-6 py-3 bg-[#1a7a2e] text-white font-bold rounded-full hover:bg-[#155a22] transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      </body>
    </html>
  )
}
