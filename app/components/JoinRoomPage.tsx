"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
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
  ChevronDown,
  Loader2,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  Menu,
} from "lucide-react";
import { toast } from "sonner";
import {
  createRoomAsync,
  joinRoomAsync,
  deleteRoom,
  useTheme,
} from "../lib/sessionStore";
import { isSupabaseConfigured } from "../lib/supabase";
import {
  sanitizeTrackTag,
  generateTrackedRoomCode,
} from "../lib/analyticsLogger";
import { SCENARIOS } from "../data/scenarios";
import { ModulePillarIllustration } from "./VisualIllustrations";
import { BrandLogo } from "./BrandLogo";

interface JoinRoomProps {
  onSuccess: (roomCode: string) => void;
}

type SectionId = "mulai-sesi" | "cara-kerja" | "empat-pilar" | "faq";

const LANDING_NAV_ITEMS: ReadonlyArray<{
  id: SectionId;
  index: string;
  label: string;
}> = [
  { id: "mulai-sesi", index: "01", label: "Mekanisme" },
  { id: "cara-kerja", index: "02", label: "Segel Ganda" },
  { id: "empat-pilar", index: "03", label: "Kurikulum 4 Pilar" },
  { id: "faq", index: "04", label: "Tanya Jawab" },
];

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

const LEDGER_STEPS = [
  { id: 1, title: "Menjawab", hint: "Jawaban tersegel", icon: EyeOff },
  { id: 2, title: "Buka Segel", hint: "Terbuka serentak", icon: Scale },
  { id: 3, title: "Piagam", hint: "Kompromi disahkan", icon: FileSignature },
] as const;

const SCENARIOS_PER_PAGE = 4;

