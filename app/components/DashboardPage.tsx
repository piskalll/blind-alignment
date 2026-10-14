"use client";

import React from "react";
import { AppHeader } from "./AppHeader";
import { Check, Clock, Lock, Sparkles, ArrowRight, FileText, ShieldCheck } from "lucide-react";
import { useRoom } from "../lib/sessionStore";
import { SCENARIOS, MODULES } from "../data/scenarios";

interface DashboardProps {
  onStartModule: (moduleId: number) => void;
  onRevealAnswers: (moduleId: number) => void;
  onViewCharter?: (moduleId: number) => void;
  onViewWaiting?: (moduleId: number) => void;
}

export const DashboardPage: React.FC<DashboardProps> = ({
  onStartModule,
  onRevealAnswers,
  onViewCharter,
  onViewWaiting,
}) => {
  const {
    room,
    myName,
    partnerName,
    me,
    role,
    isModuleUnlocked,
    completedModules,
    isUserLocked,
    isPartnerLocked,
    isBothLocked,
  } = useRoom();

  const roomCode = room?.code || "VWS-000";

  // Determine current active module (first incomplete module, or 4 if all completed)
  const activeModuleId = [1, 2, 3, 4].find((id) => !completedModules.includes(id)) || 4;
  const allModulesCompleted = [1, 2, 3, 4].every((id) => completedModules.includes(id));

  const activeModuleMeta = MODULES.find((m) => m.id === activeModuleId) || MODULES[0];

  const isActiveUserLocked = isUserLocked(activeModuleId);
  const isActivePartnerLocked = isPartnerLocked(activeModuleId);
  const isActiveBothLocked = isBothLocked(activeModuleId);

  // Helper to count answered dilemmas for a specific module
  const getModuleAnswerCount = (answers: Record<number, any> | undefined, modId: number) => {
    if (!answers) return 0;
    const modScenarios = SCENARIOS.filter((s) => s.moduleId === modId);
    return modScenarios.filter((s) => answers[s.id] !== undefined).length;
  };

  const myActiveAnswerCount = getModuleAnswerCount(me?.answers, activeModuleId);
  const partnerRole = role === "host" ? "guest" : "host";
  const partnerActiveAnswerCount = getModuleAnswerCount(room?.[partnerRole]?.answers, activeModuleId);

  const handleOpenCharter = (modId: number) => {
    if (onViewCharter) {
      onViewCharter(modId);
    } else {
      window.location.href = `/room/${roomCode}/charter?module=${modId}`;
    }
  };

  const handleOpenWaiting = (modId: number) => {
    if (onViewWaiting) {
      onViewWaiting(modId);
    } else {
      window.location.href = `/room/${roomCode}/waiting?module=${modId}`;
    }
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex flex-col">
      <AppHeader
        roomCode={roomCode}
        progressText={
          allModulesCompleted
            ? "Semua 4 Modul Telah Selesai & Diratifikasi!"
            : `Progres Modul: ${completedModules.length}/4 Selesai (Aktif: Modul ${activeModuleId})`
        }
        isEncrypted={true}
        userNames={`${myName || "You"} & ${partnerName || "Partner"}`}
      />

      <main className="max-w-6xl w-full mx-auto px-4 sm:px-8 py-8 flex-1 space-y-8">
        {/* Welcome Banner */}
        <div className="space-y-1">
          <div className="flex items-center flex-wrap gap-3">
            <span className="text-xs font-mono font-bold tracking-widest text-[#475569] uppercase">
              Room {roomCode} · Role: {role.toUpperCase()}
            </span>
            {room?.passcode && (
              <span className="px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-xs font-mono font-bold text-[#0F766E]">
                PIN: {room.passcode}
              </span>
            )}
            <button
              onClick={() => {
                const inviteLink = `${window.location.origin}/?room=${roomCode}&pin=${room?.passcode || ""}`;
                const text = encodeURIComponent(
                  `Hai! Masuk ke room kesepakatan pra-nikah kita di VowSync:\nKode Room: *${roomCode}*\nPIN: *${room?.passcode || ""}*\nLink: ${inviteLink}`
                );
                window.open(`https://wa.me/?text=${text}`, "_blank");
              }}
              className="text-xs text-[#0F766E] hover:underline flex items-center space-x-1 cursor-pointer font-semibold"
            >
              <span>Bagikan Link &amp; PIN via WhatsApp</span>
            </button>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1E293B] tracking-tight">
            Selamat datang, {myName || "User"}.
          </h1>
          <p className="text-sm sm:text-base text-[#475569]">
            {allModulesCompleted
              ? "Luar biasa! Seluruh 4 modul pilar pra-nikah telah Anda berdua selesaikan dan tanda tangani."
              : isActiveBothLocked
              ? `Jawaban Modul ${activeModuleId} telah dikunci oleh Anda dan pasangan! Buka hasil sekarang.`
              : isActiveUserLocked
              ? `Jawaban Modul ${activeModuleId} Anda telah dikunci. Menunggu ${partnerName} menyelesaikan.`
              : `Selesaikan 10 dilema pada Modul ${activeModuleId}. Jawaban tersimpan rahasia (blind) hingga keduanya mengunci.`}
          </p>
        </div>

        {/* Sync Status & Next Action Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Sync Progress Card for Active Module */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-[#1E293B]">
                {allModulesCompleted
                  ? "Seluruh 4 Modul Telah Selesai"
                  : `Status Sinkronisasi Modul ${activeModuleId}: ${activeModuleMeta.title}`}
              </h2>
              <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {completedModules.length} / 4 Modul Disepakati
              </span>
            </div>

            {/* You Progress */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="flex items-center space-x-1.5 text-[#0F766E]">
                  {isActiveUserLocked || completedModules.includes(activeModuleId) ? (
                    <span className="w-4 h-4 rounded-full bg-[#0F766E] text-white flex items-center justify-center text-[10px]">✓</span>
                  ) : (
                    <span className="w-4 h-4 rounded-full bg-slate-300 text-slate-700 flex items-center justify-center text-[10px]">●</span>
                  )}
                  <span>Anda ({myName})</span>
                </span>
                <span className="text-[#0F766E]">
                  {completedModules.includes(activeModuleId)
                    ? "Selesai & Disepakati"
                    : isActiveUserLocked
                    ? "Terkunci & Disegel (10/10)"
                    : `${myActiveAnswerCount}/10 Dilemma`}
                </span>
              </div>
              {/* Segmented bar for User */}
              <div className="grid grid-cols-10 gap-1.5">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 rounded-xs ${
                      completedModules.includes(activeModuleId) || isActiveUserLocked || i < myActiveAnswerCount
                        ? "bg-[#0F766E]"
                        : "bg-slate-200"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Partner Progress */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="flex items-center space-x-1.5 text-slate-700">
                  {isActivePartnerLocked || completedModules.includes(activeModuleId) ? (
                    <span className="w-4 h-4 rounded-full bg-[#0F766E] text-white flex items-center justify-center text-[10px]">✓</span>
                  ) : (
                    <span className="w-4 h-4 rounded-full bg-amber-400 text-white flex items-center justify-center text-[10px]">…</span>
                  )}
                  <span>Pasangan ({partnerName})</span>
                </span>
                <span className="text-slate-500">
                  {completedModules.includes(activeModuleId)
                    ? "Selesai & Disepakati"
                    : isActivePartnerLocked
                    ? "Terkunci & Disegel (10/10)"
                    : `${partnerActiveAnswerCount}/10 Dilemma`}
                </span>
              </div>
              {/* Segmented bar for Partner */}
              <div className="grid grid-cols-10 gap-1.5">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 rounded-xs ${
                      completedModules.includes(activeModuleId) || isActivePartnerLocked || i < partnerActiveAnswerCount
                        ? "bg-amber-400"
                        : "bg-slate-200"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center space-x-1.5">
                <Lock className="w-3.5 h-3.5 text-[#0F766E]" />
                <span>Zero-leakage dual blind active</span>
              </div>
              <span>
                {allModulesCompleted
                  ? "Semua modul selesai diratifikasi 🎉"
                  : isActiveBothLocked
                  ? `Modul ${activeModuleId} Keduanya Terkunci 🔒`
                  : "Menunggu penyelesaian dilema"}
              </span>
            </div>
          </div>

          {/* Action Callout Card */}
          <div className="lg:col-span-5 bg-[#1E293B] text-white rounded-2xl p-6 flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center space-x-1.5 text-xs text-slate-300 font-semibold mb-3">
                <Clock className="w-4 h-4 text-[#0F766E]" />
                <span>
                  {allModulesCompleted ? "Selesai Lengkap" : `Estimasi: ${activeModuleMeta.estimatedTime}`}
                </span>
              </div>
              <h3 className="text-xl font-bold tracking-tight mb-1">
                {allModulesCompleted
                  ? "Semua 4 Modul Selesai!"
                  : isActiveBothLocked
                  ? `Jawaban Modul ${activeModuleId} Siap Dibuka!`
                  : isActiveUserLocked
                  ? `Menunggu Jawaban ${partnerName}`
                  : myActiveAnswerCount > 0
                  ? `Lanjutkan Modul ${activeModuleId}`
                  : `Mulai Modul ${activeModuleId}`}
              </h3>
              <p className="text-xs text-slate-400">
                {allModulesCompleted
                  ? "Piagam Living Charter lengkap Anda telah diratifikasi dan siap dicetak/diunduh."
                  : isActiveBothLocked
                  ? `Anda dan ${partnerName} telah mengunci jawaban. Buka Dual Reveal Heatmap sekarang.`
                  : isActiveUserLocked
                  ? `Jawaban Modul ${activeModuleId} Anda telah dikunci. Menunggu ${partnerName} menyelesaikan.`
                  : activeModuleMeta.subtitle}
              </p>
            </div>

            {allModulesCompleted ? (
              <button
                onClick={() => handleOpenCharter(4)}
                className="mt-6 w-full py-3 px-5 bg-[#0F766E] hover:bg-[#0D625C] text-white rounded-xl text-sm font-semibold flex items-center justify-center space-x-2 transition cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Buka Living Charter Lengkap</span>
              </button>
            ) : isActiveBothLocked ? (
              <button
                onClick={() => onRevealAnswers(activeModuleId)}
                className="mt-6 w-full py-3 px-5 bg-[#0F766E] hover:bg-[#0D625C] text-white rounded-xl text-sm font-semibold flex items-center justify-center space-x-2 transition cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Reveal Bersama (Modul {activeModuleId})</span>
              </button>
            ) : isActiveUserLocked ? (
              <button
                onClick={() => handleOpenWaiting(activeModuleId)}
                className="mt-6 w-full py-3 px-5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-sm font-semibold flex items-center justify-center space-x-2 transition cursor-pointer"
              >
                <Clock className="w-4 h-4" />
                <span>Lihat Status / Ruang Tunggu</span>
              </button>
            ) : (
              <button
                onClick={() => onStartModule(activeModuleId)}
                className="mt-6 w-full py-3 px-5 bg-[#0F766E] hover:bg-[#0D625C] text-white rounded-xl text-sm font-semibold flex items-center justify-center space-x-2 transition cursor-pointer"
              >
                <span>
                  {myActiveAnswerCount > 0 ? `Lanjutkan Modul ${activeModuleId}` : `Mulai Modul ${activeModuleId}`}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* The Four Pillars Section */}
        <div>
          <h2 className="text-lg font-bold text-[#1E293B] mb-4">
            The four pillars
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {MODULES.map((mod) => {
              const isCompleted = completedModules.includes(mod.id);
              const isUnlocked = isModuleUnlocked(mod.id);
              const bothLock = isBothLocked(mod.id);
              const userLock = isUserLocked(mod.id);

              return (
                <div
                  key={mod.id}
                  className={`bg-white rounded-2xl p-6 border shadow-xs transition flex flex-col justify-between ${
                    isCompleted
                      ? "border-emerald-200 bg-emerald-50/20 hover:border-emerald-400"
                      : isUnlocked
                      ? "border-[#E2E8F0] hover:border-[#0F766E]"
                      : "border-[#E2E8F0] opacity-60 bg-slate-50/50"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl font-mono font-bold text-slate-300">
                        {String(mod.id).padStart(2, "0")}
                      </span>

                      {isCompleted ? (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-100 text-[#0F766E] text-xs font-bold border border-emerald-200">
                          <Check className="w-3.5 h-3.5" />
                          <span>Selesai (Completed)</span>
                        </span>
                      ) : bothLock ? (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-[#0F766E]/10 text-[#0F766E] text-xs font-bold border border-[#0F766E]/20">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Ready to Reveal</span>
                        </span>
                      ) : userLock ? (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Menunggu Pasangan</span>
                        </span>
                      ) : isUnlocked ? (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-50 text-[#0F766E] border border-emerald-200 text-xs font-bold">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Unlocked · 10 Dilemmas</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-bold">
                          <Lock className="w-3 h-3" />
                          <span>Terkunci (Selesaikan Modul {mod.id - 1})</span>
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-bold text-[#1E293B] mb-1.5">
                      {mod.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#475569] mb-5">
                      {mod.subtitle}
                    </p>
                  </div>

                  <div className="pt-2 flex items-center space-x-3">
                    {isCompleted ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleOpenCharter(mod.id)}
                          className="px-4 py-2.5 bg-[#0F766E] hover:bg-[#0D625C] text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Lihat Piagam</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onRevealAnswers(mod.id)}
                          className="px-3.5 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold flex items-center space-x-1 transition cursor-pointer"
                        >
                          <span>Review Hasil</span>
                        </button>
                      </>
                    ) : bothLock ? (
                      <button
                        type="button"
                        onClick={() => onRevealAnswers(mod.id)}
                        className="px-4 py-2.5 bg-[#0F766E] hover:bg-[#0D625C] text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer"
                      >
                        <span>Reveal Answers</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : userLock ? (
                      <button
                        type="button"
                        onClick={() => handleOpenWaiting(mod.id)}
                        className="px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer"
                      >
                        <span>Lihat Status</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : isUnlocked ? (
                      <button
                        type="button"
                        onClick={() => onStartModule(mod.id)}
                        className="px-4 py-2.5 bg-[#0F766E] hover:bg-[#0D625C] text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer"
                      >
                        <span>Mulai Modul {mod.id}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <div className="text-xs font-semibold text-slate-400 flex items-center space-x-1.5 py-2">
                        <Lock className="w-3.5 h-3.5" />
                        <span>Selesaikan Modul {mod.id - 1} untuk membuka</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};
