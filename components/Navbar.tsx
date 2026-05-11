'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { logoutAction } from '@/lib/actions/auth'

interface NavbarProps {
  role?: 'user' | 'admin'
}

export default function Navbar({ role = 'user' }: NavbarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [showMenu, setShowMenu] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  const userLinks = [
    { href: '/home',        label: 'Home' },
    { href: '/profil-desa', label: 'Profil Desa' },
    { href: '/kontak',      label: 'Kontak' },
  ]
  const adminLinks = [
    { href: '/admin/home',        label: 'Home' },
    { href: '/admin/profil-desa', label: 'Profil Desa' },
    { href: '/admin/kontak',      label: 'Kontak' },
  ]

  const links       = role === 'admin' ? adminLinks : userLinks
  const dashHome    = role === 'admin' ? '/admin/home' : '/home'
  const profileHref = role === 'admin' ? '/admin/bantuan-sosial' : '/profil'

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + '/')
  }

  async function handleLogout() {
    setLoggingOut(true)
    await logoutAction()
  }

  return (
    <nav className="bg-[#1a7a2e] text-white shadow-md sticky top-0 z-50">
      <div className="px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href={dashHome} className="flex items-center gap-2">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shrink-0">
            <div className="w-9 h-9 bg-yellow-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
              DM
            </div>
          </div>
          <div>
            <p className="font-bold text-sm leading-tight">Desa Mugarsari</p>
            <p className="text-xs opacity-80">Kota Tasikmalaya</p>
          </div>
        </Link>

        {/* Nav links + icon */}
        <div className="flex items-center gap-3">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-yellow-300 ${
                isActive(link.href) ? 'text-yellow-300 font-bold' : 'text-white'
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* User menu */}
          <div className="relative ml-1">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
              </svg>
            </button>

            {showMenu && (
              <>
                {/* Backdrop */}
                <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                {/* Dropdown */}
                <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-xl z-50 text-gray-800 overflow-hidden border border-gray-100">
                  <Link
                    href={profileHref}
                    className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-gray-50 transition-colors"
                    onClick={() => setShowMenu(false)}
                  >
                    <span>👤</span>
                    {role === 'admin' ? 'Bantuan Sosial' : 'Profil Saya'}
                  </Link>
                  <div className="border-t border-gray-100" />
                  <button
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-60"
                  >
                    <span>🚪</span>
                    {loggingOut ? 'Keluar...' : 'Keluar'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
