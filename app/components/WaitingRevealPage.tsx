"use client";

import React, { useState } from "react";
import { Lock, Radio, BookOpen, Bell, ArrowRight, CheckCircle2 } from "lucide-react";
import { useRoom } from "../lib/sessionStore";

interface WaitingRevealProps {
  onRevealTogether: () => void;
  onBackToDashboard: () => void;
  moduleId?: number;
}

export const WaitingRevealPage: React.FC<WaitingRevealProps> = ({
  onRevealTogether,
  onBackToDashboard,
  moduleId = 1,
}) => {
  const [whatsappNotify, setWhatsappNotify] = useState(true);
  const { room, partnerName, isBothLocked, isPartnerLocked, role } = useRoom();

  const isLockedForThisModule = isBothLocked(moduleId);
  const partnerLockedForThisModule = isPartnerLocked(moduleId);

  const partnerRole = role === "host" ? "guest" : "host";
  const partnerAnswerCount = room ? Object.keys(room[partnerRole].answers).length : 0;

  return (
    <div className="min-h-screen bg-[#1E293B] text-white flex flex-col justify-between p-6 sm:p-10 relative overflow-hidden">
      {/* Background radial soft lights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#0F766E]/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <header className="w-full flex items-center justify-between z-10 max-w-5xl mx-auto">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-full bg-white text-[#1E293B] flex items-center justify-center font-bold text-xs shadow-md">
            VS
          </div>
          <div>
            <span className="font-bold text-base block leading-none">VowSync</span>
            <span className="text-[11px] text-slate-400">
              Room {room?.code || "..."}
            </span>
          </div>
        </div>

        <button
          onClick={onBackToDashboard}
          className="text-xs font-semibold text-slate-300 hover:text-white underline cursor-pointer"
        >
          Dashboard
        </button>
      </header>

      {/* Main Center Waiting Box */}
      <main className="my-auto py-10 max-w-2xl w-full mx-auto text-center space-y-6 z-10">
        {/* Animated Lock Sphere */}
        <div className="relative inline-flex items-center justify-center">
          {isLockedForThisModule ? (
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-400" />
            </div>
          ) : (
            <>
              <div className="w-20 h-20 rounded-full border-2 border-dashed border-[#0F766E] animate-spin flex items-center justify-center" />
              <div className="absolute w-14 h-14 rounded-full bg-[#0F766E]/20 backdrop-blur-sm border border-[#0F766E]/40 flex items-center justify-center">
                <Lock className="w-6 h-6 text-[#0F766E]" />
              </div>
            </>
          )}
        </div>

        {/* Live Websocket pill */}
        <div className="flex justify-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-medium text-slate-300">
            <span className={`w-2 h-2 rounded-full ${isLockedForThisModule ? "bg-emerald-400" : "bg-[#0F766E] animate-ping"}`} />
            <span>
              {isLockedForThisModule
                ? `Both Partners Locked · Ready to Reveal Module ${moduleId}`
                : `Waiting for ${partnerName || "Partner"} (${partnerAnswerCount}/10 answered)`}
            </span>
          </div>
        </div>

        {/* Main Heading */}
        <div className="space-y-3">
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            {isLockedForThisModule
              ? `Both have locked Module ${moduleId}! Ready for the Dual Reveal.`
              : `Encrypted & Locked. Waiting for ${partnerName || "Partner"} to finish.`}
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
            {isLockedForThisModule
              ? "All answers have been safely sealed. Click the button below to decrypt and compare answers simultaneously."
              : `Your 10 answers are sealed. Neither of you can see each other's answers until both lock them in.`}
          </p>
        </div>

        {/* Primary CTA */}
        {isLockedForThisModule && (
          <div className="pt-2">
            <button
              onClick={onRevealTogether}
              className="px-8 py-3.5 bg-[#0F766E] hover:bg-[#0D625C] text-white font-semibold rounded-xl text-sm transition inline-flex items-center space-x-2 shadow-lg cursor-pointer"
            >
              <span>Reveal Together Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Two Waiting Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-8 text-left">
          {/* While you wait Card */}
          <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#0F766E]/20 text-[#0F766E] flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                While you wait: Read 3 conversation frameworks for handling financial discrepancies.
              </h3>
              <ul className="text-xs text-slate-300 space-y-1.5 mt-2.5">
                <li className="flex items-center space-x-1.5 hover:text-white cursor-pointer transition">
                  <span className="text-[#0F766E]">→</span>
                  <span>The “Yours, Mine, Ours” budget talk</span>
                </li>
                <li className="flex items-center space-x-1.5 hover:text-white cursor-pointer transition">
                  <span className="text-[#0F766E]">→</span>
                  <span>Saying no to family requests, kindly</span>
                </li>
                <li className="flex items-center space-x-1.5 hover:text-white cursor-pointer transition">
                  <span className="text-[#0F766E]">→</span>
                  <span>Naming money fears without blame</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Notify via WhatsApp Card */}
          <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-5 flex flex-col justify-between space-y-4">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-[#0F766E]/20 text-[#0F766E] flex items-center justify-center">
                <Bell className="w-5 h-5" />
              </div>
              <button
                type="button"
                onClick={() => setWhatsappNotify(!whatsappNotify)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition cursor-pointer ${
                  whatsappNotify ? "bg-[#0F766E]" : "bg-slate-600"
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${
                    whatsappNotify ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <div>
              <h3 className="text-xs font-bold text-white mb-1">
                Notify via WhatsApp when {partnerName || "Partner"} submits
              </h3>
              <p className="font-mono text-xs text-slate-400">
                Live notification enabled
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
