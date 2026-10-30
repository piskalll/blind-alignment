"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Lock,
  KeyRound,
  RefreshCw,
  LogOut,
  Copy,
  Check,
  Users,
  CheckCircle2,
  Scale,
  AlertTriangle,
  ChevronDown,
  Search,
  X,
  Sun,
  Moon,
  Home,
  Database,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { BrandLogo } from "./BrandLogo";
import { useTheme, type OptionKey } from "../lib/sessionStore";
import { sanitizeTrackTag } from "../lib/analyticsLogger";
import { MODULES, SCENARIOS } from "../data/scenarios";

const SQL_SETUP_SNIPPET = `CREATE TABLE IF NOT EXISTS public.analytics_logs (
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

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON TABLE public.analytics_logs TO anon, authenticated;

DROP POLICY IF EXISTS "Allow insert tracked analytics logs" ON public.analytics_logs;
CREATE POLICY "Allow insert tracked analytics logs"
  ON public.analytics_logs FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "Allow update tracked analytics logs" ON public.analytics_logs;
CREATE POLICY "Allow update tracked analytics logs"
  ON public.analytics_logs FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Allow read tracked analytics logs" ON public.analytics_logs;
CREATE POLICY "Allow read tracked analytics logs"
  ON public.analytics_logs FOR SELECT TO anon, authenticated USING (true);

NOTIFY pgrst, 'reload schema';`;

const SQL_GRANT_SNIPPET = `GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON TABLE public.analytics_logs TO anon, authenticated;
NOTIFY pgrst, 'reload schema';`;

interface ModuleFunnelItem {
  moduleId: number;
  title: string;
  startedRooms: number;
  startedUsers: number;
  bothLockedRooms: number;
  completedRooms: number;
  completedUsers: number;
}

interface ScenarioStatItem {
  id: number;
  moduleId: number;
  categoryLabel: string;
  title: string;
  options: { key: "A" | "B" | "C"; text: string }[];
  totalResponses: number;
  countA: number;
  countB: number;
  countC: number;
  pctA: number;
  pctB: number;
  pctC: number;
  pairedComparisons: number;
  conflictCount: number;
  severeConflictCount: number;
  conflictRate: number;
}

interface TrackedSessionItem {
  roomCode: string;
  trackTag: string;
  hostMasked: string;
  guestMasked: string | null;
  guestJoined: boolean;
  hostAnswerCount: number;
  guestAnswerCount: number;
  hostLockedModules: number[];
  guestLockedModules: number[];
  completedModules: number[];
  customQuestionCount?: number;
  alignmentScore: number | null;
  createdAt: string | null;
  updatedAt: string | null;
  hostAnswers: Record<string, OptionKey>;
  guestAnswers: Record<string, OptionKey>;
}

interface AnalyticsApiResponse {
  authenticated: boolean;
  pinConfigured: boolean;
  supabaseConfigured: boolean;
  tableMissing?: boolean;
  permissionDenied?: boolean;
  dbError?: string | null;
  selectedTag?: string;
  availableTags?: string[];
  summary?: {
    totalRooms: number;
    totalUsers: number;
    pairedRooms: number;
    soloRooms: number;
    completedAnyModuleRooms: number;
    completedAnyModuleUsers: number;
    completedAllModulesRooms: number;
    averageAlignment: number | null;
    moduleFunnel: ModuleFunnelItem[];
    customAdoption?: {
      roomsWithCustomQuestions: number;
      totalCustomQuestionsCreated: number;
      bothLockedCustomRooms: number;
      completedCustomRooms: number;
    };
  };
  topConflictScenarios?: ScenarioStatItem[];
  scenarioStats?: ScenarioStatItem[];
  sessions?: TrackedSessionItem[];
}

