"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { AppHeader } from "./AppHeader";
import {
  ChevronDown,
  AlertTriangle,
  X,
  CheckCircle2,
  FileSignature,
  Lock,
  SlidersHorizontal,
  BookOpen,
  PenLine,
  Plus,
} from "lucide-react";
import { isScenarioAnswered, useRoom } from "../lib/sessionStore";
import { computeAlignment } from "../lib/scoring";
import { SCENARIOS, getModuleMeta } from "../data/scenarios";
import { AlignmentDonutVisual } from "./VisualIllustrations";

interface AlignmentResultProps {
  onProceedToCharter: () => void;
  onBackToDashboard: () => void;
  moduleId?: number;
}

const COMPROMISE_TEMPLATES = [
  "Tetapkan batas nominal tetap dari rekening bersama yang disepakati berdua; kelebihan di atas batas tersebut wajib didiskusikan minimal 24 jam sebelumnya.",
  "Bagi beban 50% dari kas rumah tangga bersama dan 50% dari alokasi dana pribadi masing-masing tanpa mengganggu pos dana darurat.",
  "Susun aturan tertulis yang dievaluasi ulang setiap 6 bulan agar keputusan tetap adil mengikuti perubahan pendapatan dan kondisi keluarga.",
];

export const AlignmentResultPage: React.FC<AlignmentResultProps> = ({
  onProceedToCharter,
  onBackToDashboard,
  moduleId = 1,
}) => {
  const {
    room,
    myName,
    partnerName,
    me,
    partnerAnswers,
    customScenarios,
    isBothLocked,
    saveCompromise,
  } = useRoom();

  const roomCode = room?.code || "VWS-000";
  const encodedRoom = encodeURIComponent(roomCode);
  const currentModule = getModuleMeta(moduleId);

  const moduleScenarios = useMemo(
    () =>
      moduleId === 5
        ? customScenarios
        : SCENARIOS.filter((s) => s.moduleId === moduleId),
    [moduleId, customScenarios]
  );

  const allLookupScenarios = useMemo(
    () => [...SCENARIOS, ...customScenarios],
    [customScenarios]
  );

  const getScenarioBadgeLabel = (scenarioId: number) => {
    if (scenarioId >= 1001) {
      const idx = customScenarios.findIndex((s) => s.id === scenarioId);
      return idx !== -1 ? `Kustom #${idx + 1}` : `Kustom #${scenarioId}`;
    }
    return `Skenario #${scenarioId}`;
  };

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedScenarioForModal, setSelectedScenarioForModal] =
    useState<number>(moduleScenarios[0]?.id || 1);
  const [selectedSuggestion, setSelectedSuggestion] = useState(0);
  const [customAgreement, setCustomAgreement] = useState("");
  const [openAccordions, setOpenAccordions] = useState<Record<number, boolean>>(
    {}
  );

  useEffect(() => {
    if (!modalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [modalOpen]);

  const toggleAccordion = (id: number) => {
    setOpenAccordions((prev) => ({ ...prev, [id]: !(prev[id] ?? true) }));
  };

  const myAnsweredCount = useMemo(() => {
    if (!me?.answers) return 0;
    return moduleScenarios.filter((s) =>
      isScenarioAnswered(s, me.answers[s.id])
    ).length;
  }, [me?.answers, moduleScenarios]);

  const partnerAnsweredCount = useMemo(() => {
    if (!partnerAnswers) return 0;
    return moduleScenarios.filter((s) =>
      isScenarioAnswered(s, partnerAnswers[s.id])
    ).length;
  }, [partnerAnswers, moduleScenarios]);

  const hasBothAnswers =
    moduleScenarios.length > 0 &&
    (moduleId === 5
      ? isBothLocked(5)
      : myAnsweredCount > 0 && partnerAnsweredCount > 0);

  const alignment = useMemo(() => {
    if (!me?.answers || !partnerAnswers || !hasBothAnswers) {
      return null;
    }
    return computeAlignment(
      me.answers,
      partnerAnswers,
      moduleId,
      moduleId === 5 ? customScenarios : undefined
    );
  }, [
    me?.answers,
    partnerAnswers,
    hasBothAnswers,
    moduleId,
    customScenarios,
  ]);

  const overallScore = alignment ? alignment.overall : null;
  const categories = alignment ? alignment.byCategory : {};
  const essayScenarios = alignment ? alignment.essayScenarios : [];

  const criticalScenarios = alignment
    ? alignment.results.filter((r) => r.critical)
    : [];

  const alignedScenarios = alignment
    ? alignment.results.filter((r) => !r.critical)
    : [];

  const formatIDR = (val?: number) =>
    val ? "Rp " + val.toLocaleString("id-ID") : "";

  const getExistingCompromise = (scenarioId: number) =>
    room?.compromises?.find((c) => c.scenarioId === scenarioId);

  const openCompromiseModal = (scenarioId: number) => {
    const existing = getExistingCompromise(scenarioId);
    setSelectedScenarioForModal(scenarioId);
    setSelectedSuggestion(0);
    setCustomAgreement(existing?.agreementText || "");
    setModalOpen(true);
  };

  const modalScenario = allLookupScenarios.find(
    (s) => s.id === selectedScenarioForModal
  );

  return (
    <div className="min-h-screen bg-[#F8FAF7] text-[#1E293B] flex flex-col relative">
      <AppHeader
        roomCode={roomCode}
        moduleId={moduleId}
        progressText={
          hasBothAnswers
            ? overallScore !== null
              ? `Modul ${moduleId}: Skor Keselarasan ${overallScore}%`
              : `Modul ${moduleId}: ${essayScenarios.length} Refleksi Esai Terbuka`
            : `Modul ${moduleId}: Menunggu Kelengkapan Segel`
        }
        isEncrypted={true}
        userNames={`${myName || "Anda"} & ${partnerName || "Pasangan"}`}
      />

      <main className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 space-y-8">
        {moduleId === 5 && moduleScenarios.length === 0 ? (
          <div className="bg-[#FFFFFF] rounded-xl p-6 sm:p-10 border border-[#CBD5E1] space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#F0FDFA] border border-[#99F6E4] text-xs font-mono font-bold text-[#0F766E]">
              <PenLine className="w-3.5 h-3.5" />
              <span>BANK SOAL KUSTOM KOSONG · MODUL 05</span>
            </div>

            <div className="space-y-2 max-w-2xl">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E293B] tracking-tight">
                Belum ada pertanyaan kustom untuk dibandingkan di ruang{" "}
                {roomCode}
              </h1>
              <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
                Buat minimal 1 pertanyaan kustom bersama{" "}
                <strong>{partnerName || "Pasangan"}</strong> pada Studio Soal
                Kustom, lalu jawab dan kunci segel masing-masing untuk membuka
                perbandingan.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href={`/room/${encodedRoom}/custom`}
                className="min-h-[48px] px-5 py-3 rounded-lg bg-[#0F766E] hover:bg-[#115E59] text-[#FFFFFF] text-xs sm:text-sm font-bold inline-flex items-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4 shrink-0" />
                <span>Buat Pertanyaan Kustom Sekarang</span>
              </Link>
              <button
                type="button"
                onClick={onBackToDashboard}
                className="min-h-[48px] px-4 py-3 rounded-lg border border-[#CBD5E1] bg-[#FFFFFF] hover:bg-[#F1F5F9] text-[#1E293B] text-xs sm:text-sm font-bold transition-colors cursor-pointer"
              >
                Kembali ke Dashboard
              </button>
            </div>
          </div>
        ) : !hasBothAnswers ? (
          /* Honest Empty / Unrevealed State (R-17 & R-27) */
          <div className="bg-[#FFFFFF] rounded-xl p-6 sm:p-10 border border-[#CBD5E1] space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#FFFBEB] border border-[#FDE68A] text-xs font-mono font-bold text-[#92400E]">
              <Lock className="w-3.5 h-3.5" />
              <span>SEGEL GANDA BELUM TERBUKA · MODUL 0{moduleId}</span>
            </div>

            <div className="space-y-2 max-w-2xl">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E293B] tracking-tight">
                Perbandingan jawaban Modul {moduleId} membutuhkan segel kunci
                dari kedua pihak
              </h1>
              <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
                Saat ini <strong>{myName || "Anda"}</strong> telah menjawab{" "}
                <span className="font-mono font-bold text-[#1E293B]">
                  {myAnsweredCount}/{moduleScenarios.length}
                </span>{" "}
                skenario, sedangkan{" "}
                <strong>{partnerName || "Pasangan"}</strong> telah menjawab{" "}
                <span className="font-mono font-bold text-[#1E293B]">
                  {partnerAnsweredCount}/{moduleScenarios.length}
                </span>{" "}
                skenario pada <em>{currentModule.title}</em>.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href={`/room/${encodedRoom}/dilemma?module=${moduleId}`}
                className="min-h-[48px] px-5 py-3 rounded-lg bg-[#0F766E] hover:bg-[#115E59] text-[#FFFFFF] text-xs sm:text-sm font-bold inline-flex items-center gap-2 transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>
                  Isi &amp; Kunci {moduleScenarios.length} Skenario Modul{" "}
                  {moduleId}
                </span>
              </Link>

              {moduleId === 5 && (
                <Link
                  href={`/room/${encodedRoom}/custom`}
                  className="min-h-[48px] px-4 py-3 rounded-lg border border-[#0F766E] bg-[#F0FDFA] hover:bg-[#ECFDF5] text-[#0F766E] text-xs sm:text-sm font-bold inline-flex items-center gap-2 transition-colors"
                >
                  <PenLine className="w-4 h-4 shrink-0" />
                  <span>Kelola Bank Soal Kustom</span>
                </Link>
              )}

              <button
                type="button"
                onClick={onBackToDashboard}
                className="min-h-[48px] px-4 py-3 rounded-lg border border-[#CBD5E1] bg-[#FFFFFF] hover:bg-[#F1F5F9] text-[#1E293B] text-xs sm:text-sm font-bold transition-colors cursor-pointer"
              >
                Kembali ke Dashboard
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Top Header & Visual Radial Score Ledger */}
            <div className="bg-[#FFFFFF] rounded-xl p-6 sm:p-8 border border-[#CBD5E1]">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                <div className="text-xs font-mono font-bold tracking-wider text-[#0F766E] uppercase">
                  PEMBUKAAN SEGEL SERENTAK · MODUL 0{moduleId}
                </div>
                {moduleId === 5 && (
                  <Link
                    href={`/room/${encodedRoom}/custom`}
                    className="min-h-[38px] px-3 py-1.5 rounded-lg border border-[#CBD5E1] bg-[#F8FAF7] hover:border-[#0F766E] text-xs font-bold text-[#0F766E] inline-flex items-center gap-1.5"
                  >
                    <PenLine className="w-3.5 h-3.5 shrink-0" />
                    <span>Buka Bank Soal Kustom</span>
                  </Link>
                )}
              </div>

              <div className="pb-6 border-b border-[#E2E8F0]">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E293B] tracking-tight">
                  Peta Keselarasan: {currentModule.title}
                </h1>
                <p className="text-xs sm:text-sm text-[#475569] mt-1">
                  Perbandingan independen jawaban{" "}
                  <strong>{myName || "Anda"}</strong> dan{" "}
                  <strong>{partnerName || "Pasangan"}</strong>.
                </p>
              </div>

              {overallScore !== null ? (
                /* Category Breakdown Grid when >= 1 A/B/C scenario exists */
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-6">
                  {/* Radial Donut Visual Box */}
                  <div className="lg:col-span-5 space-y-3">
                    <AlignmentDonutVisual
                      score={overallScore}
                      alignedCount={alignedScenarios.length}
                      conflictCount={criticalScenarios.length}
                    />
                    <p className="text-xs text-[#475569] leading-relaxed">
                      {criticalScenarios.length > 0
                        ? `Terdapat ${criticalScenarios.length} topik pilihan A/B/C yang berbeda. Catat kompromi di bawah sebelum mengesahkan Piagam.`
                        : `Seluruh ${alignedScenarios.length} skenario pilihan A/B/C telah selaras dan siap disahkan di Piagam.`}
                      {essayScenarios.length > 0 &&
                        ` Ditambah ${essayScenarios.length} topik esai terbuka di bawah untuk didiskusikan berdua.`}
                    </p>
                  </div>

                  {/* Pillar Breakdown list */}
                  <div className="lg:col-span-7 space-y-4">
                    <h2 className="text-xs font-mono font-bold tracking-wider text-[#1E293B] uppercase">
                      Rincian Kecocokan per Kategori Topik
                    </h2>

                    {Object.entries(categories).map(([category, score]) => {
                      const barColor =
                        score >= 70
                          ? "bg-[#0F766E]"
                          : score >= 50
                          ? "bg-[#B45309]"
                          : "bg-[#B91C1C]";
                      const textColor =
                        score >= 70
                          ? "text-[#0F766E]"
                          : score >= 50
                          ? "text-[#92400E]"
                          : "text-[#991B1B]";

                      return (
                        <div key={category}>
                          <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                            <span className="text-[#1E293B]">{category}</span>
                            <span
                              className={`${textColor} font-mono tabular-nums`}
                            >
                              {score}% Selaras
                            </span>
                          </div>
                          <div className="w-full bg-[#E2E8F0] h-2.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${barColor} transition-all duration-300`}
                              style={{ width: `${score}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* Honest Open-Reflection Summary when 100% of custom questions are Essay (R-17 & C-5) */
                <div className="pt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  <div className="lg:col-span-7 bg-[#F0FDFA] border border-[#99F6E4] rounded-xl p-5 space-y-2">
                    <div className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-[#0F766E]">
                      <BookOpen className="w-4 h-4 shrink-0" />
                      <span>MODE REFLEKSI ESAI TERBUKA</span>
                    </div>
                    <h2 className="text-base sm:text-lg font-extrabold text-[#1E293B]">
                      Seluruh {essayScenarios.length} Topik Berupa Esai Terbuka
                    </h2>
                    <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                      Pertanyaan esai tidak diberi angka persentase kecocokan
                      buatan agar makna tulisan kalian tetap utuh. Baca jawaban
                      berdampingan di bawah lalu rumuskan kesepakatan tertulis
                      ke dalam Piagam Pasal V.
                    </p>
                  </div>
                  <div className="lg:col-span-5 bg-[#F8FAF7] border border-[#CBD5E1] rounded-xl p-5 grid grid-cols-2 gap-4 text-center divide-x divide-[#CBD5E1]">
                    <div>
                      <span className="block font-mono text-[11px] font-bold uppercase text-[#475569]">
                        Topik Esai Terbuka
                      </span>
                      <span className="font-mono text-2xl font-extrabold text-[#1E293B] tabular-nums">
                        {essayScenarios.length}
                      </span>
                    </div>
                    <div className="pl-4">
                      <span className="block font-mono text-[11px] font-bold uppercase text-[#0F766E]">
                        Pasal Tercatat
                      </span>
                      <span className="font-mono text-2xl font-extrabold text-[#0F766E] tabular-nums">
                        {
                          essayScenarios.filter((sc) =>
                            Boolean(getExistingCompromise(sc.id))
                          ).length
                        }
                        /{essayScenarios.length}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Where You Differ Section (Conflicts) */}
            {criticalScenarios.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-[#991B1B]" />
                    <h2 className="text-lg font-extrabold text-[#1E293B]">
                      Topik yang Memerlukan Kompromi ({criticalScenarios.length}{" "}
                      Skenario)
                    </h2>
                  </div>
                  <span className="text-xs text-[#475569] font-medium">
                    Klik kartu untuk melihat perbandingan dan merumuskan jalan
                    tengah
                  </span>
                </div>

                {criticalScenarios.map(({ scenario, score }) => {
                  const myAns = me?.answers[scenario.id];
                  const partnerAns = partnerAnswers?.[scenario.id];
                  const isOpen = openAccordions[scenario.id] ?? true;

                  const myOpt = scenario.options.find(
                    (o) => o.key === myAns?.choice
                  );
                  const partnerOpt = scenario.options.find(
                    (o) => o.key === partnerAns?.choice
                  );
                  const savedComp = getExistingCompromise(scenario.id);

                  return (
                    <div
                      key={scenario.id}
                      className={`bg-[#FFFFFF] rounded-xl border-2 overflow-hidden ${
                        savedComp ? "border-[#0F766E]" : "border-[#FECACA]"
                      }`}
                    >
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        onClick={() => toggleAccordion(scenario.id)}
                        className="w-full p-5 flex items-center justify-between gap-3 cursor-pointer hover:bg-[#F8FAF7] transition-colors border-b border-[#E2E8F0] text-left"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                              savedComp
                                ? "bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]"
                                : "bg-[#FEF2F2] text-[#991B1B] border border-[#FECACA]"
                            }`}
                          >
                            {savedComp ? "✓" : "!"}
                          </span>
                          <span className="text-sm sm:text-base font-bold text-[#1E293B] truncate">
                            {getScenarioBadgeLabel(scenario.id)} ·{" "}
                            {scenario.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-2.5 shrink-0">
                          {savedComp ? (
                            <span className="text-xs font-bold px-2.5 py-1 rounded bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]">
                              Kompromi Tercatat
                            </span>
                          ) : (
                            <span className="text-xs font-bold px-2.5 py-1 rounded bg-[#FEF2F2] text-[#991B1B] border border-[#FECACA] font-mono tabular-nums">
                              Skor {score}%
                            </span>
                          )}
                          <ChevronDown
                            className={`w-4 h-4 text-[#475569] transition-transform ${
                              isOpen ? "rotate-180" : ""
                            }`}
                          />
                        </div>
                      </button>

                      {isOpen && (
                        <div className="p-5 sm:p-6 space-y-5 bg-[#F8FAF7]">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* You chose */}
                            <div className="bg-[#FFFFFF] p-4 sm:p-5 rounded-xl border border-[#CBD5E1] space-y-2">
                              <div className="flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0] flex items-center justify-center text-xs font-bold">
                                  {myName?.[0]?.toUpperCase() || "A"}
                                </span>
                                <span className="text-xs font-bold uppercase tracking-wider text-[#475569]">
                                  Pilihan {myName || "Anda"}
                                </span>
                              </div>
                              <p className="text-xs sm:text-sm text-[#1E293B] font-bold leading-relaxed">
                                Opsi {myAns?.choice || "-"}:{" "}
                                {myOpt?.text || "Belum dijawab"}
                              </p>
                              {myAns?.amount !== undefined && (
                                <div className="text-xs font-mono font-bold text-[#0F766E] pt-1 tabular-nums">
                                  Nominal: {formatIDR(myAns.amount)}
                                </div>
                              )}
                              {myAns?.note && (
                                <div className="text-xs text-[#475569] italic pt-2 border-t border-[#E2E8F0]">
                                  &ldquo;{myAns.note}&rdquo;
                                </div>
                              )}
                            </div>

                            {/* Partner chose */}
                            <div className="bg-[#FFFFFF] p-4 sm:p-5 rounded-xl border border-[#CBD5E1] space-y-2">
                              <div className="flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-[#0F766E] text-[#FFFFFF] flex items-center justify-center text-xs font-bold">
                                  {partnerName?.[0]?.toUpperCase() || "P"}
                                </span>
                                <span className="text-xs font-bold uppercase tracking-wider text-[#0F766E]">
                                  Pilihan {partnerName || "Pasangan"}
                                </span>
                              </div>
                              <p className="text-xs sm:text-sm text-[#1E293B] font-bold leading-relaxed">
                                Opsi {partnerAns?.choice || "-"}:{" "}
                                {partnerOpt?.text || "Belum dijawab"}
                              </p>
                              {partnerAns?.amount !== undefined && (
                                <div className="text-xs font-mono font-bold text-[#0F766E] pt-1 tabular-nums">
                                  Nominal: {formatIDR(partnerAns.amount)}
                                </div>
                              )}
                              {partnerAns?.note && (
                                <div className="text-xs text-[#475569] italic pt-2 border-t border-[#E2E8F0]">
                                  &ldquo;{partnerAns.note}&rdquo;
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Compromise Box */}
                          <div className="bg-[#FFFFFF] p-5 rounded-xl border border-[#CBD5E1] space-y-3">
                            <div className="flex items-center justify-between flex-wrap gap-2">
                              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#0F766E]">
                                {savedComp
                                  ? "RUMUSAN KOMPROMI YANG DISEPAKATI"
                                  : "PANDUAN JALAN TENGAH"}
                              </span>
                            </div>

                            {savedComp ? (
                              <p className="text-sm font-semibold text-[#1E293B] leading-relaxed bg-[#ECFDF5] p-3.5 rounded-lg border border-[#A7F3D0]">
                                &ldquo;{savedComp.agreementText}&rdquo;
                              </p>
                            ) : (
                              <p className="text-xs sm:text-sm text-[#475569] leading-relaxed font-serif italic">
                                &ldquo;Kedua pilihan berangkat dari niat menjaga
                                kestabilan rumah tangga. Sepakati batas angka
                                dan prosedur komunikasi agar tidak ada pihak
                                yang merasa dilangkahi.&rdquo;
                              </p>
                            )}

                            <div className="pt-1">
                              <button
                                type="button"
                                onClick={() => openCompromiseModal(scenario.id)}
                                className="min-h-[44px] px-4 py-2 bg-[#0F766E] hover:bg-[#115E59] text-[#FFFFFF] rounded-lg text-xs font-bold transition-colors cursor-pointer"
                              >
                                {savedComp
                                  ? "Ubah Rumusan Kompromi"
                                  : "Tulis Kesepakatan Kompromi"}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </section>
            )}

            {/* Open Essay Side-by-Side Comparison Section */}
            {essayScenarios.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-[#0F766E]" />
                    <h2 className="text-lg font-extrabold text-[#1E293B]">
                      Perbandingan Jawaban Esai Terbuka ({essayScenarios.length}{" "}
                      Topik)
                    </h2>
                  </div>
                  <span className="text-xs text-[#475569] font-medium">
                    Baca pandangan masing-masing lalu catat kesepakatan untuk
                    Piagam Pasal V
                  </span>
                </div>

                {essayScenarios.map((scenario) => {
                  const myAns = me?.answers[scenario.id];
                  const partnerAns = partnerAnswers?.[scenario.id];
                  const savedComp = getExistingCompromise(scenario.id);

                  return (
                    <div
                      key={scenario.id}
                      className={`bg-[#FFFFFF] rounded-xl border-2 overflow-hidden p-5 sm:p-6 space-y-5 ${
                        savedComp ? "border-[#0F766E]" : "border-[#CBD5E1]"
                      }`}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2 border-b border-[#E2E8F0] pb-4">
                        <div className="space-y-1">
                          <div className="flex items-center flex-wrap gap-2">
                            <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded bg-[#F0FDFA] text-[#0F766E] border border-[#99F6E4]">
                              {getScenarioBadgeLabel(scenario.id)} · Esai
                              Terbuka
                            </span>
                            <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-[#FFFBEB] text-[#92400E] border border-[#FDE68A]">
                              {scenario.categoryLabel}
                            </span>
                          </div>
                          <h3 className="text-base sm:text-lg font-extrabold text-[#1E293B]">
                            {scenario.title}
                          </h3>
                          {scenario.description && (
                            <p className="text-xs sm:text-sm text-[#475569]">
                              {scenario.description}
                            </p>
                          )}
                        </div>

                        {savedComp && (
                          <span className="text-xs font-bold px-2.5 py-1 rounded bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0] shrink-0">
                            Pasal Kesepakatan Tercatat
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-[#F8FAF7] p-4 sm:p-5 rounded-xl border border-[#CBD5E1] space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0] flex items-center justify-center text-xs font-bold">
                              {myName?.[0]?.toUpperCase() || "A"}
                            </span>
                            <span className="text-xs font-bold uppercase tracking-wider text-[#475569]">
                              Jawaban Esai {myName || "Anda"}
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm text-[#1E293B] font-medium leading-relaxed whitespace-pre-line">
                            {myAns?.essayText || "Belum ada teks jawaban."}
                          </p>
                        </div>

                        <div className="bg-[#F8FAF7] p-4 sm:p-5 rounded-xl border border-[#CBD5E1] space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-[#0F766E] text-[#FFFFFF] flex items-center justify-center text-xs font-bold">
                              {partnerName?.[0]?.toUpperCase() || "P"}
                            </span>
                            <span className="text-xs font-bold uppercase tracking-wider text-[#0F766E]">
                              Jawaban Esai {partnerName || "Pasangan"}
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm text-[#1E293B] font-medium leading-relaxed whitespace-pre-line">
                            {partnerAns?.essayText || "Belum ada teks jawaban."}
                          </p>
                        </div>
                      </div>

                      <div className="bg-[#F8FAF7] p-4 rounded-xl border border-[#CBD5E1] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-1">
                          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#0F766E] block">
                            {savedComp
                              ? "BUNYI KESEPAKATAN TERTULIS"
                              : "SIMPULAN DISKUSI BERSAMA"}
                          </span>
                          {savedComp ? (
                            <p className="text-xs sm:text-sm font-semibold text-[#1E293B] leading-relaxed">
                              &ldquo;{savedComp.agreementText}&rdquo;
                            </p>
                          ) : (
                            <p className="text-xs text-[#475569]">
                              Rangkum titik temu dari kedua jawaban esai ini
                              agar tercantum pada Piagam Pasal V.
                            </p>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => openCompromiseModal(scenario.id)}
                          className="min-h-[44px] px-4 py-2 bg-[#0F766E] hover:bg-[#115E59] text-[#FFFFFF] rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0"
                        >
                          {savedComp
                            ? "Ubah Pasal Kesepakatan"
                            : "Rumuskan Kesepakatan ke Piagam"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </section>
            )}

            {/* Aligned Scenarios List */}
            {alignedScenarios.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-lg font-extrabold text-[#1E293B]">
                  Topik yang Sudah Selaras ({alignedScenarios.length} Skenario)
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {alignedScenarios.map(({ scenario, score }) => {
                    const myAns = me?.answers[scenario.id];
                    const myOpt = scenario.options.find(
                      (o) => o.key === myAns?.choice
                    );
                    return (
                      <div
                        key={scenario.id}
                        className="bg-[#FFFFFF] p-4 rounded-xl border border-[#CBD5E1] flex items-start justify-between gap-3"
                      >
                        <div className="flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-[#0F766E] shrink-0 mt-0.5" />
                          <div>
                            <div className="text-xs sm:text-sm font-bold text-[#1E293B]">
                              {getScenarioBadgeLabel(scenario.id)}:{" "}
                              {scenario.title}
                            </div>
                            <div className="text-xs text-[#475569] mt-0.5">
                              Opsi {myAns?.choice || "A"}:{" "}
                              {myOpt?.text || "Selaras"}
                            </div>
                          </div>
                        </div>
                        <span className="text-xs font-mono font-bold text-[#065F46] px-2 py-0.5 rounded bg-[#ECFDF5] border border-[#A7F3D0] shrink-0 tabular-nums">
                          {score}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Bottom Proceed Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-[#CBD5E1]">
              <button
                type="button"
                onClick={onBackToDashboard}
                className="min-h-[44px] px-4 py-2.5 rounded-lg border border-[#CBD5E1] bg-[#FFFFFF] hover:bg-[#F1F5F9] text-xs font-bold text-[#1E293B] cursor-pointer"
              >
                Kembali ke Dashboard Ruang
              </button>
              <button
                type="button"
                onClick={onProceedToCharter}
                className="min-h-[48px] px-6 py-3 bg-[#0F766E] hover:bg-[#115E59] text-[#FFFFFF] rounded-lg text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer"
              >
                <FileSignature className="w-4 h-4" />
                <span>Lanjut ke Piagam Kesepakatan Modul {moduleId}</span>
              </button>
            </div>
          </>
        )}
      </main>

      {/* Compromise Modal */}
      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="compromise-modal-title"
          className="fixed inset-0 z-50 bg-[#1E293B]/70 flex items-center justify-center p-4"
        >
          <div className="bg-[#FFFFFF] rounded-xl max-w-xl w-full p-6 sm:p-7 space-y-5 border border-[#CBD5E1]">
            <div className="flex items-start justify-between border-b border-[#E2E8F0] pb-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-[#0F766E] font-bold block">
                  RUMUSAN KESEPAKATAN ·{" "}
                  {getScenarioBadgeLabel(selectedScenarioForModal)}
                </span>
                <h3
                  id="compromise-modal-title"
                  className="text-lg font-extrabold text-[#1E293B] mt-0.5"
                >
                  {modalScenario?.title ||
                    getScenarioBadgeLabel(selectedScenarioForModal)}
                </h3>
              </div>
              <button
                type="button"
                aria-label="Tutup jendela kompromi"
                onClick={() => setModalOpen(false)}
                className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-lg text-[#475569] hover:text-[#1E293B] hover:bg-[#F1F5F9] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5">
              <div className="text-xs font-bold uppercase tracking-wider text-[#475569]">
                Pilih Templat Kesepakatan atau Tulis Sendiri:
              </div>
              {COMPROMISE_TEMPLATES.map((optText, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSelectedSuggestion(idx);
                    setCustomAgreement(optText);
                  }}
                  className={`w-full text-left p-3.5 rounded-lg border-2 transition-colors flex items-start justify-between gap-3 cursor-pointer ${
                    selectedSuggestion === idx
                      ? "border-[#0F766E] bg-[#F0FDFA]"
                      : "border-[#CBD5E1] bg-[#FFFFFF] hover:bg-[#F8FAF7]"
                  }`}
                >
                  <span className="text-xs sm:text-sm font-medium text-[#1E293B] leading-relaxed">
                    {optText}
                  </span>
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                      selectedSuggestion === idx
                        ? "border-[#0F766E] bg-[#0F766E]"
                        : "border-[#475569]"
                    }`}
                  >
                    {selectedSuggestion === idx && (
                      <div className="w-1.5 h-1.5 rounded-full bg-[#FFFFFF]" />
                    )}
                  </div>
                </button>
              ))}
            </div>

            <div>
              <label
                htmlFor="custom-agreement-input"
                className="block text-xs font-bold uppercase tracking-wider text-[#1E293B] mb-1.5"
              >
                Bunyi Pasal Kesepakatan untuk Dicantumkan di Piagam
              </label>
              <textarea
                id="custom-agreement-input"
                rows={3}
                value={customAgreement}
                onChange={(e) => setCustomAgreement(e.target.value)}
                maxLength={320}
                placeholder="Tuliskan kesepakatan spesifik Anda dan pasangan..."
                className="w-full p-3.5 text-xs sm:text-sm rounded-lg border border-[#CBD5E1] bg-[#FFFFFF] text-[#1E293B] focus:border-[#0F766E]"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#E2E8F0]">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="min-h-[44px] px-4 py-2 border border-[#CBD5E1] bg-[#FFFFFF] hover:bg-[#F1F5F9] text-[#1E293B] rounded-lg text-xs font-bold cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  const text =
                    customAgreement.trim() ||
                    COMPROMISE_TEMPLATES[selectedSuggestion];
                  saveCompromise({
                    scenarioId: selectedScenarioForModal,
                    title:
                      modalScenario?.title ||
                      getScenarioBadgeLabel(selectedScenarioForModal),
                    agreementText: text,
                  });
                  setModalOpen(false);
                }}
                className="min-h-[44px] px-5 py-2 bg-[#0F766E] hover:bg-[#115E59] text-[#FFFFFF] rounded-lg text-xs font-bold cursor-pointer"
              >
                Simpan Pasal ke Piagam
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
