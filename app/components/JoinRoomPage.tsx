"use client";

import React, { useState } from "react";
import { Lock, ArrowRight, Shield, CheckCircle2, RefreshCw } from "lucide-react";

interface JoinRoomProps {
  onEnter: (roomCode: string, email: string) => void;
}

export const JoinRoomPage: React.FC<JoinRoomProps> = ({ onEnter }) => {
  const [email, setEmail] = useState("bima.prasetyo@gmail.com");
  const [roomCode, setRoomCode] = useState("VWS - 418");
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomCode.trim().toLowerCase().includes("err")) {
      setError(true);
    } else {
      onEnter(roomCode, email);
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
          <span className="text-xs text-slate-400">SalingPaham</span>
        </div>
      </div>

      {/* Main Grid Hero */}
      <div className="my-auto py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center z-10 max-w-7xl mx-auto w-full">
        {/* Left Column: Mission statement */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-block tracking-widest uppercase text-[11px] font-mono text-[#0F766E] bg-[#0F766E]/15 border border-[#0F766E]/30 px-3 py-1 rounded-full font-semibold">
            The Dual-Blind Promise
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] text-white">
            Answer honestly. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">
              Neither of you sees a thing
            </span>{" "}
            until you both submit.
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-xl font-normal leading-relaxed">
            Debt, orang tua, and who cooks dinner — the conversations most couples
            postpone until after akad. VowSync seals every answer with end-to-end
            encryption, then reveals both sides at once, without judgment.
          </p>

          <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-slate-700/60 max-w-xl">
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-white font-semibold text-sm">
                <Lock className="w-4 h-4 text-[#0F766E]" />
                <span>Sealed answers</span>
              </div>
              <p className="text-xs text-slate-400">AES-256, per-partner keys</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-white font-semibold text-sm">
                <RefreshCw className="w-4 h-4 text-[#0F766E]" />
                <span>Simultaneous reveal</span>
              </div>
              <p className="text-xs text-slate-400">No peeking, no anchoring</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-white font-semibold text-sm">
                <Shield className="w-4 h-4 text-[#0F766E]" />
                <span>You own the data</span>
              </div>
              <p className="text-xs text-slate-400">Delete the room anytime</p>
            </div>
          </div>
        </div>

        {/* Right Column: Join Card */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-2xl p-7 sm:p-9 text-[#1E293B] shadow-2xl border border-slate-200">
            <h2 className="text-2xl font-bold tracking-tight text-[#1E293B]">
              Join your secure room
            </h2>
            <p className="text-sm text-slate-500 mt-1 mb-6">
              Use the access code Sarah shared with you.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Email or phone number
                </label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-[#E2E8F0] focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/20 text-[#1E293B] font-medium outline-hidden transition text-sm"
                  placeholder="nama@email.com"
                  required
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Room access code
                  </label>
                  <button
                    type="button"
                    onClick={() => setError(!error)}
                    className="text-[11px] text-slate-400 hover:text-slate-600 underline"
                  >
                    {error ? "Clear error demo" : "Simulate error"}
                  </button>
                </div>
                <input
                  type="text"
                  value={roomCode}
                  onChange={(e) => {
                    setRoomCode(e.target.value);
                    if (error) setError(false);
                  }}
                  className={`w-full px-4 py-3 rounded-lg border font-mono tracking-widest text-[#1E293B] font-semibold text-center text-lg outline-hidden transition ${
                    error
                      ? "border-red-500 bg-red-50/50 focus:border-red-600"
                      : "border-[#E2E8F0] focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/20"
                  }`}
                  placeholder="SRH - 482"
                  required
                />
                {error && (
                  <p className="text-xs text-red-600 mt-2 flex items-center space-x-1.5 font-medium">
                    <span>⚠</span>
                    <span>Invalid or expired session code. Please verify with your partner.</span>
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3.5 px-6 bg-[#0F766E] hover:bg-[#0D625C] text-white font-semibold rounded-lg shadow-sm transition flex items-center justify-center space-x-2 text-sm cursor-pointer"
              >
                <span>Enter Secure Session</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-slate-100 text-center text-xs text-slate-500">
              No room yet?{" "}
              <a href="#" className="font-semibold text-[#0F766E] hover:underline">
                Create one and invite your partner by WhatsApp.
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer Credits */}
      <div className="z-10 text-xs text-slate-500 flex justify-between items-center flex-wrap gap-2">
        <span>Tugas Modul Ke 5 · Kelompok 7 · Phiskal Septiaji</span>
        <span>AES-256 E2E Encryption Active</span>
      </div>
    </div>
  );
};
