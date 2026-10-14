"use client";

import React, { useState, useEffect } from "react";
import { Lock, ArrowRight, Shield, RefreshCw, KeyRound, UserCheck, MessageCircle, AlertCircle } from "lucide-react";
import { generateRoomCode, generatePasscode, createRoom, joinRoom } from "../lib/sessionStore";

interface JoinRoomProps {
  onSuccess: (roomCode: string) => void;
}

export const JoinRoomPage: React.FC<JoinRoomProps> = ({ onSuccess }) => {
  const [tab, setTab] = useState<"create" | "join">("create");

  // Create form state (no hardcoded credentials)
  const [createUsername, setCreateUsername] = useState("");
  const [createdRoomInfo, setCreatedRoomInfo] = useState<{ code: string; pin: string } | null>(null);

  // Join form state (clean empty defaults)
  const [joinUsername, setJoinUsername] = useState("");
  const [joinRoomCode, setJoinRoomCode] = useState("");
  const [joinPin, setJoinPin] = useState("");
  const [joinError, setJoinError] = useState<string | null>(null);

  // Check URL query parameters for auto-fill invitation link (?room=VWS-123&pin=1234)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const roomParam = urlParams.get("room");
      const pinParam = urlParams.get("pin");
      if (roomParam) {
        setJoinRoomCode(roomParam.toUpperCase());
        setTab("join");
      }
      if (pinParam) {
        setJoinPin(pinParam);
      }
    }
  }, []);

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!createUsername.trim()) return;

    const newCode = generateRoomCode();
    const newPin = generatePasscode();
    createRoom(createUsername.trim(), newCode, newPin);

    setCreatedRoomInfo({ code: newCode, pin: newPin });
  };

  const handleInviteWhatsApp = () => {
    if (!createdRoomInfo) return;
    const inviteLink = `${window.location.origin}/?room=${createdRoomInfo.code}&pin=${createdRoomInfo.pin}`;
    const text = encodeURIComponent(
      `Hai! Yuk isi keselarasan pra-nikah kita di VowSync (SalingPaham).\n\nKode Room: *${createdRoomInfo.code}*\nPIN Masuk: *${createdRoomInfo.pin}*\n\nAtau langsung klik link privat kita ini:\n${inviteLink}`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    setJoinError(null);

    const code = joinRoomCode.trim().toUpperCase();
    const username = joinUsername.trim();
    const pin = joinPin.trim();

    if (!code || !username || !pin) {
      setJoinError("Mohon lengkapi username, kode room, dan 4-digit PIN.");
      return;
    }

    const result = joinRoom(code, username, pin);

    if (result.success) {
      onSuccess(code);
    } else {
      if (result.error === "NOT_FOUND") {
        setJoinError("Room tidak ditemukan. Pastikan kode room sudah benar.");
      } else if (result.error === "WRONG_PIN") {
        setJoinError("PIN Room salah! Mintalah 4-digit PIN rahasia kepada pasangan Anda.");
      } else if (result.error === "ROOM_FULL") {
        setJoinError("Akses ditolak: Room ini privat dan sudah terisi penuh oleh 2 pasangan.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#1E293B] text-white flex flex-col justify-between p-6 md:p-12 lg:p-16 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#0F766E]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#0F766E]/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Navbar */}
      <div className="flex items-center space-x-3 z-10">
        <div className="w-10 h-10 rounded-full bg-white text-[#1E293B] flex items-center justify-center font-bold text-sm shadow-md">
          VS
        </div>
        <div>
          <span className="font-bold text-lg tracking-tight block">VowSync</span>
          <span className="text-xs text-slate-400">SalingPaham Platform</span>
        </div>
      </div>

      {/* Main Grid Hero */}
      <div className="my-auto py-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center z-10 max-w-7xl mx-auto w-full">
        {/* Left Column: Mission statement */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-block tracking-widest uppercase text-[11px] font-mono text-[#0F766E] bg-[#0F766E]/15 border border-[#0F766E]/30 px-3 py-1 rounded-full font-semibold">
            Indonesia&apos;s Dual-Blind Pre-Marital Alignment
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] text-white">
            Bicara finansial &amp; prinsip keluarga{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-200 to-white">
              tanpa takut dihakimi.
            </span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-xl font-normal leading-relaxed">
            Utang paylater, uang bulanan orang tua, hingga rekening bersama. Jawab masing-masing secara privat
            tanpa intip. Sesi dilindungi PIN privat dan terkunci hanya untuk 2 pasangan.
          </p>

          {/* Value Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-700/80">
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-white font-semibold text-sm">
                <Lock className="w-4 h-4 text-[#0F766E]" />
                <span>PIN &amp; 2-User Lock</span>
              </div>
              <p className="text-xs text-slate-400">Bebas penyusup asing</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-white font-semibold text-sm">
                <RefreshCw className="w-4 h-4 text-[#0F766E]" />
                <span>Simultaneous reveal</span>
              </div>
              <p className="text-xs text-slate-400">Bebas pleasing-bias</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-white font-semibold text-sm">
                <Shield className="w-4 h-4 text-[#0F766E]" />
                <span>Living Charter</span>
              </div>
              <p className="text-xs text-slate-400">Dokumentasi kesepakatan PDF</p>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Card */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-2xl p-7 sm:p-9 text-[#1E293B] shadow-2xl border border-slate-200">
            {/* Tab Switcher */}
            <div className="flex border-b border-slate-200 mb-6 pb-2">
              <button
                type="button"
                onClick={() => {
                  setTab("create");
                  setCreatedRoomInfo(null);
                }}
                className={`flex-1 text-center py-2 text-xs font-bold uppercase tracking-wider transition cursor-pointer border-b-2 -mb-2.5 ${
                  tab === "create"
                    ? "border-[#0F766E] text-[#0F766E]"
                    : "border-transparent text-slate-400 hover:text-slate-600"
                }`}
              >
                Buat Room Baru
              </button>
              <button
                type="button"
                onClick={() => setTab("join")}
                className={`flex-1 text-center py-2 text-xs font-bold uppercase tracking-wider transition cursor-pointer border-b-2 -mb-2.5 ${
                  tab === "join"
                    ? "border-[#0F766E] text-[#0F766E]"
                    : "border-transparent text-slate-400 hover:text-slate-600"
                }`}
              >
                Gabung Room Pasangan
              </button>
            </div>

            {/* TAB 1: CREATE ROOM */}
            {tab === "create" && (
              <div>
                {!createdRoomInfo ? (
                  <form onSubmit={handleCreateRoom} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                        Username Anda
                      </label>
                      <input
                        type="text"
                        value={createUsername}
                        onChange={(e) => setCreateUsername(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-[#E2E8F0] focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/20 text-[#1E293B] font-medium outline-hidden transition text-sm"
                        placeholder="Contoh: Bima"
                        required
                        autoFocus
                      />
                      <p className="text-[11px] text-slate-400 mt-1">
                        Nama ini akan tertera di Living Charter dan layar pasangan Anda.
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={!createUsername.trim()}
                      className="w-full mt-2 py-3.5 px-6 bg-[#0F766E] hover:bg-[#0D625C] disabled:opacity-50 text-white font-semibold rounded-lg shadow-sm transition flex items-center justify-center space-x-2 text-sm cursor-pointer"
                    >
                      <span>Buat Room &amp; Kunci PIN</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                ) : (
                  /* Room Created Success Display */
                  <div className="space-y-5 animate-fade-in">
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-3">
                      <div className="text-xs font-bold uppercase tracking-wider text-[#0F766E] flex items-center space-x-1.5">
                        <Shield className="w-4 h-4" />
                        <span>Room Berhasil Dibuat Secara Privat!</span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-1">
                        <div className="bg-white p-3 rounded-lg border border-emerald-100 text-center">
                          <div className="text-[10px] text-slate-400 uppercase font-mono">Kode Room</div>
                          <div className="text-xl font-bold font-mono text-[#1E293B]">{createdRoomInfo.code}</div>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-emerald-100 text-center">
                          <div className="text-[10px] text-slate-400 uppercase font-mono">4-Digit PIN</div>
                          <div className="text-xl font-bold font-mono text-[#0F766E]">{createdRoomInfo.pin}</div>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        Hanya pasangan yang memiliki <strong>Kode Room dan PIN</strong> ini yang dapat bergabung. Sesi akan otomatis dikunci permanen untuk 2 orang.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleInviteWhatsApp}
                      className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center space-x-2 transition shadow-sm cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Kirim Undangan + PIN via WhatsApp</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onSuccess(createdRoomInfo.code)}
                      className="w-full py-3 px-4 bg-[#1E293B] hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 transition cursor-pointer"
                    >
                      <span>Masuk ke Dashboard Room Saya</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: JOIN EXISTING ROOM */}
            {tab === "join" && (
              <form onSubmit={handleJoinRoom} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Username Anda
                  </label>
                  <input
                    type="text"
                    value={joinUsername}
                    onChange={(e) => setJoinUsername(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-[#E2E8F0] focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/20 text-[#1E293B] font-medium outline-hidden transition text-sm"
                    placeholder="Contoh: Sarah"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Kode Room Pasangan
                  </label>
                  <input
                    type="text"
                    value={joinRoomCode}
                    onChange={(e) => setJoinRoomCode(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border font-mono tracking-widest text-[#1E293B] font-bold text-center text-base outline-hidden transition border-[#E2E8F0] focus:border-[#0F766E]"
                    placeholder="VWS-XXX"
                    required
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                      4-Digit PIN Rahasia
                    </label>
                    <span className="text-[10px] text-slate-400">Diberikan oleh pasangan</span>
                  </div>
                  <div className="relative">
                    <input
                      type="password"
                      maxLength={6}
                      value={joinPin}
                      onChange={(e) => setJoinPin(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border font-mono tracking-widest text-[#1E293B] font-bold text-center text-lg outline-hidden transition border-[#E2E8F0] focus:border-[#0F766E]"
                      placeholder="••••"
                      required
                    />
                    <KeyRound className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                  </div>
                </div>

                {joinError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600 flex items-start space-x-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{joinError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full mt-2 py-3.5 px-6 bg-[#0F766E] hover:bg-[#0D625C] text-white font-semibold rounded-lg shadow-sm transition flex items-center justify-center space-x-2 text-sm cursor-pointer"
                >
                  <span>Verifikasi PIN &amp; Masuk Room</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Footer Credits */}
      <div className="z-10 text-xs text-slate-500 flex justify-between items-center flex-wrap gap-2">
        <span>SalingPaham (VowSync) · Indonesia Pre-Marital Alignment Engine</span>
        <span>Strict 2-User Capacity &amp; PIN Shield Active</span>
      </div>
    </div>
  );
};
