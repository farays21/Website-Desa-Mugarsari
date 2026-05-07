'use client'

import { useState } from 'react'
import { updateAssistanceStatusAction } from '@/lib/actions/social-assistance'
import { useRouter } from 'next/navigation'

interface Application {
  id: string
  nama_kepala_keluarga: string
  nik_kepala_keluarga: string
  no_kartu_keluarga: string
  pendapatan: string | null
  alamat: string | null
  no_whatsapp: string | null
  status: string
  created_at: string
  profiles?: { full_name: string | null; email: string } | null
}

interface Props {
  applications: Application[]
}

export default function BantuanSosialList({ applications: initApps }: Props) {
  const router = useRouter()
  const [apps, setApps] = useState(initApps)
  const [search, setSearch] = useState('')
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [msg, setMsg] = useState<{ id: string; text: string; ok: boolean } | null>(null)

  const filtered = apps.filter(
    (a) =>
      a.nama_kepala_keluarga.toLowerCase().includes(search.toLowerCase()) ||
      a.nik_kepala_keluarga.includes(search)
  )

  async function updateStatus(id: string, status: 'approved' | 'rejected') {
    setLoadingId(id + status)
    const result = await updateAssistanceStatusAction(id, status)

    if (result?.error) {
      setMsg({ id, text: result.error, ok: false })
    } else {
      setApps((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)))
      setMsg({ id, text: status === 'approved' ? '✓ Permohonan diterima' : '✓ Permohonan ditolak', ok: true })
      router.refresh()
    }
    setLoadingId(null)
    setTimeout(() => setMsg(null), 4000)
  }

  const statusBadge = (s: string) => ({
    approved: 'bg-green-100 text-green-800 border-green-200',
    rejected: 'bg-red-100 text-red-800 border-red-200',
    pending:  'bg-orange-100 text-orange-800 border-orange-200',
  }[s] ?? 'bg-gray-100 text-gray-700')

  const statusLabel = (s: string) => ({ approved: 'Diterima', rejected: 'Ditolak', pending: 'Pending' }[s] ?? s)

  return (
    <div className="space-y-4">
      {/* Search */}
      <input
        type="text"
        placeholder="Cari Nama Kepala Keluarga / NIK..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-4 py-2 bg-white border border-gray-300 rounded-full text-sm focus:outline-none focus:border-[#1a7a2e] shadow-sm"
      />

      {filtered.length === 0 && (
        <div className="bg-gray-300 rounded-xl p-8 text-center text-gray-500">
          {search ? 'Tidak ditemukan hasil pencarian' : 'Belum ada pendaftar bantuan sosial'}
        </div>
      )}

      {filtered.map((app) => (
        <div key={app.id} className="bg-gray-300 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-base underline">Informasi Pendaftar Bantuan Sosial</h2>
            <span className={`text-xs font-bold px-3 py-1 rounded-full border ${statusBadge(app.status)}`}>
              {statusLabel(app.status)}
            </span>
          </div>

          <div className="space-y-2">
            {[
              { label: 'Nama kepala keluarga', value: app.nama_kepala_keluarga },
              { label: 'NIK Kepala Keluarga',  value: app.nik_kepala_keluarga },
              { label: 'No Kartu Keluarga',    value: app.no_kartu_keluarga },
              { label: 'Pendapatan',           value: app.pendapatan },
              { label: 'No WhatsApp',          value: app.no_whatsapp },
            ].map((f) => (
              <div key={f.label} className="flex items-center gap-3">
                <label className="w-44 text-sm font-medium text-gray-700 shrink-0">{f.label}</label>
                <div className="flex-1 px-3 py-1.5 bg-white border border-gray-300 rounded text-sm min-h-[32px]">
                  {f.value ?? '-'}
                </div>
              </div>
            ))}

            <div className="flex items-start gap-3">
              <label className="w-44 text-sm font-medium text-gray-700 shrink-0 mt-2">Alamat</label>
              <div className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded text-sm min-h-[60px] whitespace-pre-wrap">
                {app.alamat ?? '-'}
              </div>
            </div>

            {['Foto KK', 'Foto Rumah Tampak Depan', 'Foto Ruang Tamu', 'Foto Kamar Mandi'].map((label) => (
              <div key={label} className="flex items-center gap-3">
                <label className="w-44 text-sm font-medium text-gray-700 shrink-0">{label}</label>
                <button type="button" className="px-4 py-1 bg-white border border-gray-400 rounded text-sm hover:bg-gray-50 text-gray-500">
                  Lihat
                </button>
              </div>
            ))}
          </div>

          {/* Message for this card */}
          {msg?.id === app.id && (
            <div className={`mt-3 rounded-lg px-3 py-2 text-sm text-center ${msg.ok ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-700'}`}>
              {msg.text}
            </div>
          )}

          {/* Actions */}
          {app.status === 'pending' && (
            <div className="flex gap-4 justify-center mt-4">
              <button
                onClick={() => updateStatus(app.id, 'approved')}
                disabled={loadingId !== null}
                className="px-8 py-2 bg-green-500 text-white font-bold rounded-full hover:bg-green-600 transition-colors disabled:opacity-60 flex items-center gap-2"
              >
                {loadingId === app.id + 'approved' ? (
                  <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Memproses...</>
                ) : 'Terima'}
              </button>
              <button
                onClick={() => updateStatus(app.id, 'rejected')}
                disabled={loadingId !== null}
                className="px-8 py-2 bg-red-500 text-white font-bold rounded-full hover:bg-red-600 transition-colors disabled:opacity-60 flex items-center gap-2"
              >
                {loadingId === app.id + 'rejected' ? (
                  <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Memproses...</>
                ) : 'Tolak'}
              </button>
            </div>
          )}

          {app.status !== 'pending' && (
            <p className="text-center text-sm text-gray-500 mt-4 italic">
              {app.status === 'approved' ? '✅ Sudah diterima' : '❌ Sudah ditolak'}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}
