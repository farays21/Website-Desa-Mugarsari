# 🏘️ Website Desa Mugarsari

Website resmi Desa Mugarsari, Kota Tasikmalaya — dibangun dengan **Next.js 15** (App Router), **Supabase**, dan **Tailwind CSS**.

## 🚀 Tech Stack
- Framework: Next.js 15 (App Router)
- Styling: Tailwind CSS  
- Database & Auth: Supabase (PostgreSQL)
- Deployment: Vercel

## 📂 Struktur Proyek
```
app/
├── login/               # Landing page / Login
├── register/            # Registrasi warga
├── home/                # Dashboard User - Home
├── profil-desa/         # Profil Desa
├── kontak/              # Kontak
├── profil/              # Akun & Bantuan Sosial
└── admin/
    ├── home/            # Edit Home
    ├── profil-desa/     # Edit Profil Desa
    ├── kontak/          # Edit Kontak
    └── bantuan-sosial/  # Manajemen Bantuan Sosial
```

## ⚙️ Setup
1. `npm install`
2. Copy `.env.local.example` → `.env.local`, isi Supabase URL & Anon Key
3. Jalankan `supabase/schema.sql` di Supabase SQL Editor
4. Buat admin: `UPDATE profiles SET role = 'admin' WHERE email = 'your@email.com';`
5. `npm run dev`

## 🌐 Deploy ke Vercel
Set env vars `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` di Vercel Dashboard.

*© 2026 Powered by TRIO AZA*
