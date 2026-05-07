'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { loginAction } from '@/lib/actions/auth'

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const result = await loginAction(formData)

    if (!result) {
      setError('Terjadi kesalahan, coba lagi')
      setLoading(false)
      return
    }

    if ('error' in result && result.error) {
      setError(result.error)
      setLoading(false)
      return
    }

    // Navigate based on role
    if ('role' in result) {
      if (result.role === 'admin') {
        router.push('/admin/home')
      } else {
        router.push('/home')
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-[#1a7a2e] text-white px-4 py-3 flex items-center gap-3">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
          <div className="w-9 h-9 bg-yellow-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
            DM
          </div>
        </div>
        <div>
          <p className="font-bold text-sm">Desa Mugarsari</p>
          <p className="text-xs opacity-80">Kota Tasikmalaya</p>
        </div>
      </header>

      {/* Hero */}
      <div
        className="relative h-56 flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg,#0d5c1e 0%,#1a7a2e 40%,#2fa84a 70%,#4caf50 100%)' }}
      >
        <div className="absolute inset-0 bg-black/30" />
        <h1 className="relative text-white text-2xl font-black text-center leading-snug px-6 drop-shadow-lg">
          Selamat Datang di<br />Website Resmi<br />Desa Mugarsari
        </h1>
      </div>

      {/* Login Card */}
      <div className="flex-1 flex items-start justify-center py-8 px-4 bg-gray-50">
        <div className="w-full max-w-sm bg-[#f5dfd3] rounded-2xl shadow-lg p-6">
          <div className="flex mb-4">
            <div className="bg-black text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
              Login <span className="ml-1 w-4 h-4 bg-white rounded-full inline-block" />
            </div>
          </div>

          {/* Avatar */}
          <div className="flex justify-center mb-5">
            <div className="w-20 h-20 bg-gray-500 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" className="w-12 h-12">
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
              </svg>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="email"
              type="email"
              placeholder="Email"
              required
              className="w-full px-4 py-3 rounded-full border-2 border-gray-400 bg-[#f5dfd3] placeholder-gray-600 font-semibold text-gray-800 focus:outline-none focus:border-[#1a7a2e]"
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              required
              className="w-full px-4 py-3 rounded-full border-2 border-gray-400 bg-[#f5dfd3] placeholder-gray-600 font-semibold text-gray-800 focus:outline-none focus:border-[#1a7a2e]"
            />

            {error && (
              <div className="bg-red-100 border border-red-300 rounded-lg px-3 py-2">
                <p className="text-red-700 text-sm text-center">{error}</p>
              </div>
            )}

            <p className="text-center text-gray-600 text-sm">Forgot Password?</p>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#1a7a2e] text-white font-bold rounded-full text-lg hover:bg-[#155a22] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Memuat...
                </>
              ) : 'Login'}
            </button>
          </form>

          <p className="text-center text-sm mt-4 text-gray-700">
            Belum punya akun?{' '}
            <Link href="/register" className="text-[#1a7a2e] font-semibold hover:underline">
              Daftar Sekarang
            </Link>
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#1a7a2e] text-white py-5">
        <div className="flex items-center justify-between px-6">
          <div className="w-11 h-11 bg-white rounded-full flex items-center justify-center">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold text-white">KT</div>
          </div>
          <div className="text-center">
            <p className="font-bold underline mb-2">Media Sosial</p>
            <div className="flex gap-3 justify-center">
              {[
                { color: 'text-pink-600', path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z' },
                { color: 'text-blue-700', path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
                { color: 'text-red-600', path: 'M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z' },
              ].map((icon, i) => (
                <a key={i} href="#" className="w-7 h-7 bg-white rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={`w-4 h-4 fill-current ${icon.color}`}>
                    <path d={icon.path} />
                  </svg>
                </a>
              ))}
            </div>
            <p className="text-xs opacity-70 mt-1">© 2026 Powered by TRIO AZA</p>
          </div>
          <div className="w-11 h-11 bg-white rounded-full flex items-center justify-center">
            <div className="w-10 h-10 bg-green-700 rounded-full flex items-center justify-center text-xs font-bold text-white">DM</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
