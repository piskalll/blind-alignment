"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Lock,
  Shield,
  KeyRound,
  MessageCircle,
  AlertCircle,
  Sun,
  Moon,
  CheckCircle2,
  EyeOff,
  Scale,
  FileSignature,
  LayoutGrid,
  BookOpen,
  SlidersHorizontal,
  Clock,
  ChevronDown,
  FolderOpen,
  Play,
  Menu,
  X,
  Loader2,
  Cloud,
  Search,
  Trash2,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import {
  generateRoomCode,
  generatePasscode,
  createRoom,
  createRoomAsync,
  joinRoom,
  joinRoomAsync,
  listSavedRooms,
  deleteRoomAsync,
  fetchRoomsFromSupabase,
  activateRoomSession,
  createDemoRoom,
  useTheme,
  type RoomData,
} from "../lib/sessionStore";
import { isSupabaseConfigured } from "../lib/supabase";
import { SCENARIOS } from "../data/scenarios";
import {
  HeroAlignmentIllustration,
  ModulePillarIllustration,
} from "./VisualIllustrations";

interface JoinRoomProps {
  onSuccess: (roomCode: string) => void;
}

const MODULE_META = [
  {
    id: 1,
    code: "MOD-01",
    title: "Prinsip & Transparansi Finansial",
    subtitle: "Rekening bersama, dana mertua & utang",
    summary:
      "Keterbukaan saldo, struktur kas rumah tangga, dan batas subsidi ke keluarga besar.",
  },
  {
    id: 2,
    code: "MOD-02",
    title: "Mertua & Batasan Privat",
    subtitle: "Aturan tinggal, kunjungan & privasi konflik",
    summary:
      "Garis batas antara bakti kepada orang tua dan kedaulatan rumah tangga baru.",
  },
  {
    id: 3,
    code: "MOD-03",
    title: "Visi Pengasuhan & Masa Depan Anak",
    subtitle: "Waktu punya anak, pengasuhan & pendidikan",
    summary:
      "Kesiapan finansial punya anak, peran kakek-nenek, dan kompromi karier saat anak lahir.",
  },
  {
    id: 4,
    code: "MOD-04",
    title: "Pembagian Peran, Karier & Konflik",
    subtitle: "Beban domestik, relokasi & etika bertengkar",
    summary:
      "Kesepakatan tugas harian di rumah, batasan lembur, dan protokol menyelesaikan konflik.",
  },
];

const FAQ_ITEMS = [
  {
    q: "Mengapa jawaban disegel sampai pasangan selesai?",
    a: "Agar tidak ada pihak yang mengalah atau ikut-ikutan (pleasing-bias). Perbandingan baru terbuka serentak saat kedua pihak menekan Kunci Jawaban.",
  },
  {
    q: "Bagaimana perlindungan PIN dan batas 2 pengguna bekerja?",
    a: "Setiap ruang dilindungi Kode Ruang dan 4-digit PIN. Begitu Host dan Guest bergabung, akses ruang otomatis terkunci untuk pihak ketiga.",
  },
  {
    q: "Mengapa Modul 2, 3, dan 4 terkunci di awal?",
    a: "Kurikulum disusun berjenjang. Modul berikutnya terbuka otomatis setelah Piagam Kesepakatan modul aktif ditandatangani berdua.",
  },
  {
    q: "Di mana data sesi dan tanda tangan disimpan?",
    a: "Tersimpan di Cloud Supabase serta penyimpanan lokal peramban, dan dapat dicetak menjadi dokumen PDF Piagam Kesepakatan kapan saja.",
  },
];

