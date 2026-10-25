"use client";

import React, { useState } from "react";
import {
  Lock,
  BookOpen,
  CheckCircle2,
  MessageCircle,
  Copy,
  Check,
  ChevronDown,
  Scale,
  Users,
} from "lucide-react";
import { AppHeader } from "./AppHeader";
import {
  useRoom,
  simulatePartnerLock,
  activateRoomSession,
} from "../lib/sessionStore";
import { SCENARIOS, MODULES } from "../data/scenarios";
import { VaultWaitingIllustration } from "./VisualIllustrations";

interface WaitingRevealProps {
  onRevealTogether: () => void;
  onBackToDashboard: () => void;
  moduleId?: number;
}

const DISCUSSION_GUIDES = [
  {
    title: "1. Rumus 3 Pos Rekening Rumah Tangga",
    body: "Bagi pendapatan ke dalam 3 pos: (1) Kebutuhan Bersama, (2) Tabungan & Dana Darurat, dan (3) Uang Saku Pribadi tanpa perlu izin.",
  },
  {
    title: "2. Batas Bantuan Keluarga Besar",
    body: "Sepakati batas persentase maksimal dari pendapatan bersih, dan sampaikan keputusan melalui anak kandung masing-masing.",
  },
  {
    title: "3. Fokus pada Aturan Tertulis",
    body: "Perbedaan pilihan adalah peta risiko pra-nikah. Fokus pada aturan tertulis yang membuat kedua pihak merasa aman.",
  },
];

