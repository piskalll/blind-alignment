# VowSync (SalingPaham)
> **Platform Keselarasan Pra-Nikah Berbasis Mekanisme Dual-Blind untuk Pasangan di Indonesia**

[![Next.js](https://img.shields.io/badge/Next.js-16.4-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## Daftar Isi
1. [Latar Belakang & Masalah](#latar-belakang--masalah)
2. [Solusi: Mekanisme Dual-Blind](#solusi-mekanisme-dual-blind)
3. [Tautan Proyek](#tautan-proyek)
4. [Dokumentasi Upgrade Modul 8 (Data Dinamis, Form, CRUD & UX States)](#dokumentasi-upgrade-modul-8-data-dinamis-form-crud--ux-states)
5. [Panduan Uji Coba Fitur untuk Mentor (Modul 8)](#panduan-uji-coba-fitur-untuk-mentor-modul-8)
6. [Fitur Utama](#fitur-utama)
7. [Kurikulum 4 Pilar (40 Skenario Nyata)](#kurikulum-4-pilar-40-skenario-nyata)
8. [Struktur Folder Proyek](#struktur-folder-proyek)
9. [Panduan Instalasi & Menjalankan di Lokal](#panduan-instalasi--menjalankan-di-lokal)
10. [Log Prompt AI & Catatan Perbaikan Manual](#log-prompt-ai--catatan-perbaikan-manual)
11. [Spesifikasi Teknis](#spesifikasi-teknis)

---

## Latar Belakang & Masalah

Banyak calon pasangan pengantin di Indonesia menunda atau menghindari pembicaraan sensitif menjelang pernikahan, seperti:
- Keterbukaan saldo tabungan, utang bawaan, dan jatah bulanan orang tua/mertua (*sandwich generation*).
- Batasan privasi keluarga besar, aturan tinggal bersama, dan intervensi pihak ketiga.
- Kesiapan mental serta pembagian waktu kerja saat memiliki anak.
- Pembagian beban domestik harian dan protokol menyelesaikan pertengkaran.

Diskusi tatap muka langsung sering kali terdistorsi oleh ***pleasing-bias***, di mana salah satu pihak cenderung mengalah demi menghindari ketegangan sesaat, sehingga potensi konflik tertimbun dan baru meledak setelah akad nikah.

---

## Solusi: Mekanisme Dual-Blind

**VowSync (SalingPaham)** menyelesaikan masalah tersebut dengan mekanisme **Dual-Blind**:
1. **Pengerjaan Tersegel (Blind Phase):** Masing-masing pihak menjawab 10 dilema skenario secara mandiri tanpa bisa mengintip jawaban pasangannya.
2. **Ruang Tunggu Sinkronisasi:** Sistem mengunci jawaban yang telah dipilih hingga kedua pihak menekan tombol *Kunci Jawaban*.
3. **Buka Segel Serentak (Dual Reveal):** Peta jawaban dibuka serentak. Sistem mengelompokkan hasil menjadi:
   - **Poin Selaras:** Pilihan identik yang langsung menjadi kesepakatan bersama.
   - **Poin Diskusi:** Pilihan berbeda yang mewajibkan kedua pihak merumuskan jalan tengah (kompromi).
4. **Pengesahan Piagam:** Hasil rekonsiliasi dituangkan ke dalam **Piagam Kesepakatan Pra-Nikah** yang ditandatangani oleh kedua pihak melalui kanvas digital dan dapat dicetak/diunduh dalam format PDF.

---

## Tautan Proyek

| Keterangan Berkas / Layanan | Tautan |
| :--- | :--- |
| **Repositori GitHub Publik** | `https://github.com/piskalll/blind-alignment` |
| **Branch Pengembangan Modul 8** | `modul-8` (Digabungkan ke `main` melalui Pull Request) |
| **Live Web Deployment (Vercel)** | *(Isi dengan URL Vercel Anda, contoh: `https://blind-alignment.vercel.app`)* |
| **Desain UI/UX (Figma)** | `https://www.figma.com/design/0GToZAzRJGdamea001EyYX/Untitled?node-id=28-219&t=IwgDTyoCMfj2XUij-1` |

---

## Dokumentasi Upgrade Modul 8 (Data Dinamis, Form, CRUD & UX States)

Pada Modul 8, aplikasi **VowSync (SalingPaham)** ditingkatkan dari prototipe tampilan menjadi aplikasi web dua arah (*Two-Way Web Application*) yang terhubung dengan database cloud dan memiliki siklus CRUD penuh:

### 1. Sumber Data Dinamis & Operasi CRUD (`Supabase PostgreSQL` + `scenarios.ts`)
- **Sumber Data Sesi Pasangan (Cloud Database CRUD):** Menggunakan **Supabase (PostgreSQL)** pada tabel `public.rooms` yang diakses melalui `@supabase/supabase-js` di [`app/lib/supabase.ts`](app/lib/supabase.ts) dan [`app/lib/sessionStore.ts`](app/lib/sessionStore.ts), dilengkapi *fallback* otomatis ke `localStorage` jika jaringan terputus:
  - **Create (`INSERT`):** Fungsi `createRoomAsync()` menyimpan ruang baru (Kode Ruang `VWS-XXX`, 4-digit PIN, dan objek data Host) langsung ke tabel `rooms` di Supabase.
  - **Read (`SELECT`):** Fungsi `fetchRoomsFromSupabase()` menarik daftar sesi ruang terbaru dari database Supabase saat halaman utama dimuat maupun saat tombol *Refresh* diklik.
  - **Update (`UPDATE`):** Fungsi `joinRoomAsync()` memverifikasi PIN terhadap data di Supabase dan memperbarui kolom `guest` saat pasangan bergabung.
  - **Delete (`DELETE`):** Fungsi `deleteRoomAsync()` menghapus sesi ruang dari tabel `rooms` Supabase sekaligus membersihkan penyimpanan lokal.
- **Sumber Data Kurikulum & Looping Dinamis (`.map()`):** Seluruh 40 kartu skenario pra-nikah dan 4 tab modul dirender secara dinamis menggunakan `.map()` dari struktur data terpusat di [`app/data/scenarios.ts`](app/data/scenarios.ts) tanpa duplikasi kode manual (*hardcode*).
- **Fitur Search & Filter Kategori Real-Time:** Dilengkapi bilah pencarian kata kunci (`searchKeyword`) dan filter kategori 4 pilar modul (`MOD-01` s.d. `MOD-04`) yang menyaring daftar skenario secara instan di layar.

### 2. Layanan Formulir Interaktif, Validasi & Sanitasi Input
Terdapat **3 alur formulir interaktif utama** yang terhubung langsung ke state dan database Supabase:
1. **Form Buat Ruang Sesi Baru (`handleCreateRoom` di [`app/components/JoinRoomPage.tsx`](app/components/JoinRoomPage.tsx)):**
   - Sanitasi input menggunakan `.trim()`.
   - Validasi mencegah input kosong dan mewajibkan minimal 2 karakter, dengan pesan error *inline* tepat di bawah kolom input.
2. **Form Gabung Ruang Pasangan (`handleJoinRoom` di [`app/components/JoinRoomPage.tsx`](app/components/JoinRoomPage.tsx)):**
   - Validasi berlapis per kolom: Nama Panggilan (wajib & minimal 2 karakter), Kode Ruang (wajib berformat `VWS-XXX`), dan PIN Rahasia (wajib minimal 4 digit).
   - Validasi asinkron ke Supabase untuk mengecek apakah ruang ditemukan (`NOT_FOUND`), PIN sesuai (`WRONG_PIN`), atau kapasitas 2 pasangan sudah penuh (`ROOM_FULL`).
3. **Form Rumusan Kompromi Pasangan (`saveCompromise` di [`app/components/AlignmentResultPage.tsx`](app/components/AlignmentResultPage.tsx)):**
   - Memungkinkan pasangan memilih templat jalan tengah atau menulis klausul kompromi kustom yang langsung dimasukkan ke dokumen Piagam Kesepakatan.

### 3. Kelengkapan UX States (Loading Skeleton, Empty State, Error State & Toast)
- **Loading State (Skeleton & Spinner):**
  - *Skeleton Loading* berdenyut (`animate-pulse`) pada panel **Sesi Ruang Pasangan** saat menarik data dari Supabase (`isLoadingRooms`).
  - Tombol submit formulir otomatis terkunci (`disabled`) dengan ikon *spinner* berputar (`Menyimpan ke Supabase & Mengunci PIN...` / `Memverifikasi PIN ke Supabase...`) saat proses pengiriman berlangsung.
- **Empty State (Saat Hasil Pencarian / Data Kosong):**
  - Jika kata kunci pencarian skenario tidak ditemukan, tampil kartu *Empty State* informatif: *"Yah, skenario tidak ditemukan dengan kata kunci '...'"* beserta tombol **Reset Pencarian**.
  - Jika daftar ruang kosong, tampil kartu *Empty State* dengan tombol pintasan **Aktifkan Ruang Simulasi VWS-DEMO**.
- **Error State (Penanganan Gagal Koneksi / Input Salah):**
  - Seluruh panggilan API Supabase dibungkus dalam blok `try / catch` dengan pesan yang ramah pengguna dan mekanisme *fallback* ke penyimpanan lokal agar aplikasi tidak pernah mengalami *crash*.
- **Toast Notification (`sonner`):**
  - Menggantikan `alert()` bawaan peramban dengan pop-up notifikasi halus dari pustaka **Sonner** (`toast.success` & `toast.error`) saat berhasil membuat ruang, bergabung ke ruang, atau menghapus sesi dari Supabase.

---

## Panduan Uji Coba Fitur untuk Mentor (Modul 8)

Mentor dapat menguji seluruh fungsionalitas Modul 8 secara langsung melalui halaman beranda (`/`):

1. **Menguji Search, Filter Kategori & Empty State (Data Dinamis):**
   - Gulir ke bagian **03 / Kurikulum 4 Pilar & 40 Skenario Nyata** (`#empat-pilar`).
   - Klik tab **MOD-01**, **MOD-02**, **MOD-03**, atau **MOD-04** untuk memfilter kategori modul.
   - Ketik kata kunci seperti `"mertua"` atau `"cicilan"` pada kolom pencarian untuk melihat penyaringan *real-time*.
   - Ketik kata acak (misal: `"xyz123"`) untuk memunculkan tampilan **Empty State** dan klik tombol **Reset Pencarian**.
2. **Menguji Form Interaktif, Validasi Input, Loading Spinner & Toast Notification:**
   - Pada bagian atas kanan (**Terminal Ruang Privat**), pilih tab **Buat Ruang Baru**.
   - Coba masukkan 1 huruf saja (misal: `"A"`) lalu klik submit untuk melihat **pesan error validasi inline** di bawah input.
   - Masukkan nama valid (misal: `"Bima"`) lalu klik **Buat Kode Ruang & 4-Digit PIN**. Perhatikan perubahan tombol menjadi *Loading Spinner*, diikuti kemunculan **Toast Notification (Sonner)** dan kartu Kode Ruang + PIN.
   - Pindah ke tab **Gabung Ruang Pasangan**, coba masukkan kode ruang dengan format salah (misal: `"ABC"`) untuk menguji validasi format `VWS-XXX`.
3. **Menguji Read & Delete Database Supabase + Loading Skeleton:**
   - Pada kartu **Sesi Ruang Pasangan** di bawah form terminal, klik ikon **Refresh (Muat Ulang)** untuk melihat animasi **Loading Skeleton** saat aplikasi menarik daftar sesi dari tabel `rooms` Supabase.
   - Klik ikon **Trash (Hapus)** pada salah satu sesi ruang untuk menguji operasi `DELETE` ke Supabase beserta pop-up *Toast Notification*.
4. **Menguji Alur Lengkap 1-Klik (`VWS-DEMO`):**
   - Klik tombol **Buka Ruang Simulasi** di pojok kanan atas atau bilah pintasan di bawah diagram alur untuk langsung menguji halaman *Dashboard*, *Pengantar*, *10 Skenario*, *Ruang Tunggu*, *Hasil & Form Kompromi*, hingga *Piagam PDF*.

---

## Fitur Utama

### 1. Terminal Ruang Privat & Proteksi 4-Digit PIN
- Pembuatan kode ruang unik otomatis (contoh: `VWS-482`) beserta 4-digit PIN rahasia.
- Pembatasan ketat maksimal 2 pengguna (1 Host & 1 Guest). Pihak ketiga otomatis ditolak.
- Integrasi tombol WhatsApp untuk membagikan kode ruang dan tautan masuk secara instan.

### 2. Alur Pembukaan Modul Berjenjang (Sequential Module Lock)
- Modul 2, 3, dan 4 berada dalam kondisi terkunci saat sesi baru dimulai.
- Modul berikutnya baru terbuka setelah modul aktif selesai dikerjakan dan Piagam Kesepakatannya telah ditandatangani oleh kedua pihak.

### 3. Kanvas Tanda Tangan Digital (Signature Pad)
- Kanvas responsif yang mendukung masukan kursor mouse pada desktop serta gestur sentuhan pada layar *smartphone*.
- Fitur *Clear Canvas* dan verifikasi ganda tanda tangan Host dan Guest sebelum piagam dapat dicetak.

### 4. Ekspor Dokumen Resmi Piagam Pra-Nikah (PDF)
- Halaman piagam terintegrasi dengan gaya cetak khusus (*print media query*) sehingga rapi dan siap disimpan sebagai PDF arsip keluarga.

### 5. Mode Uji Coba Cepat (Ruang Simulasi VWS-DEMO)
- Tombol 1-klik untuk langsung mengaktifkan sesi simulasi pasangan (*Bima & Nadia*) guna memudahkan evaluasi seluruh tahapan (Dashboard, Pengantar, Skenario, Ruang Tunggu, Hasil, dan Piagam) tanpa harus mengisi dari awal.

### 6. Desain Antislop & Aksesibilitas Tinggi
- Navigasi dua tingkat (*Two-Tier Editorial Header*) yang mencegah teks bertumpuk atau terpotong pada berbagai resolusi.
- Dukungan Tema Terang (*Warm Paper*) dan Tema Gelap (*Editorial Night*) dengan kontras standar WCAG AA.
- Ukuran target sentuh minimal 44px untuk kenyamanan perangkat *mobile*.

---

## Kurikulum 4 Pilar (40 Skenario Nyata)

| Modul | Kode | Judul Kurikulum | Topik Utama yang Dibahas |
| :---: | :---: | :--- | :--- |
| **01** | `MOD-01` | **Prinsip & Transparansi Finansial** | Keterbukaan saldo, rekening bersama vs pribadi, jatah bulanan orang tua/mertua, utang bawaan, dan dana darurat krisis. |
| **02** | `MOD-02` | **Mertua, Keluarga Besar & Batasan Privat** | Aturan tinggal bersama mertua, kunjungan tanpa kabar, batasan curhat masalah rumah tangga ke orang luar, dan rotasi mudik hari raya. |
| **03** | `MOD-03` | **Visi Pengasuhan & Masa Depan Anak** | Waktu memiliki momongan, penanganan krisis infertilitas, peran kakek-nenek dalam pengasuhan, kompromi karier ibu/ayah, dan metode disiplin. |
| **04** | `MOD-04` | **Pembagian Peran Harian & Resolusi Konflik** | Pembagian kerja domestik, tawaran relokasi kerja luar kota, privasi ponsel/media sosial, dan protokol bertengkar (pantangan *silent treatment*). |

---

## Struktur Folder Proyek

```text
blind-alignment/
├── app/
│   ├── components/
│   │   ├── AlignmentResultPage.tsx  # Halaman buka segel, donut chart & form kompromi
│   │   ├── AppHeader.tsx            # Header editorial 2 tingkat & navigasi sesi
│   │   ├── DashboardPage.tsx        # Dashboard status 4 modul berjenjang
│   │   ├── DilemmaRunnerPage.tsx    # Lembar pengerjaan 10 skenario dilema
│   │   ├── FinalCharterPage.tsx     # Piagam kesepakatan & cetak PDF
│   │   ├── JoinRoomPage.tsx         # Landing page, form CRUD Supabase, search & filter
│   │   ├── ModuleIntroPage.tsx      # Panduan pra-pengisian modul
│   │   ├── SignaturePad.tsx         # Komponen kanvas tanda tangan digital
│   │   ├── VisualIllustrations.tsx  # 5 Komponen ilustrasi & diagram SVG domain-spesifik
│   │   └── WaitingRevealPage.tsx    # Ruang tunggu sinkronisasi kunci jawaban
│   ├── data/
│   │   └── scenarios.ts             # Basis data 40 skenario dilema terstruktur
│   ├── lib/
│   │   ├── charterGenerator.ts      # Generator dokumen cetak PDF & hash SHA-256
│   │   ├── scoring.ts               # Kalkulasi persentase keselarasan pasangan
│   │   ├── sessionStore.ts          # Operasi CRUD Supabase + state management lokal
│   │   └── supabase.ts              # Konfigurasi klien @supabase/supabase-js
│   ├── room/
│   │   └── [code]/                  # Rute dinamis sesi per kode ruang
│   │       ├── charter/page.tsx
│   │       ├── dilemma/page.tsx
│   │       ├── intro/page.tsx
│   │       ├── result/page.tsx
│   │       ├── waiting/page.tsx
│   │       └── page.tsx
│   ├── globals.css                  # Gaya tema antislop, dark mode & scroll offset
│   ├── layout.tsx                   # Root layout Next.js + Sonner Toaster
│   └── page.tsx                     # Entry point beranda
├── public/                          # Aset statis & ikon
├── .env.local                       # Kredensial Supabase (diabaikan oleh .gitignore)
├── .npmrc                           # Konfigurasi resolusi dependensi Vercel
├── package.json                     # Konfigurasi dependensi proyek
├── tsconfig.json                    # Konfigurasi TypeScript
└── README.md                        # Dokumentasi utama proyek
```

---

## Panduan Instalasi & Menjalankan di Lokal

### Prasyarat Sistem
- **Node.js:** Versi 18.18.0 atau lebih baru (disarankan Node LTS v20.x).
- **Package Manager:** npm, pnpm, atau yarn.
- **Git:** Untuk kloning repositori.

### Langkah-Langkah

1. **Kloning Repositori:**
   ```bash
   git clone https://github.com/piskalll/blind-alignment.git
   cd blind-alignment
   ```

2. **Pasang Dependensi:**
   ```bash
   npm install
   ```

3. **Konfigurasi Variabel Lingkungan (`.env.local`):**
   Buat berkas `.env.local` di direktori utama (berkas ini aman di dalam `.gitignore` dan tidak diunggah ke GitHub publik):
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://<project-id>.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-public-key>
   ```

4. **Jalankan Server Pengembangan:**
   ```bash
   npm run dev
   ```
   Buka peramban di alamat [http://localhost:3000](http://localhost:3000).

5. **Uji Validasi TypeScript & Build Produksi:**
   ```bash
   # Pemeriksaan tipe data (0 errors)
   node node_modules/typescript/bin/tsc --noEmit

   # Pembuatan build produksi Next.js
   node node_modules/next/dist/bin/next build
   ```

---

## Log Prompt AI & Catatan Perbaikan Manual

### 1. Log Prompt AI Utama (Modul 7 & Upgrade Modul 8)

| No | Kebutuhan Fitur | Log Prompt yang Digunakan | Hasil Kode yang Digenerasi |
| :---: | :--- | :--- | :--- |
| 1 | **Arsitektur Rute & Sesi (Modul 7)** | *"Buat struktur modular Next.js App Router untuk sistem pre-marital quiz dengan rute: dashboard, intro, dilemma, waiting, result, dan charter menggunakan state lokal."* | Rute folder `/room/[code]/*` dan fungsi pembantu sesi di `sessionStore.ts`. |
| 2 | **Kurikulum 40 Skenario (Modul 7)** | *"Susun 40 skenario dilema pra-nikah kontekstual masyarakat Indonesia yang dibagi ke 4 modul (keuangan, mertua, anak, pembagian peran) dengan 3 opsi realistis."* | Basis data terstruktur pada `app/data/scenarios.ts`. |
| 3 | **Integrasi CRUD Database Supabase (Modul 8)** | *"Pertahankan seluruh class styling yang sudah ada. Hubungkan pembuatan ruang (Create), daftar sesi ruang (Read), verifikasi gabung ruang dengan PIN (Update), dan hapus ruang (Delete) ke tabel rooms di Supabase dengan fallback localStorage."* | Modul `app/lib/supabase.ts` serta fungsi `createRoomAsync`, `fetchRoomsFromSupabase`, `joinRoomAsync`, dan `deleteRoomAsync` di `app/lib/sessionStore.ts`. |
| 4 | **Fitur Search, Filter & UX States (Modul 8)** | *"Pertahankan seluruh class styling yang sudah ada. Tambahkan pencarian kata kunci real-time pada 40 skenario, Empty State dengan tombol Reset, Loading Skeleton saat mengambil data Supabase, validasi input inline, dan Toast Notification menggunakan Sonner."* | Pembaruan interaktif pada `app/components/JoinRoomPage.tsx` dan `<Toaster />` di `app/layout.tsx`. |
| 5 | **Ilustrasi Visual SVG & Pemangkasan Teks (Modul 8)** | *"Perbaiki UI dengan mengurangi blok teks yang terlalu panjang dan tambahkan ilustrasi diagram SVG kustom sesuai topik 4 pilar pra-nikah tanpa merusak fungsi CRUD dan filter."* | Komponen `app/components/VisualIllustrations.tsx` yang terintegrasi ke 6 halaman utama. |

### 2. Catatan Perbaikan Manual (Human Debugging)
Meskipun kerangka kode dibantu oleh AI, sejumlah perbaikan teknis dilakukan secara manual untuk menjamin keandalan aplikasi di tahap produksi:
1. **Penanganan Kebijakan RLS (*Row Level Security*) & Izin Tabel Supabase (Modul 8):**
   - *Kendala:* Saat menguji operasi `INSERT` dan `SELECT` menggunakan `NEXT_PUBLIC_SUPABASE_ANON_KEY`, Supabase mengembalikan error `42501 (permission denied for table rooms)`.
   - *Solusi Manual:* Menambahkan konfigurasi kebijakan SQL (`GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.rooms TO anon, authenticated;` serta `CREATE POLICY`) di SQL Editor Supabase, dan melengkapi `sessionStore.ts` dengan blok `try / catch` yang otomatis beralih ke `localStorage` apabila koneksi cloud terkendala.
2. **Perbaikan Konflik Dependensi `ERESOLVE` ESLint saat Deploy ke Vercel (Modul 8):**
   - *Kendala:* Proses *build* di Vercel gagal pada tahap `npm install` karena konflik *peer dependency* antara `eslint@^9` dan `eslint-config-next@14.2.35`.
   - *Solusi Manual:* Menyesuaikan versi `"eslint": "^8.57.0"` pada `package.json` dan menambahkan konfigurasi `legacy-peer-deps=true` di dalam berkas `.npmrc`.
3. **Perbaikan *Synchronous Hydration* pada Hook `useRoom`:**
   - *Kendala:* Inisialisasi awal `useState(null)` menunggu `useEffect` membaca `localStorage`, menyebabkan kedipan tulisan `Ruang VWS-000` saat berpindah rute.
   - *Solusi Manual:* Mengubah inisialisasi state menjadi *lazy initializer* sinkron yang langsung membaca data sesi pada frame pertama perenderan.
4. **Penyempurnaan Offset Anchor Scroll & Sticky Header:**
   - *Kendala:* Mengklik tautan navigasi beranda (`#mulai-sesi`, `#cara-kerja`, `#empat-pilar`, `#faq`) membuat judul bagian tertutup oleh *sticky header*.
   - *Solusi Manual:* Menambahkan aturan `scroll-padding-top: 5rem;` dan `scroll-behavior: smooth;` pada file `app/globals.css`.

---

## Spesifikasi Teknis

- **Framework:** Next.js 16.4 (App Router, Turbopack)
- **Library UI:** React 19.0
- **Bahasa Pemrograman:** TypeScript 5.0
- **Styling:** Tailwind CSS 4.0
- **Iconography:** Lucide React
- **Toast Notifications:** Sonner
- **Penyimpanan Data:** Supabase Cloud Database (PostgreSQL) + Fallback Web Storage API (`localStorage` & `sessionStorage`)
- **Format Ekspor:** Native Browser Print Engine (CSS Paged Media `@media print`)

---

## Lisensi

Proyek ini dilisensikan di bawah lisensi [MIT](LICENSE). Terbuka untuk dikembangkan lebih lanjut guna membantu pasangan membangun fondasi rumah tangga yang kokoh dan transparan.
 
## Status Rilis Modul 8: Siap Usability Testing Modul 9 
