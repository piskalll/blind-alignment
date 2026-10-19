"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppHeader } from "./AppHeader";
import {
  ShieldCheck,
  Check,
  Printer,
  LayoutGrid,
  BookOpen,
} from "lucide-react";
import { useRoom } from "../lib/sessionStore";
import { SignaturePad } from "./SignaturePad";
import {
  generateSessionHash,
  generatePrintDocument,
} from "../lib/charterGenerator";

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
  const router = useRouter();
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

  const activeRoomCode = room?.code || roomCode || "VWS-000";
  const encodedRoom = encodeURIComponent(activeRoomCode);

  const [sessionHash, setSessionHash] = useState("sha256: 7f8a...9c1b");
  const [timestamp, setTimestamp] = useState("19 Okt 2026, 08:00 WIB");

  useEffect(() => {
    markModuleCompleted(moduleId);
  }, [moduleId]);

  const romanNumerals = ["I", "II", "III", "IV"];
  const articleRoman = romanNumerals[(moduleId - 1) % 4] || "I";

  const moduleTitles: Record<number, string> = {
    1: "Prinsip & Transparansi Finansial",
    2: "Batasan Mertua & Keluarga Besar",
    3: "Visi Pengasuhan & Masa Depan Anak",
    4: "Pembagian Peran, Karier & Resolusi Konflik",
  };

  const articleTitle = moduleTitles[moduleId] || "Kesepakatan Rumah Tangga";

  useEffect(() => {
    const now =
      new Date().toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }) +
      ", " +
      new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }) +
      " WIB";
    setTimestamp(now);

    if (room) {
      generateSessionHash(room, now).then((hash) => {
        setSessionHash(hash);
      });
    }
  }, [room]);

  const clauses: string[] = [];

  if (compromises && compromises.length > 0) {
    compromises.forEach((c) => {
      clauses.push(`[Kompromi ${c.title}]: ${c.agreementText}`);
    });
  }

  if (clauses.length < 4) {
    if (moduleId === 4) {
      clauses.push(
        "Privasi gawai dan akun digital dihormati bersama dengan batasan yang sehat tanpa saling memata-matai.",
        "Tidak mendiamkan pasangan (silent treatment) lebih dari 2 jam ketika terjadi perselisihan.",
        "Masalah dan dinamika internal rumah tangga tidak diunggah sebagai keluhan atau sindiran di media sosial.",
        "Komitmen waktu berdua dan evaluasi berkala hubungan dirawat secara disiplin setiap bulan."
      );
    } else if (moduleId === 3) {
      clauses.push(
        "Waktu memiliki anak dan kesiapan tabungan kelahiran disepakati berdua tanpa tekanan pihak luar.",
        "Pola pengasuhan anak pasca cuti melahirkan diputuskan bersama secara adil bagi keberlanjutan karier kedua pihak.",
        "Aturan kedisiplinan, batas gawai, dan nilai dasar pendidikan anak dijalankan secara konsisten oleh ayah dan ibu.",
        "Peran kakek-nenek dihormati sebagai pendukung kasih sayang, sementara keputusan utama pengasuhan tetap di tangan orang tua."
      );
    } else if (moduleId === 2) {
      clauses.push(
        "Tempat tinggal mandiri diprioritaskan demi menjaga kemandirian dan kedaulatan rumah tangga baru.",
        "Kunjungan keluarga besar dan mertua disepakati memberi kabar terlebih dahulu demi kenyamanan bersama.",
        "Bantuan finansial untuk keluarga besar mengikuti batas kemampuan kas bersama tanpa mengorbankan kebutuhan pokok keluarga inti.",
        "Setiap gesekan dengan keluarga besar diselesaikan melalui pasangan kandung masing-masing sebagai jembatan komunikasi."
      );
    } else {
      clauses.push(
        "Total cicilan utang bulanan rumah tangga dijaga agar tidak melampaui 30% dari pendapatan bersih gabungan.",
        "Pembentukan dana darurat minimal 6 bulan pengeluaran pokok menjadi prioritas sebelum mengambil komitmen cicilan konsumtif baru.",
        "Pengeluaran pribadi di atas Rp 1.000.000 dikomunikasikan secara terbuka kepada pasangan sebelum transaksi dilakukan.",
        "Alokasi tunjangan orang tua dan bantuan darurat keluarga mengikuti batas anggaran yang telah disepakati berdua."
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
      roomCode: activeRoomCode,
      hostName: hostName || "Pihak Pertama",
      guestName: guestName || "Pihak Kedua",
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

  const handleNextModule = () => {
    markModuleCompleted(moduleId);
    const nextMod = Math.min(4, moduleId + 1);
    router.push(`/room/${encodedRoom}/intro?module=${nextMod}`);
  };

  return (
    <div className="min-h-screen bg-[#F8FAF7] text-[#1E293B] flex flex-col">
      <AppHeader
        roomCode={activeRoomCode}
        moduleId={moduleId}
        progressText={`Piagam Pasal ${articleRoman}: Diratifikasi`}
        isEncrypted={true}
        userNames={`${myName || "Anda"} & ${partnerName || "Pasangan"}`}
      />

      <main className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 space-y-6">
        {/* Ratification Header Banner */}
        <div className="bg-[#1E293B] text-[#FFFFFF] rounded-xl p-6 sm:p-7 border border-[#334155] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-11 h-11 rounded-lg bg-[#0F766E] text-[#FFFFFF] flex items-center justify-center shrink-0">
              <Check className="w-6 h-6" />
            </div>
            <div>
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#5EEAD4] block">
                DOKUMEN KESEPAKATAN PRA-NIKAH · PASAL {articleRoman}
              </span>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                Modul {moduleId} ({articleTitle}) Telah Disahkan
              </h1>
              <p className="text-xs sm:text-sm text-[#CBD5E1] mt-0.5">
                {clauses.length} butir kesepakatan tercatat pada Piagam.
                {moduleId < 4
                  ? ` Modul ${moduleId + 1} kini telah terbuka di Dashboard.`
                  : " Seluruh 4 modul kurikulum pra-nikah telah lengkap."}
              </p>
            </div>
          </div>

          {/* Article Switcher */}
          <div className="flex items-center gap-1.5 shrink-0">
            {[1, 2, 3, 4].map((mId) => (
              <Link
                key={mId}
                href={`/room/${encodedRoom}/charter?module=${mId}`}
                className={`min-h-[40px] px-3 py-1.5 rounded-lg font-mono text-xs font-bold border transition-colors inline-flex items-center ${
                  mId === moduleId
                    ? "bg-[#0F766E] text-[#FFFFFF] border-[#0F766E]"
                    : "bg-[#0F172A] text-[#CBD5E1] border-[#334155] hover:text-[#FFFFFF]"
                }`}
              >
                Pasal {romanNumerals[mId - 1]}
              </Link>
            ))}
          </div>
        </div>

        {/* Two-Column Grid: Charter Certificate on Left, Actions on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Formal Living Charter Certificate */}
          <div className="lg:col-span-8 bg-[#FFFFFF] rounded-xl p-6 sm:p-10 border-2 border-[#CBD5E1] space-y-8">
            {/* Document Header */}
            <div className="flex items-start justify-between border-b-2 border-[#1E293B] pb-6 gap-4">
              <div>
                <div className="text-xs font-mono tracking-widest text-[#0F766E] uppercase font-bold">
                  PIAGAM KESEPAKATAN PRA-NIKAH · PASAL {articleRoman}
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1E293B] tracking-tight mt-1">
                  {articleTitle}
                </h2>
                <p className="text-xs sm:text-sm text-[#475569] font-medium mt-1">
                  Disepakati secara sadar oleh{" "}
                  <strong className="text-[#1E293B]">{hostName}</strong> &amp;{" "}
                  <strong className="text-[#1E293B]">{guestName}</strong>
                </p>
              </div>
              <div className="text-right hidden sm:block shrink-0">
                <span className="font-bold text-base text-[#1E293B] block">
                  VowSync
                </span>
                <span className="text-xs text-[#475569] font-mono">
                  SalingPaham
                </span>
              </div>
            </div>

            {/* Cryptographic Session Stamp */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#F8FAF7] p-4 rounded-xl border border-[#CBD5E1] text-xs font-mono">
              <div>
                <span className="text-[#475569] block text-[11px] uppercase font-bold">
                  Kode Ruang Sesi
                </span>
                <span className="font-bold text-[#1E293B]">
                  {activeRoomCode}
                </span>
              </div>
              <div>
                <span className="text-[#475569] block text-[11px] uppercase font-bold">
                  Waktu Pengesahan
                </span>
                <span className="font-bold text-[#1E293B]">{timestamp}</span>
              </div>
              <div>
                <span className="text-[#475569] block text-[11px] uppercase font-bold">
                  Segel SHA-256
                </span>
                <span className="font-bold text-[#0F766E]">
                  {sessionHash.substring(0, 18)}...
                </span>
              </div>
            </div>

            {/* Agreement Clauses List */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-[#1E293B] uppercase tracking-wider font-mono border-b border-[#E2E8F0] pb-2">
                Butir-Butir Kesepakatan Bersama:
              </h3>
              {clauses.map((clause, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3.5 p-3.5 rounded-lg bg-[#F8FAF7] border border-[#E2E8F0]"
                >
                  <span className="font-mono font-bold text-[#0F766E] text-sm shrink-0">
                    {String(idx + 1).padStart(2, "0")}.
                  </span>
                  <p className="text-sm text-[#1E293B] leading-relaxed font-medium">
                    {clause}
                  </p>
                </div>
              ))}
            </div>

            {/* Editorial Vow Quote */}
            <div className="py-3 px-4 rounded-lg bg-[#F0FDFA] border border-[#CCFBF1] text-center">
              <p className="font-serif italic text-[#1E293B] text-sm sm:text-base">
                &ldquo;Kami menyepakati batasan dan tanggung jawab ini sebelum
                hari akad sebagai wujud keterbukaan dan rasa saling menghormati.&rdquo;
              </p>
            </div>

            {/* Partner Digital Signatures Showcase */}
            <div className="pt-6 border-t border-[#CBD5E1] grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Partner 1 (Host) */}
              <div className="p-4 rounded-xl border border-[#CBD5E1] bg-[#F8FAF7] space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#1E293B] text-[#FFFFFF] flex items-center justify-center font-bold text-xs">
                      {hostName?.[0]?.toUpperCase() || "H"}
                    </div>
                    <div>
                      <div className="font-bold text-xs text-[#1E293B]">
                        {hostName}
                      </div>
                      <div className="text-[11px] text-[#475569] font-mono">
                        Pihak Pertama (Host)
                      </div>
                    </div>
                  </div>
                  {hostSignature?.dataUrl && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0] text-[11px] font-bold">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Ditandatangani</span>
                    </span>
                  )}
                </div>
                {hostSignature?.dataUrl ? (
                  <img
                    src={hostSignature.dataUrl}
                    alt={`Tanda tangan ${hostName}`}
                    className="h-14 w-auto max-w-full object-contain mx-auto bg-[#FFFFFF] rounded p-1.5 border border-[#CBD5E1]"
                  />
                ) : (
                  <div className="text-center py-4 text-xs text-[#475569] italic bg-[#FFFFFF] rounded border border-dashed border-[#CBD5E1]">
                    Menunggu tanda tangan {hostName}
                  </div>
                )}
                {hostSignature?.signedAt && (
                  <div className="text-[11px] text-right text-[#475569] font-mono">
                    {hostSignature.signedAt}
                  </div>
                )}
              </div>

              {/* Partner 2 (Guest) */}
              <div className="p-4 rounded-xl border border-[#CBD5E1] bg-[#F8FAF7] space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#0F766E] text-[#FFFFFF] flex items-center justify-center font-bold text-xs">
                      {guestName?.[0]?.toUpperCase() || "G"}
                    </div>
                    <div>
                      <div className="font-bold text-xs text-[#1E293B]">
                        {guestName}
                      </div>
                      <div className="text-[11px] text-[#475569] font-mono">
                        Pihak Kedua (Guest)
                      </div>
                    </div>
                  </div>
                  {guestSignature?.dataUrl && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0] text-[11px] font-bold">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Ditandatangani</span>
                    </span>
                  )}
                </div>
                {guestSignature?.dataUrl ? (
                  <img
                    src={guestSignature.dataUrl}
                    alt={`Tanda tangan ${guestName}`}
                    className="h-14 w-auto max-w-full object-contain mx-auto bg-[#FFFFFF] rounded p-1.5 border border-[#CBD5E1]"
                  />
                ) : (
                  <div className="text-center py-4 text-xs text-[#475569] italic bg-[#FFFFFF] rounded border border-dashed border-[#CBD5E1]">
                    Menunggu tanda tangan {guestName}
                  </div>
                )}
                {guestSignature?.signedAt && (
                  <div className="text-[11px] text-right text-[#475569] font-mono">
                    {guestSignature.signedAt}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Signature Pad & Next Steps */}
          <div className="lg:col-span-4 space-y-5">
            <div className="bg-[#FFFFFF] rounded-xl p-6 border border-[#CBD5E1] space-y-4">
              <div>
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#0F766E] block">
                  PENGESAHAN DIGITAL
                </span>
                <h3 className="text-base font-extrabold text-[#1E293B] mt-0.5">
                  Bubuhkan Tanda Tangan Anda
                </h3>
                <p className="text-xs text-[#475569] mt-1 leading-relaxed">
                  Tanda tangani piagam ini sebagai bukti persetujuan atas
                  butir-butir kesepakatan pada Modul {moduleId}.
                </p>
              </div>

              <SignaturePad
                signerName={myName}
                initialSignature={mySignature?.dataUrl}
                onSave={(dataUrl) => saveSignature(dataUrl)}
              />
            </div>

            <div className="bg-[#FFFFFF] rounded-xl p-6 border border-[#CBD5E1] space-y-3">
              <h3 className="text-base font-extrabold text-[#1E293B]">
                Unduh &amp; Navigasi Lanjutan
              </h3>

              <button
                type="button"
                onClick={handleDownload}
                className="w-full min-h-[48px] py-3 px-4 bg-[#0F766E] hover:bg-[#115E59] text-[#FFFFFF] rounded-lg text-xs font-bold flex items-center justify-between transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Printer className="w-4 h-4" />
                  <span>Cetak / Simpan Piagam (PDF)</span>
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 bg-[#115E59] rounded">
                  A4
                </span>
              </button>

              {moduleId < 4 && (
                <button
                  type="button"
                  onClick={handleNextModule}
                  className="w-full min-h-[48px] py-3 px-4 bg-[#1E293B] hover:bg-[#0F172A] text-[#FFFFFF] rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 text-[#5EEAD4]" />
                  <span>Lanjut ke Modul {moduleId + 1}</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleBackToDashboard}
                className="w-full min-h-[44px] py-2.5 px-4 border border-[#CBD5E1] bg-[#FFFFFF] hover:bg-[#F1F5F9] text-[#1E293B] rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <LayoutGrid className="w-4 h-4 text-[#0F766E]" />
                <span>Kembali ke Dashboard Ruang</span>
              </button>

              <p className="text-xs text-[#475569] leading-relaxed pt-1">
                Dokumen ini dilengkapi segel kriptografi SHA-256 untuk mencatat
                keutuhan butir kesepakatan pra-nikah Anda.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
