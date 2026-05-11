'use client'

import { useState } from 'react'
import { updateProfileAction } from '@/lib/actions/auth'
import type { Profile } from '@/types'

interface Props {
  profile: Profile | null
}

export default function ProfileInfoForm({ profile }: Props) {
  const [values, setValues] = useState({
    full_name:   profile?.full_name   ?? '',
    nik:         profile?.nik         ?? '',
    no_kk:       profile?.no_kk       ?? '',
    alamat:      profile?.alamat      ?? '',
    no_whatsapp: profile?.no_whatsapp ?? '',
  })
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setMsg(null)

    const fd = new FormData()
    Object.entries(values).forEach(([k, v]) => fd.append(k, v))

    const result = await updateProfileAction(fd)

    if (result?.error) {
      setMsg({ text: result.error, ok: false })
    } else {
      setMsg({ text: '✓ Profil berhasil diperbarui', ok: true })
    }
    setLoading(false)
    setTimeout(() => setMsg(null), 4000)
  }

  const fields = [
    { key: 'full_name',   label: 'Nama' },
    { key: 'nik',         label: 'NIK' },
    { key: 'no_kk',       label: 'No KK' },
    { key: 'no_whatsapp', label: 'No WhatsApp' },
  ]

  return (
    <section className="bg-gray-300 rounded-xl p-4">
      <h2 className="font-bold text-center text-lg mb-4">Informasi Akun</h2>
      <form onSubmit={handleSave} className="space-y-3">
        {fields.map((f) => (
          <div key={f.key} className="flex items-center gap-3">
            <label className="w-28 font-semibold text-sm shrink-0">{f.label}</label>
            <input
              type="text"
              value={values[f.key as keyof typeof values]}
              onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
              className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded focus:outline-none focus:border-[#1a7a2e] text-sm"
            />
          </div>
        ))}

        <div className="flex items-start gap-3">
          <label className="w-28 font-semibold text-sm shrink-0 mt-2">Alamat</label>
          <textarea
            rows={3}
            value={values.alamat}
            onChange={(e) => setValues({ ...values, alamat: e.target.value })}
            className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded focus:outline-none focus:border-[#1a7a2e] text-sm resize-none"
          />
        </div>

        {msg && (
          <div className={`rounded-lg px-3 py-2 text-sm text-center ${msg.ok ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-700'}`}>
            {msg.text}
          </div>
        )}

        <div className="flex justify-center pt-1">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-2 bg-[#d4a017] text-white font-bold rounded-full hover:bg-[#b8860b] transition-colors disabled:opacity-60 flex items-center gap-2 text-sm"
          >
            {loading ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Menyimpan...</> : 'Simpan'}
          </button>
        </div>
      </form>
    </section>
  )
}
