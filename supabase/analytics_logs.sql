-- Skrip SQL pembuatan tabel riwayat analitik permanen VowSync (SalingPaham)
-- Jalankan satu kali pada menu SQL Editor di dashboard Supabase Anda.

CREATE TABLE IF NOT EXISTS public.analytics_logs (
  room_code TEXT PRIMARY KEY,
  track_tag TEXT NOT NULL,
  host_masked TEXT NOT NULL DEFAULT 'H***',
  guest_masked TEXT,
  guest_joined BOOLEAN NOT NULL DEFAULT FALSE,
  host_answers JSONB NOT NULL DEFAULT '{}'::jsonb,
  guest_answers JSONB NOT NULL DEFAULT '{}'::jsonb,
  host_locked_modules INT[] NOT NULL DEFAULT '{}',
  guest_locked_modules INT[] NOT NULL DEFAULT '{}',
  completed_modules INT[] NOT NULL DEFAULT '{}',
  alignment_score INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analytics_logs_track_tag
  ON public.analytics_logs (track_tag);

CREATE INDEX IF NOT EXISTS idx_analytics_logs_updated_at
  ON public.analytics_logs (updated_at DESC);

ALTER TABLE public.analytics_logs ENABLE ROW LEVEL SECURITY;

-- Berikan hak akses level tabel PostgreSQL kepada role anon & authenticated
-- (wajib dijalankan selain RLS policy agar PostgREST tidak menolak query dengan kode 42501).
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON TABLE public.analytics_logs TO anon, authenticated;

-- Kebijakan akses agar aplikasi klien dapat mencatat (INSERT/UPDATE) log ruang terlacak
-- dan API server Next.js dapat membaca data analitik tanpa menghapus riwayat.
DROP POLICY IF EXISTS "Allow insert tracked analytics logs" ON public.analytics_logs;
CREATE POLICY "Allow insert tracked analytics logs"
  ON public.analytics_logs
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow update tracked analytics logs" ON public.analytics_logs;
CREATE POLICY "Allow update tracked analytics logs"
  ON public.analytics_logs
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow read tracked analytics logs" ON public.analytics_logs;
CREATE POLICY "Allow read tracked analytics logs"
  ON public.analytics_logs
  FOR SELECT
  TO anon, authenticated
  USING (true);

NOTIFY pgrst, 'reload schema';
