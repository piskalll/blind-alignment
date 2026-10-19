"use client";

import React, { useState } from "react";
import { Lock, ShieldCheck, Check } from "lucide-react";
import { AppHeader } from "./AppHeader";
import { SCENARIOS, MODULES } from "../data/scenarios";
import { useRoom, OptionKey } from "../lib/sessionStore";

interface DilemmaRunnerProps {
  onBack: () => void;
  onFinish: () => void;
  moduleId?: number;
}

const formatIDR = (val: number) => "Rp " + val.toLocaleString("id-ID");

export const DilemmaRunnerPage: React.FC<DilemmaRunnerProps> = ({
  onBack,
  onFinish,
  moduleId = 1,
}) => {
  const { room, myName, partnerName, me, saveAnswer, lockAnswers } = useRoom();
  const [index, setIndex] = useState(0);

  const roomCode = room?.code || "VWS-000";
  const currentModule = MODULES.find((m) => m.id === moduleId) || MODULES[0];
  const moduleScenarios = SCENARIOS.filter((s) => s.moduleId === moduleId);
  const scenariosToUse =
    moduleScenarios.length > 0 ? moduleScenarios : SCENARIOS.slice(0, 10);

  const scenario = scenariosToUse[index] || scenariosToUse[0];
  const isLast = index === scenariosToUse.length - 1;
  const answer = me?.answers[scenario.id] ?? {};
  const choice = answer.choice;
  const amount = answer.amount ?? scenario.slider?.defaultValue;
  const note = answer.note ?? "";

  const answeredCount = scenariosToUse.filter(
    (s) => me?.answers[s.id]?.choice !== undefined
  ).length;

  const update = (patch: Partial<typeof answer>) =>
    saveAnswer(scenario.id, { ...answer, ...patch });

  const handleNext = () => {
    if (!choice) return;
    if (scenario.slider && answer.amount === undefined) update({ amount });
    if (isLast) {
      lockAnswers(moduleId);
      onFinish();
    } else {
      setIndex(index + 1);
    }
  };

  const handleBack = () => (index === 0 ? onBack() : setIndex(index - 1));

  return (
    <div className="min-h-screen bg-[#F8FAF7] text-[#1E293B] flex flex-col">
      <AppHeader
        roomCode={roomCode}
        moduleId={moduleId}
        progressText={`Modul ${moduleId} · Skenario ${index + 1}/${scenariosToUse.length}`}
        isEncrypted={true}
        userNames={`${myName || "Anda"} & ${partnerName || "Pasangan"}`}
      />

      {/* Progress Bar & 1-10 Scenario Jump Strip */}
      <div className="bg-[#FFFFFF] border-b border-[#E2E8F0]">
        <div className="w-full bg-[#E2E8F0] h-1.5">
          <div
            className="bg-[#0F766E] h-1.5 transition-all duration-200"
            style={{
              width: `${((index + 1) / scenariosToUse.length) * 100}%`,
            }}
          />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
            {scenariosToUse.map((sc, i) => {
              const isCurrent = i === index;
              const isAnswered = me?.answers[sc.id]?.choice !== undefined;
              return (
                <button
                  key={sc.id}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Buka skenario ${i + 1}`}
                  aria-current={isCurrent ? "step" : undefined}
                  className={`min-w-[34px] h-8 px-2 rounded-md font-mono text-xs font-bold border transition-colors cursor-pointer flex items-center justify-center gap-1 ${
                    isCurrent
                      ? "bg-[#1E293B] text-[#FFFFFF] border-[#1E293B]"
                      : isAnswered
                      ? "bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]"
                      : "bg-[#F8FAF7] text-[#475569] border-[#CBD5E1] hover:text-[#1E293B]"
                  }`}
                >
                  <span>{i + 1}</span>
                  {isAnswered && !isCurrent && (
                    <Check className="w-3 h-3 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3 text-xs font-semibold text-[#475569]">
            <span className="font-mono">
              {answeredCount}/{scenariosToUse.length} Terjawab
            </span>
            <button
              type="button"
              onClick={onBack}
              className="text-[#0F766E] hover:underline font-bold cursor-pointer"
            >
              Simpan &amp; Ke Dashboard
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-3xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-10 flex-1 space-y-6">
        <div className="flex items-center flex-wrap gap-2">
          <span className="font-mono text-xs font-bold uppercase px-2.5 py-1 rounded bg-[#F1F5F9] text-[#1E293B] border border-[#CBD5E1]">
            MODUL 0{moduleId} · {currentModule.title}
          </span>
          <span className="text-xs font-bold px-2.5 py-1 rounded bg-[#FFFBEB] text-[#92400E] border border-[#FDE68A]">
            {scenario.categoryLabel}
          </span>
          <span className="text-xs font-bold px-2.5 py-1 rounded bg-[#F0FDFA] text-[#0F766E] border border-[#CCFBF1] flex items-center gap-1">
            <Lock className="w-3 h-3" />
            <span>Tersegel Privat</span>
          </span>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E293B] tracking-tight leading-snug">
            Skenario #{index + 1}: {scenario.title}
          </h1>
          {scenario.description && (
            <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
              {scenario.description}
            </p>
          )}
        </div>

        <div
          role="radiogroup"
          aria-label={`Pilihan keputusan untuk ${scenario.title}`}
          className="space-y-3"
        >
          {scenario.options.map((opt) => {
            const selected = choice === opt.key;
            return (
              <button
                key={opt.key}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => update({ choice: opt.key as OptionKey })}
                className={`w-full text-left p-4 sm:p-5 rounded-xl border-2 transition-colors flex items-start sm:items-center justify-between gap-4 cursor-pointer ${
                  selected
                    ? "bg-[#F0FDFA] border-[#0F766E]"
                    : "bg-[#FFFFFF] border-[#CBD5E1] hover:border-[#475569]"
                }`}
              >
                <div className="flex items-start sm:items-center gap-3.5">
                  <span
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-sm shrink-0 ${
                      selected
                        ? "bg-[#0F766E] text-[#FFFFFF]"
                        : "bg-[#F1F5F9] text-[#1E293B] border border-[#CBD5E1]"
                    }`}
                  >
                    {opt.key}
                  </span>
                  <span className="text-sm sm:text-base font-semibold text-[#1E293B] leading-snug">
                    {opt.text}
                  </span>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-1 sm:mt-0 ${
                    selected
                      ? "border-[#0F766E] bg-[#0F766E]"
                      : "border-[#475569]"
                  }`}
                >
                  {selected && (
                    <div className="w-2 h-2 rounded-full bg-[#FFFFFF]" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {scenario.slider && amount !== undefined && (
          <div className="bg-[#FFFFFF] rounded-xl p-5 border border-[#CBD5E1] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <label
                  htmlFor="scenario-slider"
                  className="text-xs font-bold uppercase tracking-wider text-[#1E293B] block"
                >
                  {scenario.slider.label}
                </label>
                <div className="text-xs text-[#475569] flex items-center gap-1 mt-0.5 font-medium">
                  <Lock className="w-3 h-3 text-[#0F766E]" />
                  <span>Nominal dirahasiakan hingga segel terbuka</span>
                </div>
              </div>
              <div className="font-mono font-bold text-[#0F766E] text-lg tabular-nums">
                {formatIDR(amount)}
              </div>
            </div>
            <input
              id="scenario-slider"
              type="range"
              min={scenario.slider.min}
              max={scenario.slider.max}
              step={scenario.slider.step}
              value={amount}
              onChange={(e) => update({ amount: Number(e.target.value) })}
              className="w-full accent-[#0F766E] h-2 bg-[#E2E8F0] rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-xs font-mono font-medium text-[#475569] tabular-nums">
              <span>{formatIDR(scenario.slider.min)}</span>
              <span>{formatIDR(scenario.slider.max)}</span>
            </div>
          </div>
        )}

        <div className="space-y-1.5">
          <label
            className="text-xs font-bold uppercase tracking-wider text-[#1E293B] block"
            htmlFor="note"
          >
            Catatan Pertimbangan Pribadi (Opsional)
          </label>
          <textarea
            id="note"
            value={note}
            onChange={(e) => update({ note: e.target.value })}
            rows={3}
            placeholder="Tuliskan alasan atau kondisi khusus Anda. Catatan ini baru ditampilkan kepada pasangan setelah kedua pihak mengunci jawaban."
            className="w-full p-3.5 text-sm rounded-lg border border-[#CBD5E1] bg-[#FFFFFF] text-[#1E293B] focus:border-[#0F766E]"
          />
        </div>
      </main>

      <footer className="w-full bg-[#FFFFFF] border-t border-[#E2E8F0] px-4 sm:px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleBack}
            className="min-h-[44px] px-4 py-2.5 border border-[#CBD5E1] bg-[#FFFFFF] hover:bg-[#F1F5F9] text-[#1E293B] text-xs font-bold rounded-lg transition-colors cursor-pointer"
          >
            {index === 0 ? "Kembali ke Pengantar" : "Skenario Sebelumnya"}
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={!choice}
            className="min-h-[44px] px-6 py-2.5 bg-[#0F766E] hover:bg-[#115E59] disabled:opacity-40 disabled:cursor-not-allowed text-[#FFFFFF] text-xs font-bold rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
          >
            {isLast ? (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Kunci &amp; Segel 10 Jawaban Modul {moduleId}</span>
              </>
            ) : (
              <span>Simpan &amp; Lanjut ke Skenario #{index + 2}</span>
            )}
          </button>
        </div>
      </footer>
    </div>
  );
};
