-- ============================================================
-- WEBSITE DESA MUGARSARI — SUPABASE SCHEMA
-- Jalankan SELURUH file ini di Supabase SQL Editor (sekali)
-- ============================================================

-- ─────────────────────────────────────────────────────────────
-- 1. PROFILES
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email         TEXT NOT NULL,
  full_name     TEXT,
  nik           TEXT,
  no_kk         TEXT,
  alamat        TEXT,
  no_whatsapp   TEXT,
  role          TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop & recreate policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view own profile"     ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile"   ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile"   ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles"   ON public.profiles;

CREATE POLICY "Users can view own profile"   ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Allow service role to bypass (used by trigger)
CREATE POLICY "Service role full access"     ON public.profiles FOR ALL USING (true) WITH CHECK (true);

-- ─────────────────────────────────────────────────────────────
-- TRIGGER: create profile row on signup
-- Uses UPSERT so no conflict with application code
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'user')
  ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email;   -- safe no-op update
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ─────────────────────────────────────────────────────────────
-- 2. VILLAGE CONTENT
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.village_content (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section     TEXT UNIQUE NOT NULL,
  title       TEXT,
  content     TEXT NOT NULL DEFAULT '',
  image_url   TEXT,
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.village_content ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read village content"    ON public.village_content;
DROP POLICY IF EXISTS "Admins can modify village content"  ON public.village_content;

CREATE POLICY "Anyone can read village content" ON public.village_content
  FOR SELECT USING (true);

CREATE POLICY "Admins can modify village content" ON public.village_content
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Seed
INSERT INTO public.village_content (section, content) VALUES
  ('home_greeting', 'Selamat datang di Desa Mugarsari. Kami berkomitmen untuk melayani masyarakat dengan sebaik-baiknya demi kemajuan dan kesejahteraan bersama.'),
  ('home_history',  'Kelurahan Mugarsari terbentuk pada tanggal 30 Oktober 2003 dengan Perda Kota Tasikmalaya Nomor 30 Tahun 2003. Nama Mugarsari berasal dari kata "Mugar" dan "Sari" yang artinya Pemekaran yang menuju Asri.'),
  ('profil_visi',   'Visi Desa Mugarsari adalah "MELAYANI MASYARAKAT KHUSUSNYA Desa Mugarsari DENGAN SEBAIK-BAIKNYA"'),
  ('profil_misi',   'Untuk terwujudnya visi tersebut ditetapkan dua upaya/cara atau misi:' || chr(10) || '1. MEMAJUKAN DESA DALAM MISI PEMBANGUNAN' || chr(10) || '2. MEMAKMURKAN MASYARAKAT Desa Mugarsari'),
  ('kontak',        '{"phone":"0818216660","hours":"08.00 - 16.00 WIB","email":"mugarsari123@gmail.com","address":"Kelurahan Mugarsari\nKota Tasikmalaya\nJawa Barat"}')
ON CONFLICT (section) DO NOTHING;


-- ─────────────────────────────────────────────────────────────
-- 3. NEWS
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.news (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  content     TEXT,
  image_url   TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Seed news
INSERT INTO public.news (title, content) VALUES
  ('Pendataan Penerima Bansos', 'Informasi bagi seluruh warga Desa Mugarsari mengenai pendataan bantuan sosial. Saat ini, sistem pendataan telah terintegrasi dengan akun profil warga.' || chr(10) || chr(10) || 'Warga yang merasa berhak menerima bantuan diharapkan untuk masuk ke akun masing-masing, melengkapi profil, dan mengisi data pada bagian Bantuan Sosial. Pastikan dokumen pendukung seperti foto Kartu Keluarga dan kondisi rumah sudah siap untuk diunggah.' || chr(10) || chr(10) || 'Proses ini dilakukan secara mandiri untuk menjaga akurasi data dan transparansi penyaluran bantuan.'),
  ('Pembangunan Jalan Baru', 'Proyek pembangunan jalan baru di Dusun Mugarsari telah dimulai sejak awal minggu ini. Pembangunan ini bertujuan untuk meningkatkan aksesibilitas dan memperlancar arus ekonomi warga.' || chr(10) || chr(10) || 'Pemerintah desa memohon maaf atas gangguan lalu lintas yang mungkin terjadi selama proses pengerjaan berlangsung.')
ON CONFLICT DO NOTHING;

ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read news"   ON public.news;
DROP POLICY IF EXISTS "Admins can manage news" ON public.news;

CREATE POLICY "Anyone can read news"   ON public.news FOR SELECT USING (true);
CREATE POLICY "Admins can manage news" ON public.news FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);


-- ─────────────────────────────────────────────────────────────
-- 4. ORGANIZATION MEMBERS
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.organization_members (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  position    TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read org members"    ON public.organization_members;
DROP POLICY IF EXISTS "Admins can manage org members"  ON public.organization_members;

CREATE POLICY "Anyone can read org members"   ON public.organization_members FOR SELECT USING (true);
CREATE POLICY "Admins can manage org members" ON public.organization_members FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

INSERT INTO public.organization_members (name, position) VALUES
  ('Aria Muhammad Fahlevi', 'Kepala Desa'),
  ('Sekretaris Desa',       'Sekretaris Desa'),
  ('Nadiaz',                'Kepala Keuangan'),
  ('Kepala Tata Usaha',     'Tata Usaha'),
  ('Kepala Perencanaan',    'Perencanaan'),
  ('Kepala Pemerintahan',   'Pemerintahan'),
  ('Kepala Pelayanan',      'Pelayanan'),
  ('Kepala Dusun',          'Kepala Dusun')
ON CONFLICT DO NOTHING;


-- ─────────────────────────────────────────────────────────────
-- 5. DEMOGRAPHICS
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.demographics (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  total_penduduk   INTEGER DEFAULT 0,
  total_kk         INTEGER DEFAULT 0,
  total_laki       INTEGER DEFAULT 0,
  total_perempuan  INTEGER DEFAULT 0,
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.demographics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read demographics"   ON public.demographics;
DROP POLICY IF EXISTS "Admins can manage demographics" ON public.demographics;

CREATE POLICY "Anyone can read demographics"   ON public.demographics FOR SELECT USING (true);
CREATE POLICY "Admins can manage demographics" ON public.demographics FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

INSERT INTO public.demographics (total_penduduk, total_kk, total_laki, total_perempuan)
VALUES (5124, 1248, 2562, 2562)
ON CONFLICT DO NOTHING;


-- ─────────────────────────────────────────────────────────────
-- 6. SOCIAL ASSISTANCE
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.social_assistance (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                 UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  nama_kepala_keluarga    TEXT NOT NULL,
  nik_kepala_keluarga     TEXT NOT NULL,
  no_kartu_keluarga       TEXT NOT NULL,
  pendapatan              TEXT,
  alamat                  TEXT,
  no_whatsapp             TEXT,
  foto_kk_url             TEXT,
  foto_rumah_depan_url    TEXT,
  foto_ruang_tamu_url     TEXT,
  foto_kamar_mandi_url    TEXT,
  status                  TEXT NOT NULL DEFAULT 'pending'
                            CHECK (status IN ('pending','approved','rejected')),
  created_at              TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.social_assistance ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own applications"       ON public.social_assistance;
DROP POLICY IF EXISTS "Users can insert own applications"     ON public.social_assistance;
DROP POLICY IF EXISTS "Admins can manage all applications"    ON public.social_assistance;

CREATE POLICY "Users can view own applications"
  ON public.social_assistance FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own applications"
  ON public.social_assistance FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all applications"
  ON public.social_assistance FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );


-- ─────────────────────────────────────────────────────────────
-- CARA BUAT ADMIN PERTAMA
-- Jalankan ini SETELAH mendaftar akun lewat /register
-- Ganti 'your@email.com' dengan email Anda
-- ─────────────────────────────────────────────────────────────
-- UPDATE public.profiles SET role = 'admin' WHERE email = 'your@email.com';


-- ─────────────────────────────────────────────────────────────
-- TRIGGER UPDATE: simpan full_name dari metadata registrasi
-- Ganti trigger lama yang hanya menyimpan id & email
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',  -- dari signUp options.data
    'user'
  )
  ON CONFLICT (id) DO UPDATE
    SET email     = EXCLUDED.email,
        full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name);
  RETURN NEW;
END;
$$;

-- ─────────────────────────────────────────────────────────────
-- UNTUK SUPABASE DASHBOARD:
-- Authentication > URL Configuration > Site URL
--   → Set ke: http://localhost:3000 (dev) atau https://yourdomain.vercel.app (prod)
-- Authentication > URL Configuration > Redirect URLs
--   → Tambahkan: http://localhost:3000/auth/callback
--   → Tambahkan: https://yourdomain.vercel.app/auth/callback
--
-- Authentication > Providers > Email
--   → "Confirm email": NONAKTIFKAN untuk development
--      (aktifkan kembali saat production)
-- ─────────────────────────────────────────────────────────────
