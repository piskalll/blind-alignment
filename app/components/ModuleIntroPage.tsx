"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AppHeader } from "./AppHeader";
import { SCENARIOS, MODULES } from "../data/scenarios";
import { Shield, Home, LayoutGrid } from "lucide-react";
import { useRoom } from "../lib/sessionStore";
import { ModulePillarIllustration } from "./VisualIllustrations";

interface ModuleIntroProps {
  onBack: () => void;
  onStartDilemma: () => void;
  moduleId?: number;
}

export const ModuleIntroPage: React.FC<ModuleIntroProps> = ({
  onBack,
  onStartDilemma,
  moduleId = 1,
}) => {
  const { room, myName, partnerName } = useRoom();
  const roomCode = room?.code || "VWS-000";

  const currentModule = MODULES.find((m) => m.id === moduleId) || MODULES[0];
  const moduleScenarios = SCENARIOS.filter((s) => s.moduleId === moduleId);

  const [check1, setCheck1] = useState(true);
  const [check2, setCheck2] = useState(true);
  const [check3, setCheck3] = useState(true);

  const allChecked = check1 && check2 && check3;

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "Debt Ratio":
      case "Living Arrangement":
        return "bg-[#FEF2F2] text-[#991B1B] border-[#FECACA]";
      case "Parental Allowance":
      case "Parental Care":
        return "bg-[#FFFBEB] text-[#92400E] border-[#FDE68A]";
      case "Emergency Fund":
      case "In-Law Privacy":
        return "bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]";
      default:
        return "bg-[#F1F5F9] text-[#1E293B] border-[#CBD5E1]";
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAF7] text-[#1E293B] flex flex-col">
      <AppHeader
        roomCode={roomCode}
        moduleId={moduleId}
        progressText={`Modul ${moduleId}: Pemeriksaan Kesiapan`}
        isEncrypted={true}
        userNames={`${myName || "Anda"} & ${partnerName || "Pasangan"}`}
      />

      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 space-y-6">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center flex-wrap gap-2 text-xs font-semibold text-[#475569]"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-1 hover:text-[#1E293B] transition-colors"
          >
            <Home className="w-3.5 h-3.5 text-[#0F766E]" />
            <span>Beranda</span>
          </Link>
          <span>/</span>
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1 hover:text-[#1E293B] transition-colors cursor-pointer"
          >
            <LayoutGrid className="w-3.5 h-3.5 text-[#0F766E]" />
            <span>Dashboard Ruang {roomCode}</span>
          </button>
          <span>/</span>
          <span className="text-[#1E293B] font-bold">
            Modul {moduleId}: {currentModule.title}
          </span>
        </nav>

        {/* Title & Visual Illustration Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center bg-[#FFFFFF] border border-[#CBD5E1] rounded-xl p-5 sm:p-7">
          <div className="lg:col-span-7 space-y-2">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#0F766E] block">
              PENGANTAR MODUL 0{moduleId} · 10 SKENARIO KEPUTUSAN
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E293B] tracking-tight">
              {currentModule.title}
            </h1>
            <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
              {currentModule.subtitle}
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-[#065F46]">
              <Shield className="w-4 h-4 text-[#0F766E] shrink-0" />
              <span>
                Segel Dual-Blind aktif: pilihan Anda disembunyikan sampai{" "}
                <strong>{partnerName || "Pasangan"}</strong> selesai menjawab.
              </span>
            </div>
          </div>
          <div className="lg:col-span-5">
            <ModulePillarIllustration moduleId={moduleId} />
          </div>
        </div>

        {/* Two-Column Layout: Scenario List vs Readiness Checklist */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Scenarios list */}
          <div className="lg:col-span-8 bg-[#FFFFFF] rounded-xl border border-[#CBD5E1] overflow-hidden divide-y divide-[#E2E8F0]">
            <div className="px-5 py-3.5 bg-[#F8FAF7] border-b border-[#E2E8F0] flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#1E293B]">
                Daftar 10 Skenario pada Modul {moduleId}
              </span>
              <span className="font-mono text-xs font-semibold text-[#475569]">
                Estimasi {currentModule.estimatedTime}
              </span>
            </div>
            {moduleScenarios.map((sc, index) => (
              <div
                key={sc.id}
                className="p-4 sm:px-6 flex items-center justify-between gap-3 hover:bg-[#F8FAF7] transition-colors"
              >
                <div className="flex items-start sm:items-center gap-3.5 min-w-0 pr-2">
                  <span className="text-xs font-mono font-bold text-[#0F766E] bg-[#F0FDFA] border border-[#CCFBF1] px-2 py-0.5 rounded shrink-0">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <span className="text-xs sm:text-sm font-bold text-[#1E293B] block truncate">
                      {sc.title}
                    </span>
                    <span className="text-xs text-[#475569] line-clamp-1">
                      {sc.description}
                    </span>
                  </div>
                </div>
                <span
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-md border shrink-0 ${getCategoryBadge(
                    sc.category
                  )}`}
                >
                  {sc.categoryLabel}
                </span>
              </div>
            ))}
          </div>

          {/* Right: Readiness Checklist Card */}
          <div className="lg:col-span-4 bg-[#FFFFFF] rounded-xl p-6 border border-[#CBD5E1] space-y-6 lg:sticky lg:top-24">
            <div>
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#0F766E] block">
                PERSIAPAN SEBELUM MENJAWAB
              </span>
              <h2 className="text-lg font-bold text-[#1E293B] mt-0.5">
                Komitmen Kejujuran Sesi
              </h2>
              <div className="flex items-center flex-wrap gap-2 text-xs text-[#475569] mt-1 font-medium">
                <span>10 skenario</span>
                <span>·</span>
                <span>{currentModule.estimatedTime}</span>
                <span>·</span>
                <span className="text-[#0F766E] font-bold">
                  Tersimpan otomatis
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={check1}
                  onChange={(e) => setCheck1(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-[#CBD5E1] text-[#0F766E] focus:ring-[#0F766E] cursor-pointer shrink-0"
                />
                <span className="text-xs font-medium text-[#1E293B] leading-snug">
                  <strong>{myName || "Saya"}</strong> mengisi secara mandiri tanpa
                  diintip pasangan.
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={check2}
                  onChange={(e) => setCheck2(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-[#CBD5E1] text-[#0F766E] focus:ring-[#0F766E] cursor-pointer shrink-0"
                />
                <span className="text-xs font-medium text-[#1E293B] leading-snug">
                  <strong>Memilih jawaban paling jujur</strong>, bukan sekadar
                  menyenangkan pasangan.
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={check3}
                  onChange={(e) => setCheck3(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-[#CBD5E1] text-[#0F766E] focus:ring-[#0F766E] cursor-pointer shrink-0"
                />
                <span className="text-xs font-medium text-[#1E293B] leading-snug">
                  Perbedaan pilihan dijadikan bahan diskusi untuk merumuskan kompromi.
                </span>
              </label>
            </div>

            <div className="pt-3 border-t border-[#E2E8F0] space-y-2.5">
              <button
                type="button"
                onClick={onStartDilemma}
                disabled={!allChecked}
                className="w-full min-h-[48px] py-3 px-4 bg-[#0F766E] hover:bg-[#115E59] disabled:opacity-40 disabled:cursor-not-allowed text-[#FFFFFF] rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                Mulai Jawab 10 Skenario Modul {moduleId}
              </button>

              <button
                type="button"
                onClick={onBack}
                className="w-full min-h-[44px] py-2.5 px-4 rounded-lg border border-[#CBD5E1] bg-[#FFFFFF] hover:bg-[#F1F5F9] text-xs font-bold text-[#1E293B] transition-colors text-center cursor-pointer"
              >
                Kembali ke Dashboard Ruang
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
