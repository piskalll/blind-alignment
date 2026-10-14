"use client";

import React, { useState, useEffect } from "react";
import { AppHeader } from "./AppHeader";
import { Download, ArrowRight, ShieldCheck, Check, Sparkles, Printer } from "lucide-react";
import { useRoom } from "../lib/sessionStore";
import { SignaturePad } from "./SignaturePad";
import { generateSessionHash, generatePrintDocument } from "../lib/charterGenerator";
import { SCENARIOS } from "../data/scenarios";

interface FinalCharterProps {
  onBackToDashboard: () => void;
  moduleId?: number;
  roomCode?: string;
}

export const FinalCharterPage: React.FC<FinalCharterProps> = ({
  onBackToDashboard,
  moduleId = 1,
  roomCode,
}) => {
  const {
    room,
    role,
    myName,
    partnerName,
    mySignature,
    partnerSignature,
    saveSignature,
    compromises,
    markModuleCompleted,
  } = useRoom(roomCode);

  const [sessionHash, setSessionHash] = useState("sha256: 7f8a…9c1b");
  const [timestamp, setTimestamp] = useState("14 Oct 2026, 12:30 WIB");

  // Mark this module as completed so the next module unlocks on the dashboard!
  useEffect(() => {
    markModuleCompleted(moduleId);
  }, [moduleId]);

  const romanNumerals = ["I", "II", "III", "IV"];
  const articleRoman = romanNumerals[(moduleId - 1) % 4] || "I";

  const moduleTitles: Record<number, string> = {
    1: "Financial Principles & Debt Liabilities",
    2: "Sandwich Generation & In-Law Boundaries",
    3: "Domestic Roles & Career Trajectory",
    4: "Emotional Intimacy & Conflict Rules",
  };

  const articleTitle = moduleTitles[moduleId] || "Living Agreement";

  useEffect(() => {
    const now = new Date().toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }) + ", " + new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB";
    setTimestamp(now);

    if (room) {
      generateSessionHash(room, now).then((hash) => {
        setSessionHash(hash);
      });
    }
  }, [room]);

  // Siapkan klausul-klausul kesepakatan:
  // 1. Dari kesepakatan kompromi yang disepakati bersama di modal
  // 2. Klausul default dari skenario yang sudah dijawab
  const clauses: string[] = [];

  if (compromises && compromises.length > 0) {
    compromises.forEach((c) => {
      clauses.push(`[Kompromi ${c.title}]: ${c.agreementText}`);
    });
  }

  // Tambahkan klausul standar spesifik per modul jika kompromi masih sedikit
  if (clauses.length < 4) {
    if (moduleId === 4) {
      clauses.push(
        "Privasi gadget dan akun digital dihormati dengan batasan sehat tanpa saling memata-matai isi pesan.",
        "Pantang tidur dalam keadaan marah atau membiarkan silent treatment berlangsung lebih dari 2 jam.",
        "Masalah dan dinamika internal rumah tangga haram diunggah sebagai konten atau sindiran di media sosial.",
        "Komitmen kencan berdua (Date Night) dan sesi evaluasi hubungan (Marriage Check-in) rutin dirawat secara konsisten."
      );
    } else if (moduleId === 3) {
      clauses.push(
        "Tugas domestik dibagi setara dan adil dengan pertimbangan jam kerja kantor masing-masing.",
        "Pengasuhan anak pasca cuti melahirkan diputuskan bersama tanpa membebankan sepihak pada karir istri.",
        "Alokasi anggaran khusus untuk bantuan asisten rumah tangga atau perlengkapan otomasi rumah disiapkan sejak awal.",
        "Kedua belah pihak saling menghormati batas lembur kantor dan berkomitmen menjaga waktu berkualitas di akhir pekan."
      );
    } else if (moduleId === 2) {
      clauses.push(
        "Tempat tinggal mandiri diprioritaskan demi menjaga privasi dan kemandirian awal rumah tangga.",
        "Kunjungan keluarga besar dan mertua disepakati wajib memberi kabar terlebih dahulu demi kenyamanan bersama.",
        "Bantuan finansial untuk keluarga besar dibatasi secara proporsional agar tidak mengganggu kebutuhan pokok keluarga inti.",
        "Privasi kamar utama adalah zona sakral yang tidak boleh dimasuki sembarangan oleh tamu maupun keluarga."
      );
    } else {
      clauses.push(
        "Combined monthly debt instalments shall not exceed 30% of joint take-home pay.",
        "An emergency fund of 6 months' living expenses is prioritized before taking on new discretionary liabilities.",
        "Personal purchases exceeding IDR 2.000.000 require mutual advance notification and transparent consultation.",
        "Family allowances and medical assistance follow clear agreed caps without endangering primary family cashflow."
      );
    }
  }

  const hostName = role === "host" ? myName : partnerName;
  const guestName = role === "host" ? partnerName : myName;

  const hostSignature = role === "host" ? mySignature : partnerSignature;
  const guestSignature = role === "host" ? partnerSignature : mySignature;

  const handleDownload = () => {
    markModuleCompleted(moduleId);
    generatePrintDocument({
      roomCode: room?.code || roomCode || "VWS-000",
      hostName: hostName || "Host Partner",
      guestName: guestName || "Guest Partner",
      hostSignature: hostSignature?.dataUrl,
      guestSignature: guestSignature?.dataUrl,
      hostSignedAt: hostSignature?.signedAt,
      guestSignedAt: guestSignature?.signedAt,
      sessionHash,
      clauses,
      timestamp,
    });
  };

  const handleBackToDashboard = () => {
    markModuleCompleted(moduleId);
    onBackToDashboard();
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex flex-col">
      <AppHeader
        roomCode={room?.code || "VWS-000"}
        progressText="Living Charter: Ratified"
        isEncrypted={true}
        userNames={`${myName || "You"} & ${partnerName || "Partner"}`}
      />

      <main className="max-w-6xl w-full mx-auto px-4 sm:px-8 py-8 flex-1 space-y-6">
        {/* Banner Success */}
        <div className="bg-[#0F766E] text-white rounded-2xl p-6 sm:p-7 flex items-center space-x-4 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-white/15 border border-white/20 flex items-center justify-center shrink-0">
            <Check className="w-6 h-6 text-white stroke-[3]" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              Module {moduleId} Consensus Ratified &amp; Signed!
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100 mt-0.5">
              {clauses.length} agreed principles added to your Living Charter. Sign below and download your official document.
            </p>
          </div>
        </div>

        {/* Two-Column Grid: Charter Certificate on Left, Actions on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: The Formal Living Charter Document */}
          <div className="lg:col-span-8 bg-white rounded-2xl p-7 sm:p-10 border border-[#E2E8F0] shadow-sm space-y-8 relative">
            {/* Header Document Branding */}
            <div className="flex items-start justify-between border-b border-[#E2E8F0] pb-6">
              <div>
                <div className="text-[11px] font-mono tracking-widest text-[#0F766E] uppercase font-bold">
                  Living Charter · Article {articleRoman}
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1E293B] tracking-tight mt-1">
                  {articleTitle} of {hostName} &amp; {guestName}
                </h2>
              </div>
              <div className="text-right hidden sm:block">
                <span className="font-bold text-base text-[#1E293B]">VowSync</span>
                <span className="block text-[11px] text-slate-400">SalingPaham Platform</span>
              </div>
            </div>

            {/* Cryptographic Session Stamp */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 text-[11px] font-mono">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Session Code</span>
                <span className="font-semibold text-slate-700">{room?.code || "VWS-000"}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Ratified WIB</span>
                <span className="font-semibold text-slate-700">{timestamp}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">SHA-256 Seal</span>
                <span className="font-semibold text-slate-700">{sessionHash.substring(0, 16)}…</span>
              </div>
            </div>

            {/* Agreement Clauses List */}
            <div className="space-y-4 pt-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
                Ratified Clauses:
              </h3>
              {clauses.map((clause, idx) => (
                <div key={idx} className="flex items-start space-x-3.5">
                  <span className="font-mono font-bold text-[#0F766E] text-sm mt-0.5">
                    {idx + 1}.
                  </span>
                  <p className="text-sm text-slate-800 leading-relaxed font-normal">
                    {clause}
                  </p>
                </div>
              ))}
            </div>

            {/* Reflective Quote */}
            <div className="pt-2 text-center">
              <span className="font-serif-quote text-slate-500 text-sm">
                &ldquo;Kami sepakat sebelum kami berjanji. Transparansi adalah dasar dari rumah tangga yang kokoh.&rdquo;
              </span>
            </div>

            {/* Partner Digital Signatures Showcase */}
            <div className="pt-6 border-t border-[#E2E8F0] grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Partner 1 (Host) */}
              <div className="p-4 rounded-xl border border-emerald-200/80 bg-emerald-50/40 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-full bg-[#1E293B] text-white flex items-center justify-center font-bold text-xs">
                      {hostName?.[0]?.toUpperCase() || "H"}
                    </div>
                    <div>
                      <div className="font-bold text-xs text-[#1E293B]">{hostName}</div>
                      <div className="text-[10px] text-slate-500 font-mono">Host Partner</div>
                    </div>
                  </div>
                  {hostSignature && (
                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-100 text-[#0F766E] text-[10px] font-bold">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Signed</span>
                    </span>
                  )}
                </div>
                {hostSignature?.dataUrl ? (
                  <img
                    src={hostSignature.dataUrl}
                    alt="Signature"
                    className="h-12 w-auto max-w-full object-contain mx-auto bg-white/70 rounded p-1 border border-emerald-100"
                  />
                ) : (
                  <div className="text-center py-2 text-xs text-slate-400 italic">
                    Belum ada tanda tangan
                  </div>
                )}
                {hostSignature?.signedAt && (
                  <div className="text-[10px] text-right text-slate-400 font-mono">
                    {hostSignature.signedAt}
                  </div>
                )}
              </div>

              {/* Partner 2 (Guest) */}
              <div className="p-4 rounded-xl border border-emerald-200/80 bg-emerald-50/40 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-full bg-[#0F766E] text-white flex items-center justify-center font-bold text-xs">
                      {guestName?.[0]?.toUpperCase() || "G"}
                    </div>
                    <div>
                      <div className="font-bold text-xs text-[#1E293B]">{guestName}</div>
                      <div className="text-[10px] text-slate-500 font-mono">Guest Partner</div>
                    </div>
                  </div>
                  {guestSignature && (
                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-100 text-[#0F766E] text-[10px] font-bold">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Signed</span>
                    </span>
                  )}
                </div>
                {guestSignature?.dataUrl ? (
                  <img
                    src={guestSignature.dataUrl}
                    alt="Signature"
                    className="h-12 w-auto max-w-full object-contain mx-auto bg-white/70 rounded p-1 border border-emerald-100"
                  />
                ) : (
                  <div className="text-center py-2 text-xs text-slate-400 italic">
                    Belum ada tanda tangan
                  </div>
                )}
                {guestSignature?.signedAt && (
                  <div className="text-[10px] text-right text-slate-400 font-mono">
                    {guestSignature.signedAt}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Signature Pad & Next Steps */}
          <div className="lg:col-span-4 space-y-5">
            {/* Interactive Signature Pad for Current User */}
            <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-sm space-y-4">
              <h3 className="text-base font-bold text-[#1E293B]">
                Bubuhkan Tanda Tangan Anda
              </h3>
              <p className="text-xs text-slate-500">
                Tanda tangani piagam ini sebagai tanda persetujuan kedua belah pihak atas prinsip finansial rumah tangga.
              </p>

              <SignaturePad
                signerName={myName}
                initialSignature={mySignature?.dataUrl}
                onSave={(dataUrl) => saveSignature(dataUrl)}
              />
            </div>

            {/* Download & Export Card */}
            <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-sm space-y-3.5">
              <h3 className="text-base font-bold text-[#1E293B]">Cetak & Simpan</h3>

              <button
                type="button"
                onClick={handleDownload}
                className="w-full py-3.5 px-4 bg-[#0F766E] hover:bg-[#0D625C] text-white rounded-xl text-xs font-semibold flex items-center justify-between transition cursor-pointer shadow-xs"
              >
                <div className="flex items-center space-x-2">
                  <Printer className="w-4 h-4" />
                  <span>Download / Print Living Charter (PDF)</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-black/20 rounded-md">
                  PDF / A4
                </span>
              </button>

              <button
                type="button"
                onClick={handleBackToDashboard}
                className="w-full py-3 px-4 border border-[#E2E8F0] hover:bg-slate-50 text-[#1E293B] rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition cursor-pointer"
              >
                <span>Back to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
                Dokumen ini dilengkapi segel hash kriptografi (SHA-256) untuk menjamin keaslian kesepakatan pra-nikah Anda.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
