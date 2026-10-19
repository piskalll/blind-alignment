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
4. [Fitur Utama](#fitur-utama)
5. [Kurikulum 4 Pilar (40 Skenario Nyata)](#kurikulum-4-pilar-40-skenario-nyata)
6. [Struktur Folder Proyek](#struktur-folder-proyek)
7. [Panduan Instalasi & Menjalankan di Lokal](#panduan-instalasi--menjalankan-di-lokal)
8. [Log Prompt AI & Catatan Perbaikan Manual](#log-prompt-ai--catatan-perbaikan-manual)
9. [Spesifikasi Teknis](#spesifikasi-teknis)

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
| **Live Web Deployment (Vercel)** | `nyusul` |
| **Desain UI/UX (Figma)** | `https://www.figma.com/design/0GToZAzRJGdamea001EyYX/Untitled?node-id=28-219&t=IwgDTyoCMfj2XUij-1` |

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
│   │   ├── AlignmentResultPage.tsx  # Halaman buka segel & form kompromi
│   │   ├── AppHeader.tsx            # Header editorial 2 tingkat & navigasi sesi
│   │   ├── DashboardPage.tsx        # Dashboard status 4 modul berjenjang
│   │   ├── DilemmaRunnerPage.tsx    # Lembar pengerjaan 10 skenario dilema
│   │   ├── FinalCharterPage.tsx     # Piagam kesepakatan & cetak PDF
│   │   ├── JoinRoomPage.tsx         # Landing page, terminal ruang & simulasi
│   │   ├── ModuleIntroPage.tsx      # Panduan pra-pengisian modul
│   │   ├── SignaturePad.tsx         # Komponen kanvas tanda tangan digital
│   │   └── WaitingRevealPage.tsx    # Ruang tunggu sinkronisasi kunci jawaban
│   ├── data/
│   │   └── scenarios.ts             # Basis data 40 skenario dilema terstruktur
│   ├── lib/
│   │   └── sessionStore.ts          # State management lokal & logika dual-blind
│   ├── room/
│   │   └── [code]/                  # Rute dinamis sesi per kode ruang
│   │       ├── charter/page.tsx
│   │       ├── dilemma/page.tsx
│   │       ├── intro/page.tsx
│   │       ├── result/page.tsx
│   │       ├── waiting/page.tsx
│   │       └── page.tsx
│   ├── globals.css                  # Gaya tema antislop, dark mode & scroll offset
│   ├── layout.tsx                   # Root layout Next.js
│   └── page.tsx                     # Entry point beranda
├── public/                          # Aset statis & ikon
├── docs/                            # Berkas PRD & dokumentasi luaran
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

3. **Jalankan Server Pengembangan:**
   ```bash
   npm run dev
   ```
   Buka peramban di alamat [http://localhost:3000](http://localhost:3000).

4. **Uji Validasi TypeScript & Build Produksi:**
   ```bash
   # Pemeriksaan tipe data (0 errors)
   node node_modules/typescript/bin/tsc --noEmit

   # Pembuatan build produksi Next.js
   node node_modules/next/dist/bin/next build
   ```

---

## Log Prompt AI & Catatan Perbaikan Manual

### 1. Log Prompt AI Utama

| No | Kebutuhan Fitur | Log Prompt yang Digunakan | Hasil Kode yang Digenerasi |
| :---: | :--- | :--- | :--- |
| 1 | **Arsitektur Rute & Sesi** | *"Buat struktur modular Next.js App Router untuk sistem pre-marital quiz dengan rute: dashboard, intro, dilemma, waiting, result, dan charter menggunakan state lokal."* | Rute folder `/room/[code]/*` dan fungsi pembantu sesi di `sessionStore.ts`. |
| 2 | **Kurikulum 40 Skenario** | *"Susun 40 skenario dilema pra-nikah kontekstual masyarakat Indonesia yang dibagi ke 4 modul (keuangan, mertua, anak, pembagian peran) dengan 3 opsi realistis."* | Basis data terstruktur pada `app/data/scenarios.ts`. |
| 3 | **Kanvas Tanda Tangan** | *"Buat komponen SignaturePad di React yang mendukung event mouse desktop dan layar sentuh smartphone serta menyediakan tombol hapus dan simpan ke data URL."* | Komponen `app/components/SignaturePad.tsx`. |
| 4 | **Sistem Kunci Modul** | *"Buat sistem agar Modul 2, 3, dan 4 terkunci sampai modul sebelumnya selesai dijawab dan ditandatangani di piagam."* | Penambahan state `completedModules` dan validasi guard pada `sessionStore.ts`. |
| 5 | **Redesain Antislop Header** | *"Perbaiki glitch header yang berkedip dan terpotong di layar 1366px dengan membuat tata letak editorial dua baris dan menu drawer mobile."* | Komponen `app/components/AppHeader.tsx` dua tingkat (*Two-Tier Bar*). |

### 2. Catatan Perbaikan Manual (Human Debugging)
Meskipun kerangka kode dibantu oleh AI, sejumlah penyesuaian manual dilakukan untuk menjamin keandalan aplikasi:
1. **Perbaikan *Synchronous Hydration* pada Hook `useRoom`:**
   - *Kendala:* Inisialisasi awal `useState(null)` menunggu `useEffect` membaca `localStorage`, menyebabkan kedipan tulisan `Ruang VWS-000` dan pesan kunci palsu saat berpindah rute.
   - *Solusi Manual:* Mengubah inisialisasi state menjadi *lazy initializer* sinkron yang langsung membaca data sesi pada frame pertama perenderan.
2. **Koreksi Sticky Wrapper pada Dilemma Runner:**
   - *Kendala:* Header terbungkus di dalam elemen `div` bersarang yang menyebabkan posisi `sticky top-0` lepas saat halaman digulir.
   - *Solusi Manual:* Menata ulang hirarki DOM agar `<AppHeader>` terpasang langsung di bawah kontainer terluar.
3. **Penyempurnaan Offset Anchor Scroll:**
   - *Kendala:* Mengklik tautan navigasi beranda (`#mulai-sesi`, `#cara-kerja`, `#faq`) membuat judul bagian tertutup oleh sticky header.
   - *Solusi Manual:* Menambahkan aturan `scroll-padding-top: 5rem;` dan `scroll-behavior: smooth;` pada file `app/globals.css`.

---

## Spesifikasi Teknis

- **Framework:** Next.js 16.4 (App Router, Turbopack)
- **Library UI:** React 19.0
- **Bahasa Pemrograman:** TypeScript 5.0
- **Styling:** Tailwind CSS 4.0
- **Iconography:** Lucide React
- **Penyimpanan Data:** Web Storage API (`localStorage` & `sessionStorage`)
- **Format Ekspor:** Native Browser Print Engine (CSS Paged Media `@media print`)

---

## Lisensi

Proyek ini dilisensikan di bawah lisensi [MIT](LICENSE). Terbuka untuk dikembangkan lebih lanjut guna membantu pasangan membangun fondasi rumah tangga yang kokoh dan transparan.
