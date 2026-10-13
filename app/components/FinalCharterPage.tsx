"use client";

import React, { useState } from "react";
import { AppHeader } from "./AppHeader";
import { Download, ArrowRight, ShieldCheck, Check, Sparkles } from "lucide-react";

interface FinalCharterProps {
  onBackToDashboard: () => void;
}

export const FinalCharterPage: React.FC<FinalCharterProps> = ({
  onBackToDashboard,
}) => {
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = () => {
    setDownloaded(true);
    setTimeout(() => {
      alert("Generating cryptographic PDF: 'Piagam-Komitmen-Bima-Sarah-Module1.pdf'");
    }, 100);
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex flex-col">
      <AppHeader
        roomCode="SRH-207"
        progressText="In Progress: 2/4 Modules Completed"
        isEncrypted={true}
        userNames="Bima & Sarah"
      />

      <main className="max-w-6xl w-full mx-auto px-4 sm:px-8 py-8 flex-1 space-y-6">
        {/* Banner Success */}
        <div className="bg-[#0F766E] text-white rounded-2xl p-6 sm:p-7 flex items-center space-x-4 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-white/15 border border-white/20 flex items-center justify-center shrink-0">
            <Check className="w-6 h-6 text-white stroke-[3]" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              Module 1 Finalized & Mutually Signed!
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100 mt-0.5">
              4 agreements added to your Living Charter. You can amend them together anytime.
            </p>
          </div>
        </div>

        {/* Two-Column Grid: Charter Certificate on Left, Next Steps on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: The Formal Living Charter Document */}
          <div className="lg:col-span-8 bg-white rounded-2xl p-7 sm:p-10 border border-[#E2E8F0] shadow-sm space-y-8 relative">
            {/* Header Document Branding */}
            <div className="flex items-start justify-between border-b border-[#E2E8F0] pb-6">
              <div>
                <div className="text-[11px] font-mono tracking-widest text-slate-400 uppercase font-bold">
                  Living Charter · Article I
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1E293B] tracking-tight mt-1">
                  Financial Principles of Bima & Sarah
                </h2>
              </div>
              <div className="text-right hidden sm:block">
                <span className="font-bold text-base text-[#1E293B]">VowSync</span>
                <span className="block text-[11px] text-slate-400">SalingPaham</span>
              </div>
            </div>

            {/* Cryptographic Session Stamp */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 text-[11px] font-mono">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Session ID</span>
                <span className="font-semibold text-slate-700">VSX-SRH207-M1-8F2A</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Timestamp</span>
                <span className="font-semibold text-slate-700">01 Oct 2026, 09:42 WIB</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Hash</span>
                <span className="font-semibold text-slate-700">sha256: 3e9c…b71d</span>
              </div>
            </div>

            {/* Agreement Clauses List */}
            <div className="space-y-4 pt-2">
              <div className="flex items-start space-x-3.5">
                <span className="font-mono font-bold text-slate-400 text-sm mt-0.5">1.</span>
                <p className="text-sm text-slate-800 leading-relaxed font-normal">
                  Combined monthly debt instalments shall not exceed{" "}
                  <strong>30% of joint take-home pay</strong> (currently{" "}
                  <span className="font-mono font-semibold">IDR 8.400.000</span>).
                </p>
              </div>

              <div className="flex items-start space-x-3.5">
                <span className="font-mono font-bold text-slate-400 text-sm mt-0.5">2.</span>
                <p className="text-sm text-slate-800 leading-relaxed font-normal">
                  Family support follows the <strong>Tiered Safety Net</strong>: max{" "}
                  <span className="font-mono font-semibold">IDR 2.000.000</span>/month, reviewed every quarter.
                </p>
              </div>

              <div className="flex items-start space-x-3.5">
                <span className="font-mono font-bold text-slate-400 text-sm mt-0.5">3.</span>
                <p className="text-sm text-slate-800 leading-relaxed font-normal">
                  Medical emergencies above{" "}
                  <span className="font-mono font-semibold">IDR 5.000.000</span> are decided together within 24 hours, never unilaterally.
                </p>
              </div>

              <div className="flex items-start space-x-3.5">
                <span className="font-mono font-bold text-slate-400 text-sm mt-0.5">4.</span>
                <p className="text-sm text-slate-800 leading-relaxed font-normal">
                  An emergency fund of <strong>six months’ expenses</strong> (
                  <span className="font-mono font-semibold">IDR 54.000.000</span>) is built before any new consumer credit.
                </p>
              </div>
            </div>

            {/* Reflective Quote */}
            <div className="pt-2 text-center">
              <span className="font-serif-quote text-slate-500 text-sm">
                “Kami sepakat sebelum kami berjanji.”
              </span>
            </div>

            {/* Partner Digital Signatures */}
            <div className="pt-6 border-t border-[#E2E8F0] grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Bima */}
              <div className="p-4 rounded-xl border border-emerald-200/80 bg-emerald-50/40 flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-[#1E293B] text-white flex items-center justify-center font-bold text-xs shrink-0">
                  B
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-sm text-[#1E293B]">Bima Prasetyo</div>
                  <div className="text-[11px] text-slate-500 font-mono">Signed 09:41 WIB</div>
                </div>
                <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-100 text-[#0F766E] text-[11px] font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified</span>
                </span>
              </div>

              {/* Sarah */}
              <div className="p-4 rounded-xl border border-emerald-200/80 bg-emerald-50/40 flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-[#0F766E] text-white flex items-center justify-center font-bold text-xs shrink-0">
                  S
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-sm text-[#1E293B]">Sarah Wijaya</div>
                  <div className="text-[11px] text-slate-500 font-mono">Signed 09:42 WIB</div>
                </div>
                <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-100 text-[#0F766E] text-[11px] font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified</span>
                </span>
              </div>
            </div>
          </div>

          {/* Right: Next steps Action Card */}
          <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-sm space-y-4">
            <h3 className="text-base font-bold text-[#1E293B]">Next steps</h3>

            {/* Download PDF button */}
            <button
              onClick={handleDownload}
              className="w-full py-3.5 px-4 bg-[#0F766E] hover:bg-[#0D625C] text-white rounded-xl text-xs font-semibold flex items-center justify-between transition cursor-pointer shadow-xs"
            >
              <div className="flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>{downloaded ? "Living Agreement Downloaded" : "Download Signed Living Agreement (PDF)"}</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-black/20 rounded-md">248 KB</span>
            </button>

            {/* Proceed to Module 2 */}
            <button
              onClick={onBackToDashboard}
              className="w-full py-3 px-4 border border-[#E2E8F0] hover:bg-slate-50 text-[#1E293B] rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition cursor-pointer"
            >
              <span>Proceed to Module 2 (In-Law Boundaries)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-[11px] text-slate-400 leading-relaxed pt-2">
              A copy is stored encrypted in your shared room. Only you and Sarah hold the keys.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};
