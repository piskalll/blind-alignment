"use client";

import React from "react";

/**
 * Domain-specific SVG illustrations for VowSync (SalingPaham).
 * Each graphic directly depicts the Dual-Blind pre-marital mechanism or the 4 curriculum pillars
 * (Finance, In-Laws, Parenting, Domestic Roles) using theme-aware tokens so Light Mode stays 100% light (R-22, R-34).
 */

export const ModulePillarIllustration: React.FC<{
  moduleId: number;
  compact?: boolean;
}> = ({ moduleId, compact = false }) => {
  const heightClass = compact ? "h-24" : "h-32";

  if (moduleId === 1) {
    return (
      <div
        className={`w-full ${heightClass} rounded-lg bg-[#F0FDFA] border border-[#CCFBF1] flex items-center justify-center p-3 overflow-hidden`}
      >
        <svg
          viewBox="0 0 320 96"
          className="w-full h-full"
          role="img"
          aria-label="Ilustrasi Modul 1: Transparansi Finansial dan Rekening Rumah Tangga"
        >
          {/* Left Card: Dompet A */}
          <rect
            x="12"
            y="18"
            width="78"
            height="58"
            rx="8"
            fill="var(--surface-primary)"
            stroke="#0F766E"
            strokeWidth="2"
          />
          <rect x="22" y="28" width="24" height="14" rx="2" fill="#CCFBF1" />
          <text
            x="22"
            y="58"
            fill="var(--text-default)"
            fontSize="10"
            fontWeight="700"
            fontFamily="monospace"
          >
            GAJI A
          </text>

          {/* Center Joint Ledger (Light-first surface, theme-aware) */}
          <path
            d="M 90 47 L 116 47"
            stroke="var(--status-aligned)"
            strokeWidth="2"
            strokeDasharray="3 3"
          />
          <rect
            x="116"
            y="10"
            width="88"
            height="76"
            rx="10"
            fill="var(--surface-primary)"
            stroke="#0F766E"
            strokeWidth="2"
          />
          <text
            x="160"
            y="29"
            textAnchor="middle"
            fill="var(--status-aligned)"
            fontSize="9"
            fontWeight="700"
            fontFamily="monospace"
          >
            KAS BERSAMA
          </text>
          <rect
            x="128"
            y="37"
            width="64"
            height="8"
            rx="4"
            fill="var(--border-default)"
          />
          <rect x="128" y="37" width="44" height="8" rx="4" fill="#0F766E" />
          <text
            x="160"
            y="61"
            textAnchor="middle"
            fill="var(--text-default)"
            fontSize="10"
            fontWeight="700"
            fontFamily="sans-serif"
          >
            Darurat 6 Bln
          </text>
          <text
            x="160"
            y="75"
            textAnchor="middle"
            fill="var(--text-muted)"
            fontSize="8.5"
            fontFamily="monospace"
          >
            Utang &lt; 30%
          </text>

          {/* Right Card: Dompet B */}
          <path
            d="M 204 47 L 230 47"
            stroke="var(--status-aligned)"
            strokeWidth="2"
            strokeDasharray="3 3"
          />
          <rect
            x="230"
            y="18"
            width="78"
            height="58"
            rx="8"
            fill="var(--surface-primary)"
            stroke="#0F766E"
            strokeWidth="2"
          />
          <rect x="240" y="28" width="24" height="14" rx="2" fill="#CCFBF1" />
          <text
            x="240"
            y="58"
            fill="var(--text-default)"
            fontSize="10"
            fontWeight="700"
            fontFamily="monospace"
          >
            GAJI B
          </text>
        </svg>
      </div>
    );
  }

  if (moduleId === 2) {
    return (
      <div
        className={`w-full ${heightClass} rounded-lg bg-[#FFFBEB] border border-[#FDE68A] flex items-center justify-center p-3 overflow-hidden`}
      >
        <svg
          viewBox="0 0 320 96"
          className="w-full h-full"
          role="img"
          aria-label="Ilustrasi Modul 2: Batasan Mertua dan Kedaulatan Rumah Tangga"
        >
          {/* Left Extended Family House */}
          <rect
            x="16"
            y="38"
            width="64"
            height="42"
            rx="6"
            fill="var(--surface-primary)"
            stroke="#D97706"
            strokeWidth="1.8"
          />
          <text
            x="48"
            y="63"
            textAnchor="middle"
            fill="var(--amber-label)"
            fontSize="9.5"
            fontWeight="700"
            fontFamily="sans-serif"
          >
            Keluarga A
          </text>

          {/* Protective Boundary Arch around Core Home */}
          <path
            d="M 102 82 A 58 58 0 0 1 218 82"
            fill="none"
            stroke="var(--status-aligned)"
            strokeWidth="2.5"
            strokeDasharray="4 3"
          />
          <polygon points="160,16 122,44 198,44" fill="#0F766E" />
          <rect
            x="130"
            y="44"
            width="60"
            height="38"
            rx="4"
            fill="var(--surface-primary)"
            stroke="#0F766E"
            strokeWidth="2"
          />
          <text
            x="160"
            y="66"
            textAnchor="middle"
            fill="var(--status-aligned)"
            fontSize="9.5"
            fontWeight="800"
            fontFamily="monospace"
          >
            PRIVAT
          </text>

          {/* Right Extended Family House */}
          <rect
            x="240"
            y="38"
            width="64"
            height="42"
            rx="6"
            fill="var(--surface-primary)"
            stroke="#D97706"
            strokeWidth="1.8"
          />
          <text
            x="272"
            y="63"
            textAnchor="middle"
            fill="var(--amber-label)"
            fontSize="9.5"
            fontWeight="700"
            fontFamily="sans-serif"
          >
            Keluarga B
          </text>
        </svg>
      </div>
    );
  }

  if (moduleId === 3) {
    return (
      <div
        className={`w-full ${heightClass} rounded-lg bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-center p-3 overflow-hidden`}
      >
        <svg
          viewBox="0 0 320 96"
          className="w-full h-full"
          role="img"
          aria-label="Ilustrasi Modul 3: Visi Pengasuhan dan Masa Depan Anak"
        >
          {/* Timeline Track */}
          <line
            x1="36"
            y1="48"
            x2="284"
            y2="48"
            stroke="var(--status-aligned)"
            strokeWidth="2.5"
          />
          {/* Node 1: Kesiapan */}
          <circle
            cx="64"
            cy="48"
            r="18"
            fill="var(--surface-primary)"
            stroke="#0F766E"
            strokeWidth="2"
          />
          <text
            x="64"
            y="52"
            textAnchor="middle"
            fill="var(--status-aligned)"
            fontSize="10"
            fontWeight="800"
            fontFamily="monospace"
          >
            THN 1
          </text>
          <text
            x="64"
            y="82"
            textAnchor="middle"
            fill="var(--text-default)"
            fontSize="9.5"
            fontWeight="700"
            fontFamily="sans-serif"
          >
            Kesiapan
          </text>

          {/* Node 2: Pengasuhan */}
          <circle cx="160" cy="48" r="22" fill="#0F766E" />
          <text
            x="160"
            y="52"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="10"
            fontWeight="800"
            fontFamily="monospace"
          >
            ASUH
          </text>
          <text
            x="160"
            y="84"
            textAnchor="middle"
            fill="var(--text-default)"
            fontSize="9.5"
            fontWeight="700"
            fontFamily="sans-serif"
          >
            Karier &amp; Peran
          </text>

          {/* Node 3: Pendidikan */}
          <circle
            cx="256"
            cy="48"
            r="18"
            fill="var(--surface-primary)"
            stroke="#0F766E"
            strokeWidth="2"
          />
          <text
            x="256"
            y="52"
            textAnchor="middle"
            fill="var(--status-aligned)"
            fontSize="10"
            fontWeight="800"
            fontFamily="monospace"
          >
            DIDIK
          </text>
          <text
            x="256"
            y="82"
            textAnchor="middle"
            fill="var(--text-default)"
            fontSize="9.5"
            fontWeight="700"
            fontFamily="sans-serif"
          >
            Dana Sekolah
          </text>
        </svg>
      </div>
    );
  }

  return (
    <div
      className={`w-full ${heightClass} rounded-lg bg-[#F1F5F9] border border-[#CBD5E1] flex items-center justify-center p-3 overflow-hidden`}
    >
      <svg
        viewBox="0 0 320 96"
        className="w-full h-full"
        role="img"
        aria-label="Ilustrasi Modul 4: Pembagian Peran Domestik dan Resolusi Konflik"
      >
        {/* Equilibrium Fulcrum & Beam */}
        <polygon points="160,56 146,82 174,82" fill="#0F766E" />
        <line
          x1="64"
          y1="52"
          x2="256"
          y2="52"
          stroke="var(--status-aligned)"
          strokeWidth="3"
        />
        {/* Left Pan: Peran Domestik */}
        <rect
          x="36"
          y="20"
          width="84"
          height="28"
          rx="6"
          fill="var(--surface-primary)"
          stroke="#0F766E"
          strokeWidth="1.8"
        />
        <text
          x="78"
          y="38"
          textAnchor="middle"
          fill="var(--text-default)"
          fontSize="10"
          fontWeight="700"
          fontFamily="sans-serif"
        >
          Domestik 50:50
        </text>
        {/* Right Pan: Resolusi Konflik */}
        <rect
          x="200"
          y="20"
          width="84"
          height="28"
          rx="6"
          fill="#0F766E"
        />
        <text
          x="242"
          y="38"
          textAnchor="middle"
          fill="#FFFFFF"
          fontSize="10"
          fontWeight="700"
          fontFamily="sans-serif"
        >
          Jeda Tenang
        </text>
      </svg>
    </div>
  );
};

