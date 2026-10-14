export interface DilemmaScenario {
  id: number;
  moduleId: number;
  category: string;
  title: string;
  description?: string;
  options: {
    key: "A" | "B" | "C";
    text: string;
  }[];
  slider?: {
    label: string;
    min: number;
    max: number;
    step: number;
    unit: string;
    defaultValue: number;
  };
}

export interface ModuleDefinition {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  estimatedTime: string;
}

export const MODULES: ModuleDefinition[] = [
  {
    id: 1,
    title: "Financial Transparency & Debt Liabilities",
    subtitle: "KPR, paylater, kartu kredit, uang bulanan orang tua, dan rekening bersama.",
    description: "Sepuluh skenario realistis seputar transparansi utang, batas cicilan, dan pengelolaan arus kas keluarga muda.",
    estimatedTime: "10-12 menit",
  },
  {
    id: 2,
    title: "Sandwich Generation & In-Law Boundaries",
    subtitle: "Tempat tinggal, intervensi mertua, bantuan adik, dan privasi rumah tangga.",
    description: "Sepuluh skenario krusial tentang dinamika keluarga besar, hidup mandiri vs tinggal bersama mertua, dan batasan privasi.",
    estimatedTime: "10-12 menit",
  },
  {
    id: 3,
    title: "Domestic Roles & Career Trajectory",
    subtitle: "Pembagian tugas rumah tangga, urusan anak, dan kompromi karir.",
    description: "Menyelaraskan ekspektasi pembagian kerja domestik dan prioritas karir kedua pasangan di masa depan.",
    estimatedTime: "10 menit",
  },
  {
    id: 4,
    title: "Emotional Intimacy & Conflict Rules",
    subtitle: "Privasi gadget, gaya komunikasi saat marah, dan resolusi konflik.",
    description: "Membangun kesepakatan etika bertengkar, batasan privasi HP/sosial media, dan rekonsiliasi.",
    estimatedTime: "8 menit",
  },
];

