"use client";

import React, { useState } from "react";
import { Lock, Clock, ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";

interface DilemmaRunnerProps {
  onBack: () => void;
  onFinish: () => void;
}

export const DilemmaRunnerPage: React.FC<DilemmaRunnerProps> = ({
  onBack,
  onFinish,
}) => {
  const [selectedOption, setSelectedOption] = useState<"A" | "B" | "C">("A");
  const [allocation, setAllocation] = useState<number>(1500000);

  const formatIDR = (val: number) => {
    return "IDR " + val.toLocaleString("id-ID");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between">
      {/* Top Runner Header */}
      <header className="w-full bg-white border-b border-[#E2E8F0] px-4 sm:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-sm text-[#1E293B]">
            Scenario 4 of 10
          </span>
        </div>

        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-1.5 text-xs text-slate-500 font-medium">
            <Clock className="w-4 h-4 text-slate-400" />
            <span>4:32</span>
          </div>
          <button
            onClick={onBack}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            Exit
          </button>
        </div>
      </header>

      {/* Progress Bar at Top */}
      <div className="w-full bg-slate-200 h-1">
        <div className="bg-[#0F766E] h-1 w-[40%]" />
      </div>

      {/* Main Content Area */}
      <main className="max-w-3xl w-full mx-auto px-4 sm:px-8 py-10 my-auto space-y-8">
        {/* Category & Sealed Badges */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
            Parental Allowance
          </span>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 flex items-center space-x-1">
            <Lock className="w-3 h-3" />
            <span>Sealed</span>
          </span>
        </div>

        {/* Question Title */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E293B] tracking-tight leading-snug">
          Scenario #4: If your parents require an urgent medical loan of IDR
          15.000.000, how should the fund be allocated?
        </h1>

        {/* Dilemma Choice Cards */}
        <div className="space-y-3.5">
          {/* Option A */}
          <button
            type="button"
            onClick={() => setSelectedOption("A")}
            className={`w-full text-left p-5 rounded-xl border transition flex items-center justify-between cursor-pointer ${
              selectedOption === "A"
                ? "bg-emerald-50/50 border-[#0F766E] ring-1 ring-[#0F766E]"
                : "bg-white border-[#E2E8F0] hover:border-slate-400 hover:bg-slate-50/50"
            }`}
          >
            <div className="flex items-center space-x-4">
              <span
                className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                  selectedOption === "A"
                    ? "bg-[#0F766E] text-white"
                    : "bg-slate-100 text-slate-700"
                }`}
              >
                A
              </span>
              <span className="text-sm font-medium text-slate-800">
                Draw directly from our joint emergency savings, no questions asked.
              </span>
            </div>
            <div
              className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                selectedOption === "A"
                  ? "border-[#0F766E] bg-[#0F766E]"
                  : "border-slate-300"
              }`}
            >
              {selectedOption === "A" && (
                <div className="w-2 h-2 rounded-full bg-white" />
              )}
            </div>
          </button>

          {/* Option B */}
          <button
            type="button"
            onClick={() => setSelectedOption("B")}
            className={`w-full text-left p-5 rounded-xl border transition flex items-center justify-between cursor-pointer ${
              selectedOption === "B"
                ? "bg-emerald-50/50 border-[#0F766E] ring-1 ring-[#0F766E]"
                : "bg-white border-[#E2E8F0] hover:border-slate-400 hover:bg-slate-50/50"
            }`}
          >
            <div className="flex items-center space-x-4">
              <span
                className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                  selectedOption === "B"
                    ? "bg-[#0F766E] text-white"
                    : "bg-slate-100 text-slate-700"
                }`}
              >
                B
              </span>
              <span className="text-sm font-medium text-slate-800">
                Deduct entirely from my personal discretionary allowance over 6
                months.
              </span>
            </div>
            <div
              className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                selectedOption === "B"
                  ? "border-[#0F766E] bg-[#0F766E]"
                  : "border-slate-300"
              }`}
            >
              {selectedOption === "B" && (
                <div className="w-2 h-2 rounded-full bg-white" />
              )}
            </div>
          </button>

          {/* Option C */}
          <button
            type="button"
            onClick={() => setSelectedOption("C")}
            className={`w-full text-left p-5 rounded-xl border transition flex items-center justify-between cursor-pointer ${
              selectedOption === "C"
                ? "bg-emerald-50/50 border-[#0F766E] ring-1 ring-[#0F766E]"
                : "bg-white border-[#E2E8F0] hover:border-slate-400 hover:bg-slate-50/50"
            }`}
          >
            <div className="flex items-center space-x-4">
              <span
                className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                  selectedOption === "C"
                    ? "bg-[#0F766E] text-white"
                    : "bg-slate-100 text-slate-700"
                }`}
              >
                C
              </span>
              <span className="text-sm font-medium text-slate-800">
                Negotiate an affordable fixed cap, decline if it threatens primary
                family cashflow.
              </span>
            </div>
            <div
              className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                selectedOption === "C"
                  ? "border-[#0F766E] bg-[#0F766E]"
                  : "border-slate-300"
              }`}
            >
              {selectedOption === "C" && (
                <div className="w-2 h-2 rounded-full bg-white" />
              )}
            </div>
          </button>
        </div>

        {/* Additional Slider Input */}
        <div className="bg-white rounded-xl p-5 border border-[#E2E8F0] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="text-xs font-bold text-slate-800">
                Maximum monthly allocation for extended family
              </div>
              <div className="text-[11px] text-slate-500 flex items-center space-x-1 mt-0.5">
                <Lock className="w-3 h-3 text-[#0F766E]" />
                <span>Confidential input</span>
              </div>
            </div>
            <div className="text-right font-mono font-bold text-[#0F766E] text-lg">
              {formatIDR(allocation)}
            </div>
          </div>

          <input
            type="range"
            min={500000}
            max={5000000}
            step={250000}
            value={allocation}
            onChange={(e) => setAllocation(Number(e.target.value))}
            className="w-full accent-[#0F766E] h-2 bg-slate-200 rounded-lg cursor-pointer"
          />

          <div className="flex justify-between text-[11px] font-mono text-slate-400">
            <span>IDR 500k</span>
            <span>IDR 5M</span>
          </div>
        </div>
      </main>

      {/* Bottom Sticky Action Bar */}
      <footer className="w-full bg-white border-t border-[#E2E8F0] px-4 sm:px-8 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="px-4 py-2.5 border border-[#E2E8F0] hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg flex items-center space-x-1.5 transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>

          <button
            onClick={onFinish}
            className="px-6 py-2.5 bg-[#0F766E] hover:bg-[#0D625C] text-white text-xs font-semibold rounded-lg flex items-center space-x-2 transition shadow-xs cursor-pointer"
          >
            <span>Save & Next Dilemma</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </footer>
    </div>
  );
};
