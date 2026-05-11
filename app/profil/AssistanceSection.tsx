'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { submitSocialAssistanceAction } from '@/lib/actions/social-assistance'
import type { SocialAssistance } from '@/types'

interface Props {
  assistances: SocialAssistance[]
  userId: string
}

const statusColor = (s: string) =>
  s === 'approved' ? 'bg-green-500' : s === 'rejected' ? 'bg-red-500' : 'bg-orange-400'

const statusLabel = (s: string) =>
  s === 'approved' ? 'Diterima' : s === 'rejected' ? 'Ditolak' : 'Pending'

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })

function timeAgo(d: string) {
  const diff = Date.now() - new Date(d).getTime()
  const h = Math.floor(diff / 3600000)
  if (h < 1) return 'Baru saja'
  if (h < 24) return `${h} jam lalu`
  const days = Math.floor(h / 24)
  return `${days} hari lalu`
}

export default function AssistanceSection({ assistances: initList, userId }: Props) {
  const router = useRouter()
  const [list, setList] = useState(initList)
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null)
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    nama_kepala_keluarga: '',
    nik_kepala_keluarga: '',
    no_kartu_keluarga: '',
    pendapatan: '',
    alamat: '',
    no_whatsapp: '',
  })

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setMsg(null)

    const fd = new FormData()
    Object.entries(form).forEach(([k, v]) => fd.append(k, v))

    const result = await submitSocialAssistanceAction(fd)

    if (result?.error) {
      setMsg({ text: result.error, ok: false })
    } else {
      setMsg({ text: '✓ Pendaftaran berhasil dikirim!', ok: true })
      // Reset form
      setForm({
        nama_kepala_keluarga: '',
        nik_kepala_keluarga: '',
        no_kartu_keluarga: '',
        pendapatan: '',
        alamat: '',
        no_whatsapp: '',
      })
      // Refresh page data
      router.refresh()
    }
    setLoading(false)
    setTimeout(() => setMsg(null), 5000)
  }

  const formFields = [
    { key: 'nama_kepala_keluarga', label: 'Nama kepala keluarga' },
    { key: 'nik_kepala_keluarga',  label: 'NIK Kepala Keluarga' },
    { key: 'no_kartu_keluarga',   label: 'No Kartu Keluarga' },
    { key: 'pendapatan',          label: 'Pendapatan' },
    { key: 'no_whatsapp',         label: 'No WhatsApp' },
  ]

  return (
    <>
      {/* Pendaftaran Bantuan Sosial */}
      <section className="bg-gray-300 rounded-xl p-4">
        <h2 className="font-bold text-center text-lg mb-1 underline">Pendaftaran Bantuan Sosial</h2>
        <form onSubmit={handleSubmit} className="space-y-3 mt-4">
          {formFields.map((f) => (
            <div key={f.key} className="flex items-center gap-3">
              <label className="w-36 font-semibold text-sm shrink-0">{f.label}</label>
              <input
                type="text"
                required
                value={form[f.key as keyof typeof form]}
                onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded focus:outline-none focus:border-[#1a7a2e] text-sm"
              />
            </div>
          ))}

          <div className="flex items-start gap-3">
            <label className="w-36 font-semibold text-sm shrink-0 mt-2">Alamat</label>
            <textarea
              rows={3}
              required
              value={form.alamat}
              onChange={(e) => setForm({ ...form, alamat: e.target.value })}
              className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded focus:outline-none focus:border-[#1a7a2e] text-sm resize-none"
            />
          </div>

          {/* Photo upload placeholders */}
          {['Foto KK', 'Foto Rumah Tampak Depan', 'Foto Ruang Tamu', 'Foto Kamar Mandi'].map((label) => (
            <div key={label} className="flex items-center gap-3">
              <label className="w-36 font-semibold text-sm shrink-0">{label}</label>
              <button type="button" className="px-4 py-1 bg-white border border-gray-400 rounded text-sm hover:bg-gray-50 transition-colors">
                Upload
              </button>
            </div>
          ))}

          {msg && (
            <div className={`rounded-lg px-3 py-2 text-sm text-center ${msg.ok ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-700'}`}>
              {msg.text}
            </div>
          )}

          <div className="flex justify-center pt-2">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-2 bg-[#d4a017] text-white font-bold rounded-full hover:bg-[#b8860b] transition-colors disabled:opacity-60 flex items-center gap-2"
            >
              {loading ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Mengirim...</> : 'Daftar'}
            </button>
          </div>
        </form>
      </section>

      {/* Status List */}
      {list.length > 0 && (
        <section className="bg-gray-100 rounded-xl p-4">
          <h2 className="font-bold text-center text-lg mb-3">Status Pendaftaran</h2>
          <div className="space-y-3">
            {list.map((a) => (
              <div key={a.id} className="flex items-center justify-between bg-white rounded-lg px-4 py-3 shadow-sm">
                <div>
                  <p className="font-semibold text-sm">{a.nama_kepala_keluarga}</p>
                  <p className="text-xs text-gray-500">{timeAgo(a.created_at)}</p>
                </div>
                <span className={`${statusColor(a.status)} text-white text-xs font-bold px-3 py-1 rounded-full`}>
                  {statusLabel(a.status)}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  )
}
