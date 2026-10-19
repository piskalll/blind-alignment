"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppHeader } from "./AppHeader";
import {
  Check,
  Clock,
  Lock,
  FileText,
  ShieldCheck,
  Scale,
  BookOpen,
  SlidersHorizontal,
  MessageCircle,
  Home,
  Users,
} from "lucide-react";
import {
  useRoom,
  activateRoomSession,
  simulatePartnerLock,
  type Answer,
} from "../lib/sessionStore";
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
  const router = useRouter();
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
  const encodedRoom = encodeURIComponent(roomCode);

  const activeModuleId =
    [1, 2, 3, 4].find((id) => !completedModules.includes(id)) || 4;
  const allModulesCompleted = [1, 2, 3, 4].every((id) =>
    completedModules.includes(id)
  );

  const activeModuleMeta =
    MODULES.find((m) => m.id === activeModuleId) || MODULES[0];

  const isActiveUserLocked = isUserLocked(activeModuleId);
  const isActivePartnerLocked = isPartnerLocked(activeModuleId);
  const isActiveBothLocked = isBothLocked(activeModuleId);

  const getModuleAnswerCount = (
    answers: Record<number, Answer> | undefined,
    modId: number
  ) => {
    if (!answers) return 0;
    const modScenarios = SCENARIOS.filter((s) => s.moduleId === modId);
    return modScenarios.filter((s) => answers[s.id]?.choice !== undefined).length;
  };

  const myActiveAnswerCount = getModuleAnswerCount(me?.answers, activeModuleId);
  const partnerRole = role === "host" ? "guest" : "host";
  const partnerActiveAnswerCount = getModuleAnswerCount(
    room?.[partnerRole]?.answers,
    activeModuleId
  );

  const handleOpenCharter = (modId: number) => {
    if (onViewCharter) {
      onViewCharter(modId);
    } else {
      router.push(`/room/${encodedRoom}/charter?module=${modId}`);
    }
  };

  const handleOpenWaiting = (modId: number) => {
    if (onViewWaiting) {
      onViewWaiting(modId);
    } else {
      router.push(`/room/${encodedRoom}/waiting?module=${modId}`);
    }
  };

  const handleSwitchRole = () => {
    const nextRole = role === "host" ? "guest" : "host";
    activateRoomSession(roomCode, nextRole);
  };

  return (
    <div className="min-h-screen bg-[#F8FAF7] text-[#1E293B] flex flex-col">
      <AppHeader
        roomCode={roomCode}
        moduleId={activeModuleId}
        progressText={
          allModulesCompleted
            ? "Seluruh 4 Modul Selesai Diratifikasi"
            : `Progres: ${completedModules.length}/4 Modul · Aktif Modul ${activeModuleId}`
        }
        isEncrypted={true}
        userNames={`${myName || "Anda"} & ${partnerName || "Pasangan"}`}
      />

      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 space-y-8">
        {/* Top Metadata & Role Strip */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-6 border-b border-[#E2E8F0]">
          <div className="space-y-2">
            <div className="flex items-center flex-wrap gap-2">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-[#CBD5E1] bg-[#FFFFFF] hover:bg-[#F1F5F9] text-xs font-semibold text-[#1E293B]"
              >
                <Home className="w-3.5 h-3.5 text-[#0F766E]" />
                <span>Beranda</span>
              </Link>
              <span className="px-2.5 py-1 rounded-md bg-[#FFFFFF] border border-[#CBD5E1] text-xs font-mono font-bold text-[#1E293B]">
                RUANG: {roomCode}
              </span>
              {room?.passcode && (
                <span className="px-2.5 py-1 rounded-md bg-[#F0FDFA] border border-[#99F6E4] text-xs font-mono font-bold text-[#0F766E]">
                  PIN: {room.passcode}
                </span>
              )}
              <span className="px-2.5 py-1 rounded-md bg-[#F1F5F9] border border-[#E2E8F0] text-xs font-semibold text-[#475569]">
                Peran Aktif: {role === "host" ? "Pembuat Ruang (Host)" : "Pasangan (Guest)"}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#1E293B] tracking-tight">
              Dashboard Keselarasan, {myName || "Anda"}.
            </h1>
            <p className="text-sm sm:text-base text-[#475569] max-w-2xl">
              {allModulesCompleted
                ? "Seluruh 4 pilar kurikulum pra-nikah telah diselesaikan dan disahkan dalam Piagam Kesepakatan."
                : isActiveBothLocked
                ? `Segel Modul ${activeModuleId} telah terbuka karena kedua pihak selesai menjawab. Tinjau peta keselarasan dan rumuskan kompromi.`
                : isActiveUserLocked
                ? `Jawaban Modul ${activeModuleId} Anda telah disegel. Menunggu ${partnerName} mengunci 10 skenario.`
                : `Kerjakan 10 skenario pada Modul ${activeModuleId} secara jujur. Pilihan Anda disegel sampai ${partnerName} selesai menjawab.`}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleSwitchRole}
              className="min-h-[44px] px-3.5 py-2 rounded-lg border border-[#CBD5E1] bg-[#FFFFFF] hover:bg-[#F1F5F9] text-xs font-bold text-[#1E293B] flex items-center gap-1.5 cursor-pointer"
              title="Ganti sudut pandang antara Host dan Guest pada perangkat ini"
            >
              <Users className="w-4 h-4 text-[#0F766E]" />
              <span>
                Beralih ke Sudut Pandang {role === "host" ? partnerName : myName}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                const inviteLink = `${window.location.origin}/?room=${roomCode}&pin=${room?.passcode || ""}`;
                const text = encodeURIComponent(
                  `Hai! Masuk ke ruang kesepakatan pra-nikah kita di VowSync:\nKode Ruang: *${roomCode}*\nPIN Rahasia: *${room?.passcode || ""}*\nTautan: ${inviteLink}`
                );
                window.open(`https://wa.me/?text=${text}`, "_blank");
              }}
              className="min-h-[44px] px-3.5 py-2 rounded-lg bg-[#065F46] hover:bg-[#047857] text-[#FFFFFF] text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Undang via WhatsApp</span>
            </button>
          </div>
        </div>

        {/* Sync Status & Next Action Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Sync Progress Card for Active Module */}
          <div className="lg:col-span-7 bg-[#FFFFFF] rounded-xl p-6 border border-[#CBD5E1] space-y-5">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div>
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#0F766E] block">
                  STATUS SEGEL GANDA · MODUL AKTIF 0{activeModuleId}
                </span>
                <h2 className="text-base sm:text-lg font-bold text-[#1E293B] mt-0.5">
                  {allModulesCompleted
                    ? "Seluruh 4 Modul Telah Diratifikasi"
                    : activeModuleMeta.title}
                </h2>
              </div>
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-[#F1F5F9] text-[#1E293B] border border-[#CBD5E1]">
                {completedModules.length} / 4 Modul Selesai
              </span>
            </div>

            {/* User Progress */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="flex items-center gap-2 text-[#1E293B]">
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                      isActiveUserLocked ||
                      completedModules.includes(activeModuleId)
                        ? "bg-[#0F766E] text-[#FFFFFF]"
                        : "bg-[#E2E8F0] text-[#1E293B]"
                    }`}
                  >
                    {isActiveUserLocked ||
                    completedModules.includes(activeModuleId)
                      ? "✓"
                      : "1"}
                  </span>
                  <span>Anda ({myName})</span>
                </span>
                <span className="font-mono text-[#0F766E]">
                  {completedModules.includes(activeModuleId)
                    ? "Disahkan di Piagam"
                    : isActiveUserLocked
                    ? "Terkunci & Disegel (10/10)"
                    : `${myActiveAnswerCount}/10 Skenario Dijawab`}
                </span>
              </div>
              <div className="grid grid-cols-10 gap-1.5">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-2.5 rounded-xs ${
                      completedModules.includes(activeModuleId) ||
                      isActiveUserLocked ||
                      i < myActiveAnswerCount
                        ? "bg-[#0F766E]"
                        : "bg-[#E2E8F0]"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Partner Progress */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="flex items-center gap-2 text-[#1E293B]">
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                      isActivePartnerLocked ||
                      completedModules.includes(activeModuleId)
                        ? "bg-[#0F766E] text-[#FFFFFF]"
                        : "bg-[#FFFBEB] text-[#92400E] border border-[#FDE68A]"
                    }`}
                  >
                    {isActivePartnerLocked ||
                    completedModules.includes(activeModuleId)
                      ? "✓"
                      : "2"}
                  </span>
                  <span>Pasangan ({partnerName})</span>
                </span>
                <span className="font-mono text-[#475569]">
                  {completedModules.includes(activeModuleId)
                    ? "Disahkan di Piagam"
                    : isActivePartnerLocked
                    ? "Terkunci & Disegel (10/10)"
                    : `${partnerActiveAnswerCount}/10 Skenario Dijawab`}
                </span>
              </div>
              <div className="grid grid-cols-10 gap-1.5">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-2.5 rounded-xs ${
                      completedModules.includes(activeModuleId) ||
                      isActivePartnerLocked ||
                      i < partnerActiveAnswerCount
                        ? "bg-[#B45309]"
                        : "bg-[#E2E8F0]"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-[#E2E8F0] flex flex-wrap items-center justify-between gap-2 text-xs text-[#475569]">
              <div className="flex items-center gap-1.5 font-medium">
                <Lock className="w-3.5 h-3.5 text-[#0F766E]" />
                <span>Segel Dual-Blind aktif tanpa kebocoran jawaban</span>
              </div>
              {!isActivePartnerLocked && !allModulesCompleted && (
                <button
                  type="button"
                  onClick={() => simulatePartnerLock(activeModuleId)}
                  className="font-bold text-[#0F766E] hover:underline cursor-pointer"
                >
                  Simulasikan {partnerName} Selesai (Mode Uji)
                </button>
              )}
            </div>
          </div>

          {/* Primary Action Card */}
          <div className="lg:col-span-5 bg-[#1E293B] text-[#FFFFFF] rounded-xl p-6 flex flex-col justify-between border border-[#334155]">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-[#CBD5E1] font-mono">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#5EEAD4]" />
                  <span>
                    {allModulesCompleted
                      ? "KURIKULUM LENGKAP"
                      : `ESTIMASI: ${activeModuleMeta.estimatedTime.toUpperCase()}`}
                  </span>
                </span>
                <span>MOD-0{activeModuleId}</span>
              </div>

              <h3 className="text-xl font-bold tracking-tight">
                {allModulesCompleted
                  ? "Seluruh 4 Modul Selesai Diratifikasi"
                  : isActiveBothLocked
                  ? `Jawaban Modul ${activeModuleId} Siap Dibandingkan`
                  : isActiveUserLocked
                  ? `Menunggu ${partnerName} Mengunci Jawaban`
                  : myActiveAnswerCount > 0
                  ? `Lanjutkan Pengisian Modul ${activeModuleId}`
                  : `Mulai Modul ${activeModuleId}: ${activeModuleMeta.title}`}
              </h3>

              <p className="text-xs sm:text-sm text-[#CBD5E1] leading-relaxed">
                {allModulesCompleted
                  ? "Dokumen Piagam Kesepakatan Pra-Nikah untuk seluruh 4 pilar telah ditandatangani dan siap dicetak."
                  : isActiveBothLocked
                  ? `Anda dan ${partnerName} telah mengunci seluruh 10 skenario. Buka halaman Hasil untuk meninjau kecocokan dan menulis kompromi.`
                  : isActiveUserLocked
                  ? `Pilihan Anda sudah aman di balik segel. Anda dapat memantau ruang tunggu atau mensimulasikan jawaban pasangan.`
                  : activeModuleMeta.subtitle}
              </p>
            </div>

            <div className="pt-6 space-y-2">
              {allModulesCompleted ? (
                <button
                  type="button"
                  onClick={() => handleOpenCharter(4)}
                  className="w-full min-h-[48px] py-3 px-5 bg-[#0F766E] hover:bg-[#115E59] text-[#FFFFFF] rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Buka Piagam Kesepakatan Lengkap</span>
                </button>
              ) : isActiveBothLocked ? (
                <button
                  type="button"
                  onClick={() => onRevealAnswers(activeModuleId)}
                  className="w-full min-h-[48px] py-3 px-5 bg-[#0F766E] hover:bg-[#115E59] text-[#FFFFFF] rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Scale className="w-4 h-4" />
                  <span>Buka Perbandingan Jawaban (Modul {activeModuleId})</span>
                </button>
              ) : isActiveUserLocked ? (
                <button
                  type="button"
                  onClick={() => handleOpenWaiting(activeModuleId)}
                  className="w-full min-h-[48px] py-3 px-5 bg-[#334155] hover:bg-[#475569] text-[#FFFFFF] rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Clock className="w-4 h-4" />
                  <span>Buka Ruang Tunggu Segel</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onStartModule(activeModuleId)}
                  className="w-full min-h-[48px] py-3 px-5 bg-[#0F766E] hover:bg-[#115E59] text-[#FFFFFF] rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <span>
                    {myActiveAnswerCount > 0
                      ? `Lanjutkan Skenario Modul ${activeModuleId}`
                      : `Mulai Modul ${activeModuleId} Sekarang`}
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Four Pillars Curriculum Grid */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#0F766E] block">
                KURIKULUM BERJENJANG
              </span>
              <h2 className="text-xl font-extrabold text-[#1E293B]">
                Empat Pilar Keselarasan Pra-Nikah
              </h2>
            </div>
            <p className="text-xs text-[#475569]">
              Setiap modul baru terbuka setelah modul sebelumnya ditandatangani
              di Piagam Kesepakatan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {MODULES.map((mod) => {
              const isCompleted = completedModules.includes(mod.id);
              const isUnlocked = isModuleUnlocked(mod.id);
              const bothLock = isBothLocked(mod.id);
              const userLock = isUserLocked(mod.id);
              const myModCount = getModuleAnswerCount(me?.answers, mod.id);

              return (
                <div
                  key={mod.id}
                  className={`bg-[#FFFFFF] rounded-xl p-6 border transition-colors flex flex-col justify-between gap-5 ${
                    isCompleted
                      ? "border-[#0F766E]"
                      : isUnlocked
                      ? "border-[#CBD5E1]"
                      : "border-[#E2E8F0] bg-[#F1F5F9]"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-lg font-mono font-bold text-[#1E293B]">
                        MOD-0{mod.id}
                      </span>

                      {isCompleted ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#ECFDF5] text-[#065F46] text-xs font-bold border border-[#A7F3D0]">
                          <Check className="w-3.5 h-3.5" />
                          <span>Selesai &amp; Disahkan</span>
                        </span>
                      ) : bothLock ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#F0FDFA] text-[#0F766E] text-xs font-bold border border-[#99F6E4]">
                          <Scale className="w-3.5 h-3.5" />
                          <span>Siap Dibandingkan</span>
                        </span>
                      ) : userLock ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#FFFBEB] text-[#92400E] text-xs font-bold border border-[#FDE68A]">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Menunggu Pasangan</span>
                        </span>
                      ) : isUnlocked ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#F0FDFA] text-[#0F766E] border border-[#CCFBF1] text-xs font-bold">
                          <span>Terbuka · {myModCount}/10 Dijawab</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#FFFFFF] text-[#475569] border border-[#CBD5E1] text-xs font-bold">
                          <Lock className="w-3.5 h-3.5" />
                          <span>Terkunci (Selesaikan Modul {mod.id - 1})</span>
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-[#1E293B]">
                        {mod.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#475569] mt-1 leading-relaxed">
                        {mod.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#E2E8F0] flex flex-wrap items-center gap-2">
                    {isUnlocked ? (
                      <>
                        {isCompleted ? (
                          <>
                            <button
                              type="button"
                              onClick={() => handleOpenCharter(mod.id)}
                              className="min-h-[44px] px-4 py-2 bg-[#0F766E] hover:bg-[#115E59] text-[#FFFFFF] rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>Lihat Piagam</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => onRevealAnswers(mod.id)}
                              className="min-h-[44px] px-3.5 py-2 border border-[#CBD5E1] bg-[#FFFFFF] hover:bg-[#F1F5F9] text-[#1E293B] rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                            >
                              <Scale className="w-3.5 h-3.5 text-[#0F766E]" />
                              <span>Tinjau Hasil</span>
                            </button>
                          </>
                        ) : bothLock ? (
                          <button
                            type="button"
                            onClick={() => onRevealAnswers(mod.id)}
                            className="min-h-[44px] px-4 py-2 bg-[#0F766E] hover:bg-[#115E59] text-[#FFFFFF] rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                          >
                            <Scale className="w-3.5 h-3.5" />
                            <span>Buka Hasil &amp; Kompromi</span>
                          </button>
                        ) : userLock ? (
                          <button
                            type="button"
                            onClick={() => handleOpenWaiting(mod.id)}
                            className="min-h-[44px] px-4 py-2 bg-[#1E293B] hover:bg-[#0F172A] text-[#FFFFFF] rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                          >
                            <Clock className="w-3.5 h-3.5" />
                            <span>Buka Ruang Tunggu</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onStartModule(mod.id)}
                            className="min-h-[44px] px-4 py-2 bg-[#0F766E] hover:bg-[#115E59] text-[#FFFFFF] rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                          >
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>
                              {myModCount > 0
                                ? `Lanjutkan Modul ${mod.id}`
                                : `Mulai Modul ${mod.id}`}
                            </span>
                          </button>
                        )}

                        <Link
                          href={`/room/${encodedRoom}/dilemma?module=${mod.id}`}
                          className="min-h-[44px] px-3 py-2 border border-[#CBD5E1] bg-[#F8FAF7] hover:bg-[#F1F5F9] text-[#1E293B] rounded-lg text-xs font-semibold inline-flex items-center gap-1.5"
                        >
                          <SlidersHorizontal className="w-3.5 h-3.5 text-[#475569]" />
                          <span>10 Skenario</span>
                        </Link>
                      </>
                    ) : (
                      <div className="text-xs font-semibold text-[#475569] flex items-center gap-2 py-2">
                        <Lock className="w-4 h-4 text-[#475569]" />
                        <span>
                          Selesaikan dan tanda tangani Piagam Modul {mod.id - 1}{" "}
                          terlebih dahulu untuk membuka modul ini.
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
};