export const JoinRoomPage: React.FC<JoinRoomProps> = ({ onSuccess }) => {
  const { theme, toggleTheme } = useTheme();

  const [activeSection, setActiveSection] = useState<SectionId>("mulai-sesi");
  const [arrivedSection, setArrivedSection] = useState<SectionId | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [visibleSections, setVisibleSections] = useState<
    Record<SectionId, boolean>
  >({
    "mulai-sesi": true,
    "cara-kerja": false,
    "empat-pilar": false,
    faq: false,
  });

  const [tab, setTab] = useState<"create" | "join">("create");
  const [activeTrackTag, setActiveTrackTag] = useState<string | null>(null);
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

  const [ledgerStep, setLedgerStep] = useState<1 | 2 | 3>(2);
  const [selectedModuleId, setSelectedModuleId] = useState<number>(1);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [scenarioPage, setScenarioPage] = useState(1);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      deleteRoom("VWS-DEMO");
      const urlParams = new URLSearchParams(window.location.search);
      const roomParam = urlParams.get("room");
      const pinParam = urlParams.get("pin");
      const trackParam = urlParams.get("track");
      const parsedTrack = sanitizeTrackTag(trackParam);
      if (parsedTrack) {
        setActiveTrackTag(parsedTrack);
      }
      if (roomParam) {
        setJoinRoomCode(roomParam.toUpperCase());
        setTab("join");
      }
      if (pinParam) {
        setJoinPin(pinParam);
      }
    }
  }, []);

  // Observe sections 01, 02, 03, 04 for active nav state and scroll-reveal transitions
  useEffect(() => {
    if (typeof window === "undefined") return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reducedMotion || typeof IntersectionObserver === "undefined") {
      setVisibleSections({
        "mulai-sesi": true,
        "cara-kerja": true,
        "empat-pilar": true,
        faq: true,
      });
    }

    if (typeof IntersectionObserver === "undefined") return;

    const sectionIds: SectionId[] = [
      "mulai-sesi",
      "cara-kerja",
      "empat-pilar",
      "faq",
    ];

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id as SectionId;
            setVisibleSections((prev) =>
              prev[id] ? prev : { ...prev, [id]: true }
            );
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
    );

    const activeObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length > 0) {
          const nextId = visible[0].target.id as SectionId;
          setActiveSection((prev) => {
            if (prev !== nextId) {
              setArrivedSection(nextId);
            }
            return nextId;
          });
        }
      },
      { threshold: [0.2, 0.45, 0.7], rootMargin: "-72px 0px -30% 0px" }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        revealObserver.observe(el);
        activeObserver.observe(el);
      }
    });

    return () => {
      revealObserver.disconnect();
      activeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!arrivedSection) return;
    const timer = window.setTimeout(() => setArrivedSection(null), 700);
    return () => window.clearTimeout(timer);
  }, [arrivedSection]);

  // Close mobile navigation drawer on Escape key (R-32)
  useEffect(() => {
    if (!mobileNavOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileNavOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileNavOpen]);

  const handleNavigateSection = (
    e: React.MouseEvent<HTMLAnchorElement>,
    targetId: SectionId
  ) => {
    e.preventDefault();
    setMobileNavOpen(false);
    setVisibleSections((prev) => ({ ...prev, [targetId]: true }));
    setActiveSection(targetId);
    setArrivedSection(targetId);

    const targetEl = document.getElementById(targetId);
    if (targetEl) {
      const prefersReduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      targetEl.scrollIntoView({
        behavior: prefersReduced ? "auto" : "smooth",
        block: "start",
      });
      window.history.replaceState(null, "", `#${targetId}`);
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
      const customCode = activeTrackTag
        ? generateTrackedRoomCode(activeTrackTag)
        : undefined;
      const result = await createRoomAsync(sanitizedName, customCode);
      setCreatedRoomInfo({ code: result.code, pin: result.passcode });

      if (result.cloudSynced) {
        toast.success(`Ruang ${result.code} berhasil dibuat!`, {
          description:
            "Data sesi tersimpan di Cloud Supabase & penyimpanan lokal.",
        });
      } else {
        toast.success(`Ruang ${result.code} berhasil dibuat!`, {
          description: "Data sesi tersimpan di penyimpanan lokal perangkat.",
        });
      }
    } catch (err: unknown) {
      console.error("Gagal membuat ruang:", err);
      toast.error(
        "Terjadi kendala saat membuat ruang. Mencoba penyimpanan lokal."
      );
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
          const msg =
            "Ruang tidak ditemukan di Supabase maupun lokal. Pastikan kode ruang benar atau buat ruang baru.";
          setJoinError(msg);
          toast.error(msg);
        } else if (result.error === "WRONG_PIN") {
          const msg =
            "PIN rahasia tidak sesuai. Mintalah 4-digit PIN kepada pasangan Anda.";
          setJoinError(msg);
          toast.error(msg);
        } else if (result.error === "ROOM_FULL") {
          const msg =
            "Ruang ini sudah terisi penuh oleh 2 pasangan dan terkunci.";
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

  const totalScenarioPages = Math.max(
    1,
    Math.ceil(filteredScenarios.length / SCENARIOS_PER_PAGE)
  );
  const currentScenarioPage = Math.min(scenarioPage, totalScenarioPages);
  const pageStartIndex = (currentScenarioPage - 1) * SCENARIOS_PER_PAGE;
  const pagedScenarios = filteredScenarios.slice(
    pageStartIndex,
    pageStartIndex + SCENARIOS_PER_PAGE
  );

  const handleSelectModule = (moduleId: number) => {
    setSelectedModuleId(moduleId);
    setScenarioPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchKeyword(value);
    setScenarioPage(1);
  };

  const activeNavPosition =
    LANDING_NAV_ITEMS.findIndex((item) => item.id === activeSection) + 1;
  const readingProgressPercent = (Math.max(1, activeNavPosition) / 4) * 100;

  return (
    <div className="min-h-screen bg-[#F8FAF7] text-[#1E293B] flex flex-col">
      {/* Dedicated Landing-Page-Only Sticky Navigation */}
      <header className="sticky top-0 z-40 bg-[#FFFFFF] border-b border-[#CBD5E1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          <a
            href="#mulai-sesi"
            onClick={(e) => handleNavigateSection(e, "mulai-sesi")}
            aria-label="VowSync SalingPaham, kembali ke bagian 01"
            className="flex items-center min-h-[44px] pr-2 rounded-lg shrink-0"
          >
            <BrandLogo priority />
          </a>

          {/* Desktop Section Navigation (Strictly Landing Page Sections 01 - 04) */}
          <nav
            aria-label="Navigasi Halaman Utama"
            className="hidden md:flex items-center gap-1 p-1 rounded-xl bg-[#F8FAF7] border border-[#E2E8F0]"
          >
            {LANDING_NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => handleNavigateSection(e, item.id)}
                  aria-current={isActive ? "location" : undefined}
                  className={`min-h-[44px] px-3.5 py-2 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                    isActive
                      ? "bg-[#0F766E] text-[#FFFFFF]"
                      : "text-[#475569] hover:text-[#1E293B] hover:bg-[#FFFFFF]"
                  }`}
                >
                  <span
                    className={`font-mono text-[11px] ${
                      isActive ? "text-[#CCFBF1]" : "text-[#0F766E]"
                    }`}
                  >
                    {item.index}
                  </span>
                  <span>{item.label}</span>
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={
                theme === "dark"
                  ? "Aktifkan mode terang"
                  : "Aktifkan mode gelap"
              }
              title={
                theme === "dark"
                  ? "Mode Terang (Kertas)"
                  : "Mode Gelap (Malam)"
              }
              className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-lg border border-[#CBD5E1] bg-[#FFFFFF] text-[#1E293B] hover:bg-[#F1F5F9] transition-colors cursor-pointer"
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
              aria-controls="landing-mobile-nav"
              aria-label={
                mobileNavOpen
                  ? "Tutup navigasi halaman utama"
                  : "Buka navigasi halaman utama"
              }
              className="md:hidden min-h-[44px] px-3 inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#CBD5E1] bg-[#FFFFFF] text-[#1E293B] hover:bg-[#F1F5F9] text-xs font-bold transition-colors cursor-pointer"
            >
              {mobileNavOpen ? (
                <>
                  <X className="w-4 h-4 shrink-0" />
                  <span>Tutup</span>
                </>
              ) : (
                <>
                  <Menu className="w-4 h-4 shrink-0" />
                  <span>Menu</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Reading Stage Transition Indicator across Sections 01 -> 02 -> 03 -> 04 */}
        <div
          aria-hidden="true"
          className="h-0.5 w-full bg-[#E2E8F0] overflow-hidden"
        >
          <div
            className="h-full bg-[#0F766E] transition-all duration-300 ease-out"
            style={{ width: `${readingProgressPercent}%` }}
          />
        </div>

        {/* Mobile Landing Navigation Drawer */}
        {mobileNavOpen && (
          <nav
            id="landing-mobile-nav"
            aria-label="Navigasi Halaman Utama Mobile"
            className="md:hidden border-t border-[#E2E8F0] bg-[#FFFFFF] px-4 py-3 grid grid-cols-1 sm:grid-cols-2 gap-2 panel-enter"
          >
            {LANDING_NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => handleNavigateSection(e, item.id)}
                  aria-current={isActive ? "location" : undefined}
                  className={`min-h-[44px] px-3.5 py-2.5 rounded-lg border text-xs font-bold flex items-center justify-between gap-2 transition-colors ${
                    isActive
                      ? "bg-[#0F766E] text-[#FFFFFF] border-[#0F766E]"
                      : "bg-[#F8FAF7] text-[#1E293B] border-[#CBD5E1] hover:border-[#0F766E]"
                  }`}
                >
                  <span>{item.label}</span>
                  <span
                    className={`font-mono text-[11px] px-2 py-0.5 rounded ${
                      isActive
                        ? "bg-[#115E59] text-[#FFFFFF]"
                        : "bg-[#FFFFFF] text-[#0F766E] border border-[#CBD5E1]"
                    }`}
                  >
                    {item.index}
                  </span>
                </a>
              );
            })}
          </nav>
        )}
      </header>

      <main className="flex-1">
        {/* SECTION 01 (odd): Full 1-Screen Viewport (100dvh minus 4rem sticky header) */}
        <section
          id="mulai-sesi"
          className="section-odd border-b border-[#E2E8F0] min-h-[calc(100dvh-4rem)] flex flex-col justify-between py-6 sm:py-8 lg:py-10"
        >
          <div className="my-auto w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Left 50%: login landing illustration in clean paper frame */}
              <div
                className={`order-2 lg:order-1 section-reveal section-reveal-delay ${
                  visibleSections["mulai-sesi"] ? "section-reveal-visible" : ""
                }`}
              >
                <div className="bg-[#FFFFFF] p-2.5 sm:p-4 rounded-2xl border border-[#CBD5E1]">
                  <div className="rounded-xl overflow-hidden bg-[#FFFFFF]">
                    <Image
                      src="/brand/login-landing.png"
                      alt="Dua calon pasangan menjawab dengan mata tertutup, lalu jawaban mereka dibuka bersama di satu lembar"
                      width={1024}
                      height={682}
                      priority
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      className="w-full h-auto block"
                    />
                  </div>
                </div>
              </div>

              {/* Right 50%: headline + room access card */}
              <div
                className={`order-1 lg:order-2 space-y-5 section-reveal ${
                  visibleSections["mulai-sesi"] ? "section-reveal-visible" : ""
                }`}
              >
                <div className="space-y-2.5">
                  <p
                    className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#F0FDFA] border border-[#99F6E4] font-mono text-xs font-bold uppercase tracking-widest text-[#0F766E] ${
                      arrivedSection === "mulai-sesi"
                        ? "section-arrived-badge"
                        : ""
                    }`}
                  >
                    01 / MEKANISME DUAL-BLIND PRA-NIKAH
                  </p>
                  <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-[1.15] text-[#1E293B]">
                    Bicara{" "}
                    <span className="font-serif italic font-normal text-[#0F766E]">
                      jujur
                    </span>{" "}
                    sebelum hari akad.
                  </h1>
                  <p className="text-[#475569] text-sm">
                    Jawab terpisah di perangkat masing-masing, hasil terbuka
                    serentak saat kedua pihak siap.
                  </p>
                </div>

                <div className="bg-[#FFFFFF] rounded-2xl p-6 sm:p-7 border border-[#CBD5E1]">
                  <div className="flex items-center justify-between mb-5 gap-3">
                    <div className="space-y-1.5">
                      <h2 className="text-lg font-bold text-[#1E293B]">
                        Mulai atau Gabung Sesi
                      </h2>
                      {(isSupabaseConfigured || activeTrackTag) && (
                        <div className="flex flex-wrap items-center gap-1.5">
                          {isSupabaseConfigured && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-mono font-semibold bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]">
                              <span
                                className="w-1.5 h-1.5 rounded-full bg-[#0F766E]"
                                aria-hidden="true"
                              />
                              <span>Supabase Cloud Sync</span>
                            </span>
                          )}
                          {activeTrackTag && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-mono font-semibold bg-[#F0FDFA] text-[#0F766E] border border-[#99F6E4]">
                              <span>Batch #{activeTrackTag} (Anonim)</span>
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-[#F0FDFA] border border-[#CCFBF1] flex items-center justify-center shrink-0">
                      <Lock className="w-5 h-5 text-[#0F766E]" />
                    </div>
                  </div>

                  {/* Tab Switcher */}
                  <div
                    role="tablist"
                    aria-label="Pilih mode akses ruang"
                    className="grid grid-cols-2 gap-1 p-1 bg-[#F1F5F9] rounded-lg border border-[#E2E8F0] mb-5"
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
                          ? "bg-[#FFFFFF] text-[#0F766E] border border-[#99F6E4]"
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
                          ? "bg-[#FFFFFF] text-[#0F766E] border border-[#99F6E4]"
                          : "text-[#475569] hover:text-[#1E293B]"
                      }`}
                    >
                      Gabung Ruang Pasangan
                    </button>
                  </div>

                  {/* TAB 1: CREATE ROOM */}
                  {tab === "create" && (
                    <div key="create-panel" className="panel-enter">
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
                              <p
                                role="alert"
                                className="text-xs font-semibold text-[#DC2626] mt-1.5 flex items-center gap-1"
                              >
                                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                <span>{createFieldError}</span>
                              </p>
                            )}
                            <p className="text-xs text-[#475569] mt-1.5">
                              Tampil di lembar perbandingan dan Piagam
                              Kesepakatan.
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
                                <span>
                                  Menyimpan ke Supabase &amp; Mengunci PIN...
                                </span>
                              </>
                            ) : (
                              <span>Buat Kode Ruang &amp; 4-Digit PIN</span>
                            )}
                          </button>
                        </form>
                      ) : (
                        <div className="space-y-4 panel-enter">
                          <div className="p-4 bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl space-y-3">
                            <div className="text-xs font-bold uppercase tracking-wider text-[#065F46] flex items-center gap-1.5">
                              <Shield className="w-4 h-4 shrink-0" />
                              <span>Ruang Privat Siap Digunakan</span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                              <div className="bg-[#FFFFFF] p-3 rounded-lg border border-[#A7F3D0] text-center">
                                <div className="text-[11px] text-[#475569] uppercase font-mono font-semibold">
                                  Kode Ruang
                                </div>
                                <div className="text-base sm:text-lg font-bold font-mono text-[#1E293B] mt-0.5 break-all">
                                  {createdRoomInfo.code}
                                </div>
                              </div>
                              <div className="bg-[#FFFFFF] p-3 rounded-lg border border-[#A7F3D0] text-center">
                                <div className="text-[11px] text-[#475569] uppercase font-mono font-semibold">
                                  PIN Rahasia
                                </div>
                                <div className="text-lg font-bold font-mono text-[#0F766E] mt-0.5">
                                  {createdRoomInfo.pin}
                                </div>
                              </div>
                            </div>

                            <p className="text-xs text-[#065F46]">
                              Bagikan hanya kepada pasangan. Ruang terkunci
                              untuk 2 orang.
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={handleInviteWhatsApp}
                            className="w-full min-h-[44px] py-3 px-4 bg-[#ECFDF5] hover:bg-[#D1FAE5] text-[#065F46] border border-[#A7F3D0] rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                          >
                            <MessageCircle className="w-4 h-4" />
                            <span>Bagikan Kode &amp; PIN lewat WhatsApp</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => onSuccess(createdRoomInfo.code)}
                            className="w-full min-h-[48px] py-3 px-4 bg-[#0F766E] hover:bg-[#115E59] text-[#FFFFFF] rounded-lg text-xs font-bold transition-colors cursor-pointer"
                          >
                            Buka Dashboard Ruang {createdRoomInfo.code}
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 2: JOIN EXISTING ROOM */}
                  {tab === "join" && (
                    <form
                      key="join-panel"
                      onSubmit={handleJoinRoom}
                      className="space-y-4 panel-enter"
                    >
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
                              setJoinFieldErrors((prev) => ({
                                ...prev,
                                username: undefined,
                              }));
                            }
                          }}
                          className="w-full min-h-[44px] px-4 py-2.5 rounded-lg border border-[#CBD5E1] bg-[#FFFFFF] focus:border-[#0F766E] text-[#1E293B] font-medium text-sm"
                          placeholder="Contoh: Nadia"
                          required
                        />
                        {joinFieldErrors.username && (
                          <p
                            role="alert"
                            className="text-xs font-semibold text-[#DC2626] mt-1.5 flex items-center gap-1"
                          >
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
                                setJoinFieldErrors((prev) => ({
                                  ...prev,
                                  code: undefined,
                                }));
                              }
                            }}
                            className="w-full min-h-[44px] px-3 py-2.5 rounded-lg border border-[#CBD5E1] bg-[#FFFFFF] font-mono tracking-wider text-[#1E293B] font-bold text-center text-sm uppercase focus:border-[#0F766E]"
                            placeholder="VWS-XXX"
                            required
                          />
                          {joinFieldErrors.code && (
                            <p
                              role="alert"
                              className="text-xs font-semibold text-[#DC2626] mt-1.5 flex items-center gap-1"
                            >
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
                                  setJoinFieldErrors((prev) => ({
                                    ...prev,
                                    pin: undefined,
                                  }));
                                }
                              }}
                              className="w-full min-h-[44px] px-3 py-2.5 rounded-lg border border-[#CBD5E1] bg-[#FFFFFF] font-mono tracking-widest text-[#1E293B] font-bold text-center text-sm focus:border-[#0F766E]"
                              placeholder="••••"
                              required
                            />
                            <KeyRound className="w-4 h-4 text-[#475569] absolute right-3 top-3 pointer-events-none" />
                          </div>
                          {joinFieldErrors.pin && (
                            <p
                              role="alert"
                              className="text-xs font-semibold text-[#DC2626] mt-1.5 flex items-center gap-1"
                            >
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
              </div>
            </div>
          </div>

          {/* Bottom-of-Viewport Section Transition Cue (01 -> 02) */}
          <div className="pt-6 px-4 flex justify-center">
            <a
              href="#cara-kerja"
              onClick={(e) => handleNavigateSection(e, "cara-kerja")}
              className="min-h-[44px] px-4 py-2 rounded-lg border border-[#CBD5E1] bg-[#FFFFFF] hover:border-[#0F766E] hover:bg-[#F0FDFA] text-xs font-bold text-[#1E293B] inline-flex items-center gap-2 transition-colors"
            >
              <span className="font-mono text-[#0F766E]">02</span>
              <span>Lihat Cara Kerja Segel Ganda</span>
              <ChevronDown className="w-4 h-4 text-[#0F766E]" />
            </a>
          </div>
        </section>

        {/* SECTION 02 (even): DUAL-BLIND LEDGER, stepper left + light-mode ledger card right */}
        <section
          id="cara-kerja"
          className="section-even border-b border-[#CBD5E1] py-14 sm:py-20"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              {/* Left: heading + 3 step selectors */}
              <div
                className={`lg:col-span-4 space-y-6 section-reveal ${
                  visibleSections["cara-kerja"] ? "section-reveal-visible" : ""
                }`}
              >
                <div className="space-y-2.5">
                  <p
                    className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#FFFFFF] border border-[#99F6E4] font-mono text-xs font-bold uppercase tracking-widest text-[#0F766E] ${
                      arrivedSection === "cara-kerja"
                        ? "section-arrived-badge"
                        : ""
                    }`}
                  >
                    02 / CARA KERJA MEKANISME SEGEL GANDA
                  </p>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1E293B] tracking-tight leading-tight">
                    Cegah jawaban ikut-ikutan{" "}
                    <span className="font-serif italic font-normal text-[#0F766E]">
                      (pleasing-bias)
                    </span>
                  </h2>
                  <p className="text-sm text-[#475569]">
                    Pilih tiap tahap untuk meninjau cara penguncian jawaban
                    hingga pengesahan kompromi.
                  </p>
                </div>

                <div
                  role="tablist"
                  aria-orientation="vertical"
                  aria-label="Tahapan mekanisme Dual-Blind"
                  className="grid grid-cols-3 lg:grid-cols-1 gap-2.5"
                >
                  {LEDGER_STEPS.map((step) => {
                    const isActive = ledgerStep === step.id;
                    const StepIcon = step.icon;
                    return (
                      <button
                        key={step.id}
                        type="button"
                        role="tab"
                        id={`ledger-tab-${step.id}`}
                        aria-selected={isActive}
                        aria-controls="ledger-panel"
                        onClick={() => setLedgerStep(step.id)}
                        className={`min-h-[56px] p-3 lg:px-4 rounded-xl border text-xs font-bold transition-colors cursor-pointer flex flex-col lg:flex-row items-center gap-1.5 lg:gap-3 text-center lg:text-left ${
                          isActive
                            ? "bg-[#0F766E] text-[#FFFFFF] border-[#0F766E]"
                            : "bg-[#FFFFFF] text-[#1E293B] border-[#CBD5E1] hover:border-[#0F766E]"
                        }`}
                      >
                        <span
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs shrink-0 ${
                            isActive
                              ? "bg-[#FFFFFF] text-[#0F766E]"
                              : "bg-[#F0FDFA] text-[#0F766E] border border-[#CCFBF1]"
                          }`}
                        >
                          {step.id}
                        </span>
                        <span className="flex flex-col leading-tight">
                          <span className="text-sm">{step.title}</span>
                          <span
                            className={`hidden lg:block text-[11px] font-medium mt-0.5 ${
                              isActive ? "text-[#CCFBF1]" : "text-[#475569]"
                            }`}
                          >
                            {step.hint}
                          </span>
                        </span>
                        <StepIcon
                          className="hidden lg:block w-4 h-4 ml-auto shrink-0"
                          aria-hidden="true"
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right: single cohesive Light-Mode ledger sheet */}
              <div
                role="tabpanel"
                id="ledger-panel"
                aria-labelledby={`ledger-tab-${ledgerStep}`}
                className={`lg:col-span-8 rounded-2xl border border-[#CBD5E1] bg-[#FFFFFF] overflow-hidden section-reveal section-reveal-delay ${
                  visibleSections["cara-kerja"] ? "section-reveal-visible" : ""
                }`}
              >
                <div className="bg-[#F0FDFA] text-[#1E293B] border-b border-[#99F6E4] px-5 py-3.5 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="font-mono text-[11px] font-bold uppercase px-2.5 py-0.5 rounded bg-[#0F766E] text-[#FFFFFF] shrink-0">
                      Kasus #02
                    </span>
                    <span className="font-bold text-sm truncate text-[#1E293B]">
                      Bantuan Orang Tua &amp; Mertua
                    </span>
                  </div>
                  <span className="font-mono text-[11px] font-bold text-[#0F766E] bg-[#FFFFFF] px-2.5 py-1 rounded-md border border-[#99F6E4]">
                    {ledgerStep === 1 && "MENUNGGU PASANGAN"}
                    {ledgerStep === 2 && "SEGEL TERBUKA"}
                    {ledgerStep === 3 && "KOMPROMI DISAHKAN"}
                  </span>
                </div>

                <div
                  key={`ledger-step-${ledgerStep}`}
                  className="p-5 sm:p-7 space-y-5 min-h-[260px] flex flex-col justify-between panel-enter"
                >
                  <p className="font-serif italic text-base sm:text-lg text-[#1E293B]">
                    &ldquo;Orang tua meminta 15% dari penghasilan. Bagaimana
                    sikap kalian?&rdquo;
                  </p>

                  <div className="flex-1">
                    {ledgerStep === 1 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div className="p-4 rounded-xl bg-[#F0FDFA] border-2 border-[#0F766E] space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-[#0F766E]">
                              Pihak Pertama
                            </span>
                            <span className="font-mono text-[11px] font-semibold text-[#065F46] bg-[#ECFDF5] px-2 py-0.5 rounded border border-[#A7F3D0]">
                              Terkunci
                            </span>
                          </div>
                          <p className="text-sm font-bold text-[#1E293B]">
                            Opsi A: batas persentase tetap dari kas bersama.
                          </p>
                        </div>

                        <div className="p-4 rounded-xl bg-[#F8FAF7] text-[#1E293B] border border-[#CBD5E1] space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-[#475569]">
                              Pasangan
                            </span>
                            <span className="font-mono text-[11px] font-semibold text-[#0F766E] bg-[#F0FDFA] px-2 py-0.5 rounded border border-[#99F6E4] inline-flex items-center gap-1">
                              <Lock className="w-3 h-3" aria-hidden="true" />
                              <span>Disegel</span>
                            </span>
                          </div>
                          <p className="font-mono text-xs text-[#475569] py-2 px-3 rounded-lg bg-[#FFFFFF] border border-[#CBD5E1]">
                            SHA-256 · isi disembunyikan hingga serentak
                          </p>
                        </div>
                      </div>
                    )}

                    {ledgerStep === 2 && (
                      <div className="space-y-3.5">
                        <p className="text-xs font-bold uppercase tracking-wider text-[#92400E] bg-[#FFFBEB] border border-[#FDE68A] rounded-lg px-3.5 py-2.5">
                          Pilihan berbeda, butuh kompromi bersama
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          <div className="p-4 rounded-xl bg-[#F8FAF7] border border-[#CBD5E1] space-y-1.5">
                            <div className="text-xs font-bold uppercase tracking-wider text-[#475569]">
                              Pihak Pertama
                            </div>
                            <p className="text-sm font-bold text-[#1E293B]">
                              Opsi A: batas persentase tetap dari kas bersama.
                            </p>
                          </div>
                          <div className="p-4 rounded-xl bg-[#F0FDFA] border border-[#99F6E4] space-y-1.5">
                            <div className="text-xs font-bold uppercase tracking-wider text-[#0F766E]">
                              Pasangan
                            </div>
                            <p className="text-sm font-bold text-[#1E293B]">
                              Opsi B: dari uang saku pribadi masing-masing.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {ledgerStep === 3 && (
                      <div className="p-4 rounded-xl bg-[#F0FDFA] border-2 border-[#0F766E] space-y-2.5">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#0F766E]">
                            Pasal Piagam Modul 1
                          </span>
                          <span className="text-[11px] font-semibold text-[#065F46] bg-[#ECFDF5] px-2.5 py-0.5 rounded border border-[#A7F3D0] inline-flex items-center gap-1">
                            <CheckCircle2
                              className="w-3.5 h-3.5"
                              aria-hidden="true"
                            />
                            <span>Disepakati</span>
                          </span>
                        </div>
                        <p className="text-sm sm:text-base font-semibold text-[#1E293B] leading-relaxed">
                          &ldquo;Bantuan orang tua maksimal 10% dari kas
                          bersama. Selebihnya dari dana pribadi, setelah memberi
                          tahu pasangan.&rdquo;
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-[#E2E8F0] flex flex-wrap items-center justify-between gap-2 text-xs text-[#475569]">
                    <span>
                      Tahap {ledgerStep} dari 3 pada protokol Dual-Blind
                    </span>
                    <a
                      href="#empat-pilar"
                      onClick={(e) => handleNavigateSection(e, "empat-pilar")}
                      className="min-h-[44px] inline-flex items-center gap-1.5 font-bold text-[#0F766E] hover:underline"
                    >
                      <span>Lanjut ke 03 Kurikulum</span>
                      <ChevronDown className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 03 (odd): 4-PILLAR CURRICULUM EXPLORER (40 REAL SCENARIOS) */}
        <section
          id="empat-pilar"
          className="section-odd border-b border-[#CBD5E1] py-14 sm:py-20"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div
              className={`space-y-2 max-w-3xl section-reveal ${
                visibleSections["empat-pilar"] ? "section-reveal-visible" : ""
              }`}
            >
              <p
                className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#F0FDFA] border border-[#99F6E4] font-mono text-xs font-bold uppercase tracking-widest text-[#0F766E] ${
                  arrivedSection === "empat-pilar"
                    ? "section-arrived-badge"
                    : ""
                }`}
              >
                03 / KURIKULUM 4 PILAR &amp; 40 SKENARIO NYATA
              </p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1E293B] tracking-tight">
                Empat pilar utama diskusi pra-nikah
              </h2>
              <p className="text-sm text-[#475569]">
                Pilih modul untuk meninjau topik dan 10 dilema keputusannya.
              </p>
            </div>

            {/* Module Selector Tabs with Light-First Active Styling */}
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 section-reveal section-reveal-delay ${
                visibleSections["empat-pilar"] ? "section-reveal-visible" : ""
              }`}
            >
              {MODULE_META.map((mod) => {
                const isSelected = mod.id === selectedModuleId;
                return (
                  <button
                    key={mod.id}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => handleSelectModule(mod.id)}
                    className={`p-4 rounded-xl text-left transition-colors cursor-pointer flex flex-col justify-between gap-3 ${
                      isSelected
                        ? "bg-[#F0FDFA] text-[#1E293B] border-2 border-[#0F766E]"
                        : "bg-[#FFFFFF] text-[#1E293B] border border-[#CBD5E1] hover:border-[#0F766E]"
                    }`}
                  >
                    <div className="w-full space-y-2.5">
                      <div className="flex items-center justify-between w-full">
                        <span className="font-mono text-xs font-bold uppercase text-[#0F766E]">
                          {mod.code}
                        </span>
                        <span
                          className={`font-mono text-[11px] font-bold px-2 py-0.5 rounded ${
                            isSelected
                              ? "bg-[#0F766E] text-[#FFFFFF]"
                              : "bg-[#F1F5F9] text-[#475569]"
                          }`}
                        >
                          10 Kasus
                        </span>
                      </div>

                      <ModulePillarIllustration moduleId={mod.id} compact />
                    </div>

                    <div>
                      <div className="font-bold text-sm leading-snug text-[#1E293B]">
                        {mod.title}
                      </div>
                      <p className="text-xs mt-1 line-clamp-1 text-[#475569]">
                        {mod.subtitle}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Module Detail & Paginated Scenario Cards */}
            <div
              className={`bg-[#FFFFFF] rounded-2xl border border-[#CBD5E1] p-5 sm:p-7 space-y-6 section-reveal section-reveal-delay ${
                visibleSections["empat-pilar"] ? "section-reveal-visible" : ""
              }`}
            >
              <div
                key={`module-header-${selectedModuleId}`}
                className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center pb-5 border-b border-[#E2E8F0] panel-enter"
              >
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
                    <a
                      href="#mulai-sesi"
                      onClick={(e) => handleNavigateSection(e, "mulai-sesi")}
                      className="min-h-[44px] px-4 py-2 rounded-lg bg-[#0F766E] hover:bg-[#115E59] text-xs font-bold text-[#FFFFFF] inline-flex items-center transition-colors"
                    >
                      Mulai Sesi Sekarang
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                <div className="relative flex-1 max-w-md">
                  <input
                    type="text"
                    value={searchKeyword}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    aria-label="Cari skenario"
                    placeholder="Cari skenario (misal: mertua, cicilan, anak)..."
                    className="w-full min-h-[44px] pl-10 pr-11 py-2 rounded-lg border border-[#CBD5E1] bg-[#F8FAF7] focus:bg-[#FFFFFF] text-xs font-medium text-[#1E293B] focus:border-[#0F766E]"
                  />
                  <Search className="w-4 h-4 text-[#475569] absolute left-3.5 top-3.5 pointer-events-none" />
                  {searchKeyword && (
                    <button
                      type="button"
                      onClick={() => handleSearchChange("")}
                      className="min-h-[44px] min-w-[44px] absolute right-0 top-0 inline-flex items-center justify-center text-[#475569] hover:text-[#1E293B] cursor-pointer"
                      title="Hapus pencarian"
                      aria-label="Hapus pencarian"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="text-xs text-[#475569]">
                  {filteredScenarios.length === 0 ? (
                    <>Tidak ada skenario</>
                  ) : (
                    <>
                      Skenario{" "}
                      <strong>
                        {pageStartIndex + 1}-
                        {pageStartIndex + pagedScenarios.length}
                      </strong>{" "}
                      dari {filteredScenarios.length}
                    </>
                  )}
                </div>
              </div>

              <div
                key={`scenarios-${selectedModuleId}-${currentScenarioPage}-${searchKeyword}`}
                className="grid grid-cols-1 md:grid-cols-2 gap-3.5 panel-enter"
              >
                {filteredScenarios.length === 0 ? (
                  <div className="p-8 text-center bg-[#F8FAF7] border border-[#CBD5E1] rounded-xl space-y-3 col-span-full">
                    <div className="w-12 h-12 rounded-full bg-[#F0FDFA] border border-[#CCFBF1] flex items-center justify-center mx-auto text-[#0F766E]">
                      <Search className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-sm text-[#1E293B]">
                      Skenario tidak ditemukan dengan kata kunci &ldquo;
                      {searchKeyword}&rdquo;
                    </h4>
                    <p className="text-xs text-[#475569] max-w-sm mx-auto">
                      Coba kata kunci lain seperti &ldquo;uang&rdquo; atau
                      &ldquo;mertua&rdquo;.
                    </p>
                    <button
                      type="button"
                      onClick={() => handleSearchChange("")}
                      className="min-h-[44px] px-4 py-2 rounded-lg bg-[#0F766E] text-[#FFFFFF] text-xs font-bold hover:bg-[#115E59] transition-colors cursor-pointer"
                    >
                      Reset Pencarian
                    </button>
                  </div>
                ) : (
                  pagedScenarios.map((scen, idx) => (
                    <div
                      key={scen.id}
                      className="p-4 rounded-xl border border-[#CBD5E1] bg-[#F8FAF7] flex flex-col justify-between gap-2.5"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono text-xs font-bold text-[#0F766E]">
                            #{pageStartIndex + idx + 1}
                          </span>
                          <span className="text-[11px] font-semibold text-[#475569] bg-[#FFFFFF] px-2 py-0.5 rounded border border-[#CBD5E1]">
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
                        <span>3 Opsi Keputusan (A / B / C)</span>
                        <span className="font-mono font-semibold text-[#0F766E]">
                          Segel Ganda
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {totalScenarioPages > 1 && (
                <nav
                  aria-label="Halaman daftar skenario"
                  className="flex items-center justify-center gap-1.5 pt-1"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setScenarioPage(Math.max(1, currentScenarioPage - 1))
                    }
                    disabled={currentScenarioPage === 1}
                    aria-label="Halaman sebelumnya"
                    className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-lg border border-[#CBD5E1] bg-[#FFFFFF] text-[#1E293B] hover:bg-[#F1F5F9] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {Array.from({ length: totalScenarioPages }).map((_, i) => {
                    const pageNumber = i + 1;
                    const isCurrent = pageNumber === currentScenarioPage;
                    return (
                      <button
                        key={pageNumber}
                        type="button"
                        onClick={() => setScenarioPage(pageNumber)}
                        aria-label={`Halaman ${pageNumber}`}
                        aria-current={isCurrent ? "page" : undefined}
                        className={`min-h-[44px] min-w-[44px] rounded-lg border text-sm font-bold font-mono transition-colors cursor-pointer ${
                          isCurrent
                            ? "bg-[#0F766E] text-[#FFFFFF] border-[#0F766E]"
                            : "bg-[#FFFFFF] text-[#1E293B] border-[#CBD5E1] hover:bg-[#F1F5F9]"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}

                  <button
                    type="button"
                    onClick={() =>
                      setScenarioPage(
                        Math.min(totalScenarioPages, currentScenarioPage + 1)
                      )
                    }
                    disabled={currentScenarioPage === totalScenarioPages}
                    aria-label="Halaman berikutnya"
                    className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-lg border border-[#CBD5E1] bg-[#FFFFFF] text-[#1E293B] hover:bg-[#F1F5F9] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </nav>
              )}
            </div>
          </div>
        </section>

        {/* SECTION 04 (even): PRODUCT FAQ */}
        <section id="faq" className="section-even py-14 sm:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div
              className={`space-y-2.5 section-reveal ${
                visibleSections.faq ? "section-reveal-visible" : ""
              }`}
            >
              <p
                className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#FFFFFF] border border-[#99F6E4] font-mono text-xs font-bold uppercase tracking-widest text-[#0F766E] ${
                  arrivedSection === "faq" ? "section-arrived-badge" : ""
                }`}
              >
                04 / TANYA JAWAB TEKNIS &amp; PRIVASI
              </p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1E293B] tracking-tight">
                Pertanyaan yang sering diajukan pasangan
              </h2>
            </div>

            <div
              className={`bg-[#FFFFFF] rounded-2xl border border-[#CBD5E1] divide-y divide-[#E2E8F0] px-5 sm:px-7 section-reveal section-reveal-delay ${
                visibleSections.faq ? "section-reveal-visible" : ""
              }`}
            >
              {FAQ_ITEMS.map((item, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div key={item.q} className="py-4">
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full min-h-[44px] flex items-center justify-between gap-4 text-left font-bold text-sm sm:text-base text-[#1E293B] hover:text-[#0F766E] transition-colors cursor-pointer"
                    >
                      <span>{item.q}</span>
                      <ChevronDown
                        className={`w-5 h-5 text-[#0F766E] shrink-0 transition-transform duration-300 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    <div
                      className={`grid transition-all duration-300 ease-out ${
                        isOpen
                          ? "grid-rows-[1fr] opacity-100 mt-2"
                          : "grid-rows-[0fr] opacity-0 mt-0"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className="text-sm text-[#475569] leading-relaxed pr-6 pb-1">
                          {item.a}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      {/* Light-First Connected Footer (adapts cleanly to Dark Mode via data-theme="dark") */}
      <footer className="bg-[#FFFFFF] text-[#1E293B] border-t border-[#CBD5E1] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 justify-between">
            <div className="md:col-span-8 space-y-3">
              <BrandLogo />
              <p className="text-xs text-[#475569] max-w-sm leading-relaxed">
                Platform keselarasan pra-nikah Dual-Blind untuk pasangan di
                Indonesia.
              </p>
            </div>

            <div className="md:col-span-4 space-y-2.5">
              <div className="font-mono text-xs font-bold uppercase tracking-wider text-[#0F766E]">
                Navigasi Beranda
              </div>
              <ul className="space-y-0.5 text-xs text-[#475569]">
                {LANDING_NAV_ITEMS.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      onClick={(e) => handleNavigateSection(e, item.id)}
                      className="min-h-[44px] py-2 inline-flex items-center gap-2 hover:text-[#0F766E] hover:underline font-medium"
                    >
                      <span className="font-mono text-[11px] font-bold text-[#0F766E]">
                        {item.index}
                      </span>
                      <span>{item.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-[#E2E8F0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-[#475569]">
            <span>
              VowSync (SalingPaham) · Sistem Keselarasan Pra-Nikah Dual-Blind
            </span>
            <span className="font-mono text-[#0F766E] font-semibold">
              Kapasitas Ketat 2 Pasangan · Segel Ganda Terlindungi
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};