export const WaitingRevealPage: React.FC<WaitingRevealProps> = ({
  onRevealTogether,
  onBackToDashboard,
  moduleId = 1,
}) => {
  const { room, myName, partnerName, isBothLocked, role } = useRoom();
  const [openGuideIdx, setOpenGuideIdx] = useState<number | null>(0);
  const [copied, setCopied] = useState(false);

  const roomCode = room?.code || "VWS-000";
  const currentModule = MODULES.find((m) => m.id === moduleId) || MODULES[0];
  const isLockedForThisModule = isBothLocked(moduleId);

  const partnerRole = role === "host" ? "guest" : "host";
  const modScenarios = SCENARIOS.filter((s) => s.moduleId === moduleId);
  const partnerAnswerCount = room
    ? modScenarios.filter(
        (s) => room[partnerRole]?.answers?.[s.id] !== undefined
      ).length
    : 0;

  const handleSendWhatsAppReminder = () => {
    const inviteLink = `${window.location.origin}/?room=${roomCode}&pin=${room?.passcode || ""}`;
    const text = encodeURIComponent(
      `Hai ${partnerName || ""}! Aku sudah mengunci 10 jawaban untuk *Modul ${moduleId} (${currentModule.title})* di VowSync.\n\nYuk selesaikan bagianmu supaya segel Dual-Blind kita terbuka:\nKode Ruang: *${roomCode}*\nPIN: *${room?.passcode || ""}*\nTautan: ${inviteLink}`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const handleCopyInvite = () => {
    const inviteLink = `${window.location.origin}/?room=${roomCode}&pin=${room?.passcode || ""}`;
    navigator.clipboard.writeText(
      `Kode Ruang VowSync: ${roomCode} | PIN: ${room?.passcode || ""} | Link: ${inviteLink}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSimulateAndReveal = () => {
    simulatePartnerLock(moduleId);
    onRevealTogether();
  };

  const handleSwitchToPartner = () => {
    const nextRole = role === "host" ? "guest" : "host";
    activateRoomSession(roomCode, nextRole);
    window.location.href = `/room/${encodeURIComponent(roomCode)}/dilemma?module=${moduleId}`;
  };

  return (
    <div className="min-h-screen bg-[#F8FAF7] text-[#1E293B] flex flex-col">
      <AppHeader
        roomCode={roomCode}
        moduleId={moduleId}
        progressText={
          isLockedForThisModule
            ? `Modul ${moduleId}: Segel Siap Dibuka`
            : `Modul ${moduleId}: Menunggu ${partnerName || "Pasangan"}`
        }
        isEncrypted={true}
        userNames={`${myName || "Anda"} & ${partnerName || "Pasangan"}`}
      />

      <main className="max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 flex-1 space-y-8">
        {/* Main Status Ledger Card */}
        <div className="bg-[#1E293B] text-[#FFFFFF] rounded-xl p-6 sm:p-10 border border-[#334155] space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#334155] pb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#0F172A] border border-[#334155] text-xs font-mono font-bold text-[#5EEAD4]">
              {isLockedForThisModule ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-[#5EEAD4]" />
                  <span>SEGEL GANDA TERPENUHI · MODUL 0{moduleId}</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-[#5EEAD4]" />
                  <span>
                    SEGEL AKTIF · PROGRES PASANGAN: {partnerAnswerCount}/10
                  </span>
                </>
              )}
            </div>

            <span className="font-mono text-xs text-[#CBD5E1]">
              RUANG {roomCode} · PIN {room?.passcode || "----"}
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#FFFFFF] leading-tight">
              {isLockedForThisModule
                ? `Segel Modul ${moduleId} Siap Dibuka.`
                : `Jawaban Anda Tersegel. Menunggu ${partnerName || "Pasangan"}.`}
            </h1>
            <p className="text-[#CBD5E1] text-xs sm:text-sm max-w-xl">
              {isLockedForThisModule
                ? "Kedua kunci telah terverifikasi. Buka perbandingan jawaban sekarang."
                : `Pilihan untuk "${currentModule.title}" tetap tertutup sampai kedua pihak mengunci 10 skenario.`}
            </p>
          </div>

          <VaultWaitingIllustration
            isUnlocked={isLockedForThisModule}
            partnerProgress={partnerAnswerCount}
          />

          {/* Primary Actions */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            {isLockedForThisModule ? (
              <button
                type="button"
                onClick={onRevealTogether}
                className="min-h-[48px] px-6 py-3 bg-[#0F766E] hover:bg-[#115E59] text-[#FFFFFF] font-bold rounded-lg text-sm transition-colors inline-flex items-center gap-2 cursor-pointer"
              >
                <Scale className="w-4 h-4" />
                <span>Buka Perbandingan Jawaban Sekarang</span>
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleSimulateAndReveal}
                  className="min-h-[48px] px-5 py-3 bg-[#0F766E] hover:bg-[#115E59] text-[#FFFFFF] font-bold rounded-lg text-xs sm:text-sm transition-colors inline-flex items-center gap-2 cursor-pointer"
                >
                  <Scale className="w-4 h-4" />
                  <span>
                    Simulasikan {partnerName || "Pasangan"} Selesai &amp; Buka
                    Hasil
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleSwitchToPartner}
                  className="min-h-[48px] px-4 py-3 bg-[#334155] hover:bg-[#475569] text-[#FFFFFF] font-bold rounded-lg text-xs sm:text-sm transition-colors inline-flex items-center gap-2 cursor-pointer"
                >
                  <Users className="w-4 h-4 text-[#5EEAD4]" />
                  <span>
                    Isi Sebagai {partnerName || "Pasangan"} di Perangkat Ini
                  </span>
                </button>
              </>
            )}

            <button
              type="button"
              onClick={onBackToDashboard}
              className="min-h-[48px] px-4 py-3 border border-[#475569] hover:bg-[#334155] text-[#FFFFFF] font-semibold rounded-lg text-xs sm:text-sm transition-colors cursor-pointer"
            >
              Kembali ke Dashboard
            </button>
          </div>
        </div>

        {/* Two Functional Columns: Partner Invite & Discussion Guides */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Send Reminder / Share Access */}
          <div className="lg:col-span-5 bg-[#FFFFFF] border border-[#CBD5E1] rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] flex items-center justify-center shrink-0">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div>
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#0F766E] block">
                  UNDANGAN PASANGAN
                </span>
                <h2 className="text-sm font-bold text-[#1E293B]">
                  Kirim Pengingat ke {partnerName || "Pasangan"}
                </h2>
              </div>
            </div>

            <p className="text-xs text-[#475569] leading-relaxed">
              Kirimkan tautan ruang beserta 4-digit PIN rahasia agar pasangan
              Anda dapat langsung membuka dan mengunci jawaban Modul {moduleId}.
            </p>

            <div className="p-3 rounded-lg bg-[#F8FAF7] border border-[#E2E8F0] flex items-center justify-between text-xs font-mono">
              <span className="text-[#475569]">
                Ruang: <strong className="text-[#1E293B]">{roomCode}</strong>
              </span>
              <span className="text-[#0F766E] font-bold">
                PIN: {room?.passcode || "----"}
              </span>
            </div>

            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={handleSendWhatsAppReminder}
                className="w-full min-h-[44px] py-2.5 px-4 bg-[#065F46] hover:bg-[#047857] text-[#FFFFFF] rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Kirim Pengingat via WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={handleCopyInvite}
                className="w-full min-h-[44px] py-2.5 px-4 border border-[#CBD5E1] bg-[#FFFFFF] hover:bg-[#F1F5F9] text-[#1E293B] rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-[#065F46]" />
                    <span className="text-[#065F46]">
                      Tautan &amp; PIN Berhasil Disalin
                    </span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-[#475569]" />
                    <span>Salin Tautan &amp; PIN Ruang</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right: 3 Interactive Discussion Frameworks */}
          <div className="lg:col-span-7 bg-[#FFFFFF] border border-[#CBD5E1] rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-[#F0FDFA] border border-[#CCFBF1] text-[#0F766E] flex items-center justify-center shrink-0">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#0F766E] block">
                  BEKAL SEBELUM BUKA SEGEL
                </span>
                <h2 className="text-sm font-bold text-[#1E293B]">
                  3 Panduan Menghadapi Perbedaan Jawaban
                </h2>
              </div>
            </div>

            <div className="divide-y divide-[#E2E8F0] border-t border-[#E2E8F0]">
              {DISCUSSION_GUIDES.map((guide, idx) => {
                const isOpen = openGuideIdx === idx;
                return (
                  <div key={guide.title} className="py-3">
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() =>
                        setOpenGuideIdx(isOpen ? null : idx)
                      }
                      className="w-full min-h-[44px] flex items-center justify-between gap-3 text-left text-xs sm:text-sm font-bold text-[#1E293B] hover:text-[#0F766E] transition-colors cursor-pointer"
                    >
                      <span>{guide.title}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-[#475569] shrink-0 transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <p className="mt-2 text-xs text-[#475569] leading-relaxed">
                        {guide.body}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
