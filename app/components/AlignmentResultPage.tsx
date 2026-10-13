"use client";

import React, { useState } from "react";
import { AppHeader } from "./AppHeader";
import {
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Flag,
  ArrowRight,
  X,
  CheckCircle2,
} from "lucide-react";

interface AlignmentResultProps {
  onProceedToCharter: () => void;
  onBackToDashboard: () => void;
}

export const AlignmentResultPage: React.FC<AlignmentResultProps> = ({
  onProceedToCharter,
  onBackToDashboard,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(1);
  const [customAgreement, setCustomAgreement] = useState("");
  const [accordionOpenScenario4, setAccordionOpenScenario4] = useState(true);
  const [accordionOpenScenario9, setAccordionOpenScenario9] = useState(false);

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex flex-col relative">
      <AppHeader
        roomCode="SRH-207"
        progressText="In Progress: 2/4 Modules Completed"
        isEncrypted={true}
        userNames="Bima & Sarah"
      />

      <main className="max-w-6xl w-full mx-auto px-4 sm:px-8 py-8 flex-1 space-y-8">
        {/* Top Header & Score Banner */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E2E8F0] shadow-xs">
          <div className="text-xs font-mono font-bold tracking-widest text-[#475569] uppercase mb-1">
            Dual reveal · Module 1
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-[#E2E8F0]">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E293B] tracking-tight">
                Alignment Analysis: Financial Principles
              </h1>
              <p className="text-xs sm:text-sm text-[#475569] mt-1">
                Comparative analysis derived simultaneously from independent submissions.
              </p>
            </div>

            <div className="flex items-center space-x-3 bg-emerald-50/60 border border-emerald-200/80 px-5 py-3 rounded-2xl shrink-0">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#0F766E] font-mono">
                68%
              </span>
              <span className="text-xs font-bold text-slate-700 leading-tight">
                Overall <br />
                Aligned
              </span>
            </div>
          </div>

          {/* Radar Chart + Category Breakdown Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-8">
            {/* SVG Radar Visualization */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center p-4">
              <svg viewBox="0 0 240 240" className="w-56 h-56">
                {/* Background Web Rings */}
                <polygon
                  points="120,30 200,90 180,180 60,180 40,90"
                  fill="none"
                  stroke="#E2E8F0"
                  strokeWidth="1.5"
                />
                <polygon
                  points="120,60 170,100 160,155 80,155 70,100"
                  fill="none"
                  stroke="#E2E8F0"
                  strokeWidth="1.5"
                />
                {/* Axis Lines */}
                <line x1="120" y1="120" x2="120" y2="30" stroke="#CBD5E1" strokeDasharray="3 3" />
                <line x1="120" y1="120" x2="200" y2="90" stroke="#CBD5E1" strokeDasharray="3 3" />
                <line x1="120" y1="120" x2="180" y2="180" stroke="#CBD5E1" strokeDasharray="3 3" />
                <line x1="120" y1="120" x2="60" y2="180" stroke="#CBD5E1" strokeDasharray="3 3" />
                <line x1="120" y1="120" x2="40" y2="90" stroke="#CBD5E1" strokeDasharray="3 3" />

                {/* Data Polygon */}
                <polygon
                  points="120,38 190,95 160,150 78,162 55,95"
                  fill="#0F766E"
                  fillOpacity="0.18"
                  stroke="#0F766E"
                  strokeWidth="2.5"
                />
                {/* Data Points */}
                <circle cx="120" cy="38" r="4" fill="#0F766E" />
                <circle cx="190" cy="95" r="4" fill="#0F766E" />
                <circle cx="160" cy="150" r="4" fill="#DC2626" />
                <circle cx="78" cy="162" r="4" fill="#D97706" />
                <circle cx="55" cy="95" r="4" fill="#0F766E" />
              </svg>
              <span className="text-[11px] font-medium text-slate-400 mt-2">
                4-Axis Principles Radar
              </span>
            </div>

            {/* Metrics Breakdown */}
            <div className="lg:col-span-7 space-y-5">
              {/* Metric 1 */}
              <div>
                <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                  <span className="text-[#1E293B]">Joint Budgeting</span>
                  <span className="text-[#0F766E] font-mono">90% Match</span>
                </div>
                <div className="grid grid-cols-12 gap-1">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-2 rounded-xs ${
                        i < 11 ? "bg-[#0F766E]" : "bg-slate-200"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Metric 2 */}
              <div>
                <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                  <span className="text-[#1E293B]">Investment Horizon</span>
                  <span className="text-[#0F766E] font-mono">85% Match</span>
                </div>
                <div className="grid grid-cols-12 gap-1">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-2 rounded-xs ${
                        i < 10 ? "bg-[#0F766E]" : "bg-slate-200"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Metric 3: Critical Conflict */}
              <div className="p-3 bg-red-50/60 rounded-xl border border-red-200/80">
                <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-red-900">Extended Family Support</span>
                    <span className="inline-flex items-center space-x-1 text-[10px] text-red-600 bg-red-100 px-2 py-0.5 rounded-full font-bold">
                      <AlertTriangle className="w-2.5 h-2.5" />
                      <span>Critical Conflict Detected</span>
                    </span>
                  </div>
                  <span className="text-red-700 font-mono">30% Match</span>
                </div>
                <div className="grid grid-cols-12 gap-1">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-2 rounded-xs ${
                        i < 4 ? "bg-red-600" : "bg-red-200/60"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Metric 4 */}
              <div>
                <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                  <span className="text-[#1E293B]">Debt Disclosure</span>
                  <span className="text-[#D97706] font-mono">67% Match</span>
                </div>
                <div className="grid grid-cols-12 gap-1">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-2 rounded-xs ${
                        i < 8 ? "bg-[#D97706]" : "bg-slate-200"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Where You Differ Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-[#1E293B]">Where you differ</h2>

          {/* Scenario 4 Card (Critical Conflict) */}
          <div className="bg-white rounded-2xl border-2 border-red-200 overflow-hidden shadow-xs">
            {/* Header Accordion Bar */}
            <div
              onClick={() => setAccordionOpenScenario4(!accordionOpenScenario4)}
              className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition border-b border-red-100"
            >
              <div className="flex items-center space-x-3">
                <span className="w-5 h-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs font-bold">
                  !
                </span>
                <span className="text-sm font-bold text-slate-800">
                  Scenario #4 · Urgent medical loan for parents
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200 font-mono">
                  30% Match
                </span>
                {accordionOpenScenario4 ? (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </div>
            </div>

            {/* Expanded Content */}
            {accordionOpenScenario4 && (
              <div className="p-6 space-y-6 bg-slate-50/40">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Bima chose */}
                  <div className="bg-white p-4.5 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="w-5 h-5 rounded-full bg-[#1E293B] text-white flex items-center justify-center text-[10px] font-bold">
                        B
                      </span>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                        BIMA CHOSE
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#1E293B] font-medium leading-relaxed">
                      Option A — Draw directly from our joint emergency savings, no questions asked.
                    </p>
                    <div className="text-xs font-mono font-bold text-[#0F766E] pt-1">
                      Monthly cap: IDR 4.000.000
                    </div>
                  </div>

                  {/* Sarah chose */}
                  <div className="bg-white p-4.5 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="w-5 h-5 rounded-full bg-[#0F766E] text-white flex items-center justify-center text-[10px] font-bold">
                        S
                      </span>
                      <span className="text-xs font-bold uppercase tracking-wider text-[#0F766E]">
                        SARAH CHOSE
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#1E293B] font-medium leading-relaxed">
                      Option C — Negotiate an affordable fixed cap, decline if it threatens primary family cashflow.
                    </p>
                    <div className="text-xs font-mono font-bold text-[#0F766E] pt-1">
                      Monthly cap: IDR 1.250.000
                    </div>
                  </div>
                </div>

                {/* Mediation Insight Quote */}
                <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/60 text-xs sm:text-sm font-serif-quote text-slate-700">
                  “Both answers come from care for family. The gap is about{" "}
                  <strong>how much</strong> and <strong>who decides</strong>.”
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => setModalOpen(true)}
                    className="px-5 py-2.5 bg-[#0F766E] hover:bg-[#0D625C] text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer"
                  >
                    <span>Open Resolution Dialogue</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => alert("Flagged for discussion during your next dinner date!")}
                    className="px-4 py-2.5 border border-[#E2E8F0] bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer"
                  >
                    <Flag className="w-3.5 h-3.5 text-slate-400" />
                    <span>Flag for In-Person Talk</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Scenario 9 Collapsible Accordion */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-xs">
            <div
              onClick={() => setAccordionOpenScenario9(!accordionOpenScenario9)}
              className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition"
            >
              <div className="flex items-center space-x-3">
                <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-bold">
                  !
                </span>
                <span className="text-sm font-bold text-slate-800">
                  Scenario #9 · Siblings’ tuition contributions
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200 font-mono">
                  45% Match
                </span>
                {accordionOpenScenario9 ? (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </div>
            </div>

            {accordionOpenScenario9 && (
              <div className="p-6 pt-2 text-xs sm:text-sm text-slate-600 border-t border-slate-100">
                <p>
                  Bima memilih bantuan wajib penuh dari anggaran bersama, sementara Sarah menyarankan pinjaman lunak sukarela bila anggaran primer sudah surplus.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Proceed to Charter */}
        <div className="flex justify-end pt-4">
          <button
            onClick={onProceedToCharter}
            className="px-6 py-3 bg-[#1E293B] hover:bg-[#0F172A] text-white font-semibold rounded-xl text-sm transition flex items-center space-x-2 cursor-pointer"
          >
            <span>Proceed to Mutual Living Charter</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </main>

      {/* MODAL: Resolution Dialogue (Matching Figma Page 9) */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 relative my-8">
            {/* Header info */}
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-red-100 text-red-700 border border-red-200 font-mono">
                  30% Match
                </span>
                <h3 className="text-lg font-bold text-[#1E293B] mt-2">
                  Discrepancy in Scenario #4 (Extended Family Allowance)
                </h3>
                <p className="text-xs font-mono text-slate-500 mt-1">
                  Bima’s cap: IDR 4.000.000 · Sarah’s cap: IDR 1.250.000
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mediator Suggestions */}
            <div className="space-y-3">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Neutral mediator suggestions
              </div>

              {/* Suggestion 1 */}
              <button
                type="button"
                onClick={() => setSelectedSuggestion(1)}
                className={`w-full text-left p-4 rounded-xl border transition flex items-center justify-between cursor-pointer ${
                  selectedSuggestion === 1
                    ? "bg-emerald-50/60 border-[#0F766E] ring-1 ring-[#0F766E]"
                    : "bg-white border-[#E2E8F0] hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center space-x-3 pr-2">
                  <span
                    className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-xs ${
                      selectedSuggestion === 1
                        ? "bg-[#0F766E] text-white"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    ✓
                  </span>
                  <span className="text-xs sm:text-sm font-medium text-slate-800">
                    Adopt the Tiered Safety Net: Max IDR 2,000,000/month for family support with quarterly reviews.
                  </span>
                </div>
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                    selectedSuggestion === 1
                      ? "border-[#0F766E] bg-[#0F766E]"
                      : "border-slate-300"
                  }`}
                >
                  {selectedSuggestion === 1 && (
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  )}
                </div>
              </button>

              {/* Suggestion 2 */}
              <button
                type="button"
                onClick={() => setSelectedSuggestion(2)}
                className={`w-full text-left p-4 rounded-xl border transition flex items-center justify-between cursor-pointer ${
                  selectedSuggestion === 2
                    ? "bg-emerald-50/60 border-[#0F766E] ring-1 ring-[#0F766E]"
                    : "bg-white border-[#E2E8F0] hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center space-x-3 pr-2">
                  <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs">
                    2
                  </span>
                  <span className="text-xs sm:text-sm font-medium text-slate-800">
                    Emergency-only rule: medical needs above IDR 5,000,000 are discussed together within 24 hours.
                  </span>
                </div>
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                    selectedSuggestion === 2
                      ? "border-[#0F766E] bg-[#0F766E]"
                      : "border-slate-300"
                  }`}
                >
                  {selectedSuggestion === 2 && (
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  )}
                </div>
              </button>

              {/* Suggestion 3 */}
              <button
                type="button"
                onClick={() => setSelectedSuggestion(3)}
                className={`w-full text-left p-4 rounded-xl border transition flex items-center justify-between cursor-pointer ${
                  selectedSuggestion === 3
                    ? "bg-emerald-50/60 border-[#0F766E] ring-1 ring-[#0F766E]"
                    : "bg-white border-[#E2E8F0] hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center space-x-3 pr-2">
                  <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs">
                    3
                  </span>
                  <span className="text-xs sm:text-sm font-medium text-slate-800">
                    Separate “Keluarga” pot: 7.5% of combined income, each partner manages their own side.
                  </span>
                </div>
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                    selectedSuggestion === 3
                      ? "border-[#0F766E] bg-[#0F766E]"
                      : "border-slate-300"
                  }`}
                >
                  {selectedSuggestion === 3 && (
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  )}
                </div>
              </button>
            </div>

            {/* Custom Agreement Input */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Custom agreement (optional)
              </label>
              <textarea
                rows={3}
                value={customAgreement}
                onChange={(e) => setCustomAgreement(e.target.value)}
                maxLength={280}
                placeholder="Write your tailored middle-ground terms..."
                className="w-full p-3 text-xs sm:text-sm rounded-xl border border-[#E2E8F0] focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E] outline-hidden resize-none"
              />
              <div className="text-right text-[11px] text-slate-400 mt-1 font-mono">
                {customAgreement.length}/280
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="w-full sm:w-auto px-4 py-2.5 border border-[#E2E8F0] hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 transition cursor-pointer"
              >
                <Flag className="w-3.5 h-3.5 text-slate-400" />
                <span>Flag for In-Person Talk</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setModalOpen(false);
                  onProceedToCharter();
                }}
                className="w-full sm:w-auto px-5 py-2.5 bg-[#0F766E] hover:bg-[#0D625C] text-white rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 transition shadow-xs cursor-pointer"
              >
                <span>Agree & Add to Living Charter</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