export const JoinRoomPage: React.FC<JoinRoomProps> = ({ onSuccess }) => {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  const [tab, setTab] = useState<"create" | "join">("create");
  const [createUsername, setCreateUsername] = useState("");
  const [createdRoomInfo, setCreatedRoomInfo] = useState<{
    code: string;
    pin: string;
  } | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [createFieldError, setCreateFieldError] = useState<string | null>(null);

  const [joinUsername, setJoinUsername] = useState("");
  const [joinRoomCode, setJoinRoomCode] = useState("");
  const [joinPin, setJoinPin] = useState("");
  const [joinError, setJoinError] = useState<string | null>(null);
  const [isJoining, setIsJoining] = useState(false);
  const [joinFieldErrors, setJoinFieldErrors] = useState<{
    username?: string;
    code?: string;
    pin?: string;
  }>({});

  const [savedRooms, setSavedRooms] = useState<RoomData[]>([]);
  const [isLoadingRooms, setIsLoadingRooms] = useState(true);
  const [deletingRoomCode, setDeletingRoomCode] = useState<string | null>(null);
  const [ledgerStep, setLedgerStep] = useState<1 | 2 | 3>(2);
  const [selectedModuleId, setSelectedModuleId] = useState<number>(1);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const loadRooms = async () => {
    setIsLoadingRooms(true);
    try {
      const rooms = await fetchRoomsFromSupabase();
      setSavedRooms(rooms);
    } catch {
      setSavedRooms(listSavedRooms());
    } finally {
      setIsLoadingRooms(false);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      loadRooms();
      const urlParams = new URLSearchParams(window.location.search);
      const roomParam = urlParams.get("room");
      const pinParam = urlParams.get("pin");
      if (roomParam) {
        setJoinRoomCode(roomParam.toUpperCase());
        setTab("join");
      }
      if (pinParam) {
        setJoinPin(pinParam);
      }
    }
  }, []);

  const handleDeleteRoom = async (code: string) => {
    if (!window.confirm(`Yakin ingin menghapus sesi Ruang ${code}?`)) return;

    try {
      setDeletingRoomCode(code);
      const result = await deleteRoomAsync(code);
      setSavedRooms((prev) => prev.filter((r) => r.code !== code));
      if (result.cloudDeleted) {
        toast.success(`Ruang ${code} berhasil dihapus dari Cloud Supabase & lokal.`);
      } else {
        toast.success(`Ruang ${code} berhasil dihapus dari penyimpanan perangkat.`);
      }
    } catch {
      toast.error(`Gagal menghapus sesi Ruang ${code}.`);
    } finally {
      setDeletingRoomCode(null);
    }
  };

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateFieldError(null);

    const sanitizedName = createUsername.trim();
    if (!sanitizedName) {
      setCreateFieldError("Nama panggilan tidak boleh kosong.");
      return;
    }
    if (sanitizedName.length < 2) {
      setCreateFieldError("Nama panggilan minimal 2 karakter.");
      return;
    }

    try {
      setIsCreating(true);
      const result = await createRoomAsync(sanitizedName);
      setCreatedRoomInfo({ code: result.code, pin: result.passcode });
      await loadRooms();

      if (result.cloudSynced) {
        toast.success(`Ruang ${result.code} berhasil dibuat!`, {
          description: "Data sesi tersimpan di Cloud Supabase & penyimpanan lokal.",
        });
      } else {
        toast.success(`Ruang ${result.code} berhasil dibuat!`, {
          description: "Data sesi tersimpan di penyimpanan lokal perangkat.",
        });
      }
    } catch (err: unknown) {
      console.error("Gagal membuat ruang:", err);
      toast.error("Terjadi kendala saat membuat ruang. Mencoba penyimpanan lokal.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleInviteWhatsApp = () => {
    if (!createdRoomInfo) return;
    const inviteLink = `${window.location.origin}/?room=${createdRoomInfo.code}&pin=${createdRoomInfo.pin}`;
    const text = encodeURIComponent(
      `Hai! Mari kita isi sesi keselarasan pra-nikah di VowSync (SalingPaham).\n\nKode Ruang: *${createdRoomInfo.code}*\nPIN Rahasia: *${createdRoomInfo.pin}*\n\nAtau buka tautan langsung ini:\n${inviteLink}`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const handleJoinRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    setJoinError(null);
    setJoinFieldErrors({});

    const code = joinRoomCode.trim().toUpperCase();
    const username = joinUsername.trim();
    const pin = joinPin.trim();

    const errors: { username?: string; code?: string; pin?: string } = {};

    if (!username) {
      errors.username = "Nama panggilan wajib diisi.";
    } else if (username.length < 2) {
      errors.username = "Nama panggilan minimal 2 karakter.";
    }

    if (!code) {
      errors.code = "Kode ruang wajib diisi.";
    } else if (!code.startsWith("VWS-") || code.length < 5) {
      errors.code = "Format kode ruang harus VWS-XXX (contoh: VWS-482).";
    }

    if (!pin) {
      errors.pin = "4-digit PIN wajib diisi.";
    } else if (pin.length < 4) {
      errors.pin = "PIN harus terdiri dari minimal 4 digit.";
    }

    if (Object.keys(errors).length > 0) {
      setJoinFieldErrors(errors);
      return;
    }

    try {
      setIsJoining(true);
      const result = await joinRoomAsync(code, username, pin);

      if (result.success) {
        toast.success(`Berhasil bergabung ke Ruang ${code}!`, {
          description: `Selamat datang, ${username}. Membuka sesi Anda...`,
        });
        onSuccess(code);
      } else {
        if (result.error === "NOT_FOUND") {
          const msg = "Ruang tidak ditemukan di Supabase maupun lokal. Pastikan kode ruang benar atau buat ruang baru.";
          setJoinError(msg);
          toast.error(msg);
        } else if (result.error === "WRONG_PIN") {
          const msg = "PIN rahasia tidak sesuai. Mintalah 4-digit PIN kepada pasangan Anda.";
          setJoinError(msg);
          toast.error(msg);
        } else if (result.error === "ROOM_FULL") {
          const msg = "Ruang ini sudah terisi penuh oleh 2 pasangan dan terkunci.";
          setJoinError(msg);
          toast.error(msg);
        }
      }
    } catch (err: unknown) {
      console.error("Gagal verifikasi bergabung:", err);
      const fallbackMsg = "Terjadi gangguan koneksi saat verifikasi ruang.";
      setJoinError(fallbackMsg);
      toast.error(fallbackMsg);
    } finally {
      setIsJoining(false);
    }
  };

  const handleLaunchDemo = (targetPath?: string) => {
    const demo = createDemoRoom();
    loadRooms();
    setMobileNavOpen(false);
    if (targetPath) {
      router.push(targetPath);
    } else {
      onSuccess(demo.code);
    }
  };

  const handleOpenSavedRoom = (
    room: RoomData,
    role: "host" | "guest",
    subPath = ""
  ) => {
    activateRoomSession(room.code, role);
    setMobileNavOpen(false);
    router.push(`/room/${encodeURIComponent(room.code)}${subPath}`);
  };

  const moduleScenarios = SCENARIOS.filter(
    (s) => (s.moduleId || 1) === selectedModuleId
  );
  const filteredScenarios = moduleScenarios.filter((s) => {
    if (!searchKeyword.trim()) return true;
    const kw = searchKeyword.toLowerCase();
    return (
      (s.title || "").toLowerCase().includes(kw) ||
      (s.description || "").toLowerCase().includes(kw) ||
      (s.categoryLabel || "").toLowerCase().includes(kw)
    );
  });
  const activeModuleMeta =
    MODULE_META.find((m) => m.id === selectedModuleId) || MODULE_META[0];

  const primarySavedRoom = savedRooms[0] || null;
  const activeHeaderRoomCode = primarySavedRoom?.code || "VWS-DEMO";

  const handleHeaderStageJump = (subPath: string) => {
    if (primarySavedRoom) {
      handleOpenSavedRoom(primarySavedRoom, "host", subPath);
    } else {
      handleLaunchDemo(`/room/VWS-DEMO${subPath}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAF7] text-[#1E293B] flex flex-col">
      {/* Top Two-Tier Editorial Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#FFFFFF] border-b border-[#CBD5E1]">
        {/* Row 1: Brand, Section Anchors & Theme Controls */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-3">
          <a
            href="#mulai-sesi"
            className="flex items-center gap-2.5 min-h-[44px] pr-2 rounded-lg shrink-0"
          >
            <div className="w-8 h-8 rounded-lg bg-[#1E293B] text-[#FFFFFF] flex items-center justify-center font-bold text-xs tracking-wider shrink-0">
              VS
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#1E293B] text-base leading-none tracking-tight">
                VowSync
              </span>
              <span className="hidden sm:inline-block text-[10px] font-mono uppercase font-bold text-[#0F766E] px-1.5 py-0.5 bg-[#F0FDFA] border border-[#CCFBF1] rounded">
                SalingPaham
              </span>
            </div>
          </a>

          <nav
            aria-label="Navigasi Bagian Beranda"
            className="hidden lg:flex items-center gap-1"
          >
            <a
              href="#mulai-sesi"
              className="px-3 py-1.5 rounded-md text-xs font-semibold text-[#475569] hover:text-[#1E293B] hover:bg-[#F1F5F9] transition-colors whitespace-nowrap"
            >
              Terminal Ruang
            </a>
            <a
              href="#cara-kerja"
              className="px-3 py-1.5 rounded-md text-xs font-semibold text-[#475569] hover:text-[#1E293B] hover:bg-[#F1F5F9] transition-colors whitespace-nowrap"
            >
              Simulasi Segel Ganda
            </a>
            <a
              href="#empat-pilar"
              className="px-3 py-1.5 rounded-md text-xs font-semibold text-[#475569] hover:text-[#1E293B] hover:bg-[#F1F5F9] transition-colors whitespace-nowrap"
            >
              40 Skenario Kurikulum
            </a>
            <a
              href="#faq"
              className="px-3 py-1.5 rounded-md text-xs font-semibold text-[#475569] hover:text-[#1E293B] hover:bg-[#F1F5F9] transition-colors whitespace-nowrap"
            >
              Tanya Jawab
            </a>
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => handleLaunchDemo("/room/VWS-DEMO")}
              className="min-h-[40px] sm:min-h-[44px] px-3 py-2 rounded-lg bg-[#0F766E] hover:bg-[#115E59] text-[#FFFFFF] text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <Play className="w-3.5 h-3.5 fill-current shrink-0" />
              <span className="hidden sm:inline">Buka Ruang Simulasi</span>
              <span className="sm:hidden">Simulasi</span>
            </button>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label={
                theme === "dark"
                  ? "Aktifkan mode terang"
                  : "Aktifkan mode gelap"
              }
              title={
                theme === "dark" ? "Mode Terang (Kertas)" : "Mode Gelap (Malam)"
              }
              className="min-h-[40px] min-w-[40px] sm:min-h-[44px] sm:min-w-[44px] inline-flex items-center justify-center rounded-lg border border-[#CBD5E1] bg-[#FFFFFF] text-[#1E293B] hover:bg-[#F1F5F9] transition-colors cursor-pointer"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setMobileNavOpen((prev) => !prev)}
              aria-expanded={mobileNavOpen}
              aria-label="Buka menu navigasi"
              className="md:hidden min-h-[40px] min-w-[40px] inline-flex items-center justify-center rounded-lg border border-[#CBD5E1] bg-[#FFFFFF] text-[#1E293B] hover:bg-[#F1F5F9] transition-colors cursor-pointer"
            >
              {mobileNavOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Row 2: Connected Stage Navigation Bar (Tablet & Desktop >= 768px) */}
        <div className="hidden md:block border-t border-[#E2E8F0] bg-[#F8FAF7]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-11 flex items-center justify-between gap-4">
            <nav
              aria-label="Pintasan Halaman Sesi"
              className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1"
            >
              <span className="font-mono text-[11px] font-bold uppercase text-[#0F766E] pr-2 whitespace-nowrap shrink-0">
                PINTASAN SESI ({activeHeaderRoomCode}):
              </span>
              <button
                type="button"
                onClick={() => handleHeaderStageJump("")}
                className="px-2.5 py-1.5 rounded-md text-xs font-bold text-[#475569] hover:text-[#1E293B] hover:bg-[#FFFFFF] transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <LayoutGrid className="w-3.5 h-3.5 text-[#0F766E]" />
                <span>Dashboard</span>
              </button>
              <button
                type="button"
                onClick={() => handleHeaderStageJump("/intro?module=1")}
                className="px-2.5 py-1.5 rounded-md text-xs font-bold text-[#475569] hover:text-[#1E293B] hover:bg-[#FFFFFF] transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5 text-[#0F766E]" />
                <span>Pengantar</span>
              </button>
              <button
                type="button"
                onClick={() => handleHeaderStageJump("/dilemma?module=1")}
                className="px-2.5 py-1.5 rounded-md text-xs font-bold text-[#475569] hover:text-[#1E293B] hover:bg-[#FFFFFF] transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#0F766E]" />
                <span>10 Skenario</span>
              </button>
              <button
                type="button"
                onClick={() => handleHeaderStageJump("/waiting?module=1")}
                className="px-2.5 py-1.5 rounded-md text-xs font-bold text-[#475569] hover:text-[#1E293B] hover:bg-[#FFFFFF] transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Clock className="w-3.5 h-3.5 text-[#0F766E]" />
                <span>Ruang Tunggu</span>
              </button>
              <button
                type="button"
                onClick={() => handleHeaderStageJump("/result?module=1")}
                className="px-2.5 py-1.5 rounded-md text-xs font-bold text-[#475569] hover:text-[#1E293B] hover:bg-[#FFFFFF] transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Scale className="w-3.5 h-3.5 text-[#0F766E]" />
                <span>Hasil</span>
              </button>
              <button
                type="button"
                onClick={() => handleHeaderStageJump("/charter?module=1")}
                className="px-2.5 py-1.5 rounded-md text-xs font-bold text-[#475569] hover:text-[#1E293B] hover:bg-[#FFFFFF] transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <FileSignature className="w-3.5 h-3.5 text-[#0F766E]" />
                <span>Piagam</span>
              </button>
            </nav>

            <span className="hidden xl:inline font-mono text-[11px] text-[#475569] shrink-0">
              Segel Ganda · Kapasitas 2 Pasangan
            </span>
          </div>
        </div>

        {/* Mobile Navigation Drawer (< 768px) */}
        {mobileNavOpen && (
          <nav
            aria-label="Navigasi Mobile Beranda"
            className="md:hidden border-t border-[#E2E8F0] bg-[#FFFFFF] px-4 py-3 space-y-3 shadow-lg"
          >
            <div className="text-[11px] font-mono font-bold uppercase text-[#0F766E]">
              Bagian Halaman Beranda
            </div>
            <div className="grid grid-cols-2 gap-2">
              <a
                href="#mulai-sesi"
                onClick={() => setMobileNavOpen(false)}
                className="min-h-[44px] px-3 py-2 rounded-lg border border-[#CBD5E1] text-xs font-bold text-[#1E293B] hover:bg-[#F1F5F9] flex items-center"
              >
                Terminal Ruang
              </a>
              <a
                href="#cara-kerja"
                onClick={() => setMobileNavOpen(false)}
                className="min-h-[44px] px-3 py-2 rounded-lg border border-[#CBD5E1] text-xs font-bold text-[#1E293B] hover:bg-[#F1F5F9] flex items-center"
              >
                Simulasi Segel
              </a>
              <a
                href="#empat-pilar"
                onClick={() => setMobileNavOpen(false)}
                className="min-h-[44px] px-3 py-2 rounded-lg border border-[#CBD5E1] text-xs font-bold text-[#1E293B] hover:bg-[#F1F5F9] flex items-center"
              >
                40 Skenario
              </a>
              <a
                href="#faq"
                onClick={() => setMobileNavOpen(false)}
                className="min-h-[44px] px-3 py-2 rounded-lg border border-[#CBD5E1] text-xs font-bold text-[#1E293B] hover:bg-[#F1F5F9] flex items-center"
              >
                Tanya Jawab
              </a>
            </div>

            <div className="pt-2 border-t border-[#E2E8F0] space-y-2">
              <div className="text-[11px] font-mono font-bold uppercase text-[#0F766E]">
                Pintasan Halaman Sesi ({activeHeaderRoomCode})
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleHeaderStageJump("")}
                  className="min-h-[44px] px-3 py-2 rounded-lg bg-[#F8FAF7] border border-[#CBD5E1] text-xs font-bold text-[#1E293B] flex items-center gap-2 cursor-pointer"
                >
                  <LayoutGrid className="w-4 h-4 text-[#0F766E] shrink-0" />
                  <span>Dashboard</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleHeaderStageJump("/intro?module=1")}
                  className="min-h-[44px] px-3 py-2 rounded-lg bg-[#F8FAF7] border border-[#CBD5E1] text-xs font-bold text-[#1E293B] flex items-center gap-2 cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 text-[#0F766E] shrink-0" />
                  <span>Pengantar</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleHeaderStageJump("/dilemma?module=1")}
                  className="min-h-[44px] px-3 py-2 rounded-lg bg-[#F8FAF7] border border-[#CBD5E1] text-xs font-bold text-[#1E293B] flex items-center gap-2 cursor-pointer"
                >
                  <SlidersHorizontal className="w-4 h-4 text-[#0F766E] shrink-0" />
                  <span>10 Skenario</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleHeaderStageJump("/waiting?module=1")}
                  className="min-h-[44px] px-3 py-2 rounded-lg bg-[#F8FAF7] border border-[#CBD5E1] text-xs font-bold text-[#1E293B] flex items-center gap-2 cursor-pointer"
                >
                  <Clock className="w-4 h-4 text-[#0F766E] shrink-0" />
                  <span>Ruang Tunggu</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleHeaderStageJump("/result?module=1")}
                  className="min-h-[44px] px-3 py-2 rounded-lg bg-[#F8FAF7] border border-[#CBD5E1] text-xs font-bold text-[#1E293B] flex items-center gap-2 cursor-pointer"
                >
                  <Scale className="w-4 h-4 text-[#0F766E] shrink-0" />
                  <span>Hasil</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleHeaderStageJump("/charter?module=1")}
                  className="min-h-[44px] px-3 py-2 rounded-lg bg-[#F8FAF7] border border-[#CBD5E1] text-xs font-bold text-[#1E293B] flex items-center gap-2 cursor-pointer"
                >
                  <FileSignature className="w-4 h-4 text-[#0F766E] shrink-0" />
                  <span>Piagam</span>
                </button>
              </div>
            </div>
          </nav>
        )}
      </header>

      <main className="flex-1">
        {/* SECTION 1: HERO & ROOM TERMINAL */}
        <section
          id="mulai-sesi"
          className="border-b border-[#E2E8F0] py-10 sm:py-14 lg:py-20"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
              {/* Left Column: Editorial Premise & Visual Dual-Blind Illustration */}
              <div className="lg:col-span-7 space-y-5">
                <p className="font-mono text-xs font-bold uppercase tracking-widest text-[#0F766E]">
                  01 / MEKANISME DUAL-BLIND PRA-NIKAH
                </p>

                <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-[1.12] text-[#1E293B]">
                  Selesaikan diskusi{" "}
                  <span className="font-serif italic font-normal text-[#0F766E]">
                    uang, mertua, dan pengasuhan
                  </span>{" "}
                  sebelum hari akad.
                </h1>

                <p className="text-[#475569] text-sm sm:text-base max-w-xl leading-relaxed">
                  Jawab 40 dilema rumah tangga secara terpisah tanpa rasa sungkan.
                  Perbandingan baru terbuka serentak setelah Anda dan pasangan
                  mengunci jawaban.
                </p>

                <HeroAlignmentIllustration onQuickJump={handleLaunchDemo} />
              </div>

              {/* Right Column: Room Creation / Join Terminal + Saved Rooms */}
              <div className="lg:col-span-5 space-y-5">
                <div className="bg-[#FFFFFF] rounded-xl p-6 sm:p-8 border border-[#CBD5E1] shadow-xs">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#0F766E] block">
                          TERMINAL RUANG PRIVAT
                        </span>
                        {isSupabaseConfigured && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></span>
                            <span>Supabase Cloud Sync</span>
                          </span>
                        )}
                      </div>
                      <h2 className="text-lg font-bold text-[#1E293B] mt-0.5">
                        Mulai atau Gabung Sesi Pasangan
                      </h2>
                    </div>
                    <Lock className="w-5 h-5 text-[#0F766E] shrink-0" />
                  </div>

                  {/* Tab Switcher */}
                  <div
                    role="tablist"
                    aria-label="Pilih mode akses ruang"
                    className="grid grid-cols-2 gap-1 p-1 bg-[#F1F5F9] rounded-lg border border-[#E2E8F0] mb-6"
                  >
                    <button
                      type="button"
                      role="tab"
                      aria-selected={tab === "create"}
                      onClick={() => {
                        setTab("create");
                        setCreatedRoomInfo(null);
                      }}
                      className={`min-h-[44px] py-2 px-3 rounded-md text-xs font-bold transition-colors cursor-pointer ${
                        tab === "create"
                          ? "bg-[#FFFFFF] text-[#1E293B] shadow-2xs border border-[#CBD5E1]"
                          : "text-[#475569] hover:text-[#1E293B]"
                      }`}
                    >
                      Buat Ruang Baru
                    </button>
                    <button
                      type="button"
                      role="tab"
                      aria-selected={tab === "join"}
                      onClick={() => setTab("join")}
                      className={`min-h-[44px] py-2 px-3 rounded-md text-xs font-bold transition-colors cursor-pointer ${
                        tab === "join"
                          ? "bg-[#FFFFFF] text-[#1E293B] shadow-2xs border border-[#CBD5E1]"
                          : "text-[#475569] hover:text-[#1E293B]"
                      }`}
                    >
                      Gabung Ruang Pasangan
                    </button>
                  </div>

                  {/* TAB 1: CREATE ROOM */}
                  {tab === "create" && (
                    <div>
                      {!createdRoomInfo ? (
                        <form onSubmit={handleCreateRoom} className="space-y-4">
                          <div>
                            <label
                              htmlFor="create-username"
                              className="block text-xs font-bold uppercase tracking-wider text-[#1E293B] mb-1.5"
                            >
                              Nama Panggilan Anda (Pembuat Ruang)
                            </label>
                            <input
                              id="create-username"
                              type="text"
                              value={createUsername}
                              onChange={(e) => {
                                setCreateUsername(e.target.value);
                                if (createFieldError) setCreateFieldError(null);
                              }}
                              className="w-full min-h-[44px] px-4 py-2.5 rounded-lg border border-[#CBD5E1] bg-[#FFFFFF] focus:border-[#0F766E] text-[#1E293B] font-medium text-sm"
                              placeholder="Contoh: Bima"
                              required
                            />
                            {createFieldError && (
                              <p role="alert" className="text-xs font-semibold text-[#DC2626] mt-1.5 flex items-center gap-1">
                                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                <span>{createFieldError}</span>
                              </p>
                            )}
                            <p className="text-xs text-[#475569] mt-1.5 leading-relaxed">
                              Nama ini dicantumkan pada lembar perbandingan
                              jawaban dan dokumen Piagam Kesepakatan.
                            </p>
                          </div>

                          <button
                            type="submit"
                            disabled={isCreating || !createUsername.trim()}
                            className="w-full min-h-[48px] mt-2 py-3 px-5 bg-[#0F766E] hover:bg-[#115E59] disabled:opacity-50 text-[#FFFFFF] font-bold rounded-lg transition-colors text-sm cursor-pointer flex items-center justify-center gap-2"
                          >
                            {isCreating ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                                <span>Menyimpan ke Supabase &amp; Mengunci PIN...</span>
                              </>
                            ) : (
                              <span>Buat Kode Ruang &amp; 4-Digit PIN</span>
                            )}
                          </button>
                        </form>
                      ) : (
                        <div className="space-y-4">
                          <div className="p-4 bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl space-y-3">
                            <div className="text-xs font-bold uppercase tracking-wider text-[#065F46] flex items-center gap-1.5">
                              <Shield className="w-4 h-4 shrink-0" />
                              <span>Ruang Privat Siap Digunakan</span>
                            </div>

                            <div className="grid grid-cols-2 gap-3 pt-1">
                              <div className="bg-[#FFFFFF] p-3 rounded-lg border border-[#A7F3D0] text-center">
                                <div className="text-[11px] text-[#475569] uppercase font-mono font-semibold">
                                  Kode Ruang
                                </div>
                                <div className="text-xl font-bold font-mono text-[#1E293B] mt-0.5">
                                  {createdRoomInfo.code}
                                </div>
                              </div>
                              <div className="bg-[#FFFFFF] p-3 rounded-lg border border-[#A7F3D0] text-center">
                                <div className="text-[11px] text-[#475569] uppercase font-mono font-semibold">
                                  PIN Rahasia
                                </div>
                                <div className="text-xl font-bold font-mono text-[#0F766E] mt-0.5">
                                  {createdRoomInfo.pin}
                                </div>
                              </div>
                            </div>

                            <p className="text-xs text-[#065F46] leading-relaxed">
                              Bagikan <strong>Kode Ruang</strong> dan{" "}
                              <strong>PIN</strong> di atas hanya kepada pasangan
                              Anda. Ruang akan dikunci untuk 2 orang setelah
                              pasangan bergabung.
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={handleInviteWhatsApp}
                            className="w-full min-h-[44px] py-3 px-4 bg-[#065F46] hover:bg-[#047857] text-[#FFFFFF] rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                          >
                            <MessageCircle className="w-4 h-4" />
                            <span>Bagikan Kode &amp; PIN lewat WhatsApp</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => onSuccess(createdRoomInfo.code)}
                            className="w-full min-h-[48px] py-3 px-4 bg-[#1E293B] hover:bg-[#0F172A] text-[#FFFFFF] rounded-lg text-xs font-bold transition-colors cursor-pointer"
                          >
                            Buka Dashboard Ruang {createdRoomInfo.code}
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 2: JOIN EXISTING ROOM */}
                  {tab === "join" && (
                    <form onSubmit={handleJoinRoom} className="space-y-4">
                      <div>
                        <label
                          htmlFor="join-username"
                          className="block text-xs font-bold uppercase tracking-wider text-[#1E293B] mb-1.5"
                        >
                          Nama Panggilan Anda
                        </label>
                        <input
                          id="join-username"
                          type="text"
                          value={joinUsername}
                          onChange={(e) => {
                            setJoinUsername(e.target.value);
                            if (joinFieldErrors.username) {
                              setJoinFieldErrors((prev) => ({ ...prev, username: undefined }));
                            }
                          }}
                          className="w-full min-h-[44px] px-4 py-2.5 rounded-lg border border-[#CBD5E1] bg-[#FFFFFF] focus:border-[#0F766E] text-[#1E293B] font-medium text-sm"
                          placeholder="Contoh: Nadia"
                          required
                        />
                        {joinFieldErrors.username && (
                          <p role="alert" className="text-xs font-semibold text-[#DC2626] mt-1.5 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{joinFieldErrors.username}</span>
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label
                            htmlFor="join-room-code"
                            className="block text-xs font-bold uppercase tracking-wider text-[#1E293B] mb-1.5"
                          >
                            Kode Ruang
                          </label>
                          <input
                            id="join-room-code"
                            type="text"
                            value={joinRoomCode}
                            onChange={(e) => {
                              setJoinRoomCode(e.target.value);
                              if (joinFieldErrors.code) {
                                setJoinFieldErrors((prev) => ({ ...prev, code: undefined }));
                              }
                            }}
                            className="w-full min-h-[44px] px-3 py-2.5 rounded-lg border border-[#CBD5E1] bg-[#FFFFFF] font-mono tracking-wider text-[#1E293B] font-bold text-center text-sm uppercase focus:border-[#0F766E]"
                            placeholder="VWS-XXX"
                            required
                          />
                          {joinFieldErrors.code && (
                            <p role="alert" className="text-xs font-semibold text-[#DC2626] mt-1.5 flex items-center gap-1">
                              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                              <span>{joinFieldErrors.code}</span>
                            </p>
                          )}
                        </div>

                        <div>
                          <label
                            htmlFor="join-pin"
                            className="block text-xs font-bold uppercase tracking-wider text-[#1E293B] mb-1.5"
                          >
                            4-Digit PIN
                          </label>
                          <div className="relative">
                            <input
                              id="join-pin"
                              type="password"
                              maxLength={6}
                              value={joinPin}
                              onChange={(e) => {
                                setJoinPin(e.target.value);
                                if (joinFieldErrors.pin) {
                                  setJoinFieldErrors((prev) => ({ ...prev, pin: undefined }));
                                }
                              }}
                              className="w-full min-h-[44px] px-3 py-2.5 rounded-lg border border-[#CBD5E1] bg-[#FFFFFF] font-mono tracking-widest text-[#1E293B] font-bold text-center text-sm focus:border-[#0F766E]"
                              placeholder="••••"
                              required
                            />
                            <KeyRound className="w-4 h-4 text-[#475569] absolute right-3 top-3 pointer-events-none" />
                          </div>
                          {joinFieldErrors.pin && (
                            <p role="alert" className="text-xs font-semibold text-[#DC2626] mt-1.5 flex items-center gap-1">
                              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                              <span>{joinFieldErrors.pin}</span>
                            </p>
                          )}
                        </div>
                      </div>

                      {joinError && (
                        <div
                          role="alert"
                          className="p-3.5 bg-[#FEF2F2] border border-[#FECACA] rounded-lg text-xs text-[#991B1B] font-medium flex items-start gap-2"
                        >
                          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                          <span>{joinError}</span>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isJoining}
                        className="w-full min-h-[48px] mt-2 py-3 px-6 bg-[#0F766E] hover:bg-[#115E59] disabled:opacity-50 text-[#FFFFFF] font-bold rounded-lg transition-colors text-sm cursor-pointer flex items-center justify-center gap-2"
                      >
                        {isJoining ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                            <span>Memverifikasi PIN ke Supabase...</span>
                          </>
                        ) : (
                          <span>Verifikasi PIN &amp; Masuk Ruang</span>
                        )}
                      </button>
                    </form>
                  )}
                </div>

                {/* Saved Rooms on This Device & Cloud */}
                <div className="bg-[#FFFFFF] rounded-xl p-5 border border-[#CBD5E1]">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <FolderOpen className="w-4 h-4 text-[#0F766E]" />
                      <h3 className="text-xs font-bold uppercase tracking-wider text-[#1E293B]">
                        Sesi Ruang Pasangan ({savedRooms.length})
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => loadRooms()}
                        disabled={isLoadingRooms}
                        className="p-1.5 rounded-md border border-[#CBD5E1] bg-[#FFFFFF] hover:bg-[#F1F5F9] text-[#475569] hover:text-[#0F766E] transition-colors cursor-pointer"
                        title="Muat Ulang dari Database Supabase"
                        aria-label="Muat Ulang dari Database Supabase"
                      >
                        <RefreshCw
                          className={`w-3.5 h-3.5 ${
                            isLoadingRooms ? "animate-spin text-[#0F766E]" : ""
                          }`}
                        />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleLaunchDemo()}
                        className="text-xs font-bold text-[#0F766E] hover:underline cursor-pointer"
                      >
                        + Muat Ruang Demo
                      </button>
                    </div>
                  </div>

                  {isLoadingRooms ? (
                    <div
                      className="space-y-2.5 py-1"
                      role="status"
                      aria-label="Memuat data sesi dari database Supabase"
                    >
                      {[1, 2].map((i) => (
                        <div
                          key={i}
                          className="p-3.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAF7] space-y-2.5 animate-pulse"
                        >
                          <div className="flex items-center justify-between">
                            <div className="h-4 w-28 bg-[#CBD5E1] rounded"></div>
                            <div className="h-4 w-24 bg-[#CBD5E1] rounded"></div>
                          </div>
                          <div className="h-3 w-40 bg-[#E2E8F0] rounded"></div>
                          <div className="flex gap-2 pt-1">
                            <div className="h-7 w-24 bg-[#E2E8F0] rounded"></div>
                            <div className="h-7 w-20 bg-[#E2E8F0] rounded"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : savedRooms.length === 0 ? (
                    <div className="p-4 rounded-lg bg-[#F8FAF7] border border-[#E2E8F0] text-xs text-[#475569] space-y-2">
                      <p>
                        Belum ada sesi ruang yang ditemukan di database atau peramban ini.
                        Anda dapat membuat ruang baru di atas atau memuat{" "}
                        <strong>Ruang Simulasi VWS-DEMO</strong> untuk mencoba seluruh fitur.
                      </p>
                      <button
                        type="button"
                        onClick={() => handleLaunchDemo("/room/VWS-DEMO")}
                        className="min-h-[40px] px-3 py-1.5 rounded-md bg-[#1E293B] text-[#FFFFFF] font-semibold text-xs cursor-pointer"
                      >
                        Aktifkan Ruang Simulasi VWS-DEMO
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                      {savedRooms.map((room) => {
                        const completedCount = (
                          room.completedModules || []
                        ).length;
                        return (
                          <div
                            key={room.code}
                            className="p-3 rounded-lg border border-[#E2E8F0] bg-[#F8FAF7] space-y-2"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <div>
                                <span className="font-mono font-bold text-xs text-[#1E293B]">
                                  {room.code}
                                </span>
                                <span className="text-xs text-[#475569] ml-2">
                                  {room.host.name} &amp;{" "}
                                  {room.guest.name || "Menunggu Pasangan"}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-mono text-[11px] font-semibold px-2 py-0.5 rounded bg-[#FFFFFF] border border-[#CBD5E1] text-[#475569]">
                                  PIN: {room.passcode} · {completedCount}/4 Modul
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteRoom(room.code)}
                                  disabled={deletingRoomCode === room.code}
                                  className="p-1 rounded text-[#94A3B8] hover:text-[#DC2626] hover:bg-[#FEE2E2] transition-colors cursor-pointer"
                                  title={`Hapus Sesi ${room.code} dari Database`}
                                  aria-label={`Hapus Sesi ${room.code} dari Database`}
                                >
                                  {deletingRoomCode === room.code ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#DC2626]" />
                                  ) : (
                                    <Trash2 className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-1.5 pt-1">
                              <button
                                type="button"
                                onClick={() =>
                                  handleOpenSavedRoom(room, "host", "")
                                }
                                className="min-h-[36px] px-2.5 py-1 rounded bg-[#1E293B] text-[#FFFFFF] text-[11px] font-semibold cursor-pointer"
                              >
                                Dashboard ({room.host.name})
                              </button>
                              {room.guest.name && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleOpenSavedRoom(room, "guest", "")
                                  }
                                  className="min-h-[36px] px-2.5 py-1 rounded bg-[#0F766E] text-[#FFFFFF] text-[11px] font-semibold cursor-pointer"
                                >
                                  Masuk sbg {room.guest.name}
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() =>
                                  handleOpenSavedRoom(
                                    room,
                                    "host",
                                    "/dilemma?module=1"
                                  )
                                }
                                className="min-h-[36px] px-2.5 py-1 rounded border border-[#CBD5E1] bg-[#FFFFFF] text-[#1E293B] hover:bg-[#F1F5F9] text-[11px] font-semibold cursor-pointer"
                              >
                                Skenario
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  handleOpenSavedRoom(
                                    room,
                                    "host",
                                    "/result?module=1"
                                  )
                                }
                                className="min-h-[36px] px-2.5 py-1 rounded border border-[#CBD5E1] bg-[#FFFFFF] text-[#1E293B] hover:bg-[#F1F5F9] text-[11px] font-semibold cursor-pointer"
                              >
                                Hasil
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  handleOpenSavedRoom(
                                    room,
                                    "host",
                                    "/charter?module=1"
                                  )
                                }
                                className="min-h-[36px] px-2.5 py-1 rounded border border-[#CBD5E1] bg-[#FFFFFF] text-[#1E293B] hover:bg-[#F1F5F9] text-[11px] font-semibold cursor-pointer"
                              >
                                Piagam
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: INTERACTIVE DUAL-BLIND LEDGER PREVIEW */}
        <section
          id="cara-kerja"
          className="border-b border-[#E2E8F0] py-12 sm:py-16 bg-[#FFFFFF]"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div className="space-y-1.5 max-w-2xl">
                <p className="font-mono text-xs font-bold uppercase tracking-widest text-[#0F766E]">
                  02 / SIMULASI MEKANISME SEGEL GANDA
                </p>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1E293B] tracking-tight">
                  Cegah jawaban ikut-ikutan{" "}
                  <span className="font-serif italic font-normal text-[#0F766E]">
                    (pleasing-bias)
                  </span>
                </h2>
                <p className="text-sm text-[#475569]">
                  Klik tiga tahap berikut untuk melihat alur dari jawaban tersegel hingga menjadi pasal Piagam.
                </p>
              </div>

              <div
                role="tablist"
                aria-label="Tahapan mekanisme Dual-Blind"
                className="flex flex-wrap gap-2"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={ledgerStep === 1}
                  onClick={() => setLedgerStep(1)}
                  className={`min-h-[44px] px-4 py-2 rounded-lg text-xs font-bold border transition-colors cursor-pointer flex items-center gap-2 ${
                    ledgerStep === 1
                      ? "bg-[#1E293B] text-[#FFFFFF] border-[#1E293B]"
                      : "bg-[#F8FAF7] text-[#1E293B] border-[#CBD5E1] hover:bg-[#F1F5F9]"
                  }`}
                >
                  <EyeOff className="w-4 h-4" />
                  <span>1. Saat Menjawab (Tersegel)</span>
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={ledgerStep === 2}
                  onClick={() => setLedgerStep(2)}
                  className={`min-h-[44px] px-4 py-2 rounded-lg text-xs font-bold border transition-colors cursor-pointer flex items-center gap-2 ${
                    ledgerStep === 2
                      ? "bg-[#1E293B] text-[#FFFFFF] border-[#1E293B]"
                      : "bg-[#F8FAF7] text-[#1E293B] border-[#CBD5E1] hover:bg-[#F1F5F9]"
                  }`}
                >
                  <Scale className="w-4 h-4" />
                  <span>2. Saat Dual Reveal (Buka Segel)</span>
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={ledgerStep === 3}
                  onClick={() => setLedgerStep(3)}
                  className={`min-h-[44px] px-4 py-2 rounded-lg text-xs font-bold border transition-colors cursor-pointer flex items-center gap-2 ${
                    ledgerStep === 3
                      ? "bg-[#1E293B] text-[#FFFFFF] border-[#1E293B]"
                      : "bg-[#F8FAF7] text-[#1E293B] border-[#CBD5E1] hover:bg-[#F1F5F9]"
                  }`}
                >
                  <FileSignature className="w-4 h-4" />
                  <span>3. Klausul Piagam Kesepakatan</span>
                </button>
              </div>
            </div>

            {/* Ledger Comparison Card */}
            <div className="rounded-xl border border-[#CBD5E1] bg-[#F8FAF7] overflow-hidden">
              <div className="bg-[#1E293B] text-[#FFFFFF] px-5 sm:px-7 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-bold uppercase px-2 py-0.5 rounded bg-[#334155] text-[#5EEAD4]">
                    CONTOH KASUS #02 · MODUL 1
                  </span>
                  <span className="font-bold text-sm sm:text-base">
                    Dukungan Finansial Orang Tua &amp; Mertua (Sandwich Generation)
                  </span>
                </div>
                <span className="font-mono text-xs text-[#CBD5E1]">
                  {ledgerStep === 1 && "STATUS: MENUNGGU PASANGAN MENGUNCI"}
                  {ledgerStep === 2 && "STATUS: SEGEL TERBUKA SERENTAK"}
                  {ledgerStep === 3 && "STATUS: KOMPROMI TERTULIS DISAHKAN"}
                </span>
              </div>

              <div className="p-5 sm:p-7 space-y-6">
                <p className="font-serif italic text-base sm:text-lg text-[#1E293B] bg-[#FFFFFF] p-4 rounded-lg border border-[#E2E8F0]">
                  &ldquo;Orang tua salah satu pihak tidak memiliki dana pensiun
                  dan mengharapkan tunjangan bulanan sebesar 15% dari total
                  pendapatan rumah tangga kalian. Bagaimana sikap kalian?&rdquo;
                </p>

                {ledgerStep === 1 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 rounded-xl bg-[#FFFFFF] border-2 border-[#0F766E] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#0F766E]">
                          Jawaban Bima (Anda)
                        </span>
                        <span className="font-mono text-xs font-semibold text-[#065F46] bg-[#ECFDF5] px-2 py-0.5 rounded border border-[#A7F3D0]">
                          Terkunci
                        </span>
                      </div>
                      <p className="text-sm font-bold text-[#1E293B]">
                        Opsi A: Tetapkan batas persentase tetap dari dana
                        bersama yang disepakati berdua setiap bulan.
                      </p>
                      <p className="text-xs text-[#475569]">
                        Pilihan Anda sudah disimpan dan tidak dapat dilihat oleh
                        Nadia sampai ia menyelesaikan seluruh 10 skenario.
                      </p>
                    </div>

                    <div className="p-5 rounded-xl bg-[#1E293B] text-[#FFFFFF] border border-[#334155] flex flex-col justify-between space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#CBD5E1]">
                          Jawaban Nadia (Pasangan)
                        </span>
                        <span className="font-mono text-xs font-semibold text-[#5EEAD4] bg-[#0F172A] px-2 py-0.5 rounded border border-[#334155] flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                          <span>Disegel</span>
                        </span>
                      </div>
                      <div className="py-3 px-4 rounded-lg bg-[#0F172A] border border-[#334155] font-mono text-xs text-[#CBD5E1]">
                        SHA-256 BLIND SEAL · Isi jawaban disembunyikan untuk
                        menjaga kejujuran masing-masing pihak.
                      </div>
                      <p className="text-xs text-[#CBD5E1]">
                        Segel akan terbuka otomatis begitu kedua pihak menekan
                        tombol Kunci Jawaban.
                      </p>
                    </div>
                  </div>
                )}

                {ledgerStep === 2 && (
                  <div className="space-y-4">
                    <div className="p-3.5 rounded-lg bg-[#FFFBEB] border border-[#FDE68A] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#92400E]">
                        Perbedaan Terdeteksi: Pilihan Berbeda Antara Bima &amp; Nadia
                      </span>
                      <span className="text-xs font-semibold text-[#92400E]">
                        Sistem meminta rumusan kompromi sebelum Piagam dapat ditandatangani
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-5 rounded-xl bg-[#FFFFFF] border border-[#CBD5E1] space-y-2">
                        <div className="text-xs font-bold uppercase tracking-wider text-[#475569]">
                          Pilihan Bima
                        </div>
                        <p className="text-sm font-bold text-[#1E293B]">
                          Opsi A: Tetapkan batas persentase tetap dari dana
                          bersama yang disepakati berdua setiap bulan.
                        </p>
                      </div>

                      <div className="p-5 rounded-xl bg-[#FFFFFF] border border-[#CBD5E1] space-y-2">
                        <div className="text-xs font-bold uppercase tracking-wider text-[#0F766E]">
                          Pilihan Nadia
                        </div>
                        <p className="text-sm font-bold text-[#1E293B]">
                          Opsi B: Bantuan ke orang tua diambil dari uang saku
                          pribadi masing-masing, bukan dari kas rumah tangga.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {ledgerStep === 3 && (
                  <div className="p-5 rounded-xl bg-[#FFFFFF] border-2 border-[#0F766E] space-y-3">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#0F766E]">
                        PASAL KESEPAKATAN TERTULIS · PIAGAM MODUL 1
                      </span>
                      <span className="text-xs font-semibold text-[#065F46] bg-[#ECFDF5] px-2.5 py-0.5 rounded border border-[#A7F3D0] flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Disepakati Bersama</span>
                      </span>
                    </div>
                    <p className="text-sm sm:text-base font-semibold text-[#1E293B] leading-relaxed">
                      &ldquo;Bantuan rutin orang tua dialokasikan maksimal 10%
                      dari rekening bersama. Jika ada kebutuhan tambahan di luar
                      angka tersebut, diambil dari pos dana pribadi
                      masing-masing setelah memberi tahu pasangan.&rdquo;
                    </p>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-[#E2E8F0]">
                  <span className="text-xs text-[#475569]">
                    Ingin mengedit kompromi ini secara langsung di halaman Hasil
                    &amp; Piagam?
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        handleLaunchDemo("/room/VWS-DEMO/result?module=1")
                      }
                      className="min-h-[44px] px-4 py-2 rounded-lg bg-[#0F766E] hover:bg-[#115E59] text-[#FFFFFF] text-xs font-bold transition-colors cursor-pointer"
                    >
                      Buka Halaman Hasil (VWS-DEMO)
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleLaunchDemo("/room/VWS-DEMO/charter?module=1")
                      }
                      className="min-h-[44px] px-4 py-2 rounded-lg border border-[#CBD5E1] bg-[#FFFFFF] hover:bg-[#F1F5F9] text-[#1E293B] text-xs font-bold transition-colors cursor-pointer"
                    >
                      Lihat Piagam Tercetak
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: 4-PILLAR CURRICULUM EXPLORER (40 REAL SCENARIOS) */}
        <section
          id="empat-pilar"
          className="border-b border-[#E2E8F0] py-12 sm:py-16 bg-[#F8FAF7]"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="space-y-1.5 max-w-3xl">
              <p className="font-mono text-xs font-bold uppercase tracking-widest text-[#0F766E]">
                03 / KURIKULUM 4 PILAR &amp; 40 SKENARIO NYATA
              </p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1E293B] tracking-tight">
                Empat pilar utama diskusi pra-nikah
              </h2>
              <p className="text-sm text-[#475569]">
                Pilih modul untuk meninjau ilustrasi topik dan 10 dilema keputusannya.
              </p>
            </div>

            {/* Module Selector Tabs with Visual Pillar Illustrations */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {MODULE_META.map((mod) => {
                const isSelected = mod.id === selectedModuleId;
                return (
                  <button
                    key={mod.id}
                    type="button"
                    onClick={() => setSelectedModuleId(mod.id)}
                    className={`p-4 rounded-xl border text-left transition-colors cursor-pointer flex flex-col justify-between gap-3 ${
                      isSelected
                        ? "bg-[#1E293B] text-[#FFFFFF] border-[#1E293B]"
                        : "bg-[#FFFFFF] text-[#1E293B] border-[#CBD5E1] hover:border-[#0F766E]"
                    }`}
                  >
                    <div className="w-full space-y-2.5">
                      <div className="flex items-center justify-between w-full">
                        <span
                          className={`font-mono text-xs font-bold uppercase ${
                            isSelected ? "text-[#5EEAD4]" : "text-[#0F766E]"
                          }`}
                        >
                          {mod.code}
                        </span>
                        <span
                          className={`font-mono text-[11px] px-2 py-0.5 rounded ${
                            isSelected
                              ? "bg-[#334155] text-[#FFFFFF]"
                              : "bg-[#F1F5F9] text-[#475569]"
                          }`}
                        >
                          10 Kasus
                        </span>
                      </div>

                      <ModulePillarIllustration moduleId={mod.id} compact />
                    </div>

                    <div>
                      <div className="font-bold text-sm leading-snug">
                        {mod.title}
                      </div>
                      <p
                        className={`text-xs mt-1 line-clamp-1 ${
                          isSelected ? "text-[#CBD5E1]" : "text-[#475569]"
                        }`}
                      >
                        {mod.subtitle}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Module Detail & Scenario Cards */}
            <div className="bg-[#FFFFFF] rounded-xl border border-[#CBD5E1] p-5 sm:p-7 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center pb-5 border-b border-[#E2E8F0]">
                <div className="lg:col-span-5">
                  <ModulePillarIllustration moduleId={selectedModuleId} />
                </div>
                <div className="lg:col-span-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold uppercase text-[#0F766E]">
                        {activeModuleMeta.code}
                      </span>
                      <span className="text-[#CBD5E1]">•</span>
                      <span className="text-xs font-semibold text-[#475569]">
                        10 Dilema Keputusan
                      </span>
                    </div>
                    <h3 className="text-xl font-extrabold text-[#1E293B]">
                      {activeModuleMeta.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#475569] max-w-xl">
                      {activeModuleMeta.summary}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() =>
                        handleLaunchDemo(
                          `/room/VWS-DEMO/intro?module=${selectedModuleId}`
                        )
                      }
                      className="min-h-[40px] px-3.5 py-2 rounded-lg border border-[#CBD5E1] bg-[#F8FAF7] hover:bg-[#F1F5F9] text-xs font-bold text-[#1E293B] cursor-pointer"
                    >
                      Pengantar
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleLaunchDemo(
                          `/room/VWS-DEMO/dilemma?module=${selectedModuleId}`
                        )
                      }
                      className="min-h-[40px] px-3.5 py-2 rounded-lg bg-[#0F766E] hover:bg-[#115E59] text-xs font-bold text-[#FFFFFF] cursor-pointer"
                    >
                      Mulai Modul {selectedModuleId}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                <div className="relative flex-1 max-w-md">
                  <input
                    type="text"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    placeholder="Cari skenario (misal: mertua, cicilan, anak)..."
                    className="w-full min-h-[40px] pl-9 pr-8 py-2 rounded-lg border border-[#CBD5E1] bg-[#F8FAF7] focus:bg-[#FFFFFF] text-xs font-medium text-[#1E293B] focus:border-[#0F766E]"
                  />
                  <Search className="w-4 h-4 text-[#475569] absolute left-3 top-2.5 pointer-events-none" />
                  {searchKeyword && (
                    <button
                      type="button"
                      onClick={() => setSearchKeyword("")}
                      className="absolute right-2.5 top-2.5 text-[#475569] hover:text-[#1E293B] cursor-pointer"
                      title="Hapus pencarian"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <div className="text-xs text-[#475569]">
                  Menampilkan <strong>{filteredScenarios.length}</strong> dari 10 skenario
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {filteredScenarios.length === 0 ? (
                  <div className="p-8 text-center bg-[#F8FAF7] border border-[#CBD5E1] rounded-xl space-y-3 col-span-full">
                    <div className="w-12 h-12 rounded-full bg-[#E2E8F0] flex items-center justify-center mx-auto text-[#475569]">
                      <Search className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-sm text-[#1E293B]">
                      Yah, skenario tidak ditemukan dengan kata kunci &ldquo;{searchKeyword}&rdquo;
                    </h4>
                    <p className="text-xs text-[#475569] max-w-sm mx-auto">
                      Coba kata kunci lain seperti &ldquo;uang&rdquo; atau &ldquo;mertua&rdquo;.
                    </p>
                    <button
                      type="button"
                      onClick={() => setSearchKeyword("")}
                      className="min-h-[40px] px-4 py-2 rounded-lg bg-[#0F766E] text-[#FFFFFF] text-xs font-bold hover:bg-[#115E59] transition-colors cursor-pointer"
                    >
                      Reset Pencarian
                    </button>
                  </div>
                ) : (
                  filteredScenarios.map((scen, idx) => (
                    <div
                      key={scen.id}
                      className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAF7] flex flex-col justify-between gap-2.5"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono text-xs font-bold text-[#0F766E]">
                            #{idx + 1}
                          </span>
                          <span className="text-[11px] font-semibold text-[#475569] bg-[#FFFFFF] px-2 py-0.5 rounded border border-[#E2E8F0]">
                            {scen.categoryLabel}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-[#1E293B]">
                          {scen.title}
                        </h4>
                        <p className="text-xs text-[#475569] leading-relaxed line-clamp-2">
                          {scen.description}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-[#E2E8F0] flex items-center justify-between text-[11px] text-[#475569]">
                        <span>3 Opsi (A / B / C)</span>
                        <button
                          type="button"
                          onClick={() =>
                            handleLaunchDemo(
                              `/room/VWS-DEMO/dilemma?module=${selectedModuleId}`
                            )
                          }
                          className="font-bold text-[#0F766E] hover:underline cursor-pointer"
                        >
                          Buka Skenario
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: PRODUCT FAQ */}
        <section id="faq" className="py-12 sm:py-16 bg-[#FFFFFF]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="space-y-2">
              <p className="font-mono text-xs font-bold uppercase tracking-widest text-[#0F766E]">
                04 / TANYA JAWAB TEKNIS &amp; PRIVASI
              </p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1E293B] tracking-tight">
                Pertanyaan yang sering diajukan pasangan
              </h2>
            </div>

            <div className="divide-y divide-[#E2E8F0] border-y border-[#E2E8F0]">
              {FAQ_ITEMS.map((item, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div key={item.q} className="py-4">
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() =>
                        setOpenFaqIndex(isOpen ? null : idx)
                      }
                      className="w-full min-h-[44px] flex items-center justify-between gap-4 text-left font-bold text-sm sm:text-base text-[#1E293B] hover:text-[#0F766E] transition-colors cursor-pointer"
                    >
                      <span>{item.q}</span>
                      <ChevronDown
                        className={`w-5 h-5 text-[#475569] shrink-0 transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <p className="mt-2.5 text-sm text-[#475569] leading-relaxed pr-6">
                        {item.a}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      {/* Connected Sitemap Footer */}
      <footer className="bg-[#1E293B] text-[#FFFFFF] border-t border-[#334155] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-5 space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#FFFFFF] text-[#1E293B] flex items-center justify-center font-bold text-xs">
                  VS
                </div>
                <span className="font-bold text-base tracking-tight">
                  VowSync · SalingPaham
                </span>
              </div>
              <p className="text-xs text-[#CBD5E1] max-w-sm leading-relaxed">
                Platform keselarasan pra-nikah Dual-Blind untuk pasangan di
                Indonesia. Membantu menyusun kesepakatan finansial, batasan
                keluarga besar, pola asuh, dan pembagian peran secara jujur.
              </p>
            </div>

            <div className="md:col-span-4 space-y-2">
              <div className="font-mono text-xs font-bold uppercase tracking-wider text-[#5EEAD4]">
                Pintasan Halaman Sesi (Ruang VWS-DEMO)
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1 text-xs text-[#CBD5E1]">
                <button
                  type="button"
                  onClick={() => handleLaunchDemo("/room/VWS-DEMO")}
                  className="text-left hover:text-[#FFFFFF] hover:underline cursor-pointer py-1"
                >
                  Dashboard 4 Modul
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleLaunchDemo("/room/VWS-DEMO/intro?module=1")
                  }
                  className="text-left hover:text-[#FFFFFF] hover:underline cursor-pointer py-1"
                >
                  Pengantar Modul
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleLaunchDemo("/room/VWS-DEMO/dilemma?module=1")
                  }
                  className="text-left hover:text-[#FFFFFF] hover:underline cursor-pointer py-1"
                >
                  Lembar 10 Skenario
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleLaunchDemo("/room/VWS-DEMO/waiting?module=1")
                  }
                  className="text-left hover:text-[#FFFFFF] hover:underline cursor-pointer py-1"
                >
                  Ruang Tunggu Segel
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleLaunchDemo("/room/VWS-DEMO/result?module=1")
                  }
                  className="text-left hover:text-[#FFFFFF] hover:underline cursor-pointer py-1"
                >
                  Hasil &amp; Kompromi
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleLaunchDemo("/room/VWS-DEMO/charter?module=1")
                  }
                  className="text-left hover:text-[#FFFFFF] hover:underline cursor-pointer py-1"
                >
                  Piagam Kesepakatan
                </button>
              </div>
            </div>

            <div className="md:col-span-3 space-y-2">
              <div className="font-mono text-xs font-bold uppercase tracking-wider text-[#5EEAD4]">
                Navigasi Beranda
              </div>
              <ul className="space-y-1.5 text-xs text-[#CBD5E1]">
                <li>
                  <a href="#mulai-sesi" className="hover:text-[#FFFFFF] hover:underline">
                    Buat atau Gabung Ruang
                  </a>
                </li>
                <li>
                  <a href="#cara-kerja" className="hover:text-[#FFFFFF] hover:underline">
                    Simulasi Mekanisme Dual-Blind
                  </a>
                </li>
                <li>
                  <a href="#empat-pilar" className="hover:text-[#FFFFFF] hover:underline">
                    Daftar 40 Skenario Kurikulum
                  </a>
                </li>
                <li>
                  <a href="#faq" className="hover:text-[#FFFFFF] hover:underline">
                    Tanya Jawab &amp; Privasi
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-[#334155] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-[#CBD5E1]">
            <span>
              VowSync (SalingPaham) · Sistem Keselarasan Pra-Nikah Dual-Blind
            </span>
            <span className="font-mono">
              Kapasitas Ketat 2 Pasangan · Segel Lokal Peramban
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};
