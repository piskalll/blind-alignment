# Laporan Usability Testing & Sprint Perbaikan Kode (Modul 9)

**Mata Kuliah / Program:** Pengujian Aplikasi Web & Iterasi Kode  
**Proyek Aplikasi:** VowSync (SalingPaham): Platform Keselarasan Pra-Nikah Berbasis Mekanisme Dual-Blind  
**Tautan Live Web:** [https://blind-alignment.vercel.app](https://blind-alignment.vercel.app)  
**Tautan Repositori GitHub:** [https://github.com/piskalll/blind-alignment](https://github.com/piskalll/blind-alignment)  
**ID Proyek Microsoft Clarity:** `z5vxkhed8n`  
**Tanggal Pengujian:** 2 November 2026  
**Jumlah Penguji:** 2 Orang (Berdasarkan persetujuan mentor: 1 Desktop, 1 Mobile)  

---

## 1. Profil Penguji & 3 Skenario Tugas Spesifik (Bobot 25%)

### A. Profil Penguji Target (Metode Think-Aloud)
Pengujian dilakukan secara langsung kepada 2 pengguna nyata mewakili dua lingkungan perangkat utama (Desktop dan Smartphone) dengan metode *Think-Aloud*, tanpa intervensi pengembang selama proses pengerjaan tugas.

| No | Nama Penguji | Perangkat & Browser | Resolusi / Viewport | Peran Penguji |
| :---: | :--- | :--- | :--- | :--- |
| 1 | **Bima** | Laptop Windows (Google Chrome) | 1920 x 1080 (Desktop View) | Pengguna desktop |
| 2 | **Sarah** | Smartphone Android (Chrome Mobile) | 390 x 844 (Mobile View) | Pengguna mobile |

---

### B. Tiga Skenario Tugas Pengujian (Specific Tasks)

* **Tugas 1 (Eksplorasi & Navigasi Antarmuka):**  
  *Instruksi:* Buka halaman beranda VowSync, pelajari cara kerja mekanisme 4 tahap Dual-Blind dan topik 4 pilar keselarasan, kemudian coba navigasi kembali ke halaman utama setelah memasuki sesi ruang.  
  *Kriteria Sukses:* Penguji memahami alur aplikasi dan dapat berpindah halaman tanpa mengalami disorientasi atau tautan buntu (*dead-end*).

* **Tugas 2 (Interaksi Detail & Kustomisasi Soal Mandiri MOD-05):**  
  *Instruksi:* Masuk ke menu kustomisasi Modul 5, buat 1 pertanyaan dilema kesepakatan baru dengan memasukkan teks judul soal dan opsi jawaban, lalu periksa keterbacaan teks yang telah diketik.  
  *Kriteria Sukses:* Penguji dapat melihat form dengan jelas, mengetikkan pertanyaan tanpa teks terpotong, dan berhasil menyimpan soal kustom ke daftar modul.

* **Tugas 3 (Input Formulir Utama, Jawaban Esai & Tanda Tangan Piagam):**  
  *Instruksi:* Masuk ke sesi ruang, jawab pertanyaan pilihan dan pertanyaan esai terbuka pada modul, kunci jawaban di ruang tunggu, buka hasil keselarasan bersama, lakukan tanda tangan digital pada kanvas, serta coba tombol pengulangan tanda tangan jika ingin memperbaiki goresan.  
  *Kriteria Sukses:* Penguji dapat mengetik esai dengan lancar tanpa delay/kehilangan data, mengunci jawaban, dan menandatangani dokumen piagam kesepakatan secara fleksibel.

---

## 2. Tabel Pengukuran 3 Metrik Usabilitas (Bobot 20%)

### Standar Penilaian:
1. **Task Success Rate (%):**
   * Berhasil Mulus (100%): Tugas selesai mandiri tanpa hambatan.
   * Berhasil Sempat Bingung / Terhambat Bug (50%): Tugas selesai namun mengalami kebingungan atau kendala teknis antarmuka.
   * Gagal (0%): Penguji menyerah atau tidak dapat menyelesaikan alur tugas.
2. **Time-on-Task (detik):** Durasi penyelesaian tugas berdasarkan rekaman sesi di dashboard Microsoft Clarity.
3. **Single Ease Question (SEQ: Skala 1–7):** *"Seberapa mudah menyelesaikan tugas ini?"* (1 = Sangat Sulit, 7 = Sangat Mudah). Catatan kualitatif wajib dicatat untuk skor 1 sampai 4.

---

### A. Tabel Rekapitulasi Data Hasil Pengujian (2 Penguji)

| Penguji | Tugas | Success Rate (%) | Durasi (detik) | Skor SEQ (1–7) | Catatan Kualitatif / Alasan Penguji (Wajib jika SEQ 1–4) |
| :---: | :---: | :---: | :---: | :---: | :--- |
| **Bima** *(Desktop)* | Tugas 1 | 50% | 68 detik | 4/7 | **Kualitatif:** Ketika kembali ke landing page tidak bisa kembali ke dashboard karena tidak ada tombol back pada landing page. |
| | Tugas 2 | 50% | 85 detik | 4/7 | **Kualitatif:** Textbox pada halaman membuat soal modul 5 kurang besar, tidak terlihat isi dari text tersebut. |
| | Tugas 3 | 50% | 145 detik | 3/7 | **Kualitatif:** Textbox jawaban pada beberapa halaman terlihat tidak nyaman karena sering terhapus sendiri dan terasa delay; tanda tangan tidak dapat diambil ulang padahal terdapat button untuk mengulang. |
| **Sarah** *(Mobile)* | Tugas 1 | 50% | 58 detik | 4/7 | **Kualitatif:** Tombol kurang terlihat pada mobile view sehingga sempat bingung mencari tombol aksi untuk memulai sesi. |
| | Tugas 2 | 50% | 115 detik | 3/7 | **Kualitatif:** Pada membuat soal modul 5 sangat sulit dilihat karena tempat input yang terlalu kecil pada view mobile. |
| | Tugas 3 | 50% | 165 detik | 2/7 | **Kualitatif:** Tempat untuk menjawab essai terasa sangat delay dan membuat tidak nyaman; box tanda tangan kurang besar pada mobile dan tidak dapat mengambil tanda tangan ulang. |

---

### B. Ringkasan Rata-Rata Metrik Usabilitas

| Metrik yang Diukur | Tugas 1 (Eksplorasi) | Tugas 2 (MOD-05 CRUD) | Tugas 3 (Form & Tanda Tangan) | Rata-Rata Gabungan |
| :--- | :---: | :---: | :---: | :---: |
| **Rata-Rata Success Rate** | 50.0% | 50.0% | 50.0% | **50.0%** |
| **Rata-Rata Time-on-Task** | 63.0 detik | 100.0 detik | 155.0 detik | **106.0 detik** |
| **Rata-Rata Skor SEQ (1–7)** | 4.0 / 7 | 3.5 / 7 | 2.5 / 7 | **3.33 / 7** |

> **Analisis Metrik:**  
> Skor rata-rata SEQ berada di angka **3.33 / 7** (di bawah batas netral 4.0), menunjukkan adanya hambatan usabilitas nyata pada fitur tanda tangan kanvas, kolom input esai, ukuran textarea pembuatan soal, serta navigasi balik ke dashboard yang memerlukan sprint perbaikan kode segera.

---

## 3. Klasifikasi Audit Temuan & Daftar GitHub Issues (Bobot 20%)

Berdasarkan keluhan langsung Bima dan Sarah, dirumuskan 5 GitHub Issues yang diprioritaskan menggunakan label resmi:

### Daftar GitHub Issues:
| No. Issue | Klasifikasi & Label | Judul Masalah Usabilitas | Sumber Temuan Penguji |
| :---: | :--- | :--- | :--- |
| **Issue #1** | 🔴 **Kritis / Mayor** | Tombol reset tanda tangan digital tidak dapat mengulang atau mengosongkan kanvas tanda tangan | Dilaporkan oleh Bima (Desktop) & Sarah (Mobile) di Tugas 3 (Skor SEQ 2–3). |
| **Issue #2** | 🔴 **Kritis / Mayor** | Textarea jawaban esai mengalami delay ketikan tinggi dan risiko teks terhapus saat auto-save | Dilaporkan oleh Bima (Desktop) & Sarah (Mobile) di Tugas 3 (Skor SEQ 2–3). |
| **Issue #3** | 🟡 **Minor** | Textbox pembuatan soal kustom MOD-05 terlalu kecil dan memotong keterbacaan teks | Dilaporkan oleh Bima (Desktop) & Sarah (Mobile) di Tugas 2 (Skor SEQ 3–4). |
| **Issue #4** | 🟡 **Minor** | Ketiadaan tombol kembali ke dashboard ruang aktif saat pengguna berpindah ke landing page | Dilaporkan oleh Bima (Desktop) di Tugas 1 (Skor SEQ 4). |
| **Issue #5** | ⚪ **Kosmetik** | Box tanda tangan kurang proporsional dan kontras tombol aksi rendah pada tampilan mobile | Dilaporkan oleh Sarah (Mobile) di Tugas 1 & Tugas 3 (Skor SEQ 2–4). |

> **Tautan Bukti GitHub Issues:**
> 1. [Issue #1: Bug Reset Canvas Tanda Tangan](https://github.com/piskalll/blind-alignment/issues/1)
> 2. [Issue #2: Debounce & Delay Input Esai](https://github.com/piskalll/blind-alignment/issues/2)
> 3. [Issue #3: Textarea Sempit Pembuatan Soal Modul 5](https://github.com/piskalll/blind-alignment/issues/3)
> 4. [Issue #4: Navigasi Back ke Dashboard dari Beranda](https://github.com/piskalll/blind-alignment/issues/4)
> 5. [Issue #5: Responsivitas Box Canvas & Kontras Tombol Mobile](https://github.com/piskalll/blind-alignment/issues/5)

---

### Bukti Rekaman Microsoft Clarity (Tracker)
*(Simpan screenshot pendukung dari dashboard Clarity ke folder `docs/images/`)*

* **Bukti 1: Ringkasan Sesi Pengujian Bima & Sarah**  
  Menampilkan riwayat rekaman sesi (Session List) dengan durasi pengujian dan interaksi klik kedua pengguna.  
  `![Clarity Session Recording](docs/images/clarity-sessions.png)`

* **Bukti 2: Heatmap & Analisis Dead Clicks / Rage Clicks**  
  Menampilkan titik klik berulang (*rage clicks*) penguji pada tombol ulangi tanda tangan yang tidak merespons serta keraguan klik pada kolom esai.  
  `![Clarity Clicks Heatmap](docs/images/clarity-clicks.png)`

---

## 4. Sprint Perbaikan Kode via Git Pull Request (Bobot 25%)

### A. Alur Kerja Git Branching
Seluruh perbaikan diimplementasikan pada branch terisolasi sebelum digabungkan ke branch utama:

1. **Pembuatan Branch Khusus:**
   ```bash
   git checkout -b fix/usability-iteration
   ```
2. **Implementasi Perbaikan Komponen:**
   * `SignaturePad.tsx`: Memperbaiki logika `clear()` pada kanvas tanda tangan dan memastikan tombol "Ulangi Tanda Tangan" menghapus state garis serta mereset data base64 secara tuntas.
   * `DilemmaRunnerPage.tsx`: Menerapkan *local state* dengan *debounce* pada input esai agar ketikan responsif seketika tanpa delay network dan tidak tertimpa re-render auto-save.
   * `CustomQuestionsStudioPage.tsx`: Memperbesar dimensi textarea form soal Modul 5 dari `rows={2}` menjadi `rows={4}` dengan `min-h-[110px]` dan padding responsif.
   * `AppHeader.tsx` & `JoinRoomPage.tsx`: Menambahkan banner / tombol akses cepat *"Kembali ke Ruang Aktif (VWS-XXX)"* pada navbar beranda jika pengguna sudah memiliki sesi aktif.
   * `app/globals.css`: Mempertegas rasio kontras tombol dan memperbesar area sentuh (*tap target*) minimal 44 piksel pada layar smartphone.
3. **Verifikasi Kode & Build:**
   ```bash
   node node_modules/typescript/bin/tsc --noEmit
   ```
4. **Pull Request & Penggabungan (Merge):**
   * PR dibuka dari `fix/usability-iteration` ke `master`.
   * Deskripsi PR memuat deklarasi penutup issue otomatis:  
     `Closes #1, Closes #2, Closes #3, Closes #4, Closes #5`
   * PR di-merge ke branch utama dan diverifikasi pada live deployment Vercel.

---

## 5. Dokumentasi Bukti Visual Before vs After (Bobot 10%)

| Area Antarmuka | Kondisi Sebelum Perbaikan (Before) | Kondisi Sesudah Perbaikan (After) |
| :--- | :--- | :--- |
| **1. Kanvas Tanda Tangan (Issue #1)** | Tombol "Ulangi" tidak bereaksi, coretan lama tetap menempel di kanvas dan tidak bisa digambar ulang. | Tombol "Ulangi" mengosongkan kanvas seketika dan menampilkan instruksi tanda tangan ulang yang bersih. |
| **2. Kolom Input Esai (Issue #2)** | Ketikan terasa lambat, delay beberapa detik per kata, dan teks berisiko hilang saat auto-save berjalan. | Ketikan instan dan lancar (*zero latency*), indikator simpan berjalan di latar belakang tanpa mengganggu kursor. |
| **3. Form Soal Modul 5 (Issue #3)** | Textbox kecil hanya menampilkan 1-2 baris kalimat, teks panjang terpotong dan tidak nyaman diedit. | Textbox lega (4 baris), otomatis bertambah tinggi, kalimat panjang terbaca utuh di desktop dan HP. |
| **4. Navigasi Beranda (Issue #4)** | Dari dashboard kembali ke landing page tidak tersedia tombol kembali, pengguna harus memasukkan kode ulang. | Terdapat tombol pintas melayang *"Kembali ke Sesi Aktif"* di bagian header beranda. |
| **5. Tampilan Mobile (Issue #5)** | Box tanda tangan sempit dan tombol aksi kurang kontras pada layar ponsel kecil. | Box tanda tangan proporsional mengikuti lebar layar dan tombol aksi memiliki warna serta kontras tegas (44px tap target). |

---

### Tautan Pengumpulan Akhir
* **URL Live Web Aktif:** [https://blind-alignment.vercel.app](https://blind-alignment.vercel.app)
* **Tautan Repositori GitHub:** [https://github.com/piskalll/blind-alignment](https://github.com/piskalll/blind-alignment)
* **Tautan Pull Request Sprint Usabilitas:** [https://github.com/piskalll/blind-alignment/pull/4](https://github.com/piskalll/blind-alignment/pull/4) *(Merged)*
* **ID Microsoft Clarity:** `z5vxkhed8n`
