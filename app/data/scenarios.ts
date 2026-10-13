export interface DilemmaScenario {
  id: number;
  category: "Debt Ratio" | "Parental Allowance" | "Emergency Fund";
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

export const SCENARIOS: DilemmaScenario[] = [
  {
    id: 1,
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
    category: "Parental Allowance",
    title: "Urgent medical loan for parents",
    description: "If your parents require an urgent medical loan of IDR 15.000.000, how should the fund be allocated?",
    options: [
      { key: "A", text: "Draw directly from our joint emergency savings, no questions asked." },
      { key: "B", text: "Deduct entirely from my personal discretionary allowance over 6 months." },
      { key: "C", text: "Negotiate an affordable fixed cap, decline if it threatens primary family cashflow." },
    ],
    slider: {
      label: "Maximum monthly allocation for extended family",
      min: 500000,
      max: 5000000,
      step: 250000,
      unit: "IDR",
      defaultValue: 1500000,
    },
  },
  {
    id: 5,
    category: "Emergency Fund",
    title: "Emergency fund target (months of expenses)",
    description: "Berapa bulan pengeluaran rutin yang wajib tersimpan di dana darurat likuid sebelum investasi?",
    options: [
      { key: "A", text: "3 bulan pengeluaran (cukup untuk single income / aman)." },
      { key: "B", text: "6 bulan pengeluaran (standar ideal keluarga mandiri)." },
      { key: "C", text: "9-12 bulan pengeluaran (prioritas konservatif tanpa kompromi)." },
    ],
  },
  {
    id: 6,
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
    category: "Debt Ratio",
    title: "Disclosing purchases above IDR 2,000,000",
    description: "Aturan keterbukaan belanja pribadi yang melebihi batas tertentu.",
    options: [
      { key: "A", text: "Wajib diskusi dan sepakat bersama sebelum melakukan transaksi." },
      { key: "B", text: "Cukup saling memberi tahu setelah beli, asalkan memakai uang jajan pribadi." },
      { key: "C", text: "Bebas tanpa lapor selama tidak mengambil dana darurat atau cicilan bersama." },
    ],
  },
];
