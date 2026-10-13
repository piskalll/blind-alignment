"use client";

import React from "react";
import { AppHeader } from "./AppHeader";
import { Check, Clock, Lock, Sparkles, ArrowRight } from "lucide-react";

interface DashboardProps {
  onStartModule: (moduleId: number) => void;
  onRevealAnswers: (moduleId: number) => void;
}

export const DashboardPage: React.FC<DashboardProps> = ({
  onStartModule,
  onRevealAnswers,
}) => {
  return (
    <div className="min-h-screen bg-[#F1F5F9] flex flex-col">
      <AppHeader
        roomCode="SRH-207"
        progressText="In Progress: 2/4 Modules Completed"
        isEncrypted={true}
        userNames="Bima & Sarah"
      />

      <main className="max-w-6xl w-full mx-auto px-4 sm:px-8 py-8 flex-1 space-y-8">
        {/* Welcome Banner */}
        <div className="space-y-1">
          <div className="text-xs font-mono font-bold tracking-widest text-[#475569] uppercase">
            Room SRH-207 · Since 12 Sep 2026
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1E293B] tracking-tight">
            Selamat pagi, Bima.
          </h1>
          <p className="text-sm sm:text-base text-[#475569]">
            Module 1 is sealed on both sides. One reveal is waiting for you.
          </p>
        </div>

        {/* Sync Status & Next Action Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Sync Progress Card */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs space-y-5">
            <h2 className="text-base font-bold text-[#1E293B]">
              Module 2 sync status
            </h2>

            {/* You (Bima) Progress */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="flex items-center space-x-1.5 text-[#0F766E]">
                  <span className="w-4 h-4 rounded-full bg-[#0F766E] text-white flex items-center justify-center text-[10px]">✓</span>
                  <span>You (Bima)</span>
                </span>
                <span className="text-[#0F766E]">Completed (10/10 Dilemmas)</span>
              </div>
              {/* Segmented bar for Bima */}
              <div className="grid grid-cols-10 gap-1.5">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="h-2 rounded-xs bg-[#0F766E]" />
                ))}
              </div>
            </div>

            {/* Sarah Progress */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="flex items-center space-x-1.5 text-[#D97706]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#D97706]"></span>
                  <span className="text-[#1E293B]">Sarah</span>
                </span>
                <span className="text-[#D97706]">In Progress (7/10 Dilemmas)</span>
              </div>
              {/* Segmented bar for Sarah */}
              <div className="grid grid-cols-10 gap-1.5">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 rounded-xs ${
                      i < 7 ? "bg-[#D97706]" : "bg-[#E2E8F0]"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Action Prompt Card */}
          <div className="lg:col-span-5 bg-[#1E293B] text-white rounded-2xl p-6 flex flex-col justify-between shadow-md">
            <div>
              <div className="flex items-center space-x-1.5 text-xs text-slate-300 font-semibold mb-3">
                <Clock className="w-4 h-4 text-[#0F766E]" />
                <span>Est. 5 mins</span>
              </div>
              <h3 className="text-xl font-bold tracking-tight mb-1">
                Continue Module 2
              </h3>
              <p className="text-xs text-slate-400">
                3 dilemmas left on in-law boundaries.
              </p>
            </div>

            <button
              onClick={() => onStartModule(2)}
              className="mt-6 w-full py-3 px-5 bg-[#0F766E] hover:bg-[#0D625C] text-white rounded-xl text-sm font-semibold flex items-center justify-center space-x-2 transition cursor-pointer"
            >
              <span>Continue Module 2</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* The Four Pillars Section */}
        <div>
          <h2 className="text-lg font-bold text-[#1E293B] mb-4">
            The four pillars
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Pillar 1: Ready to Reveal */}
            <div className="bg-white rounded-2xl p-6 border border-[#0F766E]/40 shadow-xs hover:border-[#0F766E] transition flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl font-mono font-bold text-slate-300">01</span>
                  <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-[#0F766E]/10 text-[#0F766E] text-xs font-bold border border-[#0F766E]/20">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Ready to Reveal</span>
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#1E293B] mb-1.5">
                  Financial Transparency & Debt Liabilities
                </h3>
                <p className="text-xs sm:text-sm text-[#475569] mb-5">
                  KPR, paylater, credit cards, and joint vs. separate accounts.
                </p>
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <button
                  onClick={() => onRevealAnswers(1)}
                  className="px-4 py-2.5 bg-[#0F766E] hover:bg-[#0D625C] text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer"
                >
                  <span>Reveal answers</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onStartModule(1)}
                  className="px-4 py-2.5 border border-[#E2E8F0] hover:bg-slate-50 text-[#1E293B] rounded-lg text-xs font-semibold transition cursor-pointer"
                >
                  Details
                </button>
              </div>
            </div>

            {/* Pillar 2: In Progress */}
            <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl font-mono font-bold text-slate-300">02</span>
                  <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-[#D97706]/10 text-[#D97706] text-xs font-bold border border-[#D97706]/20">
                    <Clock className="w-3.5 h-3.5" />
                    <span>In Progress</span>
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#1E293B] mb-1.5">
                  Sandwich Generation & In-Law Boundaries
                </h3>
                <p className="text-xs sm:text-sm text-[#475569] mb-5">
                  Monthly support for parents, siblings tuition, living arrangements.
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onStartModule(2)}
                  className="px-4 py-2.5 border border-[#E2E8F0] hover:bg-slate-50 text-[#1E293B] rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer"
                >
                  <span>Resume</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Pillar 3: Locked */}
            <div className="bg-white/60 rounded-2xl p-6 border border-[#E2E8F0] opacity-80 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl font-mono font-bold text-slate-300">03</span>
                  <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-medium">
                    <Lock className="w-3 h-3" />
                    <span>Locked</span>
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-700 mb-1.5">
                  Domestic Roles & Career Growth
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mb-4">
                  Housework split, relocation for work, ART and childcare help.
                </p>
              </div>
              <p className="text-[11px] text-slate-400 italic">
                Unlocks after Module 2 is signed.
              </p>
            </div>

            {/* Pillar 4: Locked */}
            <div className="bg-white/60 rounded-2xl p-6 border border-[#E2E8F0] opacity-80 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl font-mono font-bold text-slate-300">04</span>
                  <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-medium">
                    <Lock className="w-3 h-3" />
                    <span>Locked</span>
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-700 mb-1.5">
                  Parenting & Core Values
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mb-4">
                  Timing, schooling, faith practice, and screen-time principles.
                </p>
              </div>
              <p className="text-[11px] text-slate-400 italic">
                Unlocks after Module 3 is signed.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
