"use client";

import React, { useState, useMemo } from "react";
import { AppHeader } from "./AppHeader";
import {
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Flag,
  ArrowRight,
  X,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { useRoom } from "../lib/sessionStore";
import { computeAlignment } from "../lib/scoring";
import { SCENARIOS } from "../data/scenarios";

interface AlignmentResultProps {
  onProceedToCharter: () => void;
  onBackToDashboard: () => void;
  moduleId?: number;
}

export const AlignmentResultPage: React.FC<AlignmentResultProps> = ({
  onProceedToCharter,
  onBackToDashboard,
  moduleId = 1,
}) => {
  const { room, myName, partnerName, me, partnerAnswers, bothLocked, saveCompromise } = useRoom();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedScenarioForModal, setSelectedScenarioForModal] = useState<number>(4);
  const [selectedSuggestion, setSelectedSuggestion] = useState(1);
  const [customAgreement, setCustomAgreement] = useState("");
  const [openAccordions, setOpenAccordions] = useState<Record<number, boolean>>({
    4: true,
  });

  const toggleAccordion = (id: number) => {
    setOpenAccordions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Hitung skor dinamis menggunakan computeAlignment
  const alignment = useMemo(() => {
    if (!me?.answers || !partnerAnswers) {
      return null;
    }
    return computeAlignment(me.answers, partnerAnswers, moduleId);
  }, [me?.answers, partnerAnswers, moduleId]);

  const overallScore = alignment ? alignment.overall : 68;
  const categories = alignment ? alignment.byCategory : {
    "Debt Ratio": 75,
    "Parental Allowance": 45,
    "Emergency Fund": 80,
  };

  const criticalScenarios = alignment
    ? alignment.results.filter((r) => r.critical)
    : [];

  const alignedScenarios = alignment
    ? alignment.results.filter((r) => !r.critical)
    : [];

  const formatIDR = (val?: number) =>
    val ? "IDR " + val.toLocaleString("id-ID") : "";

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex flex-col relative">
      <AppHeader
        roomCode={room?.code || "VWS-000"}
        progressText="Dual Reveal: Completed"
        isEncrypted={true}
        userNames={`${myName || "You"} & ${partnerName || "Partner"}`}
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

            <div className={`flex items-center space-x-3 px-5 py-3 rounded-2xl shrink-0 border ${
              overallScore >= 70
                ? "bg-emerald-50/60 border-emerald-200/80"
                : overallScore >= 50
                ? "bg-amber-50/60 border-amber-200/80"
                : "bg-red-50/60 border-red-200/80"
            }`}>
              <span className={`text-3xl sm:text-4xl font-extrabold font-mono ${
                overallScore >= 70
                  ? "text-[#0F766E]"
                  : overallScore >= 50
                  ? "text-[#D97706]"
                  : "text-[#DC2626]"
              }`}>
                {overallScore}%
              </span>
              <span className="text-xs font-bold text-slate-700 leading-tight">
                Overall <br />
                Aligned
              </span>
            </div>
          </div>

          {/* Category Breakdown Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-8">
            {/* SVG Visual Meter */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-slate-50/60 rounded-2xl border border-slate-100">
              <div className="relative w-44 h-44 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#E2E8F0"
                    strokeWidth="10"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke={overallScore >= 70 ? "#0F766E" : overallScore >= 50 ? "#D97706" : "#DC2626"}
                    strokeWidth="10"
                    strokeDasharray="251.2"
                    strokeDashoffset={251.2 - (251.2 * overallScore) / 100}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-3xl font-extrabold text-[#1E293B] font-mono">
                    {overallScore}%
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Consensus
                  </span>
                </div>
              </div>
              <div className="text-xs text-center text-slate-500 mt-3 max-w-xs">
                {criticalScenarios.length > 0
                  ? `${criticalScenarios.length} critical differences need a mutual compromise before signing.`
                  : "Great alignment across all financial scenarios!"}
              </div>
            </div>

            {/* Pillar Breakdown list */}
            <div className="lg:col-span-7 space-y-4">
              <h2 className="text-xs font-mono font-bold tracking-widest text-[#475569] uppercase mb-4">
                Pillar match breakdown
              </h2>

              {Object.entries(categories).map(([category, score]) => {
                const color =
                  score >= 70 ? "bg-[#0F766E]" : score >= 50 ? "bg-[#D97706]" : "bg-[#DC2626]";
                const textColor =
                  score >= 70 ? "text-[#0F766E]" : score >= 50 ? "text-[#D97706]" : "text-[#DC2626]";

                return (
                  <div key={category}>
                    <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                      <span className="text-[#1E293B]">{category}</span>
                      <span className={`${textColor} font-mono`}>{score}% Match</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${color} transition-all duration-500`}
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Where You Differ Section (Conflicts) */}
        {criticalScenarios.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <h2 className="text-lg font-bold text-[#1E293B]">
                Where you differ ({criticalScenarios.length} Critical Conflict{criticalScenarios.length > 1 ? "s" : ""})
              </h2>
            </div>

            {criticalScenarios.map(({ scenario, score }) => {
              const myAns = me?.answers[scenario.id];
              const partnerAns = partnerAnswers?.[scenario.id];
              const isOpen = openAccordions[scenario.id] ?? false;

              const myOpt = scenario.options.find((o) => o.key === myAns?.choice);
              const partnerOpt = scenario.options.find((o) => o.key === partnerAns?.choice);

              return (
                <div
                  key={scenario.id}
                  className="bg-white rounded-2xl border-2 border-red-200 overflow-hidden shadow-xs"
                >
                  {/* Header Accordion Bar */}
                  <div
                    onClick={() => toggleAccordion(scenario.id)}
                    className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition border-b border-red-100"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="w-5 h-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs font-bold">
                        !
                      </span>
                      <span className="text-sm font-bold text-slate-800">
                        Scenario #{scenario.id} · {scenario.title}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200 font-mono">
                        {score}% Match
                      </span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {isOpen && (
                    <div className="p-6 space-y-6 bg-slate-50/40">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* You chose */}
                        <div className="bg-white p-4.5 rounded-xl border border-slate-200 space-y-2">
                          <div className="flex items-center space-x-2">
                            <span className="w-5 h-5 rounded-full bg-[#1E293B] text-white flex items-center justify-center text-[10px] font-bold">
                              {myName?.[0]?.toUpperCase() || "Y"}
                            </span>
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                              {myName || "YOU"} CHOSE
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm text-[#1E293B] font-medium leading-relaxed">
                            Option {myAns?.choice} — {myOpt?.text || "Not answered"}
                          </p>
                          {myAns?.amount && (
                            <div className="text-xs font-mono font-bold text-[#0F766E] pt-1">
                              Allocation: {formatIDR(myAns.amount)}
                            </div>
                          )}
                          {myAns?.note && (
                            <div className="text-xs text-slate-500 italic pt-1 border-t border-slate-100">
                              &ldquo;{myAns.note}&rdquo;
                            </div>
                          )}
                        </div>

                        {/* Partner chose */}
                        <div className="bg-white p-4.5 rounded-xl border border-slate-200 space-y-2">
                          <div className="flex items-center space-x-2">
                            <span className="w-5 h-5 rounded-full bg-[#0F766E] text-white flex items-center justify-center text-[10px] font-bold">
                              {partnerName?.[0]?.toUpperCase() || "P"}
                            </span>
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                              {partnerName || "PARTNER"} CHOSE
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm text-[#1E293B] font-medium leading-relaxed">
                            Option {partnerAns?.choice} — {partnerOpt?.text || "Not answered"}
                          </p>
                          {partnerAns?.amount && (
                            <div className="text-xs font-mono font-bold text-[#0F766E] pt-1">
                              Allocation: {formatIDR(partnerAns.amount)}
                            </div>
                          )}
                          {partnerAns?.note && (
                            <div className="text-xs text-slate-500 italic pt-1 border-t border-slate-100">
                              &ldquo;{partnerAns.note}&rdquo;
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Bridge Callout */}
                      <div className="bg-white p-5 rounded-xl border border-[#0F766E]/30 space-y-3">
                        <div className="flex items-center space-x-2 text-[#0F766E] text-xs font-bold uppercase tracking-wider">
                          <Sparkles className="w-4 h-4" />
                          <span>Neutral Compromise Suggestion</span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-serif-quote italic">
                          &ldquo;Both perspectives stem from care for financial security and family duty.
                          Bridging this gap requires clear rules on notification and emergency caps.&rdquo;
                        </p>
                        <div className="pt-2">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedScenarioForModal(scenario.id);
                              setModalOpen(true);
                            }}
                            className="px-4 py-2 bg-[#0F766E] hover:bg-[#0D625C] text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer"
                          >
                            <span>Open Compromise Options</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Aligned Scenarios List */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-[#1E293B]">
            Where you aligned ({alignedScenarios.length} Scenarios)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {alignedScenarios.map(({ scenario, score }) => {
              const myAns = me?.answers[scenario.id];
              return (
                <div
                  key={scenario.id}
                  className="bg-white p-4 rounded-xl border border-emerald-200/60 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#0F766E] shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-slate-800">
                        #{scenario.id}: {scenario.title}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Both chose: Option {myAns?.choice || "A"}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#0F766E] px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-100">
                    {score}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Proceed Bar */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-200">
          <button
            onClick={onBackToDashboard}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            ← Back to Dashboard
          </button>
          <button
            onClick={onProceedToCharter}
            className="px-6 py-3 bg-[#0F766E] hover:bg-[#0D625C] text-white rounded-xl text-sm font-semibold flex items-center space-x-2 shadow-md cursor-pointer"
          >
            <span>Proceed to Living Charter</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </main>

      {/* Compromise Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-[#1E293B]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-7 space-y-6 shadow-2xl border border-slate-200">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold">
                  Compromise Engine · Scenario #{selectedScenarioForModal}
                </span>
                <h3 className="text-lg font-bold text-[#1E293B] mt-0.5">
                  Reach a Mutual Middle Ground
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {[
                "Fixed Emergency Limit: Draw from joint account up to IDR 2.000.000, any excess requires 24h discussion.",
                "Discretionary Split: 50% from joint emergency savings, 50% from personal discretionary allowance over 3 months.",
                "Dedicated Family Pot: Allocate 7.5% of combined monthly take-home pay strictly for extended family requests.",
              ].map((optText, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedSuggestion(idx + 1)}
                  className={`w-full text-left p-4 rounded-xl border transition flex items-center justify-between cursor-pointer ${
                    selectedSuggestion === idx + 1
                      ? "border-[#0F766E] bg-emerald-50/40 ring-1 ring-[#0F766E]"
                      : "border-[#E2E8F0] hover:bg-slate-50"
                  }`}
                >
                  <span className="text-xs sm:text-sm font-medium text-slate-800">
                    {optText}
                  </span>
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ml-3 ${
                      selectedSuggestion === idx + 1
                        ? "border-[#0F766E] bg-[#0F766E]"
                        : "border-slate-300"
                    }`}
                  >
                    {selectedSuggestion === idx + 1 && (
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Custom Agreement Input */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Custom agreement terms (optional)
              </label>
              <textarea
                rows={2}
                value={customAgreement}
                onChange={(e) => setCustomAgreement(e.target.value)}
                maxLength={280}
                placeholder="Write your custom terms..."
                className="w-full p-3 text-xs rounded-xl border border-[#E2E8F0] focus:border-[#0F766E] outline-hidden resize-none"
              />
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 border border-[#E2E8F0] text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const optionsMap: Record<number, string> = {
                    1: "Fixed Emergency Limit: Draw from joint account up to IDR 2.000.000, any excess requires 24h discussion.",
                    2: "Discretionary Split: 50% from joint emergency savings, 50% from personal discretionary allowance over 3 months.",
                    3: "Dedicated Family Pot: Allocate 7.5% of combined monthly take-home pay strictly for extended family requests.",
                  };
                  const text = customAgreement.trim() || optionsMap[selectedSuggestion];
                  const sc = SCENARIOS.find((s) => s.id === selectedScenarioForModal);
                  saveCompromise({
                    scenarioId: selectedScenarioForModal,
                    title: sc?.title || `Scenario #${selectedScenarioForModal}`,
                    agreementText: text,
                  });
                  setModalOpen(false);
                  onProceedToCharter();
                }}
                className="px-5 py-2 bg-[#0F766E] hover:bg-[#0D625C] text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                Save & Add to Living Charter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
