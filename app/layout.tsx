import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Website Desa Mugarsari',
  description: 'Website Resmi Desa Mugarsari, Kota Tasikmalaya',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className="min-h-screen flex flex-col bg-white">
        {children}
      </body>
    </html>
  )
}
