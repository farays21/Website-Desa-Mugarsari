'use client'

import { useState } from 'react'
import { updateKontakAction } from '@/lib/actions/village-content'

interface Props {
  initialData: { phone: string; hours: string; email: string; address: string }
}

export default function AdminKontakForm({ initialData }: Props) {
  const [data, setData] = useState(initialData)
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSave() {
    setLoading(true)
    const fd = new FormData()
    Object.entries(data).forEach(([k, v]) => fd.append(k, v))
    const r = await updateKontakAction(fd)
    setMsg(r?.error ? r.error : 'Kontak berhasil diperbarui!')
    setLoading(false)
    setTimeout(() => setMsg(''), 3000)
  }

  const fields = [
    { key: 'phone', label: 'Nomor Telepon', icon: '📞' },
    { key: 'hours', label: 'Jam Operasional', icon: '🕐' },
    { key: 'email', label: 'Email', icon: '✉️' },
    { key: 'address', label: 'Alamat', icon: '📍' },
  ]

  return (
    <section className="bg-gray-300 rounded-xl p-4">
      <h2 className="font-semibold mb-4">Informasi Kontak Desa</h2>
      <div className="space-y-4">
        {fields.map((f) => (
          <div key={f.key} className="flex items-start gap-3">
            <span className="text-xl mt-2">{f.icon}</span>
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 block mb-1">{f.label}</label>
              {f.key === 'address' ? (
                <textarea
                  value={data[f.key as keyof typeof data]}
                  onChange={(e) => setData({ ...data, [f.key]: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm resize-none focus:outline-none focus:border-[#1a7a2e]"
                />
              ) : (
                <input
                  type="text"
                  value={data[f.key as keyof typeof data]}
                  onChange={(e) => setData({ ...data, [f.key]: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm focus:outline-none focus:border-[#1a7a2e]"
                />
              )}
            </div>
          </div>
        ))}
      </div>
      {msg && <p className="text-sm text-green-700 mt-3">{msg}</p>}
      <div className="flex gap-2 mt-4">
        <button onClick={handleSave} disabled={loading} className="px-4 py-1.5 bg-white border border-gray-400 rounded text-sm hover:bg-gray-100 disabled:opacity-60">
          Simpan
        </button>
        <button onClick={() => setData(initialData)} className="px-4 py-1.5 bg-white border border-gray-400 rounded text-sm hover:bg-gray-100">
          Batal
        </button>
      </div>
    </section>
  )
}
