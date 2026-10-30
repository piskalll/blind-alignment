"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Lock, ShieldCheck, Check, PenLine, Plus } from "lucide-react";
import { toast } from "sonner";
import { AppHeader } from "./AppHeader";
import { SCENARIOS, getModuleMeta } from "../data/scenarios";
import {
  isScenarioAnswered,
  useRoom,
  type OptionKey,
} from "../lib/sessionStore";

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
  const {
    room,
    myName,
    partnerName,
    me,
    customScenarios,
    saveAnswer,
    lockAnswers,
  } = useRoom();
  const [index, setIndex] = useState(0);

  const roomCode = room?.code || "VWS-000";
  const encodedRoom = encodeURIComponent(roomCode);
  const currentModule = getModuleMeta(moduleId);

  const scenariosToUse =
    moduleId === 5
      ? customScenarios
      : (() => {
          const filtered = SCENARIOS.filter((s) => s.moduleId === moduleId);
          return filtered.length > 0 ? filtered : SCENARIOS.slice(0, 10);
        })();

  if (moduleId === 5 && scenariosToUse.length === 0) {
    return (
      <div className="min-h-screen bg-[#F8FAF7] text-[#1E293B] flex flex-col">
        <AppHeader
          roomCode={roomCode}
          moduleId={5}
          progressText="Modul 5: Bank Soal Kustom Kosong"
          isEncrypted={true}
          userNames={`${myName || "Anda"} & ${partnerName || "Pasangan"}`}
        />
        <main className="max-w-xl w-full mx-auto px-4 sm:px-6 py-16 my-auto">
          <div className="bg-[#FFFFFF] border border-[#CBD5E1] rounded-2xl p-6 sm:p-8 space-y-5 text-center">
            <div className="w-12 h-12 rounded-xl bg-[#F0FDFA] border border-[#99F6E4] text-[#0F766E] flex items-center justify-center mx-auto">
              <PenLine className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#0F766E] block">
                MODUL 05 · PERTANYAAN KUSTOM PASANGAN
              </span>
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#1E293B]">
                Belum Ada Pertanyaan Kustom di Ruang {roomCode}
              </h1>
              <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                Susun minimal 1 pertanyaan kustom (Pilihan A/B/C atau Esai
                Terbuka) pada Studio Soal Kustom sebelum mengisi jawaban
                tersegel bersama pasangan.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href={`/room/${encodedRoom}/custom`}
                className="min-h-[46px] px-5 py-2.5 rounded-lg bg-[#0F766E] hover:bg-[#115E59] text-[#FFFFFF] text-xs sm:text-sm font-bold inline-flex items-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4 shrink-0" />
                <span>Buat Pertanyaan Kustom Sekarang</span>
              </Link>
              <button
                type="button"
                onClick={onBack}
                className="min-h-[46px] px-4 py-2.5 rounded-lg border border-[#CBD5E1] bg-[#FFFFFF] hover:bg-[#F1F5F9] text-[#1E293B] text-xs sm:text-sm font-bold cursor-pointer"
              >
                Kembali ke Dashboard
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const safeIndex = Math.min(index, Math.max(0, scenariosToUse.length - 1));
  const scenario = scenariosToUse[safeIndex] || scenariosToUse[0];
  const isLast = safeIndex === scenariosToUse.length - 1;
  const isEssay = scenario.questionType === "essay";

  const answer = me?.answers[scenario.id] ?? {};
  const choice = answer.choice;
  const essayText = answer.essayText ?? "";
  const amount = answer.amount ?? scenario.slider?.defaultValue;
  const note = answer.note ?? "";

  const isCurrentAnswered = isScenarioAnswered(scenario, answer);
  const answeredCount = scenariosToUse.filter((s) =>
    isScenarioAnswered(s, me?.answers[s.id])
  ).length;

  const update = (patch: Partial<typeof answer>) =>
    saveAnswer(scenario.id, { ...answer, ...patch });

  const handleNext = () => {
    if (!isCurrentAnswered) return;
    if (!isEssay && scenario.slider && answer.amount === undefined) {
      update({ amount });
    }
    if (isLast) {
      const firstUnansweredIdx = scenariosToUse.findIndex((s) => {
        if (s.id === scenario.id) return false;
        return !isScenarioAnswered(s, me?.answers[s.id]);
      });
      if (firstUnansweredIdx !== -1) {
        setIndex(firstUnansweredIdx);
        toast.info(
          `Lengkapi jawaban Skenario #${firstUnansweredIdx + 1} terlebih dahulu sebelum menyegel Modul ${moduleId}.`
        );
        return;
      }
      lockAnswers(moduleId);
      onFinish();
    } else {
      setIndex(safeIndex + 1);
    }
  };

  const handleBack = () =>
    safeIndex === 0 ? onBack() : setIndex(safeIndex - 1);

  return (
    <div className="min-h-screen bg-[#F8FAF7] text-[#1E293B] flex flex-col">
      <AppHeader
        roomCode={roomCode}
        moduleId={moduleId}
        progressText={`Modul ${moduleId} · Skenario ${safeIndex + 1}/${scenariosToUse.length}`}
        isEncrypted={true}
        userNames={`${myName || "Anda"} & ${partnerName || "Pasangan"}`}
      />

      {/* Progress Bar & Scenario Jump Strip */}
      <div className="bg-[#FFFFFF] border-b border-[#E2E8F0]">
        <div className="w-full bg-[#E2E8F0] h-1.5">
          <div
            className="bg-[#0F766E] h-1.5 transition-all duration-200"
            style={{
              width: `${((safeIndex + 1) / scenariosToUse.length) * 100}%`,
            }}
          />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
            {scenariosToUse.map((sc, i) => {
              const isCurrent = i === safeIndex;
              const isAnswered = isScenarioAnswered(sc, me?.answers[sc.id]);
              return (
                <button
                  key={sc.id}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Buka skenario ${i + 1}`}
                  aria-current={isCurrent ? "step" : undefined}
                  className={`min-w-[44px] min-h-[44px] sm:min-w-[36px] sm:min-h-[34px] px-2.5 rounded-md font-mono text-xs font-bold border transition-colors cursor-pointer flex items-center justify-center gap-1 ${
                    isCurrent
                      ? "bg-[#0F766E] text-[#FFFFFF] border-[#0F766E]"
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

          <div className="flex items-center flex-wrap gap-3 text-xs font-semibold text-[#475569]">
            <span className="font-mono">
              {answeredCount}/{scenariosToUse.length} Terjawab
            </span>
            {moduleId === 5 && (
              <Link
                href={`/room/${encodedRoom}/custom`}
                className="text-[#0F766E] hover:underline font-bold inline-flex items-center gap-1"
              >
                <PenLine className="w-3.5 h-3.5" />
                <span>Kelola Soal</span>
              </Link>
            )}
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
          {moduleId === 5 && (
            <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-[#FFFFFF] text-[#1E293B] border border-[#CBD5E1]">
              {isEssay ? "Esai Terbuka" : "Pilihan A / B / C"}
            </span>
          )}
          <span className="text-xs font-bold px-2.5 py-1 rounded bg-[#F0FDFA] text-[#0F766E] border border-[#CCFBF1] flex items-center gap-1">
            <Lock className="w-3 h-3" />
            <span>Tersegel Privat</span>
          </span>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E293B] tracking-tight leading-snug">
            Skenario #{safeIndex + 1}: {scenario.title}
          </h1>
          {scenario.description && (
            <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
              {scenario.description}
            </p>
          )}
        </div>

        {isEssay ? (
          <div className="bg-[#FFFFFF] rounded-xl p-5 sm:p-6 border-2 border-[#CBD5E1] focus-within:border-[#0F766E] space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <label
                htmlFor="essay-answer"
                className="text-xs font-bold uppercase tracking-wider text-[#1E293B]"
              >
                Jawaban Esai Terbuka Anda (Wajib Diisi)
              </label>
              <span className="font-mono text-xs font-semibold text-[#475569]">
                {essayText.trim().length}/1000 karakter
              </span>
            </div>

            <div className="p-3 rounded-lg bg-[#F0FDFA] border border-[#CCFBF1] flex items-start gap-2 text-xs text-[#0F766E] font-medium">
              <Lock className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>
                Jawaban tertulis Anda disegel dan tidak dapat dilihat oleh{" "}
                <strong>{partnerName || "Pasangan"}</strong> sampai kalian
                berdua mengunci seluruh soal Modul {moduleId}.
              </span>
            </div>

            <textarea
              id="essay-answer"
              value={essayText}
              onChange={(e) => update({ essayText: e.target.value })}
              rows={5}
              maxLength={1000}
              placeholder="Tuliskan pandangan, harapan, atau batasan yang paling jujur menurut Anda untuk dibahas bersama pasangan..."
              className="w-full p-3.5 text-sm sm:text-base rounded-lg border border-[#CBD5E1] bg-[#F8FAF7] text-[#1E293B] focus:border-[#0F766E] leading-relaxed"
            />
          </div>
        ) : (
          <>
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
          </>
        )}
      </main>

      <footer className="w-full bg-[#FFFFFF] border-t border-[#E2E8F0] px-4 sm:px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleBack}
            className="min-h-[44px] px-4 py-2.5 border border-[#CBD5E1] bg-[#FFFFFF] hover:bg-[#F1F5F9] text-[#1E293B] text-xs font-bold rounded-lg transition-colors cursor-pointer"
          >
            {safeIndex === 0 ? "Kembali ke Dashboard" : "Skenario Sebelumnya"}
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={!isCurrentAnswered}
            className="min-h-[44px] px-6 py-2.5 bg-[#0F766E] hover:bg-[#115E59] disabled:opacity-40 disabled:cursor-not-allowed text-[#FFFFFF] text-xs font-bold rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
          >
            {isLast ? (
              <>
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>
                  Kunci &amp; Segel {scenariosToUse.length} Jawaban Modul{" "}
                  {moduleId}
                </span>
              </>
            ) : (
              <span>Simpan &amp; Lanjut ke Skenario #{safeIndex + 2}</span>
            )}
          </button>
        </div>
      </footer>
    </div>
  );
};
