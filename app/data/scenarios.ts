export interface DilemmaScenario {
  id: number;
  moduleId: number;
  category: string;
  categoryLabel: string;
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
    title: "Prinsip & Transparansi Finansial",
    subtitle: "KPR, cicilan PayLater, uang bulanan orang tua, dana darurat, dan rekening bersama.",
    description:
      "Sepuluh skenario realistis seputar keterbukaan utang, batas rasio cicilan, tunjangan orang tua, dan tata kelola arus kas keluarga baru.",
    estimatedTime: "10-12 menit",
  },
  {
    id: 2,
    title: "Mertua, Keluarga Besar & Batasan Privat",
    subtitle: "Tempat tinggal pasca akad, intervensi mertua, pinjaman kerabat, dan privasi rumah tangga.",
    description:
      "Sepuluh skenario krusial tentang dinamika keluarga besar, pilihan hidup mandiri dibanding tinggal bersama mertua, dan batasan privasi.",
    estimatedTime: "10-12 menit",
  },
  {
    id: 3,
    title: "Pembagian Peran, Pengasuhan & Karier",
    subtitle: "Pembagian tugas domestik, pengasuhan anak pasca cuti, dan kompromi relokasi karier.",
    description:
      "Menyelaraskan ekspektasi pembagian kerja domestik, pengasuhan anak, dan prioritas karier kedua pasangan di masa depan.",
    estimatedTime: "10 menit",
  },
  {
    id: 4,
    title: "Keintiman Emosional & Etika Resolusi Konflik",
    subtitle: "Privasi gawai, gaya komunikasi saat marah, batasan media sosial, dan rekonsiliasi.",
    description:
      "Membangun kesepakatan etika bertengkar, batasan privasi ponsel serta media sosial, dan jadwal evaluasi hubungan rutin.",
    estimatedTime: "8-10 menit",
  },
];

