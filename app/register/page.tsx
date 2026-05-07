'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { registerAction } from '@/lib/actions/auth'
import Footer from '@/components/Footer'

export default function RegisterPage() {
  const router = useRouter()
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const [confirmed, setConfirmed] = useState(false)   // email confirm screen

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const result = await registerAction(formData)

    if (!result) {
      setError('Terjadi kesalahan server')
      setLoading(false)
      return
    }
    if ('error' in result && result.error) {
      setError(result.error)
      setLoading(false)
      return
    }
    if ('requiresConfirmation' in result && result.requiresConfirmation) {
      setConfirmed(true)          // show "check your email" screen
      setLoading(false)
      return
    }
    // Session created immediately → go to home
    router.push('/home')
  }

  // ── Email Confirmation Screen ─────────────────────────────────────────────
  if (confirmed) {
    return (
      <div className="min-h-screen flex flex-col">
        <header className="bg-[#1a7a2e] text-white px-4 py-3 flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <div className="w-9 h-9 bg-yellow-500 rounded-full flex items-center justify-center text-xs font-bold text-white">DM</div>
          </div>
          <div>
            <p className="font-bold text-sm">Desa Mugarsari</p>
            <p className="text-xs opacity-80">Kota Tasikmalaya</p>
          </div>
        </header>
        <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white">
          <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center max-w-sm w-full">
            <div className="text-5xl mb-4">📧</div>
            <h2 className="text-xl font-black text-green-800 mb-2">Cek Email Anda!</h2>
            <p className="text-gray-600 text-sm mb-4">
              Kami mengirimkan link konfirmasi ke email Anda. Klik link tersebut untuk mengaktifkan akun dan masuk ke website.
            </p>
            <Link href="/login"
              className="block w-full py-2 bg-[#1a7a2e] text-white font-bold rounded-full text-center hover:bg-[#155a22] transition-colors">
              Kembali ke Login
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  // ── Register Form ─────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-[#1a7a2e] text-white px-4 py-3 flex items-center gap-3">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
          <div className="w-9 h-9 bg-yellow-500 rounded-full flex items-center justify-center text-xs font-bold text-white">DM</div>
        </div>
        <div>
          <p className="font-bold text-sm">Desa Mugarsari</p>
          <p className="text-xs opacity-80">Kota Tasikmalaya</p>
        </div>
      </header>

      <div className="flex-1 py-6 px-4 bg-white">
        <div className="w-full max-w-sm mx-auto bg-gray-300 rounded-2xl shadow-md p-6">
          <h1 className="text-2xl font-black text-center mb-6">Registrasi</h1>

          <form onSubmit={handleSubmit} className="space-y-3">
            <FieldRow label="Email">
              <input name="email" type="email" required
                className="field-input" />
            </FieldRow>
            <FieldRow label="Password">
              <input name="password" type="password" required minLength={6}
                placeholder="Min. 6 karakter"
                className="field-input" />
            </FieldRow>
            <FieldRow label="Nama Lengkap">
              <input name="full_name" type="text" required className="field-input" />
            </FieldRow>
            <FieldRow label="NIK">
              <input name="nik" type="text" required maxLength={16} className="field-input" />
            </FieldRow>
            <FieldRow label="No KK">
              <input name="no_kk" type="text" required maxLength={16} className="field-input" />
            </FieldRow>
            <FieldRow label="No WhatsApp">
              <input name="no_whatsapp" type="tel" className="field-input" />
            </FieldRow>
            <div className="flex items-start gap-3">
              <label className="w-28 font-semibold text-sm shrink-0 mt-2">Alamat</label>
              <textarea name="alamat" rows={3}
                className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded focus:outline-none focus:border-[#1a7a2e] text-sm resize-none" />
            </div>

            {error && (
              <div className="bg-red-100 border border-red-300 rounded-lg px-3 py-2">
                <p className="text-red-700 text-sm text-center">{error}</p>
              </div>
            )}

            <div className="flex justify-center pt-2">
              <button type="submit" disabled={loading}
                className="px-10 py-2 bg-[#d4a017] text-white font-bold rounded-full hover:bg-[#b8860b] transition-colors disabled:opacity-60 flex items-center gap-2">
                {loading
                  ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Mendaftar...</>
                  : 'Simpan'}
              </button>
            </div>
          </form>

          <p className="text-center text-sm mt-4 text-gray-700">
            Sudah punya akun?{' '}
            <Link href="/login" className="text-[#1a7a2e] font-semibold hover:underline">Login</Link>
          </p>
        </div>
      </div>
      <Footer />

      <style jsx global>{`
        .field-input {
          flex: 1;
          padding: 0.5rem 0.75rem;
          background: white;
          border: 1px solid #d1d5db;
          border-radius: 0.25rem;
          font-size: 0.875rem;
          outline: none;
          width: 100%;
        }
        .field-input:focus { border-color: #1a7a2e; }
      `}</style>
    </div>
  )
}

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <label className="w-28 font-semibold text-sm shrink-0">{label}</label>
      {children}
    </div>
  )
}
