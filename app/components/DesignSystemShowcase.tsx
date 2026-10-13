"use client";

import React, { useState } from "react";
import {
  Lock,
  Shield,
  Check,
  AlertCircle,
  Clock,
  EyeOff,
  FileText,
  Download,
  Flag,
  BookOpen,
  Bell,
  Sparkles,
  ArrowRight,
  ChevronRight,
  X,
  ArrowLeft,
} from "lucide-react";

export const DesignSystemShowcase: React.FC = () => {
  const [inputValue, setInputValue] = useState("bima@salingpaham.id");
  const [codeValue, setCodeValue] = useState("SRH-482");
  const [errorCodeValue, setErrorCodeValue] = useState("ABC");
  const [selectedChoice, setSelectedChoice] = useState<string>("B");

  return (
    <div className="min-h-screen bg-[#F1F5F9] p-6 sm:p-12 space-y-12 max-w-6xl mx-auto">
      {/* Design System Header */}
      <div className="border-b border-[#E2E8F0] pb-6 space-y-2">
        <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#0F766E]">
          VowSync / SalingPaham UI Guideline & Components
        </div>
        <h1 className="text-3xl font-extrabold text-[#1E293B]">
          Design System & Component Library (Pages 2 & 3)
        </h1>
        <p className="text-sm text-[#475569]">
          Two-tier token architecture, Plus Jakarta Sans, Newsreader Serif, JetBrains Mono, 8pt spacing grid.
        </p>
      </div>

      {/* 01 COLOR TOKENS */}
      <section className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E2E8F0] shadow-xs space-y-6">
        <div>
          <span className="text-xs font-mono font-bold text-slate-400">01</span>
          <h2 className="text-xl font-bold text-[#1E293B]">Color Tokens (Tier 1 & Tier 2)</h2>
        </div>

        {/* Primitive Swatches */}
        <div>
          <div className="text-xs font-bold uppercase text-slate-500 mb-3 tracking-wider">
            Tier 1 · Primitive
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="rounded-xl overflow-hidden border border-slate-200 shadow-2xs">
              <div className="h-16 bg-[#1E293B]" />
              <div className="p-3 text-xs bg-white">
                <div className="font-bold text-[#1E293B]">Navy</div>
                <div className="font-mono text-slate-400">#1E293B</div>
                <div className="text-[11px] text-slate-500 mt-1">Structure, headings, trust</div>
              </div>
            </div>

            <div className="rounded-xl overflow-hidden border border-slate-200 shadow-2xs">
              <div className="h-16 bg-[#0F766E]" />
              <div className="p-3 text-xs bg-white">
                <div className="font-bold text-[#0F766E]">Emerald</div>
                <div className="font-mono text-slate-400">#0F766E</div>
                <div className="text-[11px] text-slate-500 mt-1">Primary action, aligned</div>
              </div>
            </div>

            <div className="rounded-xl overflow-hidden border border-slate-200 shadow-2xs">
              <div className="h-16 bg-[#D97706]" />
              <div className="p-3 text-xs bg-white">
                <div className="font-bold text-[#D97706]">Amber</div>
                <div className="font-mono text-slate-400">#D97706</div>
                <div className="text-[11px] text-slate-500 mt-1">In progress, caution</div>
              </div>
            </div>

            <div className="rounded-xl overflow-hidden border border-slate-200 shadow-2xs">
              <div className="h-16 bg-[#DC2626]" />
              <div className="p-3 text-xs bg-white">
                <div className="font-bold text-[#DC2626]">Crimson</div>
                <div className="font-mono text-slate-400">#DC2626</div>
                <div className="text-[11px] text-slate-500 mt-1">Conflict, errors</div>
              </div>
            </div>
          </div>
        </div>

        {/* Semantic Tokens Table */}
        <div className="pt-2">
          <div className="text-xs font-bold uppercase text-slate-500 mb-3 tracking-wider">
            Tier 2 · Semantic
          </div>
          <div className="border border-[#E2E8F0] rounded-xl overflow-hidden divide-y divide-[#E2E8F0] text-xs">
            <div className="flex items-center justify-between p-3 bg-slate-50 font-mono text-[11px]">
              <span className="font-bold text-slate-700">Token</span>
              <span className="text-slate-500">Usage</span>
              <span className="text-slate-400">Hex</span>
            </div>
            <div className="flex items-center justify-between p-3">
              <span className="font-mono text-slate-800">--color-surface-primary</span>
              <span className="text-slate-600">Cards, sheets</span>
              <span className="font-mono font-bold text-slate-500">#FFFFFF</span>
            </div>
            <div className="flex items-center justify-between p-3">
              <span className="font-mono text-slate-800">--color-surface-subtle</span>
              <span className="text-slate-600">App canvas</span>
              <span className="font-mono font-bold text-slate-500">#F1F5F9</span>
            </div>
            <div className="flex items-center justify-between p-3">
              <span className="font-mono text-slate-800">--color-text-default</span>
              <span className="text-slate-600">Body & headings</span>
              <span className="font-mono font-bold text-slate-500">#1E293B</span>
            </div>
            <div className="flex items-center justify-between p-3">
              <span className="font-mono text-slate-800">--color-text-muted</span>
              <span className="text-slate-600">Secondary copy — 7.6:1</span>
              <span className="font-mono font-bold text-slate-500">#475569</span>
            </div>
            <div className="flex items-center justify-between p-3">
              <span className="font-mono text-slate-800">--color-status-aligned</span>
              <span className="text-[#0F766E] font-medium">Match ≥ 70%</span>
              <span className="font-mono font-bold text-[#0F766E]">#0F766E</span>
            </div>
            <div className="flex items-center justify-between p-3">
              <span className="font-mono text-slate-800">--color-status-conflict</span>
              <span className="text-[#DC2626] font-medium">Match &lt; 50%</span>
              <span className="font-mono font-bold text-[#DC2626]">#B91C1C</span>
            </div>
          </div>
        </div>
      </section>

      {/* 02 TYPOGRAPHY & SPACING */}
      <section className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E2E8F0] shadow-xs space-y-6">
        <div>
          <span className="text-xs font-mono font-bold text-slate-400">02</span>
          <h2 className="text-xl font-bold text-[#1E293B]">Typography Hierarchy</h2>
        </div>

        <div className="space-y-4 divide-y divide-[#E2E8F0]">
          <div className="pt-2">
            <span className="text-xs font-mono text-slate-400 block mb-1">H1 · 32 / 40 · ExtraBold</span>
            <div className="text-3xl font-extrabold text-[#1E293B]">Piagam Komitmen Bima & Sarah</div>
          </div>
          <div className="pt-4">
            <span className="text-xs font-mono text-slate-400 block mb-1">H2 · 24 / 32 · Bold</span>
            <div className="text-2xl font-bold text-[#1E293B]">Tanggungan Keluarga Inti</div>
          </div>
          <div className="pt-4">
            <span className="text-xs font-mono text-slate-400 block mb-1">H3 · 20 / 28 · SemiBold</span>
            <div className="text-xl font-semibold text-[#1E293B]">Dilema 3 dari 8</div>
          </div>
          <div className="pt-4">
            <span className="text-xs font-mono text-slate-400 block mb-1">Body · 16 / 24 · Regular</span>
            <div className="text-base text-[#1E293B]">Orang tua meminta kiriman bulanan IDR 3.500.000.</div>
          </div>
          <div className="pt-4">
            <span className="text-xs font-mono text-slate-400 block mb-1">Caption · 12 / 16 · Medium</span>
            <div className="text-xs font-medium text-[#475569]">Jawaban dienkripsi end-to-end</div>
          </div>
          <div className="pt-4">
            <span className="text-xs font-mono text-slate-400 block mb-1">Newsreader · Italic 400 (Reflective)</span>
            <div className="font-serif-quote text-lg text-slate-700">“Kami sepakat sebelum kami berjanji.”</div>
          </div>
          <div className="pt-4">
            <span className="text-xs font-mono text-slate-400 block mb-1">JetBrains Mono · 400 (IDR Amounts)</span>
            <div className="font-code text-xl font-semibold text-[#0F766E]">IDR 3.500.000</div>
          </div>
        </div>
      </section>

      {/* 03 COMPONENT SPECS (PAGE 3) */}
      <section className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E2E8F0] shadow-xs space-y-8">
        <div>
          <span className="text-xs font-mono font-bold text-slate-400">03</span>
          <h2 className="text-xl font-bold text-[#1E293B]">Interactive UI Components</h2>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <div className="text-xs font-bold uppercase text-slate-500 tracking-wider">Buttons</div>
          <div className="flex flex-wrap items-center gap-4">
            <button className="px-5 py-2.5 bg-[#0F766E] text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 shadow-xs">
              <span>Kunci Jawaban</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button className="px-5 py-2.5 bg-slate-300 text-slate-600 rounded-lg text-xs font-semibold flex items-center space-x-1.5">
              <span className="w-3 h-3 border-2 border-slate-500 border-t-transparent rounded-full animate-spin" />
              <span>Syncing…</span>
            </button>
            <button disabled className="px-5 py-2.5 bg-slate-200 text-slate-400 rounded-lg text-xs font-semibold cursor-not-allowed">
              Kunci Jawaban (Disabled)
            </button>
            <button className="px-5 py-2.5 border border-[#E2E8F0] bg-white text-slate-800 rounded-lg text-xs font-semibold flex items-center space-x-1.5 shadow-2xs">
              <Download className="w-3.5 h-3.5" />
              <span>Unduh PDF</span>
            </button>
            <button className="px-4 py-2 text-slate-500 hover:text-slate-800 text-xs font-semibold">
              Lewati (Ghost)
            </button>
          </div>
        </div>

        {/* Badges & Avatars */}
        <div className="space-y-3 pt-4 border-t border-[#E2E8F0]">
          <div className="text-xs font-bold uppercase text-slate-500 tracking-wider">Badges & Avatars</div>
          <div className="flex flex-wrap items-center gap-4">
            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">Draft</span>
            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-[#0F766E] border border-emerald-200 flex items-center space-x-1">
              <Check className="w-3 h-3" />
              <span>92% Match</span>
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-[#D97706] border border-amber-200 flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>Menunggu Sarah</span>
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-[#DC2626] border border-red-200 flex items-center space-x-1">
              <AlertCircle className="w-3 h-3" />
              <span>38% Match</span>
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800 text-white flex items-center space-x-1">
              <Lock className="w-3 h-3" />
              <span>E2E Encrypted</span>
            </span>

            {/* Pair Stack */}
            <div className="flex -space-x-2 ml-4">
              <div className="h-8 w-8 rounded-full bg-[#1E293B] text-white flex items-center justify-center text-xs font-bold ring-2 ring-white">
                B
              </div>
              <div className="h-8 w-8 rounded-full bg-[#0F766E] text-white flex items-center justify-center text-xs font-bold ring-2 ring-white">
                S
              </div>
            </div>
          </div>
        </div>

        {/* Text Inputs */}
        <div className="space-y-3 pt-4 border-t border-[#E2E8F0]">
          <div className="text-xs font-bold uppercase text-slate-500 tracking-wider">Form Inputs</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Email</label>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#E2E8F0] text-sm text-[#1E293B]"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Default state</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0F766E] mb-1">Kode Pasangan (Focus)</label>
              <input
                type="text"
                value={codeValue}
                onChange={(e) => setCodeValue(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border-2 border-[#0F766E] text-sm text-[#1E293B] font-mono outline-hidden"
              />
              <span className="text-[10px] text-[#0F766E] mt-1 block">Active focus state</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-red-500 mb-1">Kode Pasangan (Error)</label>
              <input
                type="text"
                value={errorCodeValue}
                onChange={(e) => setErrorCodeValue(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-red-500 bg-red-50/40 text-sm text-red-900 font-mono outline-hidden"
              />
              <span className="text-[10px] text-red-600 mt-1 block flex items-center space-x-1">
                <span>⚠ Format kode: 3 huruf 3 angka</span>
              </span>
            </div>
          </div>
        </div>

        {/* Choice Cards */}
        <div className="space-y-3 pt-4 border-t border-[#E2E8F0]">
          <div className="text-xs font-bold uppercase text-slate-500 tracking-wider">Dilemma Choice Cards</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => setSelectedChoice("A")}
              className={`p-4.5 rounded-xl border text-left flex items-center justify-between cursor-pointer transition ${
                selectedChoice === "A"
                  ? "bg-emerald-50/60 border-[#0F766E] ring-1 ring-[#0F766E]"
                  : "bg-white border-[#E2E8F0] hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-700">
                  A
                </span>
                <span className="text-xs sm:text-sm font-medium text-slate-800">
                  Kirim IDR 2.000.000 per bulan, tetap
                </span>
              </div>
              <div className={`w-4 h-4 rounded-full border ${selectedChoice === "A" ? "border-[#0F766E] bg-[#0F766E]" : "border-slate-300"}`} />
            </button>

            <button
              onClick={() => setSelectedChoice("B")}
              className={`p-4.5 rounded-xl border text-left flex items-center justify-between cursor-pointer transition ${
                selectedChoice === "B"
                  ? "bg-emerald-50/60 border-[#0F766E] ring-1 ring-[#0F766E]"
                  : "bg-white border-[#E2E8F0] hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="w-7 h-7 rounded-lg bg-[#0F766E] text-white flex items-center justify-center font-bold text-xs">
                  ✓
                </span>
                <span className="text-xs sm:text-sm font-medium text-slate-800">
                  Sesuaikan dengan kondisi keuangan kami
                </span>
              </div>
              <div className={`w-4 h-4 rounded-full border ${selectedChoice === "B" ? "border-[#0F766E] bg-[#0F766E]" : "border-slate-300"}`} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