const formatTimestamp = (iso: string | null | undefined): string => {
  if (!iso) return "Waktu tidak tercatat";
  try {
    return new Date(iso).toLocaleString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
};

export const AnalyticsDashboardPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState<AnalyticsApiResponse | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState<string | null>(null);
  const [submittingPin, setSubmittingPin] = useState(false);

  const [selectedTag, setSelectedTag] = useState<string>("ALL");
  const [linkTagInput, setLinkTagInput] = useState<string>("uji");
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  const [selectedModuleTab, setSelectedModuleTab] = useState<number>(1);
  const [sessionSearch, setSessionSearch] = useState<string>("");
  const [expandedRoomCode, setExpandedRoomCode] = useState<string | null>(null);

  const loadAnalytics = useCallback(
    async (tag: string, silent: boolean = false) => {
      if (silent) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setFetchError(null);

      try {
        const res = await fetch(
          `/api/analytics?tag=${encodeURIComponent(tag)}`,
          { cache: "no-store" }
        );
        const json = (await res.json()) as AnalyticsApiResponse;
        setData(json);
      } catch (err) {
        console.error("Gagal memuat analitik:", err);
        setFetchError("Gagal menghubungi server analitik. Coba muat ulang.");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  useEffect(() => {
    void loadAnalytics(selectedTag);
  }, [loadAnalytics, selectedTag]);

  const handleUnlockPin = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinError(null);

    if (!pinInput.trim()) {
      setPinError("Masukkan PIN Rahasia Admin terlebih dahulu.");
      return;
    }

    try {
      setSubmittingPin(true);
      const res = await fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: pinInput.trim() }),
      });
      const result = (await res.json()) as {
        ok?: boolean;
        message?: string;
      };

      if (!res.ok || !result.ok) {
        setPinError(result.message || "PIN Rahasia Admin tidak sesuai.");
        return;
      }

      setPinInput("");
      toast.success("Panel Analytics berhasil dibuka.");
      await loadAnalytics(selectedTag);
    } catch {
      setPinError("Terjadi gangguan jaringan saat memverifikasi PIN.");
    } finally {
      setSubmittingPin(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "logout" }),
      });
      setData((prev) =>
        prev ? { ...prev, authenticated: false } : null
      );
      toast.success("Sesi Admin telah dikunci kembali.");
    } catch {
      toast.error("Gagal mengunci sesi.");
    }
  };

  const cleanPreviewTag = sanitizeTrackTag(linkTagInput) || "UJI";

  const handleCopyTrackLink = async () => {
    if (typeof window === "undefined") return;
    const url = `${window.location.origin}/?track=${cleanPreviewTag.toLowerCase()}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedLink(true);
      toast.success(`Tautan pelacakan #${cleanPreviewTag} berhasil disalin.`);
      window.setTimeout(() => setCopiedLink(false), 2200);
    } catch {
      toast.error("Gagal menyalin tautan secara otomatis.");
    }
  };

  const handleCopySql = async () => {
    try {
      await navigator.clipboard.writeText(SQL_SETUP_SNIPPET);
      setCopiedSql(true);
      toast.success("Skrip SQL berhasil disalin. Tempel di Supabase SQL Editor.");
      window.setTimeout(() => setCopiedSql(false), 2500);
    } catch {
      toast.error("Gagal menyalin skrip SQL.");
    }
  };

  const moduleScenariosStats = (data?.scenarioStats || []).filter(
    (s) => s.moduleId === selectedModuleTab
  );

  const filteredSessions = (data?.sessions || []).filter((sess) => {
    if (!sessionSearch.trim()) return true;
    const kw = sessionSearch.trim().toLowerCase();
    return (
      sess.roomCode.toLowerCase().includes(kw) ||
      sess.trackTag.toLowerCase().includes(kw) ||
      sess.hostMasked.toLowerCase().includes(kw) ||
      (sess.guestMasked || "").toLowerCase().includes(kw)
    );
  });

  return (
    <div className="min-h-screen bg-[#F8FAF7] text-[#1E293B] flex flex-col font-sans">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-[#FFFFFF] border-b border-[#CBD5E1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href="/"
              aria-label="Kembali ke beranda VowSync"
              className="flex items-center min-h-[44px] shrink-0"
            >
              <BrandLogo priority />
            </Link>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#F0FDFA] border border-[#99F6E4] font-mono text-xs font-bold text-[#0F766E]">
              <Database className="w-3.5 h-3.5 shrink-0" />
              <span>ANALYTICS &amp; LOG SESI</span>
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/"
              className="min-h-[44px] px-3 rounded-lg border border-[#CBD5E1] bg-[#FFFFFF] hover:bg-[#F1F5F9] text-xs font-bold text-[#1E293B] inline-flex items-center gap-1.5 transition-colors"
            >
              <Home className="w-4 h-4 text-[#0F766E]" />
              <span className="hidden sm:inline">Beranda</span>
            </Link>

            {data?.authenticated && (
              <>
                <button
                  type="button"
                  onClick={() => void loadAnalytics(selectedTag, true)}
                  disabled={refreshing}
                  aria-label="Muat ulang data analytics"
                  className="min-h-[44px] px-3 rounded-lg border border-[#CBD5E1] bg-[#FFFFFF] hover:bg-[#F1F5F9] text-xs font-bold text-[#1E293B] inline-flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw
                    className={`w-4 h-4 text-[#0F766E] ${
                      refreshing ? "animate-spin" : ""
                    }`}
                  />
                  <span className="hidden md:inline">Muat Ulang</span>
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="min-h-[44px] px-3 rounded-lg border border-[#CBD5E1] bg-[#FFFFFF] hover:bg-[#FEF2F2] text-xs font-bold text-[#991B1B] inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4 shrink-0" />
                  <span className="hidden md:inline">Kunci Panel</span>
                </button>
              </>
            )}

            <button
              type="button"
              onClick={toggleTheme}
              aria-label={
                theme === "dark"
                  ? "Aktifkan mode terang"
                  : "Aktifkan mode gelap"
              }
              className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-lg border border-[#CBD5E1] bg-[#FFFFFF] text-[#1E293B] hover:bg-[#F1F5F9] transition-colors cursor-pointer"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {loading ? (
          <div className="min-h-[50dvh] flex flex-col items-center justify-center gap-3 text-center">
            <Loader2 className="w-7 h-7 text-[#0F766E] animate-spin" />
            <p className="text-sm font-semibold text-[#475569]">
              Memeriksa status akses dan memuat log analitik sesi...
            </p>
          </div>
        ) : fetchError ? (
          <div
            role="alert"
            className="max-w-lg mx-auto bg-[#FFFFFF] border border-[#FECACA] rounded-2xl p-6 space-y-4 text-center"
          >
            <div className="w-11 h-11 rounded-xl bg-[#FEF2F2] border border-[#FECACA] text-[#991B1B] flex items-center justify-center mx-auto">
              <AlertCircle className="w-5 h-5" />
            </div>
            <h1 className="text-lg font-extrabold text-[#1E293B]">
              Gagal Memuat Panel Analytics
            </h1>
            <p className="text-xs sm:text-sm text-[#475569]">{fetchError}</p>
            <button
              type="button"
              onClick={() => void loadAnalytics(selectedTag)}
              className="min-h-[44px] px-5 py-2.5 rounded-lg bg-[#0F766E] hover:bg-[#115E59] text-[#FFFFFF] text-xs font-bold cursor-pointer"
            >
              Coba Lagi Sekarang
            </button>
          </div>
        ) : !data?.pinConfigured ? (
          /* Setup State 1: ANALYTICS_ADMIN_PIN Not Set in .env.local */
          <div className="max-w-xl mx-auto bg-[#FFFFFF] border border-[#CBD5E1] rounded-2xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] text-[#92400E] flex items-center justify-center shrink-0">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <p className="font-mono text-xs font-bold uppercase tracking-wider text-[#92400E]">
                  KONFIGURASI SERVER DIPERLUKAN
                </p>
                <h1 className="text-xl font-extrabold text-[#1E293B]">
                  Atur PIN Rahasia Admin Terlebih Dahulu
                </h1>
              </div>
            </div>

            <p className="text-sm text-[#475569] leading-relaxed">
              Demi keamanan agar PIN tidak pernah tertulis di kode peramban,
              tambahkan variabel <code className="font-mono font-bold text-[#1E293B]">ANALYTICS_ADMIN_PIN</code> pada berkas{" "}
              <code className="font-mono font-bold text-[#1E293B]">.env.local</code> (dan pada Environment Variables Vercel saat produksi), lalu jalankan ulang server aplikasi.
            </p>

            <div className="p-4 rounded-xl bg-[#F8FAF7] border border-[#CBD5E1] font-mono text-xs text-[#1E293B]">
              ANALYTICS_ADMIN_PIN=pin-rahasia-pilihan-anda
            </div>

            <button
              type="button"
              onClick={() => void loadAnalytics(selectedTag)}
              className="w-full min-h-[48px] py-3 px-5 rounded-lg bg-[#0F766E] hover:bg-[#115E59] text-[#FFFFFF] text-sm font-bold cursor-pointer"
            >
              Cek Ulang Konfigurasi PIN
            </button>
          </div>
        ) : !data.authenticated ? (
          <div className="max-w-md mx-auto my-8 bg-[#FFFFFF] border border-[#CBD5E1] rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="space-y-1.5">
              <p className="font-mono text-xs font-bold uppercase tracking-wider text-[#0F766E] flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 shrink-0" />
                <span>Akses Terbatas Pemilik Web</span>
              </p>
              <h1 className="text-2xl font-extrabold text-[#1E293B] tracking-tight">
                Buka Panel Analytics
              </h1>
              <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                Masukkan PIN Rahasia Admin untuk meninjau total pengguna seluruh
                web (#PUBLIK maupun batch khusus), tingkat penyelesaian modul,
                dan distribusi pilihan skenario secara anonim.
              </p>
            </div>

            <form onSubmit={handleUnlockPin} className="space-y-4">
              <div>
                <label
                  htmlFor="admin-pin-input"
                  className="block text-xs font-bold uppercase tracking-wider text-[#1E293B] mb-1.5"
                >
                  PIN Rahasia Admin
                </label>
                <div className="relative">
                  <input
                    id="admin-pin-input"
                    type="password"
                    value={pinInput}
                    onChange={(e) => {
                      setPinInput(e.target.value);
                      if (pinError) setPinError(null);
                    }}
                    placeholder="Masukkan PIN Admin"
                    className="w-full min-h-[48px] pl-4 pr-10 py-2.5 rounded-lg border border-[#CBD5E1] bg-[#FFFFFF] font-mono tracking-widest text-sm font-bold text-[#1E293B] focus:border-[#0F766E]"
                    required
                  />
                  <KeyRound className="w-4 h-4 text-[#475569] absolute right-3.5 top-3.5 pointer-events-none" />
                </div>

                {pinError && (
                  <p
                    role="alert"
                    className="mt-2 text-xs font-semibold text-[#991B1B] flex items-center gap-1.5"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{pinError}</span>
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={submittingPin}
                className="w-full min-h-[48px] py-3 px-5 rounded-lg bg-[#0F766E] hover:bg-[#115E59] disabled:opacity-50 text-[#FFFFFF] text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                {submittingPin ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Memverifikasi PIN...</span>
                  </>
                ) : (
                  <span>Verifikasi PIN &amp; Buka Analytics</span>
                )}
              </button>
            </form>
          </div>
        ) : !data.supabaseConfigured ? (
          <div className="max-w-xl mx-auto bg-[#FFFFFF] border border-[#CBD5E1] rounded-2xl p-6 sm:p-8 space-y-4">
            <h1 className="text-xl font-extrabold text-[#1E293B]">
              Koneksi Supabase Belum Aktif
            </h1>
            <p className="text-sm text-[#475569]">
              Pastikan <code className="font-mono font-bold">NEXT_PUBLIC_SUPABASE_URL</code> dan{" "}
              <code className="font-mono font-bold">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> telah terpasang di{" "}
              <code className="font-mono font-bold">.env.local</code> agar log terpusat lintas perangkat dapat dibaca.
            </p>
          </div>
        ) : data.tableMissing ? (
          /* Setup State 3: Table analytics_logs Not Created Yet in Supabase */
          <div className="max-w-3xl mx-auto bg-[#FFFFFF] border border-[#CBD5E1] rounded-2xl p-6 sm:p-8 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-mono text-xs font-bold uppercase tracking-wider text-[#0F766E]">
                  LANGKAH SETUP SUPABASE (1 KALI SAJA)
                </p>
                <h1 className="text-xl sm:text-2xl font-extrabold text-[#1E293B] mt-0.5">
                  Buat Tabel <code className="font-mono">analytics_logs</code> di Supabase
                </h1>
              </div>

              <button
                type="button"
                onClick={handleCopySql}
                className="min-h-[44px] px-4 py-2 rounded-lg bg-[#0F766E] hover:bg-[#115E59] text-[#FFFFFF] text-xs font-bold inline-flex items-center gap-2 cursor-pointer"
              >
                {copiedSql ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Skrip SQL Tersalin</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Salin Skrip SQL</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-sm text-[#475569] leading-relaxed">
              Salin skrip SQL di bawah ini (tersedia juga pada berkas{" "}
              <code className="font-mono font-bold text-[#1E293B]">supabase/analytics_logs.sql</code>), buka{" "}
              <strong>Supabase Dashboard &gt; SQL Editor</strong>, tempel lalu klik{" "}
              <strong>Run</strong>. Setelah selesai, klik tombol cek ulang di bawah.
            </p>

            <pre className="p-4 rounded-xl bg-[#F8FAF7] border border-[#CBD5E1] overflow-x-auto font-mono text-xs text-[#1E293B] leading-relaxed">
              {SQL_SETUP_SNIPPET}
            </pre>

            <button
              type="button"
              onClick={() => void loadAnalytics(selectedTag)}
              className="min-h-[48px] px-5 py-3 rounded-lg border border-[#0F766E] bg-[#F0FDFA] hover:bg-[#ECFDF5] text-[#0F766E] text-xs font-bold inline-flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Saya Sudah Menjalankan SQL, Cek Ulang Sekarang</span>
            </button>
          </div>
        ) : data.permissionDenied ? (
          <div className="max-w-3xl mx-auto bg-[#FFFFFF] border border-[#CBD5E1] rounded-2xl p-6 sm:p-8 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-mono text-xs font-bold uppercase tracking-wider text-[#92400E]">
                  IZIN TABEL POSTGRESQL DIPERLUKAN (KODE 42501)
                </p>
                <h1 className="text-xl sm:text-2xl font-extrabold text-[#1E293B] mt-0.5">
                  Aktifkan Izin Akses <code className="font-mono">GRANT</code> pada Tabel <code className="font-mono">analytics_logs</code>
                </h1>
              </div>

              <button
                type="button"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(SQL_GRANT_SNIPPET);
                    setCopiedSql(true);
                    toast.success("Perintah GRANT SQL berhasil disalin.");
                    window.setTimeout(() => setCopiedSql(false), 2500);
                  } catch {
                    toast.error("Gagal menyalin perintah SQL.");
                  }
                }}
                className="min-h-[44px] px-4 py-2 rounded-lg bg-[#0F766E] hover:bg-[#115E59] text-[#FFFFFF] text-xs font-bold inline-flex items-center gap-2 cursor-pointer"
              >
                {copiedSql ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Perintah GRANT Tersalin</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Salin Perintah GRANT</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-sm text-[#475569] leading-relaxed">
              Tabel <code className="font-mono font-bold text-[#1E293B]">public.analytics_logs</code> sudah ada, namun role API Supabase (<code className="font-mono font-bold text-[#1E293B]">anon</code> &amp; <code className="font-mono font-bold text-[#1E293B]">authenticated</code>) belum diberi izin tabel PostgreSQL. Jalankan 3 baris SQL berikut di <strong>Supabase Dashboard &gt; SQL Editor</strong>:
            </p>

            <pre className="p-4 rounded-xl bg-[#F8FAF7] border border-[#CBD5E1] overflow-x-auto font-mono text-xs text-[#1E293B] leading-relaxed">
              {SQL_GRANT_SNIPPET}
            </pre>

            <button
              type="button"
              onClick={() => void loadAnalytics(selectedTag)}
              className="min-h-[48px] px-5 py-3 rounded-lg border border-[#0F766E] bg-[#F0FDFA] hover:bg-[#ECFDF5] text-[#0F766E] text-xs font-bold inline-flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Sudah Dijalankan, Cek Ulang Sekarang</span>
            </button>
          </div>
        ) : data.dbError ? (
          <div
            role="alert"
            className="max-w-xl mx-auto bg-[#FFFFFF] border border-[#FECACA] rounded-2xl p-6 space-y-3"
          >
            <h1 className="text-lg font-extrabold text-[#991B1B]">
              Kendala Query Supabase
            </h1>
            <p className="text-xs font-mono text-[#475569]">{data.dbError}</p>
            <button
              type="button"
              onClick={() => void loadAnalytics(selectedTag)}
              className="min-h-[44px] px-4 py-2 rounded-lg bg-[#0F766E] text-[#FFFFFF] text-xs font-bold cursor-pointer"
            >
              Muat Ulang
            </button>
          </div>
        ) : (
          /* Authenticated Main Dashboard */
          <div className="space-y-10">
            <section
              aria-label="Pembuat Tautan Batch dan Filter Kategori"
              className="bg-[#FFFFFF] border border-[#CBD5E1] rounded-2xl p-5 sm:p-6 space-y-5"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
                <div className="lg:col-span-7 space-y-2">
                  <label
                    htmlFor="track-tag-generator"
                    className="block font-mono text-xs font-bold uppercase tracking-wider text-[#0F766E]"
                  >
                    Pembuat Tautan Label Batch (Opsional untuk Kelas / Riset)
                  </label>
                  <p className="text-xs text-[#475569]">
                    Pengunjung umum otomatis tercatat pada{" "}
                    <strong className="font-mono text-[#0F766E]">#PUBLIK</strong>.
                    Gunakan tautan opsional ini bila ingin memisahkan kelompok
                    tertentu ke kode{" "}
                    <strong className="font-mono text-[#1E293B]">
                      VWS-{cleanPreviewTag}-XXX
                    </strong>
                    .
                  </p>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-1">
                    <div className="flex items-center rounded-lg border border-[#CBD5E1] focus-within:border-[#0F766E] bg-[#F8FAF7] px-3 min-h-[44px] sm:w-52">
                      <span className="font-mono text-xs text-[#475569] mr-1">
                        ?track=
                      </span>
                      <input
                        id="track-tag-generator"
                        type="text"
                        maxLength={10}
                        value={linkTagInput}
                        onChange={(e) => setLinkTagInput(e.target.value)}
                        className="w-full bg-transparent font-mono text-xs font-bold text-[#1E293B] rounded px-1 py-1"
                        placeholder="uji"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleCopyTrackLink}
                      className="min-h-[44px] px-4 py-2 rounded-lg bg-[#0F766E] hover:bg-[#115E59] text-[#FFFFFF] text-xs font-bold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      {copiedLink ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Tautan #{cleanPreviewTag} Tersalin</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>
                            Salin Link Batch (?track=
                            {cleanPreviewTag.toLowerCase()})
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-5 space-y-2">
                  <span className="block font-mono text-xs font-bold uppercase tracking-wider text-[#475569]">
                    Filter Kategori Sesi
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => setSelectedTag("ALL")}
                      className={`min-h-[44px] px-3.5 py-2 rounded-lg border text-xs font-bold font-mono transition-colors cursor-pointer ${
                        selectedTag === "ALL"
                          ? "bg-[#0F766E] text-[#FFFFFF] border-[#0F766E]"
                          : "bg-[#F8FAF7] text-[#1E293B] border-[#CBD5E1] hover:border-[#0F766E]"
                      }`}
                    >
                      SEMUA SESI
                    </button>
                    {(data.availableTags || []).map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => setSelectedTag(tag)}
                        className={`min-h-[44px] px-3.5 py-2 rounded-lg border text-xs font-bold font-mono transition-colors cursor-pointer ${
                          selectedTag === tag
                            ? "bg-[#0F766E] text-[#FFFFFF] border-[#0F766E]"
                            : "bg-[#F8FAF7] text-[#1E293B] border-[#CBD5E1] hover:border-[#0F766E]"
                        }`}
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {(data.summary?.totalRooms || 0) === 0 ? (
              <div className="bg-[#FFFFFF] border border-[#CBD5E1] rounded-2xl p-8 sm:p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-xl bg-[#F0FDFA] border border-[#99F6E4] text-[#0F766E] flex items-center justify-center mx-auto">
                  <Users className="w-6 h-6" />
                </div>
                <h2 className="text-lg font-extrabold text-[#1E293B]">
                  Belum Ada Sesi Tercatat pada Kategori Ini
                </h2>
                <p className="text-xs sm:text-sm text-[#475569] max-w-md mx-auto leading-relaxed">
                  Setiap pengunjung yang membuat ruang di beranda otomatis
                  terekam secara anonim pada{" "}
                  <strong className="font-mono text-[#0F766E]">#PUBLIK</strong>.
                  Anda juga dapat membagikan tautan opsional{" "}
                  <code className="font-mono font-bold text-[#0F766E]">
                    /?track={cleanPreviewTag.toLowerCase()}
                  </code>{" "}
                  jika ingin memisahkan kelompok tertentu.
                </p>
              </div>
            ) : (
              <>
                <section className="space-y-5">
                  <div className="space-y-1">
                    <p className="font-mono text-xs font-bold uppercase tracking-widest text-[#0F766E]">
                      01 / RINGKASAN PENGGUNA &amp; PENYELESAIAN MODUL
                    </p>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-[#1E293B]">
                      Partisipasi pasangan dan progres kurikulum
                    </h2>
                  </div>

                  {/* Asymmetric ledger hierarchy elevating the two primary cohort metrics over secondary figures */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
                    <div className="lg:col-span-8 bg-[#FFFFFF] border-2 border-[#0F766E] rounded-2xl p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-[#E2E8F0]">
                      <div className="space-y-3 sm:pr-6">
                        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#475569]">
                          <span>Total Pengguna Tercatat</span>
                          <Users className="w-4 h-4 text-[#0F766E]" />
                        </div>
                        <div className="font-mono text-4xl font-extrabold text-[#1E293B] tabular-nums">
                          {data.summary?.totalUsers || 0}
                          <span className="text-sm font-sans font-semibold text-[#475569] ml-2">
                            orang
                          </span>
                        </div>
                        <p className="text-xs text-[#475569] leading-relaxed">
                          <strong className="font-mono text-[#1E293B]">
                            {data.summary?.pairedRooms || 0} pasang
                          </strong>{" "}
                          telah bergabung berdua, sementara{" "}
                          <strong className="font-mono text-[#1E293B]">
                            {data.summary?.soloRooms || 0} ruang
                          </strong>{" "}
                          masih diisi 1 orang (menunggu pasangan).
                        </p>
                      </div>

                      <div className="space-y-3 pt-5 sm:pt-0 sm:pl-6">
                        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#0F766E]">
                          <span>Menyelesaikan Modul</span>
                          <CheckCircle2 className="w-4 h-4 text-[#0F766E]" />
                        </div>
                        <div className="font-mono text-4xl font-extrabold text-[#0F766E] tabular-nums">
                          {data.summary?.completedAnyModuleUsers || 0}
                          <span className="text-sm font-sans font-semibold text-[#475569] ml-2">
                            orang
                          </span>
                        </div>
                        <p className="text-xs text-[#475569] leading-relaxed">
                          <strong className="font-mono text-[#1E293B]">
                            {data.summary?.completedAnyModuleRooms || 0} ruang
                          </strong>{" "}
                          telah mengesahkan minimal 1 piagam modul (
                          <strong className="font-mono text-[#0F766E]">
                            {data.summary?.completedAllModulesRooms || 0} ruang
                          </strong>{" "}
                          tuntas seluruh 4 modul).
                        </p>
                      </div>
                    </div>

                    <div className="lg:col-span-4 flex flex-col justify-between gap-4">
                      <div className="bg-[#F0FDFA] border border-[#99F6E4] rounded-xl p-4 flex items-center justify-between gap-3">
                        <div className="space-y-0.5">
                          <div className="text-xs font-bold uppercase tracking-wider text-[#0F766E]">
                            Rata-Rata Skor Selaras
                          </div>
                          <p className="text-[11px] text-[#475569]">
                            Dari ruang yang kedua pihaknya telah menjawab
                          </p>
                        </div>
                        <div className="font-mono text-2xl font-extrabold text-[#1E293B] tabular-nums shrink-0">
                          {data.summary?.averageAlignment !== null &&
                          data.summary?.averageAlignment !== undefined
                            ? `${data.summary.averageAlignment}%`
                            : "-"}
                        </div>
                      </div>

                      <div className="bg-[#FFFFFF] border border-[#CBD5E1] rounded-xl p-4 flex items-center justify-between gap-3">
                        <div className="space-y-0.5">
                          <div className="text-xs font-bold uppercase tracking-wider text-[#475569]">
                            Total Ruang Tercatat
                          </div>
                          <p className="text-[11px] text-[#475569]">
                            Tersimpan permanen di log riwayat
                          </p>
                        </div>
                        <div className="font-mono text-2xl font-extrabold text-[#1E293B] tabular-nums shrink-0">
                          {data.summary?.totalRooms || 0}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#FFFFFF] border border-[#CBD5E1] rounded-2xl p-5 sm:p-6 space-y-4">
                    <h3 className="text-sm font-extrabold uppercase tracking-wider font-mono text-[#1E293B]">
                      Rincian Penyelesaian per Modul (Modul 1 s.d. 4)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {(data.summary?.moduleFunnel || []).map((m) => {
                        const totalR = Math.max(1, data.summary?.totalRooms || 1);
                        const completionPct = Math.round(
                          (m.completedRooms / totalR) * 100
                        );
                        return (
                          <div
                            key={m.moduleId}
                            className="p-4 rounded-xl bg-[#F8FAF7] border border-[#CBD5E1] space-y-3 flex flex-col justify-between"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="font-mono text-xs font-bold text-[#0F766E]">
                                  MOD-0{m.moduleId}
                                </span>
                                <span className="font-mono text-xs font-bold text-[#1E293B]">
                                  {completionPct}% ruang
                                </span>
                              </div>
                              <div className="text-xs font-bold text-[#1E293B] line-clamp-2">
                                {m.title}
                              </div>
                            </div>

                            <div className="space-y-2">
                              <div className="h-2 rounded-full analytics-bar-track overflow-hidden">
                                <div
                                  className="h-full analytics-bar-fill rounded-full"
                                  style={{ width: `${completionPct}%` }}
                                />
                              </div>

                              <div className="space-y-1 text-[11px] text-[#475569] font-medium">
                                <div className="flex justify-between">
                                  <span>Mulai mengisi:</span>
                                  <strong className="font-mono text-[#1E293B]">
                                    {m.startedUsers} org ({m.startedRooms} ruang)
                                  </strong>
                                </div>
                                <div className="flex justify-between">
                                  <span>Segel terkunci berdua:</span>
                                  <strong className="font-mono text-[#1E293B]">
                                    {m.bothLockedRooms} pasang
                                  </strong>
                                </div>
                                <div className="flex justify-between">
                                  <span>Piagam selesai:</span>
                                  <strong className="font-mono text-[#0F766E]">
                                    {m.completedUsers} org ({m.completedRooms}{" "}
                                    ruang)
                                  </strong>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Privacy-Safe Custom Questions (MOD-05) Adoption Ledger */}
                  <div className="bg-[#FFFFFF] border border-[#CBD5E1] rounded-2xl p-5 sm:p-6 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#0F766E] block">
                          MOD-05 · ADOPSI PERTANYAAN KUSTOM PASANGAN
                        </span>
                        <h3 className="text-base font-extrabold text-[#1E293B]">
                          Metrik penggunaan fitur soal buatan sendiri (tanpa
                          menyimpan isi teks soal)
                        </h3>
                      </div>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#F0FDFA] border border-[#99F6E4] font-mono text-xs font-bold text-[#0F766E] shrink-0">
                        <Lock className="w-3.5 h-3.5 shrink-0" />
                        <span>TEKS SOAL &amp; ESAI PRIVAT</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
                      <div className="p-4 rounded-xl bg-[#F8FAF7] border border-[#CBD5E1] space-y-1">
                        <span className="block font-mono text-[11px] font-bold uppercase text-[#475569]">
                          Ruang Memakai Kustom
                        </span>
                        <div className="font-mono text-2xl font-extrabold text-[#1E293B] tabular-nums">
                          {data.summary?.customAdoption
                            ?.roomsWithCustomQuestions || 0}
                          <span className="text-xs font-sans font-semibold text-[#475569] ml-1.5">
                            ruang
                          </span>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-[#F8FAF7] border border-[#CBD5E1] space-y-1">
                        <span className="block font-mono text-[11px] font-bold uppercase text-[#475569]">
                          Total Soal Dibuat
                        </span>
                        <div className="font-mono text-2xl font-extrabold text-[#1E293B] tabular-nums">
                          {data.summary?.customAdoption
                            ?.totalCustomQuestionsCreated || 0}
                          <span className="text-xs font-sans font-semibold text-[#475569] ml-1.5">
                            soal
                          </span>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-[#F8FAF7] border border-[#CBD5E1] space-y-1">
                        <span className="block font-mono text-[11px] font-bold uppercase text-[#475569]">
                          Segel MOD-05 Terkunci
                        </span>
                        <div className="font-mono text-2xl font-extrabold text-[#1E293B] tabular-nums">
                          {data.summary?.customAdoption?.bothLockedCustomRooms ||
                            0}
                          <span className="text-xs font-sans font-semibold text-[#475569] ml-1.5">
                            pasang
                          </span>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-[#F0FDFA] border border-[#99F6E4] space-y-1">
                        <span className="block font-mono text-[11px] font-bold uppercase text-[#0F766E]">
                          Piagam Pasal V Sah
                        </span>
                        <div className="font-mono text-2xl font-extrabold text-[#0F766E] tabular-nums">
                          {data.summary?.customAdoption?.completedCustomRooms ||
                            0}
                          <span className="text-xs font-sans font-semibold text-[#475569] ml-1.5">
                            ruang
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* SECTION 02: Analitik Skenario (Topik Konflik & Distribusi Opsi A/B/C) */}
                <section className="space-y-5">
                  <div className="space-y-1">
                    <p className="font-mono text-xs font-bold uppercase tracking-widest text-[#0F766E]">
                      02 / ANALITIK SKENARIO &amp; DISTRIBUSI PILIHAN A / B / C
                    </p>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-[#1E293B]">
                      Topik paling sering berbeda pendapat &amp; sebaran jawaban
                    </h2>
                  </div>

                  {/* Top Conflict Scenarios */}
                  <div className="bg-[#FFFFFF] border border-[#CBD5E1] rounded-2xl p-5 sm:p-6 space-y-4">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <h3 className="text-sm font-extrabold uppercase tracking-wider font-mono text-[#1E293B] flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-[#B45309]" />
                        <span>
                          Topik yang Paling Sering Memicu Perbedaan Pilihan
                        </span>
                      </h3>
                      <span className="text-xs text-[#475569]">
                        Dihitung dari pasangan yang telah menjawab skenario yang
                        sama
                      </span>
                    </div>

                    {(data.topConflictScenarios || []).length === 0 ? (
                      <p className="text-xs sm:text-sm text-[#475569] py-4 px-4 rounded-xl bg-[#F8FAF7] border border-[#CBD5E1]">
                        Belum ada perbedaan jawaban antar pasangan yang tercatat
                        pada batch ini.
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                        {(data.topConflictScenarios || []).map((sc) => (
                          <div
                            key={sc.id}
                            className="p-4 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] space-y-2 flex flex-col justify-between"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-mono text-xs font-bold text-[#92400E]">
                                  Skenario #{sc.id} · MOD-0{sc.moduleId}
                                </span>
                                <span className="font-mono text-xs font-extrabold px-2 py-0.5 rounded bg-[#FFFFFF] text-[#92400E] border border-[#FDE68A]">
                                  {sc.conflictRate}% Beda
                                </span>
                              </div>
                              <div className="text-sm font-bold text-[#1E293B] leading-snug">
                                {sc.title}
                              </div>
                            </div>
                            <div className="text-[11px] text-[#92400E] font-medium pt-1 border-t border-[#FDE68A] flex items-center justify-between">
                              <span>
                                {sc.conflictCount} dari {sc.pairedComparisons}{" "}
                                pasangan berbeda
                              </span>
                              {sc.severeConflictCount > 0 && (
                                <span className="font-mono font-bold">
                                  {sc.severeConflictCount} silang A-C
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Per-Module A/B/C Distribution */}
                  <div className="bg-[#FFFFFF] border border-[#CBD5E1] rounded-2xl p-5 sm:p-6 space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2E8F0] pb-4">
                      <div>
                        <h3 className="text-base font-extrabold text-[#1E293B]">
                          Sebaran Pilihan Opsi A / B / C per Skenario
                        </h3>
                        <p className="text-xs text-[#475569]">
                          Pilih modul untuk melihat kecenderungan jawaban seluruh
                          pengguna pada kategori terpilih.
                        </p>
                      </div>

                      <div
                        role="tablist"
                        aria-label="Filter modul skenario"
                        className="flex flex-wrap gap-1.5"
                      >
                        {MODULES.map((m) => {
                          const active = selectedModuleTab === m.id;
                          return (
                            <button
                              key={m.id}
                              type="button"
                              role="tab"
                              aria-selected={active}
                              onClick={() => setSelectedModuleTab(m.id)}
                              className={`min-h-[44px] px-3.5 py-2 rounded-lg border font-mono text-xs font-bold transition-colors cursor-pointer ${
                                active
                                  ? "bg-[#0F766E] text-[#FFFFFF] border-[#0F766E]"
                                  : "bg-[#F8FAF7] text-[#1E293B] border-[#CBD5E1] hover:border-[#0F766E]"
                              }`}
                            >
                              MOD-0{m.id}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {moduleScenariosStats.map((sc) => (
                        <div
                          key={sc.id}
                          className="p-4 rounded-xl bg-[#F8FAF7] border border-[#CBD5E1] space-y-3"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span className="font-mono text-xs font-bold text-[#0F766E]">
                                #{sc.id} · {sc.categoryLabel}
                              </span>
                              <h4 className="text-sm font-bold text-[#1E293B] mt-0.5">
                                {sc.title}
                              </h4>
                            </div>
                            <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-[#FFFFFF] border border-[#CBD5E1] text-[#475569] shrink-0">
                              {sc.totalResponses} jawaban
                            </span>
                          </div>

                          <div className="space-y-2">
                            {sc.options.map((opt) => {
                              const count =
                                opt.key === "A"
                                  ? sc.countA
                                  : opt.key === "B"
                                  ? sc.countB
                                  : sc.countC;
                              const pct =
                                opt.key === "A"
                                  ? sc.pctA
                                  : opt.key === "B"
                                  ? sc.pctB
                                  : sc.pctC;

                              return (
                                <div key={opt.key} className="space-y-1">
                                  <div className="flex items-center justify-between text-xs gap-2">
                                    <span className="text-[#1E293B] font-medium truncate">
                                      <strong className="font-mono text-[#0F766E] mr-1.5">
                                        Opsi {opt.key}:
                                      </strong>
                                      {opt.text}
                                    </span>
                                    <span className="font-mono text-xs font-bold text-[#1E293B] shrink-0 tabular-nums">
                                      {count} ({pct}%)
                                    </span>
                                  </div>
                                  <div className="h-2 rounded-full analytics-bar-track overflow-hidden">
                                    <div
                                      className="h-full analytics-bar-fill rounded-full transition-all duration-300"
                                      style={{ width: `${pct}%` }}
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* SECTION 03: Riwayat Sesi Tersamar */}
                <section className="space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                    <div className="space-y-1">
                      <p className="font-mono text-xs font-bold uppercase tracking-widest text-[#0F766E]">
                        03 / RIWAYAT SESI TERSAMAR (PRIVACY-SAFE)
                      </p>
                      <h2 className="text-xl sm:text-2xl font-extrabold text-[#1E293B]">
                        Log sesi (#PUBLIK &amp; batch khusus) tanpa catatan
                        pribadi maupun tanda tangan
                      </h2>
                    </div>

                    <div className="relative w-full sm:w-72">
                      <input
                        type="text"
                        value={sessionSearch}
                        onChange={(e) => setSessionSearch(e.target.value)}
                        aria-label="Cari kode ruang pada riwayat"
                        placeholder="Cari kode ruang (misal: VWS-UJI)..."
                        className="w-full min-h-[44px] pl-9 pr-10 py-2 rounded-lg border border-[#CBD5E1] bg-[#FFFFFF] text-xs font-medium text-[#1E293B] focus:border-[#0F766E]"
                      />
                      <Search className="w-4 h-4 text-[#475569] absolute left-3 top-3.5 pointer-events-none" />
                      {sessionSearch && (
                        <button
                          type="button"
                          onClick={() => setSessionSearch("")}
                          aria-label="Hapus pencarian kode ruang"
                          className="min-h-[44px] min-w-[44px] absolute right-0 top-0 inline-flex items-center justify-center text-[#475569] hover:text-[#1E293B] cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="bg-[#FFFFFF] border border-[#CBD5E1] rounded-2xl divide-y divide-[#E2E8F0] overflow-hidden">
                    {filteredSessions.length === 0 ? (
                      <div className="p-8 text-center text-xs sm:text-sm text-[#475569]">
                        Tidak ditemukan sesi dengan kata kunci &ldquo;
                        {sessionSearch}&rdquo;.
                      </div>
                    ) : (
                      filteredSessions.map((sess) => {
                        const isExpanded = expandedRoomCode === sess.roomCode;
                        return (
                          <div key={sess.roomCode} className="p-4 sm:p-5">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                              <div className="space-y-1.5">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="font-mono text-sm font-extrabold text-[#1E293B]">
                                    {sess.roomCode}
                                  </span>
                                  <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-[#F0FDFA] text-[#0F766E] border border-[#99F6E4]">
                                    #{sess.trackTag}
                                  </span>
                                  {sess.guestJoined ? (
                                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]">
                                      Berpasangan ({sess.hostMasked} &amp;{" "}
                                      {sess.guestMasked})
                                    </span>
                                  ) : (
                                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#F1F5F9] text-[#475569] border border-[#CBD5E1]">
                                      1 Orang ({sess.hostMasked} · Menunggu
                                      pasangan)
                                    </span>
                                  )}
                                </div>

                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#475569]">
                                  <span>
                                    Diperbarui: {formatTimestamp(sess.updatedAt)}
                                  </span>
                                  <span>
                                    Jawaban Host:{" "}
                                    <strong className="font-mono text-[#1E293B]">
                                      {sess.hostAnswerCount}/40
                                    </strong>
                                  </span>
                                  <span>
                                    Jawaban Guest:{" "}
                                    <strong className="font-mono text-[#1E293B]">
                                      {sess.guestAnswerCount}/40
                                    </strong>
                                  </span>
                                  <span>
                                    Modul Inti:{" "}
                                    <strong className="font-mono text-[#0F766E]">
                                      {
                                        sess.completedModules.filter(
                                          (m) => m >= 1 && m <= 4
                                        ).length
                                      }
                                      /4
                                    </strong>
                                  </span>
                                  {((sess.customQuestionCount || 0) > 0 ||
                                    sess.completedModules.includes(5)) && (
                                    <span>
                                      Soal Kustom:{" "}
                                      <strong className="font-mono text-[#0F766E]">
                                        {sess.customQuestionCount || 0} soal
                                        {sess.completedModules.includes(5)
                                          ? " (Pasal V Sah)"
                                          : ""}
                                      </strong>
                                    </span>
                                  )}
                                  {sess.alignmentScore !== null && (
                                    <span>
                                      Skor Selaras:{" "}
                                      <strong className="font-mono text-[#0F766E]">
                                        {sess.alignmentScore}%
                                      </strong>
                                    </span>
                                  )}
                                </div>
                              </div>

                              <button
                                type="button"
                                aria-expanded={isExpanded}
                                onClick={() =>
                                  setExpandedRoomCode(
                                    isExpanded ? null : sess.roomCode
                                  )
                                }
                                className="min-h-[44px] px-4 py-2 rounded-lg border border-[#CBD5E1] bg-[#F8FAF7] hover:border-[#0F766E] text-xs font-bold text-[#1E293B] inline-flex items-center justify-center gap-2 transition-colors cursor-pointer shrink-0"
                              >
                                <span>
                                  {isExpanded
                                    ? "Tutup Rincian Opsi"
                                    : "Lihat Log Opsi A/B/C"}
                                </span>
                                <ChevronDown
                                  className={`w-4 h-4 text-[#0F766E] transition-transform ${
                                    isExpanded ? "rotate-180" : ""
                                  }`}
                                />
                              </button>
                            </div>

                            {isExpanded && (
                              <div className="mt-4 pt-4 border-t border-[#E2E8F0] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 panel-enter">
                                {MODULES.map((m) => {
                                  const modScens = SCENARIOS.filter(
                                    (s) => s.moduleId === m.id
                                  );
                                  const isDone = sess.completedModules.includes(
                                    m.id
                                  );
                                  return (
                                    <div
                                      key={m.id}
                                      className="p-3.5 rounded-xl bg-[#F8FAF7] border border-[#CBD5E1] space-y-2"
                                    >
                                      <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-1.5">
                                        <span className="font-mono text-xs font-bold text-[#0F766E]">
                                          MOD-0{m.id}
                                        </span>
                                        <span className="text-[11px] font-semibold text-[#475569]">
                                          {isDone ? "Piagam Sah" : "Proses"}
                                        </span>
                                      </div>

                                      <div className="space-y-1 font-mono text-xs">
                                        {modScens.map((sc) => {
                                          const rawH =
                                            sess.hostAnswers[String(sc.id)];
                                          const rawG = sess.guestJoined
                                            ? sess.guestAnswers[String(sc.id)]
                                            : undefined;
                                          const hChoice = rawH || "-";
                                          const gChoice = rawG || "-";
                                          const diff = Boolean(
                                            rawH && rawG && rawH !== rawG
                                          );
                                          return (
                                            <div
                                              key={sc.id}
                                              className="flex items-center justify-between py-0.5"
                                            >
                                              <span className="text-[#475569]">
                                                #{String(sc.id).padStart(2, "0")}
                                              </span>
                                              <span
                                                className={`font-bold ${
                                                  diff
                                                    ? "text-[#92400E]"
                                                    : "text-[#1E293B]"
                                                }`}
                                              >
                                                H:{hChoice} / G:{gChoice}
                                              </span>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </section>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
};
