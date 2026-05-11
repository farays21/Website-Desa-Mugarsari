'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  updateVillageContentAction,
  addNewsAction,
  deleteNewsAction,
} from '@/lib/actions/village-content'

interface NewsItem { id: string; title: string; content: string | null; created_at: string }
interface Props { greeting: string; history: string; news: NewsItem[] }

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })

function StatusMsg({ msg }: { msg: { text: string; ok: boolean } | null }) {
  if (!msg) return null
  return (
    <div className={`rounded-lg px-3 py-2 text-sm mb-2 ${msg.ok ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-700'}`}>
      {msg.text}
    </div>
  )
}

export default function AdminHomeForm({ greeting, history, news: initNews }: Props) {
  const router = useRouter()
  const [greetingText, setGreetingText] = useState(greeting)
  const [historyText,  setHistoryText]  = useState(history)
  const [news,         setNews]         = useState(initNews)
  const [newTitle,     setNewTitle]     = useState('')
  const [newContent,   setNewContent]   = useState('')

  const [greetingMsg, setGreetingMsg] = useState<{ text: string; ok: boolean } | null>(null)
  const [historyMsg,  setHistoryMsg]  = useState<{ text: string; ok: boolean } | null>(null)
  const [newsMsg,     setNewsMsg]     = useState<{ text: string; ok: boolean } | null>(null)
  const [loading, setLoading] = useState(false)

  function showMsg(
    set: React.Dispatch<React.SetStateAction<{ text: string; ok: boolean } | null>>,
    text: string,
    ok: boolean
  ) {
    set({ text, ok })
    setTimeout(() => set(null), 4000)
  }

  async function saveGreeting() {
    setLoading(true)
    const fd = new FormData(); fd.append('content', greetingText)
    const r = await updateVillageContentAction('home_greeting', fd)
    showMsg(setGreetingMsg, r?.error ? r.error : '✓ Sambutan disimpan', !r?.error)
    setLoading(false)
  }

  async function saveHistory() {
    setLoading(true)
    const fd = new FormData(); fd.append('content', historyText)
    const r = await updateVillageContentAction('home_history', fd)
    showMsg(setHistoryMsg, r?.error ? r.error : '✓ Sejarah disimpan', !r?.error)
    if (!r?.error) router.refresh()
    setLoading(false)
  }

  async function addNews() {
    if (!newTitle.trim()) return
    setLoading(true)
    const fd = new FormData()
    fd.append('title', newTitle)
    fd.append('content', newContent)
    const r = await addNewsAction(fd)
    if (r?.error) {
      showMsg(setNewsMsg, r.error, false)
    } else {
      const item = (r as { item?: NewsItem }).item
      if (item) setNews([item, ...news])
      else router.refresh()
      setNewTitle('')
      setNewContent('')
      showMsg(setNewsMsg, '✓ Berita ditambahkan', true)
    }
    setLoading(false)
  }

  async function removeNews(id: string) {
    const r = await deleteNewsAction(id)
    if (r?.error) showMsg(setNewsMsg, r.error, false)
    else setNews(news.filter((n) => n.id !== id))
  }

  return (
    <div className="space-y-4">
      {/* ── Sambutan ───────────────────────────────────────────────────── */}
      <section className="bg-gray-300 rounded-xl p-4">
        <h2 className="font-semibold mb-3">Sambutan Kepala Desa</h2>
        <div className="mb-3">
          <span className="text-sm font-medium block mb-1">Foto Kepala Desa</span>
          <button type="button"
            className="px-3 py-1 bg-gray-400 text-sm rounded hover:bg-gray-500 transition-colors">
            Update Foto
          </button>
        </div>
        <label className="text-sm font-medium block mb-1">Teks Sambutan</label>
        <textarea
          value={greetingText}
          onChange={(e) => setGreetingText(e.target.value)}
          rows={4}
          className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm resize-none focus:outline-none focus:border-[#1a7a2e] mb-2"
        />
        <StatusMsg msg={greetingMsg} />
        <div className="flex gap-2">
          <button onClick={saveGreeting} disabled={loading}
            className="px-4 py-1.5 bg-white border border-gray-400 rounded text-sm hover:bg-gray-100 disabled:opacity-60 transition-colors">
            Simpan
          </button>
          <button onClick={() => setGreetingText(greeting)}
            className="px-4 py-1.5 bg-white border border-gray-400 rounded text-sm hover:bg-gray-100 transition-colors">
            Batal
          </button>
        </div>
      </section>

      {/* ── Berita ─────────────────────────────────────────────────────── */}
      <section className="bg-gray-300 rounded-xl p-4">
        <h2 className="font-semibold mb-3">Berita Desa</h2>

        <div className="space-y-2 mb-3">
          <input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Judul berita baru..."
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm focus:outline-none focus:border-[#1a7a2e]"
          />
          <textarea
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="Isi berita..."
            rows={3}
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm resize-none focus:outline-none focus:border-[#1a7a2e]"
          />
          <button onClick={addNews} disabled={loading || !newTitle.trim()}
            className="w-full px-4 py-2 bg-[#1a7a2e] text-white text-sm rounded hover:bg-[#155a22] disabled:opacity-60 transition-colors">
            + Tambah Berita
          </button>
        </div>

        <StatusMsg msg={newsMsg} />

        <div className="space-y-2 max-h-64 overflow-y-auto">
          {news.map((item) => (
            <div key={item.id} className="flex items-center justify-between bg-gray-200 rounded-lg px-3 py-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-gray-500 shrink-0">📄</span>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{item.title}</p>
                  <p className="text-xs text-gray-500">{fmtDate(item.created_at)}</p>
                </div>
              </div>
              <button onClick={() => removeNews(item.id)}
                className="ml-2 w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors shrink-0"
                title="Hapus">
                🗑️
              </button>
            </div>
          ))}
          {news.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4">Belum ada berita</p>
          )}
        </div>
      </section>

      {/* ── Sejarah ────────────────────────────────────────────────────── */}
      <section className="bg-gray-300 rounded-xl p-4">
        <h2 className="font-semibold mb-3">Sejarah Desa</h2>
        <textarea
          value={historyText}
          onChange={(e) => setHistoryText(e.target.value)}
          rows={5}
          placeholder="Teks Sejarah..."
          className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm resize-none focus:outline-none focus:border-[#1a7a2e] mb-2"
        />
        <StatusMsg msg={historyMsg} />
        <div className="flex gap-2">
          <button onClick={saveHistory} disabled={loading}
            className="px-4 py-1.5 bg-white border border-gray-400 rounded text-sm hover:bg-gray-100 disabled:opacity-60 transition-colors">
            Simpan
          </button>
          <button onClick={() => setHistoryText(history)}
            className="px-4 py-1.5 bg-white border border-gray-400 rounded text-sm hover:bg-gray-100 transition-colors">
            Batal
          </button>
        </div>
      </section>
    </div>
  )
}