export const SCENARIOS: DilemmaScenario[] = [
  {
    id: 1,
    moduleId: 1,
    category: "Debt Ratio",
    categoryLabel: "Rasio Utang",
    title: "Sisa Cicilan PayLater & Kredit Sebelum Menikah",
    description:
      "Bagaimana penyelesaian tanggungan PayLater atau cicilan konsumtif yang sudah berjalan sebelum hari akad nikah?",
    options: [
      { key: "A", text: "Dilunasi bersama dari tabungan gabungan sebelum akad nikah." },
      { key: "B", text: "Menjadi tanggung jawab pribadi masing-masing tanpa mencampuri dana bersama." },
      { key: "C", text: "Dibuat rencana pelunasan bertahap secara terbuka dengan alokasi maksimal 10% pendapatan." },
    ],
  },
  {
    id: 2,
    moduleId: 1,
    category: "Debt Ratio",
    categoryLabel: "Rasio Utang",
    title: "Batas Maksimal Cicilan Bulanan Rumah Tangga",
    description:
      "Berapa batas maksimal persentase total cicilan gabungan terhadap pendapatan bersih bulanan?",
    options: [
      { key: "A", text: "Maksimal 20% agar arus kas keluarga tetap longgar dan tenang." },
      { key: "B", text: "Maksimal 30% sesuai standar kesehatan finansial untuk KPR dan aset." },
      { key: "C", text: "Fleksibel hingga 40% apabila ditujukan untuk cicilan rumah pertama." },
    ],
  },
  {
    id: 3,
    moduleId: 1,
    category: "Parental Allowance",
    categoryLabel: "Tunjangan Orang Tua",
    title: "Transfer Bulanan Rutin untuk Orang Tua & Mertua",
    description:
      "Bagaimana komitmen pemberian tunjangan bulanan untuk orang tua dari masing-masing pihak?",
    options: [
      { key: "A", text: "Nominal disamakan untuk kedua orang tua dan diambil dari rekening bersama." },
      { key: "B", text: "Dikelola terpisah dari uang saku pribadi masing-masing tanpa patokan nominal sama." },
      { key: "C", text: "Disesuaikan secara proporsional berdasarkan kondisi ekonomi orang tua masing-masing." },
    ],
  },
  {
    id: 4,
    moduleId: 1,
    category: "Parental Allowance",
    categoryLabel: "Tunjangan Orang Tua",
    title: "Dana Darurat Medis Orang Tua",
    description:
      "Jika orang tua membutuhkan biaya medis mendesak sebesar Rp 15.000.000 di luar tanggungan BPJS, bagaimana langkah kalian?",
    options: [
      { key: "A", text: "Ambil langsung dari tabungan darurat bersama tanpa perhitungan utang." },
      { key: "B", text: "Talangi dulu dari kas bersama lalu dicicil kembali dari pos pribadi selama 6 bulan." },
      { key: "C", text: "Bantu sesuai plafon aman kas rumah tangga dan komunikasikan batas kemampuan bersama saudara kandung." },
    ],
    slider: {
      label: "Batas plafon bantuan darurat keluarga per kejadian",
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
    categoryLabel: "Dana Darurat",
    title: "Target Dana Darurat Sebelum Investasi Berisiko",
    description:
      "Berapa bulan biaya hidup rutin yang wajib terkumpul di rekening dana darurat sebelum mulai berinvestasi agresif?",
    options: [
      { key: "A", text: "3 bulan pengeluaran pokok untuk fase awal pernikahan." },
      { key: "B", text: "6 bulan pengeluaran pokok sebagai standar aman keluarga mandiri." },
      { key: "C", text: "9 hingga 12 bulan pengeluaran pokok sebelum mengambil instrumen berisiko." },
    ],
  },
  {
    id: 6,
    moduleId: 1,
    category: "Emergency Fund",
    categoryLabel: "Dana Darurat",
    title: "Pemegang Akses & PIN Rekening Bersama",
    description:
      "Bagaimana pengaturan hak akses dan transparansi mutasi pada rekening bersama rumah tangga?",
    options: [
      { key: "A", text: "Kedua pihak memegang akses penuh dengan notifikasi transaksi ke kedua nomor." },
      { key: "B", text: "Satu pihak menjadi pengelola harian dan menyampaikan rekap mutasi setiap akhir bulan." },
      { key: "C", text: "Semua penarikan di atas batas tertentu memerlukan persetujuan tertulis kedua pihak." },
    ],
  },
  {
    id: 7,
    moduleId: 1,
    category: "Debt Ratio",
    categoryLabel: "Rasio Utang",
    title: "Pelunasan Pinjaman Pendidikan Pasangan",
    description:
      "Bagaimana sikap kalian terhadap sisa pinjaman biaya pendidikan atau kursus karier pasangan sebelum menikah?",
    options: [
      { key: "A", text: "Dilunasi bersama karena manfaat kariernya dinikmati oleh rumah tangga." },
      { key: "B", text: "Dilunasi oleh pihak yang bersangkutan dari alokasi penghasilan pribadinya." },
      { key: "C", text: "Dibantu bersama hanya ketika cicilan tersebut mulai menekan biaya kebutuhan pokok." },
    ],
  },
  {
    id: 8,
    moduleId: 1,
    category: "Emergency Fund",
    categoryLabel: "Dana Darurat",
    title: "Biaya Resepsi Pernikahan vs Uang Muka Rumah Pertama",
    description:
      "Bagaimana prioritas alokasi tabungan pra-nikah yang kalian miliki saat ini?",
    options: [
      { key: "A", text: "Utamakan resepsi pernikahan yang menghormati harapan kedua keluarga besar." },
      { key: "B", text: "Acara akad sederhana dan alokasikan 80% tabungan untuk uang muka rumah pertama." },
      { key: "C", text: "Bagi seimbang 50:50 antara acara syukuran keluarga dan modal awal rumah tangga." },
    ],
  },
  {
    id: 9,
    moduleId: 1,
    category: "Parental Allowance",
    categoryLabel: "Tunjangan Orang Tua",
    title: "Bantuan Biaya Sekolah Adik Kandung",
    description:
      "Bagaimana jika orang tua meminta kalian membantu biaya kuliah adik kandung saat kas rumah tangga sedang ketat?",
    options: [
      { key: "A", text: "Tetap dibantu rutin sebagai tanggung jawab kakak sampai adik lulus." },
      { key: "B", text: "Hanya dibantu secara sukarela apabila kebutuhan pokok dan tabungan inti sudah aman." },
      { key: "C", text: "Berikan sebagai pinjaman pendidikan tanpa bunga yang dicatat jelas." },
    ],
  },
  {
    id: 10,
    moduleId: 1,
    category: "Debt Ratio",
    categoryLabel: "Rasio Utang",
    title: "Transparansi Belanja Pribadi di Atas Rp 2.000.000",
    description:
      "Bagaimana aturan keterbukaan saat ingin membeli barang hobi atau kebutuhan pribadi bernominal besar?",
    options: [
      { key: "A", text: "Wajib berdiskusi dan mendapat persetujuan pasangan sebelum membeli." },
      { key: "B", text: "Cukup memberi tahu pasangan, selama menggunakan pos uang saku pribadi." },
      { key: "C", text: "Bebas tanpa perlu melapor selama tidak menyentuh rekening bersama." },
    ],
  },
  {
    id: 11,
    moduleId: 2,
    category: "Living Arrangement",
    categoryLabel: "Tempat Tinggal",
    title: "Pilihan Tempat Tinggal di Tahun Pertama Pernikahan",
    description: "Bagaimana keputusan tempat tinggal kalian pada 1 hingga 2 tahun pertama setelah akad?",
    options: [
      { key: "A", text: "Wajib menyewa atau mengontrak mandiri secara terpisah dari orang tua maupun mertua." },
      { key: "B", text: "Tinggal sementara di rumah orang tua atau mertua maksimal 1-2 tahun sambil mengumpulkan DP rumah." },
      { key: "C", text: "Menyewa hunian mandiri yang lokasinya berdekatan (di bawah 15 menit) dari rumah orang tua." },
    ],
  },
  {
    id: 12,
    moduleId: 2,
    category: "In-Law Privacy",
    categoryLabel: "Privasi Mertua",
    title: "Kunci Duplikat Rumah & Kunjungan Tanpa Kabar",
    description:
      "Mertua atau orang tua meminta kunci cadangan rumah dan sering berkunjung tanpa memberi kabar lebih dulu.",
    options: [
      { key: "A", text: "Tidak memberikan kunci cadangan dan menyepakati aturan memberi kabar minimal sehari sebelumnya." },
      { key: "B", text: "Titipkan kunci darurat dalam amplop tersegel, namun kunjungan tetap wajib memberi kabar." },
      { key: "C", text: "Memberikan kunci cadangan karena orang tua dianggap bagian dari rumah sendiri." },
    ],
  },
  {
    id: 13,
    moduleId: 2,
    category: "Parental Care",
    categoryLabel: "Perawatan Lansia",
    title: "Merawat Orang Tua Lanjut Usia di Masa Depan",
    description:
      "Jika kelak salah satu orang tua sudah lanjut usia atau sakit dan hidup sendirian, bagaimana langkah kalian?",
    options: [
      { key: "A", text: "Mengajak beliau tinggal satu atap di rumah kita untuk dirawat langsung." },
      { key: "B", text: "Menyewa perawat pendamping profesional di rumah beliau dengan kunjungan rutin." },
      { key: "C", text: "Membagi jadwal menginap dan biaya perawatan secara adil bersama saudara kandung lainnya." },
    ],
    slider: {
      label: "Alokasi anggaran bulanan untuk perawatan orang tua lansia",
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
    categoryLabel: "Tradisi Hari Raya",
    title: "Rotasi Mudik Hari Raya (Lebaran / Natal)",
    description: "Bagaimana cara kalian membagi jadwal mudik hari raya antara dua keluarga besar?",
    options: [
      { key: "A", text: "Rotasi bergantian per tahun secara disiplin antara keluarga suami dan keluarga istri." },
      { key: "B", text: "Bagi waktu pada tahun yang sama: hari pertama di satu keluarga, hari kedua di keluarga lainnya." },
      { key: "C", text: "Mengundang kedua orang tua merayakan hari raya bersama di rumah kita." },
    ],
  },
  {
    id: 15,
    moduleId: 2,
    category: "Child Rearing",
    categoryLabel: "Batas Pola Asuh",
    title: "Intervensi Pola Asuh Anak oleh Kakek & Nenek",
    description:
      "Orang tua atau mertua memberikan makanan atau aturan yang bertentangan dengan prinsip pengasuhan kalian.",
    options: [
      { key: "A", text: "Anak kandung dari orang tua tersebut wajib menyampaikan batasan secara santun namun tegas." },
      { key: "B", text: "Toleransi selama tidak membahayakan kesehatan dan keselamatan anak." },
      { key: "C", text: "Mengikuti saran orang tua saat sedang berada di rumah beliau demi menjaga suasana." },
    ],
  },
  {
    id: 16,
    moduleId: 2,
    category: "Family Borrowing",
    categoryLabel: "Pinjaman Kerabat",
    title: "Saudara Kandung Meminjam Uang Jumlah Besar",
    description:
      "Kakak atau adik ingin meminjam Rp 20.000.000 untuk modal usaha atau kebutuhan mendesak.",
    options: [
      { key: "A", text: "Tolak pinjaman besar dan berikan bantuan semampunya secara ikhlas tanpa mengharap kembali." },
      { key: "B", text: "Pinjamkan dengan perjanjian tertulis dan jadwal pengembalian yang disepakati berdua." },
      { key: "C", text: "Menolak semua bentuk utang-piutang keluarga agar tidak merusak silaturahmi." },
    ],
  },
  {
    id: 17,
    moduleId: 2,
    category: "In-Law Privacy",
    categoryLabel: "Privasi Mertua",
    title: "Menceritakan Konflik Rumah Tangga kepada Orang Tua",
    description:
      "Saat terjadi pertengkaran rumah tangga, sejauh mana orang tua boleh mengetahui masalah kalian?",
    options: [
      { key: "A", text: "Pantang menceritakan pertengkaran internal kepada orang tua maupun mertua." },
      { key: "B", text: "Hanya melibatkan orang tua atau mediator apabila menyangkut pelanggaran prinsip berat." },
      { key: "C", text: "Diperbolehkan meminta nasihat orang tua kandung selama tidak menjelekkan pasangan." },
    ],
  },
  {
    id: 18,
    moduleId: 2,
    category: "Living Arrangement",
    categoryLabel: "Tempat Tinggal",
    title: "Privasi Kamar Tidur Utama Saat Keluarga Menginap",
    description:
      "Bagaimana aturan akses kamar tidur utama ketika keluarga besar datang menginap di rumah?",
    options: [
      { key: "A", text: "Kamar utama adalah area privat pasangan yang tidak boleh dimasuki tamu maupun kerabat." },
      { key: "B", text: "Boleh dimasuki hanya dengan izin langsung dari pemilik rumah." },
      { key: "C", text: "Terbuka bagi orang tua atau saudara yang membutuhkan ruang istirahat." },
    ],
  },
  {
    id: 19,
    moduleId: 2,
    category: "Sandwich Generation",
    categoryLabel: "Generasi Sandwich",
    title: "Kenaikan Gaji: Tabungan Inti vs Tambahan Tunjangan Ortu",
    description:
      "Saat salah satu pihak mendapat promosi dan kenaikan pendapatan bersih sebesar 25%, bagaimana alokasinya?",
    options: [
      { key: "A", text: "100% kenaikan dialokasikan untuk mempercepat tabungan rumah dan pendidikan anak." },
      { key: "B", text: "Bagi proporsional: 70% untuk tabungan keluarga inti dan 30% untuk menambah tunjangan orang tua." },
      { key: "C", text: "Nominal kenaikan gaji cukup diketahui berdua agar tidak memicu ekspektasi baru dari kerabat." },
    ],
  },
  {
    id: 20,
    moduleId: 2,
    category: "Parental Care",
    categoryLabel: "Perawatan Lansia",
    title: "Keterlibatan Mertua dalam Belanja & Urusan Dapur",
    description:
      "Orang tua atau mertua sering mengatur isi kulkas, menu harian, dan cara mengelola belanja rumah tangga.",
    options: [
      { key: "A", text: "Kelola belanja rumah tangga secara mandiri berdua dan ajak mertua makan bersama di luar secara berkala." },
      { key: "B", text: "Terima masukan dengan sopan namun tetap jalankan anggaran belanja yang sudah disepakati berdua." },
      { key: "C", text: "Libatkan mertua saat belanja bulanan agar beliau merasa tetap dibutuhkan." },
    ],
  },
  {
    id: 21,
    moduleId: 3,
    category: "Chore Division",
    categoryLabel: "Tugas Domestik",
    title: "Pembagian Pekerjaan Rumah Tangga Pasangan Bekerja",
    description:
      "Jika suami dan istri sama-sama bekerja penuh waktu, bagaimana pembagian urusan kebersihan dan rumah tangga?",
    options: [
      { key: "A", text: "Bagi daftar tugas harian secara tertulis dan setara antara suami dan istri." },
      { key: "B", text: "Gunakan bantuan asisten rumah tangga atau layanan binatu agar waktu luang fokus untuk istirahat." },
      { key: "C", text: "Fleksibel bergantian mengerjakan sesuai siapa yang pulang lebih awal." },
    ],
  },
  {
    id: 22,
    moduleId: 3,
    category: "Childcare & Career",
    categoryLabel: "Pengasuhan & Karier",
    title: "Pengasuhan Anak Setelah Masa Cuti Melahirkan Selesai",
    description:
      "Bagaimana skema pengasuhan bayi setelah masa cuti melahirkan 3 bulan berakhir?",
    options: [
      { key: "A", text: "Salah satu pihak mengambil jeda karier sementara untuk fokus mendampingi tumbuh kembang awal anak." },
      { key: "B", text: "Menggunakan pengasuh profesional terlatih di rumah atau penitipan anak (daycare) terpercaya." },
      { key: "C", text: "Meminta bantuan orang tua atau mertua mendampingi pengasuhan selama jam kerja." },
    ],
  },
  {
    id: 23,
    moduleId: 3,
    category: "Career Relocation",
    categoryLabel: "Relokasi Karier",
    title: "Tawaran Promosi Karier di Luar Kota atau Luar Negeri",
    description:
      "Salah satu pihak mendapat promosi penting namun harus pindah domisili ke luar kota selama 2 tahun.",
    options: [
      { key: "A", text: "Pindah bersama sebagai satu keluarga meskipun pasangan harus mencari pekerjaan baru." },
      { key: "B", text: "Menjalani hubungan jarak jauh sementara dengan jadwal kepulangan rutin setiap dua minggu." },
      { key: "C", text: "Menolak penugasan luar kota demi menjaga keutuhan karier kedua pihak di kota saat ini." },
    ],
  },
  {
    id: 24,
    moduleId: 3,
    category: "Work-Life Boundaries",
    categoryLabel: "Batas Jam Kerja",
    title: "Batas Lembur & Pekerjaan Kantor di Akhir Pekan",
    description:
      "Bagaimana kesepakatan mengenai urusan pekerjaan kantor saat malam hari dan akhir pekan?",
    options: [
      { key: "A", text: "Akhir pekan bebas dari urusan pekerjaan kantor agar waktu berkualitas berdua terjaga." },
      { key: "B", text: "Toleransi lembur di akhir pekan secara terbatas asalkan dikomunikasikan sebelumnya." },
      { key: "C", text: "Saling mendukung jam kerja ekstra selama fase awal membangun fondasi ekonomi keluarga." },
    ],
  },
  {
    id: 25,
    moduleId: 3,
    category: "Domestic Budget",
    categoryLabel: "Anggaran Domestik",
    title: "Anggaran Asisten Rumah Tangga & Peralatan Otomasi",
    description:
      "Seberapa penting menyisihkan anggaran khusus untuk asisten rumah tangga atau alat bantu rumah?",
    options: [
      { key: "A", text: "Wajib dianggarkan sejak awal pernikahan untuk mencegah kelelahan dan pertengkaran domestik." },
      { key: "B", text: "Dikerjakan berdua terlebih dahulu di tahun pertama dan baru menyewa ART saat anak lahir." },
      { key: "C", text: "Mengutamakan penghematan mandiri agar dana tersebut masuk ke pos investasi." },
    ],
    slider: {
      label: "Batas anggaran bulanan untuk bantuan asisten rumah tangga",
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
    categoryLabel: "Perbedaan Gaji",
    title: "Sikap Saat Penghasilan Istri Lebih Tinggi dari Suami",
    description:
      "Bagaimana pengelolaan kas rumah tangga apabila penghasilan istri dua kali lipat lebih tinggi dari suami?",
    options: [
      { key: "A", text: "Kontribusi biaya rumah tangga dibagi proporsional sesuai persentase penghasilan masing-masing." },
      { key: "B", text: "Penghasilan suami menutup kebutuhan pokok harian, sementara penghasilan istri untuk tabungan aset." },
      { key: "C", text: "Seluruh pendapatan digabung 100% sebagai kas bersama tanpa membedakan besaran setoran." },
    ],
  },
  {
    id: 27,
    moduleId: 3,
    category: "Education Pursuit",
    categoryLabel: "Studi Lanjut",
    title: "Rencana Melanjutkan Studi Pascasarjana atau Sertifikasi",
    description:
      "Salah satu pasangan ingin melanjutkan kuliah S2 atau sertifikasi berbiaya besar setelah menikah.",
    options: [
      { key: "A", text: "Didukung penuh menggunakan tabungan bersama sebagai investasi masa depan keluarga." },
      { key: "B", text: "Didukung apabila menggunakan jalur beasiswa atau tabungan pribadi tanpa mengurangi dana darurat." },
      { key: "C", text: "Ditunda hingga uang muka rumah dan dana pendidikan dasar anak terpenuhi." },
    ],
  },
  {
    id: 28,
    moduleId: 3,
    category: "Daily Meals",
    categoryLabel: "Konsumsi Harian",
    title: "Pengaturan Makan Harian: Memasak vs Katering",
    description:
      "Bagaimana ekspektasi penyediaan makanan sehari-hari ketika kedua pihak lelah bekerja?",
    options: [
      { key: "A", text: "Menyiapkan bahan masakan di akhir pekan (meal prep) agar tetap makan masakan rumah yang hemat." },
      { key: "B", text: "Berlangganan katering rumahan sehat agar tidak membebani waktu istirahat malam." },
      { key: "C", text: "Memasak menu praktis saat senggang dan memesan makanan saat jadwal kerja padat." },
    ],
  },
  {
    id: 29,
    moduleId: 3,
    category: "Social Life",
    categoryLabel: "Pergaulan Kerja",
    title: "Acara Malam Bersama Rekan Kerja Tanpa Pasangan",
    description:
      "Bagaimana aturan menghadiri acara makan malam atau kumpul rekan kerja setelah jam kantor?",
    options: [
      { key: "A", text: "Memberi kabar sebelumnya dan menyepakati batas jam pulang (misalnya pukul 22.00)." },
      { key: "B", text: "Cukup berbagi lokasi dan perkiraan waktu pulang tanpa batas jam yang kaku." },
      { key: "C", text: "Mengajak pasangan ikut hadir pada acara yang memungkinkan agar saling mengenal rekan kerja." },
    ],
  },
  {
    id: 30,
    moduleId: 3,
    category: "Personal Space",
    categoryLabel: "Waktu Pribadi",
    title: "Alokasi Waktu Pribadi (Me-Time) & Hobi Masing-Masing",
    description:
      "Bagaimana pengaturan waktu pribadi untuk hobi atau istirahat sendiri setelah menikah?",
    options: [
      { key: "A", text: "Saling memberikan waktu pribadi terjadwal beberapa jam setiap minggu tanpa rasa bersalah." },
      { key: "B", text: "Waktu hobi pribadi dilakukan bersamaan ketika pasangan juga memiliki agenda sendiri." },
      { key: "C", text: "Mengutamakan kegiatan akhir pekan yang dilakukan bersama-sama." },
    ],
  },
  {
    id: 31,
    moduleId: 4,
    category: "Digital Privacy",
    categoryLabel: "Privasi Digital",
    title: "Akses Kata Sandi Ponsel & Akun Media Sosial",
    description:
      "Sejauh mana keterbukaan PIN layar kunci ponsel dan akses pesan pribadi di antara kalian?",
    options: [
      { key: "A", text: "Keterbukaan penuh: saling mengetahui PIN ponsel dan bebas mengakses kapan saja." },
      { key: "B", text: "Saling mengetahui PIN untuk kondisi darurat, namun menghormati ruang pesan tanpa memeriksa rutin." },
      { key: "C", text: "Ponsel merupakan ranah privat masing-masing yang dijaga melalui komitmen kepercayaan." },
    ],
  },
  {
    id: 32,
    moduleId: 4,
    category: "Conflict Resolution",
    categoryLabel: "Resolusi Konflik",
    title: "Waktu Menyelesaikan Pertengkaran: Malam Itu Juga vs Jeda Tenang",
    description:
      "Bagaimana cara kalian menangani perdebatan tajam yang terjadi menjelang waktu tidur?",
    options: [
      { key: "A", text: "Menyelesaikan pembicaraan malam itu juga agar tidak tidur dalam kondisi memendam amarah." },
      { key: "B", text: "Mengambil jeda tenang 2 hingga 3 jam atau tidur lebih dulu, lalu membahasnya pagi hari dengan kepala dingin." },
      { key: "C", text: "Menurunkan tensi dengan saling meminta maaf lebih dulu sebelum membahas pokok masalah." },
    ],
  },
  {
    id: 33,
    moduleId: 4,
    category: "Communication Boundaries",
    categoryLabel: "Etika Komunikasi",
    title: "Sikap Mendiamkan Pasangan (Silent Treatment) Saat Kecewa",
    description:
      "Bagaimana aturan kalian ketika salah satu pihak cenderung diam saat merasa kesal?",
    options: [
      { key: "A", text: "Dilarang mendiamkan pasangan tanpa penjelasan; wajib menyampaikan bahwa sedang butuh waktu tenang." },
      { key: "B", text: "Diperbolehkan mengambil waktu hening maksimal 2 jam sebelum kembali berdialog." },
      { key: "C", text: "Memberikan ruang sepenuhnya hingga pihak yang kecewa siap membuka pembicaraan." },
    ],
  },
  {
    id: 34,
    moduleId: 4,
    category: "Social Media Sharing",
    categoryLabel: "Media Sosial",
    title: "Mengunggah Keluhan atau Sindiran Rumah Tangga di Media Sosial",
    description:
      "Bagaimana batasan membuat status atau unggahan ketika sedang menghadapi masalah hubungan?",
    options: [
      { key: "A", text: "Dilarang mutlak mengunggah masalah rumah tangga atau kalimat sindiran di media sosial." },
      { key: "B", text: "Boleh berbagi kutipan umum selama sama sekali tidak mengarah pada urusan internal keluarga." },
      { key: "C", text: "Bebas berekspresi di akun terbatas (close friends) selama tidak menyebut nama pasangan." },
    ],
  },
  {
    id: 35,
    moduleId: 4,
    category: "Intimacy & Affection",
    categoryLabel: "Waktu Berdua",
    title: "Komitmen Waktu Kencan Berdua (Date Night) Setelah Menikah",
    description:
      "Bagaimana cara kalian menjaga kedekatan emosional di tengah kesibukan kerja dan mengurus rumah?",
    options: [
      { key: "A", text: "Menjadwalkan kencan berdua secara rutin setiap minggu tanpa membahas pekerjaan." },
      { key: "B", text: "Mengadakan agenda makan malam atau jalan berdua minimal dua kali dalam sebulan." },
      { key: "C", text: "Menjaga obrolan berkualitas setiap malam di rumah tanpa harus menjadwalkan kencan khusus." },
    ],
    slider: {
      label: "Alokasi anggaran bulanan untuk kegiatan waktu berkualitas berdua",
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
    categoryLabel: "Batasan Pertemanan",
    title: "Batasan Interaksi dengan Mantan & Teman Lawan Jenis",
    description:
      "Bagaimana aturan menjaga komunikasi dengan mantan pasangan atau teman dekat lawan jenis setelah menikah?",
    options: [
      { key: "A", text: "Menutup kontak pribadi dengan mantan dan tidak pergi berdua saja dengan teman lawan jenis." },
      { key: "B", text: "Komunikasi sebatas urusan profesional atau grup terbuka dengan sepengetahuan pasangan." },
      { key: "C", text: "Tetap berteman wajar selama bersikap transparan dan mengenalkan teman tersebut kepada pasangan." },
    ],
  },
  {
    id: 37,
    moduleId: 4,
    category: "Conflict Boundaries",
    categoryLabel: "Batas Pertengkaran",
    title: "Batas Intonasi Suara, Kata Kasar, dan Kata Pisah Saat Marah",
    description:
      "Apa garis merah yang tidak boleh dilanggar ketika sedang terjadi pertengkaran sengit?",
    options: [
      { key: "A", text: "Dilarang membentak, memaki, atau mengucapkan kata cerai/pisah dalam kondisi marah." },
      { key: "B", text: "Jika nada bicara mulai meninggi, diskusi wajib dihentikan sementara selama 15 menit." },
      { key: "C", text: "Fokus menyelesaikan akar masalah dan segera saling memaafkan bila ada ucapan yang terpeleset." },
    ],
  },
  {
    id: 38,
    moduleId: 4,
    category: "Love Language",
    categoryLabel: "Bahasa Kasih",
    title: "Bentuk Dukungan Utama Saat Pasangan Sedang Lelah Mental",
    description:
      "Respon seperti apa yang paling Anda butuhkan dari pasangan saat sedang mengalami tekanan berat?",
    options: [
      { key: "A", text: "Dukungan kata-kata yang menenangkan dan pelukan hangat tanpa dihakimi." },
      { key: "B", text: "Bantuan nyata mengambil alih tugas harian di rumah agar bisa beristirahat." },
      { key: "C", text: "Didengarkan secara utuh sampai selesai berbicara sebelum diberikan saran solusi." },
    ],
  },
  {
    id: 39,
    moduleId: 4,
    category: "Future Vision",
    categoryLabel: "Konseling Pernikahan",
    title: "Kesediaan Mengikuti Konseling Pernikahan Profesional",
    description:
      "Jika kelak muncul kebuntuan komunikasi yang tidak selesai berdua, ke mana kalian mencari bantuan?",
    options: [
      { key: "A", text: "Sepakat sejak awal untuk berkonsultasi kepada psikolog atau konselor pernikahan berlisensi." },
      { key: "B", text: "Meminta bimbingan tokoh agama atau mentor keluarga yang dipercaya kedua belah pihak." },
      { key: "C", text: "Menyelesaikan secara internal berdua melalui jadwal rekonsiliasi khusus." },
    ],
  },
  {
    id: 40,
    moduleId: 4,
    category: "Reconciliation",
    categoryLabel: "Evaluasi Hubungan",
    title: "Jadwal Evaluasi Perasaan & Rumah Tangga Bulanan",
    description:
      "Bagaimana kalian memastikan unek-unek kecil tidak menumpuk menjadi bom waktu di masa depan?",
    options: [
      { key: "A", text: "Mengadakan sesi obrolan evaluasi rutin sebulan sekali untuk saling bertanya hal yang perlu diperbaiki." },
      { key: "B", text: "Menyampaikan evaluasi secara langsung setiap akhir pekan sambil bersantai berdua." },
      { key: "C", text: "Membicarakan hal yang mengganjal kapan saja saat dirasa perlu tanpa jadwal formal." },
    ],
  },
];
