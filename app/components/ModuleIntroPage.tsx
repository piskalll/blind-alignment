"use client";

import React, { useState } from "react";
import { AppHeader } from "./AppHeader";
import { SCENARIOS } from "../data/scenarios";
import { Shield, Check, ArrowRight, ArrowLeft } from "lucide-react";

interface ModuleIntroProps {
  onBack: () => void;
  onStartDilemma: () => void;
}

export const ModuleIntroPage: React.FC<ModuleIntroProps> = ({
  onBack,
  onStartDilemma,
}) => {
  const [check1, setCheck1] = useState(true);
  const [check2, setCheck2] = useState(true);
  const [check3, setCheck3] = useState(true);

  const allChecked = check1 && check2 && check3;

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "Debt Ratio":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "Parental Allowance":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Emergency Fund":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
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
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-xs font-medium text-slate-500">
          <button onClick={onBack} className="hover:text-slate-800 transition">
            Dashboard
          </button>
          <span>/</span>
          <span className="text-slate-800 font-semibold">
            Module 1: Financial Liabilities
          </span>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E293B] tracking-tight">
            Financial Expectations & Debt Management
          </h1>
          <p className="text-sm text-[#475569] max-w-3xl leading-relaxed">
            Ten realistic scenarios drawn from Indonesian households — from cicilan
            KPR to a parent&apos;s hospital bill. There are no right answers, only
            yours.
          </p>
        </div>

        {/* Privacy Banner */}
        <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-4 flex items-center space-x-3 text-emerald-900">
          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
            <Shield className="w-4 h-4 text-[#0F766E]" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#0F766E]">
              Privacy guarantee
            </div>
            <div className="text-xs sm:text-sm font-medium text-slate-700">
              Your partner will not see your answers until both submit.
            </div>
          </div>
        </div>

        {/* Two-Column Layout: Scenario List vs Readiness Checklist */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: 10 Scenarios list */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden divide-y divide-[#E2E8F0]">
            {SCENARIOS.map((sc, index) => (
              <div
                key={sc.id}
                className="p-4 sm:px-6 flex items-center justify-between hover:bg-slate-50/80 transition"
              >
                <div className="flex items-center space-x-4 min-w-0 pr-3">
                  <span className="text-xs font-mono font-bold text-slate-400 shrink-0">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-[#1E293B] truncate">
                    {sc.title}
                  </span>
                </div>
                <span
                  className={`text-[11px] font-medium px-2.5 py-0.8 rounded-full border shrink-0 ${getCategoryBadge(
                    sc.category
                  )}`}
                >
                  {sc.category}
                </span>
              </div>
            ))}
          </div>

          {/* Right: Before you begin Card */}
          <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs space-y-6 sticky top-20">
            <div>
              <h2 className="text-lg font-bold text-[#1E293B]">Before you begin</h2>
              <div className="flex items-center space-x-2 text-xs text-slate-500 mt-1">
                <span>10 dilemmas</span>
                <span>·</span>
                <span>~12 minutes</span>
                <span>·</span>
                <span className="text-[#0F766E] font-medium">autosaves</span>
              </div>
            </div>

            {/* Checklist items */}
            <div className="space-y-3.5">
              <label className="flex items-start space-x-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={check1}
                  onChange={(e) => setCheck1(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded-sm border-[#E2E8F0] text-[#0F766E] focus:ring-[#0F766E] cursor-pointer"
                />
                <span className="text-xs font-medium text-slate-700 leading-snug group-hover:text-slate-900">
                  Bima has a private, quiet 15 minutes
                </span>
              </label>

              <label className="flex items-start space-x-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={check2}
                  onChange={(e) => setCheck2(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded-sm border-[#E2E8F0] text-[#0F766E] focus:ring-[#0F766E] cursor-pointer"
                />
                <span className="text-xs font-medium text-slate-700 leading-snug group-hover:text-slate-900">
                  Sarah has confirmed she is ready
                </span>
              </label>

              <label className="flex items-start space-x-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={check3}
                  onChange={(e) => setCheck3(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded-sm border-[#E2E8F0] text-[#0F766E] focus:ring-[#0F766E] cursor-pointer"
                />
                <span className="text-xs font-medium text-slate-700 leading-snug group-hover:text-slate-900">
                  I agree to answer for us, not to please my partner
                </span>
              </label>
            </div>

            {/* Start Button */}
            <div className="pt-2">
              <button
                disabled={!allChecked}
                onClick={onStartDilemma}
                className={`w-full py-3 px-4 rounded-xl text-sm font-semibold flex items-center justify-center space-x-2 transition ${
                  allChecked
                    ? "bg-[#0F766E] hover:bg-[#0D625C] text-white shadow-sm cursor-pointer"
                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
                }`}
              >
                <span>Start Module</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              {!allChecked && (
                <p className="text-[11px] text-center text-slate-400 mt-2">
                  Complete all checks to start.
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