export const VaultWaitingIllustration: React.FC<{
  isUnlocked: boolean;
  partnerProgress: number;
}> = ({ isUnlocked, partnerProgress }) => {
  return (
    <div className="w-full rounded-xl bg-[#F8FAF7] border border-[#CBD5E1] p-4">
      <svg
        viewBox="0 0 560 110"
        className="w-full h-auto"
        role="img"
        aria-label="Diagram Kunci Ganda VowSync"
      >
        {/* Left Key: Kunci Anda */}
        <rect
          x="16"
          y="22"
          width="170"
          height="66"
          rx="10"
          fill="var(--surface-primary)"
          stroke="#0F766E"
          strokeWidth="2"
        />
        <circle cx="44" cy="55" r="14" fill="#0F766E" />
        <text
          x="44"
          y="59"
          textAnchor="middle"
          fill="#FFFFFF"
          fontSize="12"
          fontWeight="800"
          fontFamily="monospace"
        >
          ✓
        </text>
        <text
          x="68"
          y="49"
          fill="var(--text-default)"
          fontSize="12"
          fontWeight="700"
          fontFamily="sans-serif"
        >
          Kunci Anda
        </text>
        <text
          x="68"
          y="66"
          fill="var(--status-aligned)"
          fontSize="10"
          fontWeight="700"
          fontFamily="monospace"
        >
          10/10 TERSEGEL
        </text>

        {/* Connector Left to Center */}
        <line
          x1="186"
          y1="55"
          x2="238"
          y2="55"
          stroke="#0F766E"
          strokeWidth="2.5"
        />

        {/* Center Lock Core */}
        <circle
          cx="280"
          cy="55"
          r="38"
          fill={isUnlocked ? "#0F766E" : "var(--surface-primary)"}
          stroke={isUnlocked ? "#0F766E" : "#D97706"}
          strokeWidth="2.5"
        />
        <text
          x="280"
          y="52"
          textAnchor="middle"
          fill={isUnlocked ? "#FFFFFF" : "var(--text-default)"}
          fontSize="10"
          fontWeight="800"
          fontFamily="monospace"
        >
          {isUnlocked ? "TERBUKA" : "SEGEL"}
        </text>
        <text
          x="280"
          y="66"
          textAnchor="middle"
          fill={isUnlocked ? "#CCFBF1" : "var(--amber-label)"}
          fontSize="9"
          fontWeight="700"
          fontFamily="monospace"
        >
          {isUnlocked ? "SERENTAK" : "DUAL-KEY"}
        </text>

        {/* Connector Center to Right */}
        <line
          x1="322"
          y1="55"
          x2="374"
          y2="55"
          stroke={isUnlocked ? "#0F766E" : "var(--border-default)"}
          strokeWidth="2.5"
          strokeDasharray={isUnlocked ? undefined : "4 4"}
        />

        {/* Right Key: Kunci Pasangan */}
        <rect
          x="374"
          y="22"
          width="170"
          height="66"
          rx="10"
          fill="var(--surface-primary)"
          stroke={isUnlocked ? "#0F766E" : "var(--border-default)"}
          strokeWidth="2"
        />
        <circle
          cx="402"
          cy="55"
          r="14"
          fill={isUnlocked ? "#0F766E" : "var(--surface-accent)"}
          stroke={isUnlocked ? "#0F766E" : "var(--border-default)"}
          strokeWidth="1.5"
        />
        <text
          x="402"
          y="59"
          textAnchor="middle"
          fill={isUnlocked ? "#FFFFFF" : "var(--text-default)"}
          fontSize="11"
          fontWeight="800"
          fontFamily="monospace"
        >
          {isUnlocked ? "✓" : "2"}
        </text>
        <text
          x="426"
          y="49"
          fill="var(--text-default)"
          fontSize="12"
          fontWeight="700"
          fontFamily="sans-serif"
        >
          Kunci Pasangan
        </text>
        <text
          x="426"
          y="66"
          fill={isUnlocked ? "var(--status-aligned)" : "var(--amber-label)"}
          fontSize="10"
          fontWeight="700"
          fontFamily="monospace"
        >
          {isUnlocked ? "10/10 TERSEGEL" : `${partnerProgress}/10 DIJAWAB`}
        </text>
      </svg>
    </div>
  );
};