export const SCENARIOS: DilemmaScenario[] = [
  // ================= MODULE 1 =================
  {
    id: 1,
    moduleId: 1,
    category: "Debt Ratio",
    title: "Existing paylater balances before marriage",
    description: "Bagaimana penyelesaian tanggungan paylater atau cicilan gaya hidup yang ada sebelum menikah?",
    options: [
      { key: "A", text: "Dilunasi bersama dari tabungan gabungan sebelum akad nikah." },
      { key: "B", text: "Menjadi tanggung jawab pribadi masing-masing tanpa mencampuri dana bersama." },
      { key: "C", text: "Dibuat rencana cicilan bertahap transparan dengan alokasi maksimal 10% pendapatan." },
    ],
  },
  {
    id: 2,
    moduleId: 1,
    category: "Debt Ratio",
    title: "Combined debt-to-income ceiling",
    description: "Batas maksimal persentase total cicilan gabungan terhadap take-home pay bulanan.",
    options: [
      { key: "A", text: "Maksimal 20% agar cashflow keluarga tetap longgar dan aman." },
      { key: "B", text: "Maksimal 30% sesuai standar perbankan umum untuk KPR dan aset." },
      { key: "C", text: "Fleksibel hingga 45% jika untuk aset produktif / rumah pertama." },
    ],
  },
  {
    id: 3,
    moduleId: 1,
    category: "Parental Allowance",
    title: "Monthly transfer to parents",
    description: "Komitmen uang jajan rutin bulanan untuk orang tua dari masing-masing pihak.",
    options: [
      { key: "A", text: "Nominal sama rata untuk kedua pihak orang tua dari rekening bersama." },
      { key: "B", text: "Dikelola terpisah dari uang jajan pribadi masing-masing tanpa patokan sama." },
      { key: "C", text: "Ditentukan berdasarkan skala kebutuhan mendesak orang tua tiap bulan." },
    ],
  },
  {
    id: 4,
    moduleId: 1,
    category: "Parental Allowance",
    title: "Urgent medical loan for parents",
    description: "Jika orang tua membutuhkan dana darurat medis mendesak sebesar Rp 15.000.000, bagaimana solusinya?",
    options: [
      { key: "A", text: "Ambil langsung dari tabungan darurat bersama tanpa syarat." },
      { key: "B", text: "Dipotong bertahap dari pos uang jajan pribadi pihak yang bersangkutan selama 6 bulan." },
      { key: "C", text: "Bantu sesuai batas kemampuan aman bersama, tolak halus bila mengancam cashflow utama." },
    ],
    slider: {
      label: "Batas plafon bantuan darurat keluarga per bulan",
      min: 500000,
      max: 5000000,
      step: 250000,
      unit: "IDR",
      defaultValue: 1500000,
    },
  },
  {
    id: 5,
    moduleId: 1,
    category: "Emergency Fund",
    title: "Emergency fund target (months of expenses)",
    description: "Berapa bulan pengeluaran rutin yang wajib tersimpan di dana darurat likuid sebelum mulai investasi?",
    options: [
      { key: "A", text: "3 bulan pengeluaran (cukup untuk awal pernikahan yang aman)." },
      { key: "B", text: "6 bulan pengeluaran (standar ideal keluarga mandiri)." },
      { key: "C", text: "9-12 bulan pengeluaran (prioritas konservatif tanpa kompromi)." },
    ],
  },
  {
    id: 6,
    moduleId: 1,
    category: "Emergency Fund",
    title: "Who holds the joint account PIN",
    description: "Transparansi dan hak akses ke rekening bersama keluarga.",
    options: [
      { key: "A", text: "Keduanya memegang akses penuh dan notifikasi SMS/email bersama." },
      { key: "B", text: "Satu pasangan menjadi bendahara utama, pasangan lain mendapat laporan bulanan." },
      { key: "C", text: "Rekening bersama hanya via persetujuan ganda (dual-authorization) untuk nominal besar." },
    ],
  },
  {
    id: 7,
    moduleId: 1,
    category: "Debt Ratio",
    title: "Paying off a partner’s student loan",
    description: "Sikap terhadap pinjaman pendidikan/kuliah pasangan yang belum tuntas.",
    options: [
      { key: "A", text: "Dibayar bersama sebagai investasi masa depan keluarga." },
      { key: "B", text: "Pasangan yang bersangkutan melunasi dari penghasilan pribadinya." },
      { key: "C", text: "Dibantu bersama hanya jika cicilan tersebut mengganggu biaya sewa/KPR." },
    ],
  },
  {
    id: 8,
    moduleId: 1,
    category: "Emergency Fund",
    title: "Wedding costs vs. house down-payment",
    description: "Prioritas pemanfaatan tabungan pra-nikah.",
    options: [
      { key: "A", text: "Fokus ke pesta pernikahan yang berkesan bagi keluarga besar." },
      { key: "B", text: "Pesta sederhana dan minimalis, alokasikan 80% tabungan untuk DP rumah pertama." },
      { key: "C", text: "Bagi seimbang 50:50 antara pesta yang layak dan dana darurat awal rumah tangga." },
    ],
  },
  {
    id: 9,
    moduleId: 1,
    category: "Parental Allowance",
    title: "Siblings’ tuition contributions",
    description: "Membantu biaya sekolah/kuliah adik kandung saat anggaran keluarga pas-pasan.",
    options: [
      { key: "A", text: "Wajib dibantu sebagai tanggung jawab kakak tertua sampai lulus." },
      { key: "B", text: "Bantuan sifatnya sukarela dan hanya bila kebutuhan utama rumah tangga sudah terpenuhi." },
      { key: "C", text: "Pinjaman lunak keluarga tanpa bunga yang diharapkan dikembalikan setelah bekerja." },
    ],
  },
  {
    id: 10,
    moduleId: 1,
    category: "Debt Ratio",
    title: "Disclosing purchases above IDR 2,000,000",
    description: "Aturan keterbukaan belanja pribadi yang melebihi batas tertentu.",
    options: [
      { key: "A", text: "Wajib diskusi dan sepakat bersama sebelum melakukan transaksi." },
      { key: "B", text: "Cukup saling memberi tahu setelah beli, asalkan memakai uang jajan pribadi." },
      { key: "C", text: "Bebas tanpa lapor selama tidak mengambil dana darurat atau cicilan bersama." },
    ],
  },

  // ================= MODULE 2 (SANDWICH GENERATION & IN-LAW BOUNDARIES) =================
  {
    id: 11,
    moduleId: 2,
    category: "Living Arrangement",
    title: "Pilihan Tempat Tinggal Pasca Menikah",
    description: "Keputusan hunian di 1-2 tahun pertama pernikahan.",
    options: [
      { key: "A", text: "Wajib sewa/ngontrak sendiri terpisah, tidak tinggal di rumah orang tua/mertua." },
      { key: "B", text: "Tinggal sementara di rumah mertua/orang tua maksimal 1-2 tahun untuk kumpul modal DP." },
      { key: "C", text: "Membeli rumah yang lokasinya berdekatan dengan orang tua (radius < 15 menit)." },
    ],
  },
  {
    id: 12,
    moduleId: 2,
    category: "In-Law Privacy",
    title: "Kunci Duplikat Rumah & Kunjungan Tanpa Kabar",
    description: "Mertua atau orang tua meminta kunci cadangan rumah dan sering datang berkunjung tanpa kabar terlebih dahulu.",
    options: [
      { key: "A", text: "Tidak memberikan kunci cadangan, dan sepakat wajib kabar minimal 1 hari sebelumnya." },
      { key: "B", text: "Beri kunci cadangan hanya untuk keadaan darurat, namun wajib ketuk pintu/kabar sebelum datang." },
      { key: "C", text: "Bebas kapan saja berkunjung dan pegang kunci, pintu rumah selalu terbuka untuk orang tua." },
    ],
  },
  {
    id: 13,
    moduleId: 2,
    category: "Parental Care",
    title: "Orang Tua Lanjut Usia Tinggal Bersama",
    description: "Jika di masa depan salah satu orang tua sudah sepuh atau sakit-sakitan dan hidup sendirian.",
    options: [
      { key: "A", text: "Ajak tinggal satu atap di rumah kita dan dirawat bersama." },
      { key: "B", text: "Sewa perawat khusus/caregiver yang mendampingi di rumah beliau sendiri." },
      { key: "C", text: "Gantian menginap dan merawat bersama saudara kandung lainnya sesuai jadwal." },
    ],
    slider: {
      label: "Alokasi anggaran bulanan untuk perawatan orang tua sepuh",
      min: 1000000,
      max: 8000000,
      step: 500000,
      unit: "IDR",
      defaultValue: 2500000,
    },
  },
  {
    id: 14,
    moduleId: 2,
    category: "Holiday Tradition",
    title: "Rotasi Mudik Hari Raya (Lebaran / Natal)",
    description: "Menentukan agenda mudik saat hari raya pertama.",
    options: [
      { key: "A", text: "Rotasi adil dan ketat: Tahun ini keluarga istri, tahun depan keluarga suami." },
      { key: "B", text: "Bagi dua hari: Hari ke-1 di keluarga terdekat/lebih sepuh, hari ke-2 di keluarga lainnya." },
      { key: "C", text: "Fleksibel mengundang kedua belah pihak keluarga besar berkumpul di rumah kita." },
    ],
  },
  {
    id: 15,
    moduleId: 2,
    category: "Child Rearing",
    title: "Intervensi Pola Asuh Anak oleh Mertua",
    description: "Orang tua/mertua berbeda pendapat soal pola makan, gadget, atau disiplin anak pertama kita.",
    options: [
      { key: "A", text: "Tegas menjaga batasan: Pasangan orang tua kandung yang wajib menegur keluarganya dengan santun." },
      { key: "B", text: "Kompromi fleksibel selama tidak membahayakan kesehatan fisik atau moral anak." },
      { key: "C", text: "Mengalah dan menghormati nasihat orang tua demi menjaga keharmonisan keluarga besar." },
    ],
  },
  {
    id: 16,
    moduleId: 2,
    category: "Family Borrowing",
    title: "Saudara Kandung Meminjam Uang dalam Jumlah Besar",
    description: "Adik/kakak ipar ingin meminjam dana Rp 20.000.000 untuk modal usaha atau kebutuhan mendesak.",
    options: [
      { key: "A", text: "Hanya beri bantuan cuma-cuma seikhlasnya (tanpa berharap kembali), tolak pinjaman besar." },
      { key: "B", text: "Pinjamkan dengan surat perjanjian tertulis dan tanggal jatuh tempo yang tegas." },
      { key: "C", text: "Tolak secara prinsipil untuk menghindari potensi keretakan hubungan keluarga." },
    ],
  },
  {
    id: 17,
    moduleId: 2,
    category: "In-Law Privacy",
    title: "Membicarakan Konflik Rumah Tangga ke Orang Tua",
    description: "Saat bertengkar atau berselisih paham mengenai masalah rumah tangga.",
    options: [
      { key: "A", text: "Sumpah tutup pintu: Pantang menceritakan masalah apapun ke orang tua/mertua." },
      { key: "B", text: "Hanya boleh melibatkan pihak ketiga (mediator/orang tua) jika terjadi KDRT atau ancaman cerai." },
      { key: "C", text: "Wajar curhat ke orang tua kandung masing-masing untuk mencari nasihat penenang." },
    ],
  },
  {
    id: 18,
    moduleId: 2,
    category: "Living Arrangement",
    title: "Privasi Kamar Utama dari Kunjungan Keluarga",
    description: "Kebiasaan keluarga besar/saudara yang masuk atau beristirahat di kamar tidur utama.",
    options: [
      { key: "A", text: "Kamar utama adalah zona sakral privat yang selalu tertutup/terkunci bagi tamu siapapun." },
      { key: "B", text: "Diizinkan hanya jika ada izin langsung dari pemilik rumah." },
      { key: "C", text: "Santai dan terbuka, keluarga besar bebas beristirahat di kamar utama." },
    ],
  },
  {
    id: 20,
    moduleId: 2,
    category: "Parental Care",
    title: "Ibu Mertua Meminta Ikut Belanja Bulanan",
    description: "Orang tua atau mertua ingin sering ikut menemani belanja kebutuhan rumah tangga dan memberi saran belanja.",
    options: [
      { key: "A", text: "Tetapkan jadwal mandiri berdua pasangan, libatkan mertua hanya sesekali untuk makan bersama." },
      { key: "B", text: "Ajak belanja bersama dan sediakan anggaran terpisah khusus untuk hadiah beliau." },
      { key: "C", text: "Serahkan sebagian daftar belanja kebutuhan dapur kepada mertua agar merasa dihargai." },
    ],
  },
  {
    id: 19,
    moduleId: 2,
    category: "Sandwich Generation",
    title: "Kenaikan Gaji: Alokasi Tabungan vs Menambah Uang Ortu",
    description: "Saat salah satu pasangan mendapat promosi atau kenaikan take-home pay 25%.",
    options: [
      { key: "A", text: "100% kenaikan dialokasikan untuk mempercepat tabungan rumah/investasi keluarga sendiri." },
      { key: "B", text: "Proporsional: 70% tabungan mandiri, 30% untuk menambah uang jajan/hadiah orang tua." },
      { key: "C", text: "Tidak perlu memberi tahu nominal kenaikan gaji kepada keluarga besar untuk mencegah ekspektasi." },
    ],
  },

  // ================= MODULE 3 (DOMESTIC ROLES & CAREER TRAJECTORY) =================
  {
    id: 21,
    moduleId: 3,
    category: "Chore Division",
    title: "Pembagian Pekerjaan Rumah Tangga (Dual-Career)",
    description: "Jika kedua pasangan sama-sama bekerja penuh waktu (full-time) dari pagi hingga malam.",
    options: [
      { key: "A", text: "Bagi tugas secara setara dan terjadwal (misal: satu memasak/cuci piring, satu cuci baju/bersih-bersih)." },
      { key: "B", text: "Gunakan jasa ART harian / laundry kiloan untuk menghemat tenaga dan waktu istirahat berdua." },
      { key: "C", text: "Fleksibel tanpa jadwal tetap, siapa yang pulang lebih awal atau luang yang mengerjakan." },
    ],
  },
  {
    id: 22,
    moduleId: 3,
    category: "Childcare & Career",
    title: "Pengasuhan Anak Pasca Cuti Melahirkan",
    description: "Setelah masa cuti melahirkan 3 bulan selesai dan kedua pihak harus kembali bekerja.",
    options: [
      { key: "A", text: "Salah satu pihak (biasanya istri) bersedia transisi menjadi full-time parent atau resign." },
      { key: "B", text: "Sewa jasa daycare terpercaya atau babysitter profesional di rumah." },
      { key: "C", text: "Minta bantuan orang tua/mertua untuk menjaga anak selama jam kerja kantor." },
    ],
  },
  {
    id: 23,
    moduleId: 3,
    category: "Career Relocation",
    title: "Tawaran Relokasi Karir ke Luar Kota / Luar Negeri",
    description: "Salah satu pasangan mendapat peluang promosi emas tapi wajib pindah dinas ke luar pulau/negeri selama 2 tahun.",
    options: [
      { key: "A", text: "Wajib ikut mendampingi pasangan yang dipromosikan, meski harus melepaskan pekerjaan saat ini." },
      { key: "B", text: "Jalani Long Distance Marriage (LDM) sementara dengan komitmen pulang rutin 2 minggu sekali." },
      { key: "C", text: "Tolak tawaran tersebut demi menjaga kebersamaan fisik rumah tangga di kota domisili saat ini." },
    ],
  },
  {
    id: 24,
    moduleId: 3,
    category: "Work-Life Boundaries",
    title: "Lembur & Jam Kerja di Akhir Pekan",
    description: "Ekspektasi batas waktu pekerjaan kantor saat tiba di rumah dan waktu weekend.",
    options: [
      { key: "A", text: "Strict boundary: HP kantor dimatikan/diabaikan saat weekend, 100% fokus untuk waktu berdua." },
      { key: "B", text: "Toleransi lembur sewajarnya asalkan memberi kabar jelas dan tidak mengorbankan rencana bersama." },
      { key: "C", text: "Bebas bekerja lembur kapan saja karena sama-sama sedang dalam fase membangun karir di usia muda." },
    ],
  },
  {
    id: 25,
    moduleId: 3,
    category: "Domestic Budget",
    title: "Anggaran Khusus Asisten Rumah Tangga (ART) / Robot Vacuum",
    description: "Alokasi anggaran untuk alat otomatisasi rumah atau bantuan ART.",
    options: [
      { key: "A", text: "Investasi wajib sejak awal: gaji ART atau beli dishwasher & robot vacuum untuk minimalkan konflik domestik." },
      { key: "B", text: "Kerjakan sendiri dulu di tahun pertama, baru sewa ART jika sudah memiliki momongan." },
      { key: "C", text: "Lebih baik uangnya dialokasikan untuk tabungan investasi masa depan dibanding membayar ART." },
    ],
    slider: {
      label: "Batas anggaran maksimal per bulan untuk ART / outsourcing domestik",
      min: 500000,
      max: 4000000,
      step: 250000,
      unit: "IDR",
      defaultValue: 1500000,
    },
  },
  {
    id: 26,
    moduleId: 3,
    category: "Income Disparity",
    title: "Kesenjangan Penghasilan (Jika Istri Berpenghasilan Lebih Besar)",
    description: "Sikap pasangan terhadap dinamika keuangan jika penghasilan istri 2x lipat lebih besar dari suami.",
    options: [
      { key: "A", text: "Tetap proporsional: pengeluaran dibagi sesuai persentase rasio penghasilan masing-masing." },
      { key: "B", text: "Suami tetap menanggung seluruh kebutuhan pokok sandang-pangan, penghasilan istri untuk tabungan/aset." },
      { key: "C", text: "Gabung 100% jadi satu rekening keluarga tanpa membandingkan siapa yang menyetor lebih banyak." },
    ],
  },
  {
    id: 27,
    moduleId: 3,
    category: "Education Pursuit",
    title: "Keinginan Melanjutkan Studi S2 / Sertifikasi Mahal",
    description: "Salah satu pasangan ingin kuliah S2 atau mengambil sertifikasi profesional berbiaya tinggi di tahun ke-2 pernikahan.",
    options: [
      { key: "A", text: "Dukung penuh dari tabungan keluarga jika untuk kemajuan karir jangka panjang." },
      { key: "B", text: "Hanya izinkan jika berhasil mendapatkan beasiswa penuh tanpa menguras tabungan bersama." },
      { key: "C", text: "Tunda rencana studi sampai kebutuhan kepemilikan rumah dan dana darurat terpenuhi." },
    ],
  },
  {
    id: 28,
    moduleId: 3,
    category: "Daily Meals",
    title: "Penyediaan Makanan Sehari-hari (Masak vs Pesan Online)",
    description: "Strategi konsumsi makanan harian keluarga jika keduanya lelah bekerja.",
    options: [
      { key: "A", text: "Prioritaskan masak sendiri di rumah (meal prep akhir pekan) demi kesehatan dan hemat." },
      { key: "B", text: "Langganan katering harian sehat atau pesan online agar tidak lelah urusan dapur." },
      { key: "C", text: "Fleksibel: masak simpel jika sempat, pesan makanan siap saji jika sedang padat lembur." },
    ],
  },
  {
    id: 29,
    moduleId: 3,
    category: "Social Life",
    title: "Hangout dengan Rekan Kerja / Networking Tanpa Pasangan",
    description: "Acara nongkrong, gathering kantor, atau networking malam bersama rekan kerja lawan jenis.",
    options: [
      { key: "A", text: "Wajib izin dan menetapkan jam malam (misal maksimal jam 22.00 sudah tiba di rumah)." },
      { key: "B", text: "Cukup memberi kabar lokasi dan estimasi kepulangan, saling percaya tanpa batasan jam kaku." },
      { key: "C", text: "Ajak pasangan ikut jika memungkinkan agar saling mengenal lingkaran pertemanan kerja." },
    ],
  },
  {
    id: 30,
    moduleId: 3,
    category: "Personal Space",
    title: "Waktu Sendiri (Me-Time) Tanpa Gangguan",
    description: "Kebutuhan waktu personal untuk hobi, me-time, atau menyendiri setelah lelah beraktivitas seharian.",
    options: [
      { key: "A", text: "Wajib saling memberi ruang me-time tanpa rasa bersalah minimal beberapa jam tiap minggu." },
      { key: "B", text: "Me-time disepakati hanya saat pasangan juga sedang memiliki kesibukan atau hobi sendiri." },
      { key: "C", text: "Prioritaskan quality time bersama pasangan, hobi pribadi dilakukan bersama-sama." },
    ],
  },

  // ================= MODULE 4 (EMOTIONAL INTIMACY & CONFLICT RULES) =================
  {
    id: 31,
    moduleId: 4,
    category: "Digital Privacy",
    title: "Privasi Gadget & Password Sosial Media",
    description: "Keterbukaan akses ponsel pintar, PIN layar kunci, dan akun sosial media satu sama lain.",
    options: [
      { key: "A", text: "Transparansi penuh: saling tahu password HP dan bebas membuka kapan saja tanpa curiga." },
      { key: "B", text: "Privasi sehat: tahu password hanya untuk keadaan darurat, namun tidak saling cek isi chat/DM." },
      { key: "C", text: "Privasi mutlak: HP adalah ranah pribadi masing-masing yang wajib dihormati tanpa saling intip." },
    ],
  },
  {
    id: 32,
    moduleId: 4,
    category: "Conflict Resolution",
    title: "Aturan Bertengkar: Selesaikan Hari Ini vs Butuh Waktu Tenang",
    description: "Prinsip menghadapi perselisihan argumen yang memanas sebelum tidur.",
    options: [
      { key: "A", text: "Pantang tidur dalam keadaan marah: wajib diselesaikan malam itu juga sampai tuntas." },
      { key: "B", text: "Jeda waktu tenang (cooling down): sepakat tidur dulu atau beri waktu 2-3 jam, bahas esok pagi dengan kepala dingin." },
      { key: "C", text: "Fleksibel: siapa yang merasa bersalah berinisiatif meminta maaf lebih dulu untuk mencairkan suasana." },
    ],
  },
  {
    id: 33,
    moduleId: 4,
    category: "Communication Boundaries",
    title: "Diam Seribu Bahasa (Silent Treatment) Saat Marah",
    description: "Sikap saat salah satu pasangan merajuk dan mendiamkan pasangannya saat kecewa.",
    options: [
      { key: "A", text: "Silent treatment dilarang keras: wajib utarakan perasaan dengan kata-kata meski sedang kesal." },
      { key: "B", text: "Boleh diam maksimal 1-2 jam untuk menenangkan emosi, setelah itu wajib mulai berbicara." },
      { key: "C", text: "Toleransi sikap diam dan beri ruang hingga pasangan merasa siap untuk bicara sendiri." },
    ],
  },
  {
    id: 34,
    moduleId: 4,
    category: "Social Media Sharing",
    title: "Mengunggah Masalah Hubungan / Sindiran di Media Sosial",
    description: "Membuat status galau, quotes sindiran, atau curhat dinamika rumah tangga di WhatsApp Story / Instagram.",
    options: [
      { key: "A", text: "Pantang mutlak: masalah rumah tangga haram dijadikan konten atau sindiran publik di medsos." },
      { key: "B", text: "Hanya boleh membagikan quotes refleksi umum tanpa menyudutkan atau membicarakan aib pasangan." },
      { key: "C", text: "Dianggap wajar sebagai bentuk ekspresi emosi sesaat selama tidak menyebut nama langsung." },
    ],
  },
  {
    id: 35,
    moduleId: 4,
    category: "Intimacy & Affection",
    title: "Frekuensi Kencan Berdua (Date Night) Pasca Menikah",
    description: "Komitmen menjaga api romansa berdua di tengah kesibukan pekerjaan dan rutinitas rumah tangga.",
    options: [
      { key: "A", text: "Wajib date night rutin minimal 1 minggu sekali khusus berdua tanpa urusan pekerjaan." },
      { key: "B", text: "Jadwalkan kencan spesial 1-2 kali sebulan atau saat momen perayaan tertentu." },
      { key: "C", text: "Fleksibel dan spontan, kualitas kebersamaan sehari-hari di rumah lebih diutamakan." },
    ],
    slider: {
      label: "Alokasi anggaran khusus kencan berdua (Date Night) per bulan",
      min: 250000,
      max: 3000000,
      step: 250000,
      unit: "IDR",
      defaultValue: 1000000,
    },
  },
  {
    id: 36,
    moduleId: 4,
    category: "Friendship Boundaries",
    title: "Hubungan & Komunikasi dengan Mantan / Teman Dekat Lawan Jenis",
    description: "Batasan menjaga komunikasi chat atau bertemu dengan mantan kekasih atau sahabat lawan jenis.",
    options: [
      { key: "A", text: "Putus total kontak dengan mantan, dan batasi intervensi emosional dengan sahabat lawan jenis." },
      { key: "B", text: "Boleh berteman wajar sebatas urusan profesional/silaturahmi biasa dengan sepengetahuan pasangan." },
      { key: "C", text: "Bebas tetap berteman akrab tanpa batasan, karena masa lalu sudah selesai dan ada rasa saling percaya." },
    ],
  },
  {
    id: 37,
    moduleId: 4,
    category: "Conflict Boundaries",
    title: "Penggunaan Nada Suara Tinggi & Kata Kasar Saat Emosi",
    description: "Batasan verbal saat terjadi pertengkaran hebat.",
    options: [
      { key: "A", text: "Zero tolerance: membentak, memaki, atau melontarkan kata cerai otomatis menghentikan diskusi (pause rule)." },
      { key: "B", text: "Toleransi nada tinggi saat meluapkan emosi, namun wajib meminta maaf segera setelah situasi reda." },
      { key: "C", text: "Fokus ke inti permasalahan yang didebatkan, abaikan dinamika emosi dan intonasi sesaat." },
    ],
  },
  {
    id: 38,
    moduleId: 4,
    category: "Love Language",
    title: "Penyampaian Rasa Sayang (Bahasa Kasih Utama)",
    description: "Kebutuhan afeksi yang paling diharapkan saat merasa lelah atau sedang jatuh mental.",
    options: [
      { key: "A", text: "Kata-kata penegasan (Words of Affirmation) & pelukan fisik (Physical Touch) yang menenangkan." },
      { key: "B", text: "Tindakan nyata melayani (Acts of Service) seperti disiapkan makanan atau dibantu pekerjaan." },
      { key: "C", text: "Waktu berkualitas (Quality Time) mendengarkan keluh kesah tanpa disela saran atau dihakimi." },
    ],
  },
  {
    id: 39,
    moduleId: 4,
    category: "Future Vision",
    title: "Komitmen Mengikuti Konseling Pernikahan Jika Terjadi Kebuntuan",
    description: "Jika di tahun ke-3 atau ke-5 pernikahan terjadi masalah komunikasi yang berlarut-larut.",
    options: [
      { key: "A", text: "Sepakat sejak pra-nikah: bersedia konsultasi ke psikolog/konselor pernikahan profesional." },
      { key: "B", text: "Prioritaskan meminta nasihat tokoh agama atau tetua keluarga yang dihormati kedua belah pihak." },
      { key: "C", text: "Wajib diselesaikan berdua secara internal tanpa melibatkan pihak luar siapapun." },
    ],
  },
  {
    id: 40,
    moduleId: 4,
    category: "Reconciliation",
    title: "Rutinitas Rekonsiliasi & Evaluasi Hubungan (Marriage Check-in)",
    description: "Menyediakan waktu khusus untuk saling mengevaluasi perasaan dan hal yang mengganjal.",
    options: [
      { key: "A", text: "Sesi 'Marriage Check-in' rutin bulanan: saling bertanya 'apa yang bisa aku perbaiki untukmu?'." },
      { key: "B", text: "Bahas perasaan hanya jika salah satu merasa ada hal yang mulai mengganjal." },
      { key: "C", text: "Jalani secara alami tanpa perlu sesi evaluasi formal yang terasa kaku." },
    ],
  },
];
