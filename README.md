# VowSync (SalingPaham)

> Platform penyelarasan kesepakatan pra-nikah berbasis mekanisme Dual-Blind untuk pasangan di Indonesia.

[![Next.js](https://img.shields.io/badge/Next.js-16.4.0-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.3.0-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## Daftar Isi

1. [Latar Belakang & Masalah](#latar-belakang--masalah)
2. [Solusi: Mekanisme Dual-Blind](#solusi-mekanisme-dual-blind)
3. [Tautan Proyek](#tautan-proyek)
4. [Fitur Utama](#fitur-utama)
5. [Arsitektur Data Dinamis, CRUD & UX States](#arsitektur-data-dinamis-crud--ux-states)
6. [Kurikulum 4 Pilar Inti & Modul Kustom (MOD-05)](#kurikulum-4-pilar-inti--modul-kustom-mod-05)
7. [Panduan Uji Coba Cepat](#panduan-uji-coba-cepat)
8. [Struktur Folder Proyek](#struktur-folder-proyek)
9. [Panduan Instalasi & Konfigurasi Lokal](#panduan-instalasi--konfigurasi-lokal)
10. [Catatan Pengembangan & Perbaikan Teknis](#catatan-pengembangan--perbaikan-teknis)
11. [Spesifikasi Teknis](#spesifikasi-teknis)

---

## Latar Belakang & Masalah

Banyak calon pengantin di Indonesia menunda pembicaraan sensitif menjelang pernikahan, mulai dari keterbukaan saldo tabungan, cicilan bawaan, tunjangan orang tua (*sandwich generation*), aturan tinggal bersama mertua, pembagian tugas domestik, hingga batas etika saat bertengkar.

Diskusi tatap muka langsung sering terdistorsi oleh *pleasing-bias*: salah satu pihak mengiyakan pilihan pasangannya demi menghindari ketegangan sesaat, sehingga perbedaan prinsip baru muncul setelah akad nikah.

---

## Solusi: Mekanisme Dual-Blind

VowSync (SalingPaham) memfasilitasi penyelarasan pra-nikah melalui empat tahap terstruktur:

1. **Pengerjaan Tersegel (Blind Phase):** Masing-masing pasangan menjawab skenario dilema secara mandiri di perangkatnya tanpa dapat melihat pilihan pasangan.
2. **Ruang Tunggu Sinkronisasi:** Jawaban dikunci di balik segel hingga kedua pihak menekan tombol kunci jawaban pada modul terkait.
3. **Pembukaan Segel Serentak (Dual Reveal):** Setelah kedua kunci terverifikasi, aplikasi menampilkan peta kecocokan, rincian per kategori, perbandingan jawaban esai terbuka, serta daftar topik yang berbeda pendapat untuk dirumuskan jalan tengahnya.
4. **Pengesahan Piagam Pra-Nikah:** Klausul kesepakatan dan rumusan kompromi dituangkan ke dalam dokumen **Piagam Kesepakatan Pra-Nikah** (Pasal I s.d. Pasal V), ditandatangani pada kanvas digital oleh Host dan Guest, lalu siap dicetak atau disimpan sebagai PDF ukuran A4.

---

## Tautan Proyek

| Keterangan | Tautan |
| :--- | :--- |
| Repositori GitHub Publik | `https://github.com/piskalll/blind-alignment` |
| Live Deployment (Vercel) | `https://blind-alignment.vercel.app` |
| Desain Awal UI/UX (Figma) | `https://www.figma.com/design/0GToZAzRJGdamea001EyYX/Untitled?node-id=28-219&t=IwgDTyoCMfj2XUij-1` |

---

## Fitur Utama

### 1. Ruang Privat 2 Arah & Proteksi PIN 4 Digit
Pembuatan kode ruang unik (`VWS-XXX` atau `VWS-<TAG>-XXX`) dilengkapi PIN rahasia 4 digit dan pembagian undangan langsung ke WhatsApp. Setiap ruang dibatasi untuk dua peserta (Host dan Guest) dengan sinkronisasi otomatis melalui Supabase Realtime dan mekanisme *fallback* ke `localStorage`.

### 2. Kurikulum Berjenjang 4 Pilar (40 Skenario Standar)
Modul 1 terbuka sejak awal, sedangkan Modul 2, 3, dan 4 terbuka secara berurutan setelah modul sebelumnya selesai disahkan pada halaman Piagam Kesepakatan. Beberapa skenario finansial dan anggaran domestik juga dilengkapi penggeser nominal Rupiah (`slider`) serta kolom catatan pertimbangan pribadi.

### 3. Studio CRUD Pertanyaan Kustom Pasangan (`MOD-05`)
Tersedia di rute `/room/[code]/custom` dan langsung terbuka sejak ruang dibuat tanpa harus menamatkan Modul 1 s.d. 4 terlebih dahulu:
- Pasangan dapat menyusun bersama hingga **15 pertanyaan kustom** per ruang.
- Mendukung dua format pertanyaan:
  - **Pilihan Ganda (`A / B / C`):** Dihitung ke dalam persentase keselarasan dan memicu perumusan kompromi bila pilihan berseberangan.
  - **Esai Terbuka:** Dijawab secara bebas di balik segel Dual-Blind, lalu ditampilkan berdampingan pada halaman Hasil tanpa mendistorsi skor persentase buatan, lengkap dengan tombol perumusan klausul ke **Piagam Pasal V**.
- Aturan integritas segel saat kolaborasi: menambah soal baru membuka kembali segel `MOD-05` tanpa menghapus jawaban soal lain; menyunting soal menaikkan nomor versi (`v1`, `v2`, dst.) dan mereset jawaban khusus pada soal yang diubah; menghapus soal mencatat ID ke `deletedCustomIds` agar tidak muncul kembali saat sinkronisasi lintas perangkat.

### 4. Panel Analytics & Riwayat Sesi Anonim (`/analytics`)
Halaman analitik khusus pemilik aplikasi yang dilindungi PIN server (`ANALYTICS_ADMIN_PIN`) melalui cookie `HttpOnly` bertanda tangan HMAC-SHA256:
- Mencatat jumlah pengguna dan penyelesaian modul baik dari pengunjung umum (`#PUBLIK`) maupun tautan kohort/riset khusus (`/?track=uji` menghasilkan kode `VWS-UJI-XXX`).
- Menjaga privasi pasangan: nama peserta disamarkan (`B***`), hanya menyimpan kunci opsi `A/B/C` pada skenario standar `1..40`, dan tidak pernah merekam catatan pribadi, tanda tangan, isi pertanyaan kustom, maupun teks jawaban esai ke tabel analitik.
- Menampilkan corong penyelesaian Modul 1 s.d. 4, daftar skenario yang paling sering memicu perbedaan pilihan, distribusi opsi `A / B / C` per skenario, serta metrik adopsi agregat `MOD-05`.

### 5. Kanvas Tanda Tangan Digital & Cetak Piagam A4
Mendukung tanda tangan kursor maupun layar sentuh ponsel untuk kedua pihak, dilengkapi stempel waktu pengesahan, ringkasan hash sesi SHA-256 lokal, serta tata letak cetak A4 bersih untuk Pasal I s.d. Pasal V.

### 6. Navigasi Editorial, Tema Terang/Gelap & Aksesibilitas WCAG AA
- Halaman beranda memiliki navigasi khusus dengan indikator progres baca dan koreografi perpindahan antar bagian `01` s.d. `04` yang menghormati `prefers-reduced-motion: reduce`.
- Mendukung Mode Terang (*Warm Editorial Paper*) dan Mode Gelap (*Night Reading Mode*) dengan rasio kontras terverifikasi minimal `4.5:1` untuk teks normal dan target sentuh minimal `44x44px` di perangkat mobile.

---

## Arsitektur Data Dinamis, CRUD & UX States

### 1. Siklus CRUD Sesi Ruang (`public.rooms`)
Diimplementasikan pada `app/lib/sessionStore.ts` dengan cadangan otomatis ke penyimpanan peramban bila koneksi luring:
- **Create:** `createRoomAsync()` membuat kode ruang, PIN 4 digit, serta state awal Host di tabel `public.rooms` Supabase.
- **Read:** `fetchRoomsFromSupabase()` dan `pullRoomFromSupabase()` menarik daftar sesi serta menyatukan progres jawaban Host dan Guest secara periodik maupun *real-time*.
- **Update:** `joinRoomAsync()`, `saveAnswer()`, `lockAnswers()`, `saveCompromise()`, `saveSignature()`, dan `markModuleCompleted()` memperbarui dokumen status ruang di Supabase.
- **Delete:** `deleteRoomAsync()` menghapus sesi ruang dari Supabase sekaligus membersihkan penyimpanan lokal.

### 2. Siklus CRUD Bank Soal Kustom (`MOD-05`)
Diimplementasikan pada `app/lib/sessionStore.ts` dan antarmuka `app/components/CustomQuestionsStudioPage.tsx`:
- **Create:** `addCustomScenario()` memvalidasi input, menetapkan ID sekuensial `1001+`, menambah pertanyaan ke ruang, dan menaikkan `customModuleRevision`.
- **Read & Filter:** Daftar soal kustom dirender dinamis dan dapat difilter berdasarkan tipe (`Semua`, `Pilihan A/B/C`, `Esai Terbuka`).
- **Update:** `updateCustomScenario()` memperbarui isi pertanyaan, menaikkan `version`, dan membersihkan jawaban lama khusus pada soal tersebut.
- **Delete:** `deleteCustomScenario()` menghapus soal melalui dialog konfirmasi yang dapat ditutup dengan `Escape` dan menyimpan tombstone ID pada `deletedCustomIds`.

### 3. Penanganan UX States Lengkap
- **Loading State:** Indikator pemuatan sesi ruang (`animate-pulse` dan *spinner* tombol) saat verifikasi PIN, pembuatan ruang, penyegaran daftar ruang, maupun pemeriksaan akses `/analytics`.
- **Empty State:** Tampilan informatif saat kata kunci pencarian skenario tidak ditemukan, saat daftar ruang belum tersedia, saat bank soal kustom `MOD-05` masih kosong, dan saat segel pasangan belum terbuka.
- **Error & Validation State:** Pesan kesalahan *inline* (`role="alert"`) pada validasi nama, format kode ruang, kecocokan PIN, kapasitas ruang penuh (`ROOM_FULL`), kelengkapan opsi soal kustom, serta panduan SQL otomatis apabila tabel atau izin `GRANT` di Supabase belum dijalankan.
- **Toast Notification:** Umpan balik instan menggunakan pustaka `sonner` pada aksi simpan, salin tautan/PIN, pembaruan soal kustom, dan penghapusan data.

---

## Kurikulum 4 Pilar Inti & Modul Kustom (MOD-05)

| Modul | Kode | Sifat Akses | Judul Modul | Cakupan Topik |
| :---: | :---: | :---: | :--- | :--- |
| **01** | `MOD-01` | Terbuka sejak awal | Prinsip & Transparansi Finansial | Cicilan bawaan, batas rasio utang, tunjangan orang tua, dana darurat medis, dan akses rekening bersama (10 skenario). |
| **02** | `MOD-02` | Berjenjang (pasca Pasal I) | Mertua, Keluarga Besar & Batasan Privat | Tempat tinggal tahun pertama, kunci cadangan rumah, perawatan lansia, rotasi hari raya, dan privasi kamar utama (10 skenario). |
| **03** | `MOD-03` | Berjenjang (pasca Pasal II) | Pembagian Peran, Pengasuhan & Karier | Tugas domestik pasangan bekerja, pengasuhan pasca cuti lahir, relokasi karier, studi lanjut, dan waktu pribadi (10 skenario). |
| **04** | `MOD-04` | Berjenjang (pasca Pasal III) | Keintiman Emosional & Etika Resolusi Konflik | Privasi gawai, jeda tenang saat berdebat, pantangan *silent treatment*, batasan media sosial, dan jadwal evaluasi bulanan (10 skenario). |
| **05** | `MOD-05` | Bebas urutan | Pertanyaan Kustom Pasangan | Hingga 15 soal buatan pasangan sendiri (Pilihan A/B/C atau Esai Terbuka) yang disahkan pada Piagam Pasal V. |

---

## Panduan Uji Coba Cepat

1. **Mode Simulasi Instan (`VWS-DEMO`):**
   - Buka halaman beranda `/`, lalu klik tombol **Coba Simulasi** pada bilah navigasi atau bagian Hero untuk masuk ke ruang contoh pasangan tanpa perlu membuat akun.
2. **Uji Alur 2 Perangkat / 2 Jendela Peramban:**
   - Pada jendela pertama, buat ruang baru di panel **Mulai Sesi** untuk memperoleh Kode Ruang `VWS-XXX` dan PIN 4 digit.
   - Buka jendela *Incognito* kedua, pilih tab **Gabung Ruang Pasangan**, lalu masukkan Kode Ruang dan PIN tersebut.
3. **Uji CRUD Pertanyaan Kustom (`MOD-05`):**
   - Dari Dashboard ruang, klik **Bank Soal Kustom** (atau menu **Soal Kustom** di header) untuk membuka `/room/[code]/custom`.
   - Buat 1 soal tipe **Pilihan Ganda (A / B / C)** dan 1 soal tipe **Esai Terbuka** (tersedia tombol contoh draf cepat), uji fitur **Edit** serta **Hapus**, lalu klik **Mulai Jawab MOD-05** pada kedua jendela hingga segel terbuka dan sahkan ke **Pasal V**.
4. **Uji Pencarian Kurikulum & Panel Analytics:**
   - Gulir beranda ke bagian **03 / Kurikulum 4 Pilar** untuk menguji filter modul dan pencarian kata kunci *real-time*.
   - Buka `/analytics` dan masukkan `ANALYTICS_ADMIN_PIN` untuk melihat metrik pengguna, distribusi jawaban anonim, serta pembuat tautan batch `?track=...`.

---

## Struktur Folder Proyek

```text
blind-alignment/
├── app/
│   ├── analytics/
│   │   └── page.tsx                     # Rute halaman panel analitik admin (/analytics)
│   ├── api/
│   │   └── analytics/
│   │       └── route.ts                 # Endpoint autentikasi PIN HMAC & agregasi log sesi
│   ├── components/
│   │   ├── AlignmentResultPage.tsx      # Hasil buka segel, skor A/B/C, esai berdampingan & modal kompromi
│   │   ├── AnalyticsDashboardPage.tsx   # Antarmuka analitik penggunaan, sebaran opsi & adopsi MOD-05
│   │   ├── AppHeader.tsx                # Header sesi 2 tingkat, pemilih modul M1..M5 & tema
│   │   ├── BrandLogo.tsx                # Komponen identitas logo VowSync
│   │   ├── CustomQuestionsStudioPage.tsx# Studio CRUD kolaboratif pertanyaan kustom pasangan (MOD-05)
│   │   ├── DashboardPage.tsx            # Dashboard progres segel 4 modul inti + kartu ledger MOD-05
│   │   ├── DesignSystemShowcase.tsx     # Komponen referensi sistem desain internal
│   │   ├── DilemmaRunnerPage.tsx        # Lembar pengerjaan skenario A/B/C, slider IDR & esai tersegel
│   │   ├── FinalCharterPage.tsx         # Piagam Kesepakatan Pasal I..V & kanvas tanda tangan
│   │   ├── JoinRoomPage.tsx             # Landing page 4 bagian, akses ruang CRUD, simulator & FAQ
│   │   ├── MicrosoftClarity.tsx         # Integrasi skrip observabilitas Microsoft Clarity (opsional)
│   │   ├── ModuleIntroPage.tsx          # Pemeriksaan kesiapan pra-pengisian modul
│   │   ├── SignaturePad.tsx             # Kanvas tanda tangan digital (mouse & touch)
│   │   ├── VisualIllustrations.tsx      # Ilustrasi vektor SVG fungsional (Hero, Pilar M1..M5, Brankas, Donut)
│   │   └── WaitingRevealPage.tsx        # Ruang tunggu sinkronisasi segel & pengingat WhatsApp
│   ├── data/
│   │   └── scenarios.ts                 # Definisi tipe, 40 skenario standar & metadata MOD-01..MOD-05
│   ├── lib/
│   │   ├── analyticsLogger.ts           # Sanitasi log anonim, penyamaran nama & tag batch (?track=)
│   │   ├── charterGenerator.ts          # Generator dokumen cetak A4 & hash SHA-256 lokal
│   │   ├── scoring.ts                   # Perhitungan kecocokan A/B/C & pemisahan esai terbuka
│   │   ├── sessionStore.ts              # Sinkronisasi Supabase Realtime, CRUD ruang, CRUD soal kustom & hook useRoom
│   │   └── supabase.ts                  # Inisialisasi klien @supabase/supabase-js
│   ├── room/
│   │   └── [code]/
│   │       ├── charter/page.tsx         # Rute Piagam Kesepakatan (/room/[code]/charter)
│   │       ├── custom/page.tsx          # Rute Studio Soal Kustom (/room/[code]/custom)
│   │       ├── dilemma/page.tsx         # Rute pengerjaan skenario (/room/[code]/dilemma)
│   │       ├── intro/page.tsx           # Rute pengantar modul (/room/[code]/intro)
│   │       ├── result/page.tsx          # Rute perbandingan jawaban (/room/[code]/result)
│   │       ├── waiting/page.tsx         # Rute ruang tunggu segel (/room/[code]/waiting)
│   │       └── page.tsx                 # Rute dashboard ruang (/room/[code])
│   ├── globals.css                      # Token warna kertas editorial, tema gelap, fokus WCAG & transisi
│   ├── layout.tsx                       # Root layout Next.js, pemuatan font & Sonner Toaster
│   └── page.tsx                         # Rute beranda utama (/)
├── public/                              # Aset gambar logo & ikon statis
├── supabase/
│   └── analytics_logs.sql               # Skema SQL & kebijakan RLS untuk tabel public.analytics_logs
├── DESIGN.md                            # Dokumentasi arah desain, sistem warna, tipografi & dial antislop
├── next.config.ts                       # Konfigurasi Next.js 16 (Cache Components aktif)
├── package.json                         # Daftar dependensi & skrip npm
├── tsconfig.json                        # Konfigurasi kompilator TypeScript
└── README.md                            # Dokumentasi proyek
```

---

## Panduan Instalasi & Konfigurasi Lokal

### Prasyarat
- **Node.js** versi `20.9.0` atau lebih baru.
- **npm** (atau `pnpm` / `yarn`).
- Proyek **Supabase** aktif (opsional untuk pengembangan luring, wajib untuk sinkronisasi 2 perangkat dan panel `/analytics`).

### Langkah Menjalankan

1. **Kloning repositori & masuk ke direktori proyek:**
   ```bash
   git clone https://github.com/piskalll/blind-alignment.git
   cd blind-alignment
   ```

2. **Pasang dependensi:**
   ```bash
   npm install
   ```

3. **Siapkan variabel lingkungan pada berkas `.env.local`:**
   ```env
   # Koneksi Supabase (sinkronisasi ruang & log analitik)
   NEXT_PUBLIC_SUPABASE_URL=https://<project-id>.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<supabase-anon-key>

   # PIN Rahasia khusus halaman /analytics (hanya dibaca di sisi server)
   ANALYTICS_ADMIN_PIN=pin-admin-pilihan-anda

   # Opsional: kunci service role untuk pembacaan analitik server & ID Microsoft Clarity
   SUPABASE_SERVICE_ROLE_KEY=
   NEXT_PUBLIC_CLARITY_PROJECT_ID=
   ```

4. **Siapkan tabel database di Supabase SQL Editor:**
   - Pastikan tabel `public.rooms` tersedia (`code TEXT PRIMARY KEY`, `passcode TEXT`, `host_name TEXT`, `guest_name TEXT`, `status TEXT`, `completed_modules INT[]`, `created_at TIMESTAMPTZ DEFAULT NOW()`) beserta izin RLS untuk `anon` dan `authenticated`.
   - Jalankan skrip pada berkas [`supabase/analytics_logs.sql`](supabase/analytics_logs.sql) di **Supabase SQL Editor** untuk menyiapkan tabel `public.analytics_logs` (panel `/analytics` juga menampilkan skrip ini secara otomatis apabila tabel belum dibuat).

5. **Jalankan server pengembangan:**
   ```bash
   npm run dev
   ```
   Buka [http://localhost:3000](http://localhost:3000) di peramban.

6. **Pemeriksaan tipe TypeScript & build produksi:**
   ```bash
   node node_modules/typescript/bin/tsc --noEmit
   npm run build
   ```

---

## Catatan Pengembangan & Perbaikan Teknis

1. **Kebijakan RLS & Izin `GRANT` PostgreSQL pada Supabase:**
   Mengatasi galat `42501 (permission denied)` pada peran `anon` dengan menyertakan perintah `GRANT SELECT, INSERT, UPDATE` eksplisit di [`supabase/analytics_logs.sql`](supabase/analytics_logs.sql) serta deteksi mandiri di halaman `/analytics` bila izin tabel belum diaktifkan.
2. **Konvergensi Sinkronisasi Kolaboratif Soal Kustom (`MOD-05`):**
   Penggabungan state `Set` biasa antar dua perangkat dapat memunculkan kembali soal yang sudah dihapus atau mengunci ulang modul yang baru ditambah soalnya. Masalah ini diatasi pada `sessionStore.ts` menggunakan pelacak `deletedCustomIds`, stempel `questionVersion` pada setiap jawaban, dan pencocokan `customLockedRevision` terhadap `customModuleRevision`.
3. **Hidratasi Sinkron & Kompatibilitas Next.js 16 Cache Components:**
   Seluruh komponen pembaca parameter URL (`useSearchParams` dan `params` asinkron) dibungkus dalam batas `<Suspense>` agar kompatibel dengan fitur *Partial Prerendering / Cache Components* di Next.js `16.4.0`, sementara `useRoom` menggunakan inisialisasi sinkron untuk mencegah kedipan kode ruang kosong.
4. **Kepatuhan Kontras Warna Mode Terang & Mode Gelap:**
   Seluruh kartu, lencana status, dan bilah distribusi analitik dipetakan ke variabel warna di [`app/globals.css`](app/globals.css) dan diuji menggunakan skrip kontras WCAG 2.x sehingga tetap terbaca jelas pada kedua tema.

---

## Spesifikasi Teknis

- **Framework:** Next.js `16.4.0` (App Router, Turbopack, Cache Components)
- **UI Library:** React `19.3.0`
- **Bahasa:** TypeScript `5`
- **Styling:** Tailwind CSS `4` + Custom Editorial Theme Variables
- **Database & Realtime:** Supabase PostgreSQL (`@supabase/supabase-js`) + Web Storage Fallback (`localStorage` & `sessionStorage`)
- **Ikon & Notifikasi:** `lucide-react` & `sonner`
- **Observabilitas (Opsional):** `@microsoft/clarity`
- **Ekspor Dokumen:** Native Browser Print Engine A4 (`@page { size: A4 }`) + Web Crypto API (`SHA-256`)

---

## Lisensi

Didistribusikan di bawah lisensi [MIT](LICENSE).