export const AlignmentDonutVisual: React.FC<{
  score: number;
  alignedCount: number;
  conflictCount: number;
}> = ({ score, alignedCount, conflictCount }) => {
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (Math.min(100, Math.max(0, score)) / 100) * circumference;

  return (
    <div className="flex items-center gap-4 px-4 py-3 rounded-xl bg-[#F8FAF7] border border-[#CBD5E1]">
      <div className="relative w-24 h-24 shrink-0">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="var(--border-default)"
            strokeWidth="10"
          />
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={score >= 70 ? "#0F766E" : score >= 50 ? "#D97706" : "#DC2626"}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-xl font-extrabold text-[#1E293B] tabular-nums">
            {score}%
          </span>
          <span className="text-[10px] font-bold uppercase text-[#475569]">
            Selaras
          </span>
        </div>
      </div>

      <div className="space-y-1.5 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-xs bg-[#0F766E] shrink-0" />
          <span className="font-bold text-[#1E293B]">
            {alignedCount} Skenario Sejalan
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-xs bg-[#D97706] shrink-0" />
          <span className="font-bold text-[#1E293B]">
            {conflictCount} Perlu Kompromi
          </span>
        </div>
      </div>
    </div>
  );
};

export const CharterSealEmblem: React.FC = () => {
  return (
    <div className="w-16 h-16 shrink-0" aria-hidden="true">
      <svg viewBox="0 0 80 80" className="w-full h-full">
        <circle
          cx="40"
          cy="40"
          r="36"
          fill="var(--surface-accent)"
          stroke="#0F766E"
          strokeWidth="2.5"
          strokeDasharray="4 2"
        />
        <circle cx="40" cy="40" r="28" fill="#0F766E" />
        <text
          x="40"
          y="37"
          textAnchor="middle"
          fill="#CCFBF1"
          fontSize="8"
          fontWeight="800"
          fontFamily="monospace"
        >
          VOWSYNC
        </text>
        <text
          x="40"
          y="49"
          textAnchor="middle"
          fill="#FFFFFF"
          fontSize="9"
          fontWeight="800"
          fontFamily="sans-serif"
        >
          SAH
        </text>
      </svg>
    </div>
  );
};
