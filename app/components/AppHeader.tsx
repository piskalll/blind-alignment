"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useSearchParams, useParams } from "next/navigation";
import {
  Lock,
  Sun,
  Moon,
  Menu,
  X,
  Home,
  LayoutGrid,
  BookOpen,
  SlidersHorizontal,
  Clock,
  Scale,
  FileSignature,
  PenLine,
} from "lucide-react";
import { useTheme } from "../lib/sessionStore";
import { BrandLogo } from "./BrandLogo";

interface HeaderProps {
  roomCode?: string;
  progressText?: string;
  isEncrypted?: boolean;
  userNames?: string;
  showAvatars?: boolean;
  moduleId?: number;
}

export const AppHeader: React.FC<HeaderProps> = ({
  roomCode,
  progressText,
  isEncrypted = true,
  userNames = "Anda & Pasangan",
  showAvatars = true,
  moduleId: propModuleId,
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = useParams<{ code?: string }>();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const urlCode =
    typeof params?.code === "string"
      ? decodeURIComponent(params.code).toUpperCase()
      : "";
  const activeRoomCode = (
    urlCode ||
    (roomCode && roomCode !== "VWS-000" ? roomCode : "") ||
    ""
  ).toUpperCase();

  const queryMod = Number(searchParams?.get("module"));
  const activeModuleId =
    propModuleId || (queryMod >= 1 && queryMod <= 5 ? queryMod : 1);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname, activeModuleId]);

  const parts = userNames.split("&").map((s) => s.trim());
  const initial1 = parts[0]?.[0]?.toUpperCase() || "A";
  const initial2 = parts[1]?.[0]?.toUpperCase() || "P";

  const encodedRoom = activeRoomCode ? encodeURIComponent(activeRoomCode) : "";

  const roomNavLinks = activeRoomCode
    ? [
        {
          label: "Dashboard",
          href: `/room/${encodedRoom}`,
          exact: true,
          icon: LayoutGrid,
        },
        {
          label: "Soal Kustom",
          href: `/room/${encodedRoom}/custom`,
          matchPath: `/room/${encodedRoom}/custom`,
          icon: PenLine,
        },
        {
          label: "Pengantar",
          href: `/room/${encodedRoom}/intro?module=${activeModuleId}`,
          matchPath: `/room/${encodedRoom}/intro`,
          icon: BookOpen,
        },
        {
          label: activeModuleId === 5 ? "Jawab Kustom" : "10 Skenario",
          href: `/room/${encodedRoom}/dilemma?module=${activeModuleId}`,
          matchPath: `/room/${encodedRoom}/dilemma`,
          icon: SlidersHorizontal,
        },
        {
          label: "Ruang Tunggu",
          href: `/room/${encodedRoom}/waiting?module=${activeModuleId}`,
          matchPath: `/room/${encodedRoom}/waiting`,
          icon: Clock,
        },
        {
          label: "Hasil",
          href: `/room/${encodedRoom}/result?module=${activeModuleId}`,
          matchPath: `/room/${encodedRoom}/result`,
          icon: Scale,
        },
        {
          label: "Piagam",
          href: `/room/${encodedRoom}/charter?module=${activeModuleId}`,
          matchPath: `/room/${encodedRoom}/charter`,
          icon: FileSignature,
        },
      ]
    : [];

  const isLinkActive = (item: {
    href: string;
    exact?: boolean;
    matchPath?: string;
  }) => {
    if (!pathname) return false;
    const cleanPathname = pathname.replace(/\/$/, "");
    if (item.exact) {
      return cleanPathname === `/room/${encodedRoom}`;
    }
    if (item.matchPath) {
      return cleanPathname.startsWith(item.matchPath);
    }
    return cleanPathname === item.href;
  };

  const buildModuleSwitchHref = (targetMod: number) => {
    if (!pathname || !encodedRoom) return `/room/${encodedRoom}`;
    const cleanPathname = pathname.replace(/\/$/, "");
    if (cleanPathname === `/room/${encodedRoom}`) {
      return targetMod === 5
        ? `/room/${encodedRoom}/custom`
        : `/room/${encodedRoom}/intro?module=${targetMod}`;
    }
    if (cleanPathname === `/room/${encodedRoom}/custom`) {
      return targetMod === 5
        ? `/room/${encodedRoom}/custom`
        : `/room/${encodedRoom}/intro?module=${targetMod}`;
    }
    return `${cleanPathname}?module=${targetMod}`;
  };

  return (
    <header className="w-full bg-[#FFFFFF] border-b border-[#CBD5E1] sticky top-0 z-40 print:hidden">
      {/* Row 1: Brand Identity & Session Metadata */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/"
            className="flex items-center gap-2.5 group min-h-[44px] pr-2 rounded-lg shrink-0"
            title="Kembali ke Beranda VowSync"
          >
            <BrandLogo />
          </Link>

          {activeRoomCode && (
            <div className="hidden sm:flex items-center gap-1.5 pl-3 border-l border-[#E2E8F0] text-xs text-[#475569] min-w-0">
              <span>Ruang</span>
              <span className="font-mono font-bold text-[#1E293B] bg-[#F1F5F9] px-2 py-0.5 rounded border border-[#CBD5E1]">
                {activeRoomCode}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {progressText && (
            <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-[#FFFBEB] text-[#92400E] text-xs font-semibold rounded-md border border-[#FDE68A] max-w-[280px]">
              <span
                className="w-2 h-2 rounded-full bg-[#B45309] shrink-0"
                aria-hidden="true"
              />
              <span className="truncate">{progressText}</span>
            </div>
          )}

          {isEncrypted && (
            <div
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-[#F0FDFA] text-[#0F766E] text-xs font-semibold rounded-md border border-[#CCFBF1]"
              title="Jawaban disegel secara lokal hingga kedua pihak mengunci modul"
            >
              <Lock className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden md:inline">Segel Ganda</span>
            </div>
          )}

          {showAvatars && (
            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-[#E2E8F0]">
              <div className="flex -space-x-1.5 overflow-hidden shrink-0">
                <div className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0] text-xs font-bold ring-2 ring-[#FFFFFF]">
                  {initial1}
                </div>
                <div className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#0F766E] text-[#FFFFFF] text-xs font-bold ring-2 ring-[#FFFFFF]">
                  {initial2}
                </div>
              </div>
              <span className="hidden xl:inline text-xs font-semibold text-[#1E293B] max-w-[160px] truncate">
                {userNames}
              </span>
            </div>
          )}

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={
              theme === "dark" ? "Aktifkan mode terang" : "Aktifkan mode gelap"
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

          {activeRoomCode && (
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-expanded={mobileMenuOpen}
              aria-label="Buka menu navigasi sesi"
              className="md:hidden min-h-[40px] min-w-[40px] inline-flex items-center justify-center rounded-lg border border-[#CBD5E1] bg-[#FFFFFF] text-[#1E293B] hover:bg-[#F1F5F9] transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Row 2: Dedicated Stage & Module Navigation Bar (Tablet & Desktop >= 768px) */}
      {activeRoomCode && (
        <div className="hidden md:block border-t border-[#E2E8F0] bg-[#F8FAF7]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-11 flex items-center justify-between gap-4">
            <nav
              aria-label="Navigasi Tahap Sesi"
              className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1"
            >
              <Link
                href="/"
                className="px-2.5 py-1.5 rounded-md text-xs font-semibold text-[#475569] hover:text-[#1E293B] hover:bg-[#FFFFFF] transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
              >
                <Home className="w-3.5 h-3.5 text-[#0F766E]" />
                <span>Beranda</span>
              </Link>

              <span
                className="text-[#CBD5E1] select-none px-0.5"
                aria-hidden="true"
              >
                /
              </span>

              {roomNavLinks.map((item) => {
                const active = isLinkActive(item);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                      active
                        ? "bg-[#0F766E] text-[#FFFFFF]"
                        : "text-[#475569] hover:text-[#1E293B] hover:bg-[#FFFFFF]"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Quick Module Selector Pills */}
            <div className="flex items-center gap-1 shrink-0">
              <span className="text-[11px] font-mono font-bold text-[#475569] mr-1 hidden lg:inline">
                MODUL:
              </span>
              {[1, 2, 3, 4, 5].map((mId) => {
                const isCurrentMod = mId === activeModuleId;
                return (
                  <Link
                    key={mId}
                    href={buildModuleSwitchHref(mId)}
                    title={
                      mId === 5
                        ? "Buka Modul 5 (Pertanyaan Kustom)"
                        : `Buka Modul ${mId}`
                    }
                    className={`px-2 py-1 rounded font-mono text-xs font-bold transition-colors ${
                      isCurrentMod
                        ? "bg-[#0F766E] text-[#FFFFFF]"
                        : "text-[#475569] hover:text-[#1E293B] hover:bg-[#FFFFFF] border border-transparent hover:border-[#CBD5E1]"
                    }`}
                  >
                    M{mId}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Navigation Drawer (< 768px) */}
      {activeRoomCode && mobileMenuOpen && (
        <nav
          aria-label="Navigasi Tahap Sesi Mobile"
          className="md:hidden border-t border-[#E2E8F0] bg-[#FFFFFF] px-4 py-3 space-y-3 shadow-lg"
        >
          <div className="flex items-center justify-between text-xs text-[#475569] pb-2 border-b border-[#E2E8F0]">
            <span className="font-semibold text-[#1E293B] truncate">
              {userNames}
            </span>
            <span className="font-mono font-bold text-[#0F766E] shrink-0">
              Ruang {activeRoomCode} · Modul {activeModuleId}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="min-h-[44px] px-3 py-2 rounded-lg border border-[#CBD5E1] text-xs font-bold text-[#1E293B] hover:bg-[#F1F5F9] flex items-center gap-2"
            >
              <Home className="w-4 h-4 text-[#0F766E] shrink-0" />
              <span>Beranda Utama</span>
            </Link>
            {roomNavLinks.map((item) => {
              const active = isLinkActive(item);
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={`min-h-[44px] px-3 py-2 rounded-lg border text-xs font-bold flex items-center gap-2 transition-colors ${
                    active
                      ? "bg-[#0F766E] text-[#FFFFFF] border-[#0F766E]"
                      : "border-[#CBD5E1] text-[#1E293B] hover:bg-[#F1F5F9]"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="pt-2 border-t border-[#E2E8F0] flex items-center justify-between gap-2">
            <span className="text-xs font-mono font-bold text-[#475569]">
              PILIH MODUL:
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {[1, 2, 3, 4, 5].map((mId) => (
                <Link
                  key={mId}
                  href={buildModuleSwitchHref(mId)}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`min-h-[44px] min-w-[44px] px-3 py-1.5 rounded-md font-mono text-xs font-bold inline-flex items-center justify-center ${
                    mId === activeModuleId
                      ? "bg-[#0F766E] text-[#FFFFFF]"
                      : "bg-[#F1F5F9] text-[#1E293B] border border-[#CBD5E1]"
                  }`}
                >
                  M{mId}
                </Link>
              ))}
            </div>
          </div>
        </nav>
      )}
    </header>
  );
};
