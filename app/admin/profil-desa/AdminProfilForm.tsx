'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  updateVillageContentAction,
  addOrgMemberAction,
  updateOrgMemberAction,
  deleteOrgMemberAction,
  updateDemographicsAction,
} from '@/lib/actions/village-content'

interface OrgMember  { id: string; name: string; position: string }
interface Demographics { total_penduduk: number; total_kk: number; total_laki: number; total_perempuan: number }
interface Props { visi: string; misi: string; orgMembers: OrgMember[]; demographics: Demographics | null }

function StatusMsg({ msg }: { msg: { text: string; ok: boolean } | null }) {
  if (!msg) return null
  return (
    <div className={`rounded-lg px-3 py-2 text-sm mb-2 ${msg.ok ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-700'}`}>
      {msg.text}
    </div>
  )
}

export default function AdminProfilForm({ visi, misi, orgMembers: initOrg, demographics }: Props) {
  const router   = useRouter()
  const [visiText, setVisiText] = useState(visi)
  const [misiText, setMisiText] = useState(misi)
  const [org,      setOrg]      = useState(initOrg)

  const [newName,  setNewName]  = useState('')
  const [newPos,   setNewPos]   = useState('')
  const [editId,   setEditId]   = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editPos,  setEditPos]  = useState('')

  const [vmMsg,   setVmMsg]   = useState<{ text: string; ok: boolean } | null>(null)
  const [orgMsg,  setOrgMsg]  = useState<{ text: string; ok: boolean } | null>(null)
  const [demoMsg, setDemoMsg] = useState<{ text: string; ok: boolean } | null>(null)
  const [loading, setLoading] = useState(false)

  function showMsg(
    set: React.Dispatch<React.SetStateAction<{ text: string; ok: boolean } | null>>,
    text: string, ok: boolean
  ) { set({ text, ok }); setTimeout(() => set(null), 4000) }

  async function saveVisiMisi() {
    setLoading(true)
    const fdV = new FormData(); fdV.append('content', visiText)
    const fdM = new FormData(); fdM.append('content', misiText)
    await updateVillageContentAction('profil_visi', fdV)
    const r = await updateVillageContentAction('profil_misi', fdM)
    showMsg(setVmMsg, r?.error ? r.error : '✓ Visi & Misi disimpan', !r?.error)
    if (!r?.error) router.refresh()
    setLoading(false)
  }

  async function addMember() {
    if (!newName.trim() || !newPos.trim()) return
    setLoading(true)
    const fd = new FormData()
    fd.append('name', newName); fd.append('position', newPos)
    const r = await addOrgMemberAction(fd)
    if (r?.error) {
      showMsg(setOrgMsg, r.error, false)
    } else {
      const item = (r as { item?: OrgMember }).item
      if (item) setOrg([...org, item])
      else router.refresh()
      setNewName(''); setNewPos('')
      showMsg(setOrgMsg, '✓ Anggota ditambahkan', true)
    }
    setLoading(false)
  }

  async function saveEdit() {
    if (!editId) return
    setLoading(true)
    const fd = new FormData()
    fd.append('name', editName); fd.append('position', editPos)
    const r = await updateOrgMemberAction(editId, fd)
    if (r?.error) showMsg(setOrgMsg, r.error, false)
    else {
      setOrg(org.map((m) => m.id === editId ? { ...m, name: editName, position: editPos } : m))
      setEditId(null)
      showMsg(setOrgMsg, '✓ Data diperbarui', true)
    }
    setLoading(false)
  }

  async function removeMember(id: string) {
    const r = await deleteOrgMemberAction(id)
    if (r?.error) showMsg(setOrgMsg, r.error, false)
    else setOrg(org.filter((m) => m.id !== id))
  }

  async function saveDemographics(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const fd = new FormData(e.currentTarget)
    const r = await updateDemographicsAction(fd)
    showMsg(setDemoMsg, r?.error ? r.error : '✓ Data kependudukan disimpan', !r?.error)
    if (!r?.error) router.refresh()
    setLoading(false)
  }

  return (
    <div className="space-y-4">
      {/* ── Visi & Misi ─────────────────────────────────────────────── */}
      <section className="bg-gray-300 rounded-xl p-4">
        <h2 className="font-semibold mb-3">Visi &amp; Misi</h2>
        <label className="text-sm font-medium block mb-1">Visi</label>
        <textarea value={visiText} onChange={(e) => setVisiText(e.target.value)} rows={3}
          className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm resize-none focus:outline-none focus:border-[#1a7a2e] mb-3" />
        <label className="text-sm font-medium block mb-1">Misi</label>
        <textarea value={misiText} onChange={(e) => setMisiText(e.target.value)} rows={3}
          className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm resize-none focus:outline-none focus:border-[#1a7a2e] mb-2" />
        <StatusMsg msg={vmMsg} />
        <div className="flex gap-2">
          <button onClick={saveVisiMisi} disabled={loading}
            className="px-4 py-1.5 bg-white border border-gray-400 rounded text-sm hover:bg-gray-100 disabled:opacity-60 transition-colors">Simpan</button>
          <button onClick={() => { setVisiText(visi); setMisiText(misi) }}
            className="px-4 py-1.5 bg-white border border-gray-400 rounded text-sm hover:bg-gray-100 transition-colors">Batal</button>
        </div>
      </section>

      {/* ── Struktur Organisasi ─────────────────────────────────────── */}
      <section className="bg-gray-300 rounded-xl p-4">
        <h2 className="font-semibold mb-3">Struktur Organisasi</h2>

        {/* Add row */}
        <div className="flex gap-2 mb-3">
          <input value={newName} onChange={(e) => setNewName(e.target.value)}
            placeholder="Nama..." className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded text-sm focus:outline-none" />
          <input value={newPos} onChange={(e) => setNewPos(e.target.value)}
            placeholder="Jabatan..." className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded text-sm focus:outline-none" />
          <button onClick={addMember} disabled={loading || !newName.trim() || !newPos.trim()}
            className="px-3 py-2 bg-[#1a7a2e] text-white text-sm rounded hover:bg-[#155a22] disabled:opacity-60 transition-colors">+</button>
        </div>

        <StatusMsg msg={orgMsg} />

        <div className="space-y-2 max-h-64 overflow-y-auto">
          {org.map((m) => (
            <div key={m.id}>
              {editId === m.id ? (
                <div className="flex gap-2 bg-yellow-50 border border-yellow-300 rounded-lg p-2">
                  <input value={editName} onChange={(e) => setEditName(e.target.value)}
                    className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none" />
                  <input value={editPos} onChange={(e) => setEditPos(e.target.value)}
                    className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none" />
                  <button onClick={saveEdit} disabled={loading}
                    className="px-3 py-1 bg-[#1a7a2e] text-white text-xs rounded hover:bg-[#155a22] disabled:opacity-60">✓</button>
                  <button onClick={() => setEditId(null)}
                    className="px-3 py-1 bg-gray-400 text-white text-xs rounded hover:bg-gray-500">✕</button>
                </div>
              ) : (
                <div className="flex items-center justify-between bg-gray-200 rounded-lg px-3 py-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-gray-500 shrink-0">📄</span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{m.name}</p>
                      <p className="text-xs text-gray-500">{m.position}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-2 shrink-0">
                    <button onClick={() => { setEditId(m.id); setEditName(m.name); setEditPos(m.position) }}
                      className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center hover:bg-blue-200 transition-colors text-sm">✏️</button>
                    <button onClick={() => removeMember(m.id)}
                      className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors text-sm">🗑️</button>
                  </div>
                </div>
              )}
            </div>
          ))}
          {org.length === 0 && <p className="text-sm text-gray-500 text-center py-3">Belum ada anggota</p>}
        </div>
      </section>

      {/* ── Data Kependudukan ────────────────────────────────────────── */}
      <section className="bg-gray-300 rounded-xl p-4">
        <h2 className="font-semibold mb-3">Data Penduduk</h2>
        <form onSubmit={saveDemographics}>
          <div className="grid grid-cols-2 gap-3 mb-3">
            {[
              { name: 'total_penduduk',  label: 'Total Penduduk',  val: demographics?.total_penduduk  ?? 0 },
              { name: 'total_kk',        label: 'Total KK',        val: demographics?.total_kk        ?? 0 },
              { name: 'total_laki',      label: 'Total Laki-Laki', val: demographics?.total_laki      ?? 0 },
              { name: 'total_perempuan', label: 'Total Perempuan', val: demographics?.total_perempuan ?? 0 },
            ].map((f) => (
              <div key={f.name} className="bg-gray-200 rounded-lg p-3">
                <label className="text-xs font-medium text-gray-600 block mb-1">{f.label}</label>
                <input name={f.name} type="number" min="0" defaultValue={f.val}
                  className="w-full px-2 py-1 bg-white border border-gray-300 rounded text-sm focus:outline-none focus:border-[#1a7a2e]" />
              </div>
            ))}
          </div>
          <StatusMsg msg={demoMsg} />
          <div className="flex gap-2">
            <button type="submit" disabled={loading}
              className="px-4 py-1.5 bg-white border border-gray-400 rounded text-sm hover:bg-gray-100 disabled:opacity-60 transition-colors">Simpan</button>
            <button type="reset"
              className="px-4 py-1.5 bg-white border border-gray-400 rounded text-sm hover:bg-gray-100 transition-colors">Reset</button>
          </div>
        </form>
      </section>
    </div>
  )
}
