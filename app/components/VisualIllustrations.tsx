"use client";

import React from "react";

/**
 * Domain-specific SVG illustrations for VowSync (SalingPaham).
 * Each graphic directly depicts the Dual-Blind pre-marital mechanism or the 4 curriculum pillars
 * (Finance, In-Laws, Parenting, Domestic Roles) to replace walls of text with visual clarity (R-22).
 */

export const HeroAlignmentIllustration: React.FC<{
  onQuickJump?: (path: string) => void;
}> = ({ onQuickJump }) => {
  return (
    <div className="bg-[#FFFFFF] border border-[#CBD5E1] rounded-xl p-4 sm:p-5 space-y-4">
      <div className="flex items-center justify-between gap-2 border-b border-[#E2E8F0] pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#0F766E]" />
          <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#1E293B]">
            VISUALISASI ALUR SEGEL GANDA (DUAL-BLIND)
          </span>
        </div>
        <span className="font-mono text-[11px] font-semibold text-[#0F766E] bg-[#F0FDFA] px-2 py-0.5 rounded border border-[#CCFBF1]">
          40 Dilema · 4 Modul
        </span>
      </div>

      {/* Main Architectural SVG Diagram */}
      <div className="w-full overflow-hidden rounded-lg bg-[#F8FAF7] border border-[#E2E8F0] p-3 sm:p-4">
        <svg
          viewBox="0 0 680 210"
          className="w-full h-auto"
          role="img"
          aria-label="Diagram alur Dual-Blind: Bima dan Nadia mengisi jawaban tersegel secara terpisah, lalu segel terbuka serentak menjadi Piagam Kesepakatan"
        >
          {/* Connecting Flow Lines */}
          <path
            d="M 195 58 C 235 58, 240 105, 275 105"
            fill="none"
            stroke="#0F766E"
            strokeWidth="2"
            strokeDasharray="4 4"
          />
          <path
            d="M 195 152 C 235 152, 240 105, 275 105"
            fill="none"
            stroke="#0F766E"
            strokeWidth="2"
            strokeDasharray="4 4"
          />
          <path
            d="M 405 105 L 455 105"
            fill="none"
            stroke="#0F766E"
            strokeWidth="2.5"
          />

          {/* Left Top Card: Lembar Bima */}
          <g transform="translate(14, 16)">
            <rect
              width="180"
              height="82"
              rx="10"
              fill="#FFFFFF"
              stroke="#0F766E"
              strokeWidth="2"
            />
            <circle cx="28" cy="28" r="13" fill="#1E293B" />
            <text
              x="28"
              y="32"
              textAnchor="middle"
              fill="#FFFFFF"
              fontSize="11"
              fontWeight="700"
              fontFamily="sans-serif"
            >
              B
            </text>
            <text
              x="48"
              y="25"
              fill="#1E293B"
              fontSize="12"
              fontWeight="700"
              fontFamily="sans-serif"
            >
              Lembar Bima
            </text>
            <text
              x="48"
              y="39"
              fill="#0F766E"
              fontSize="9"
              fontWeight="700"
              fontFamily="monospace"
            >
              10/10 TERKUNCI
            </text>
            {/* Option pills */}
            <rect
              x="16"
              y="52"
              width="44"
              height="18"
              rx="4"
              fill="#0F766E"
            />
            <text
              x="38"
              y="64"
              textAnchor="middle"
              fill="#FFFFFF"
              fontSize="9"
              fontWeight="700"
              fontFamily="monospace"
            >
              Opsi A
            </text>
            <rect
              x="66"
              y="52"
              width="44"
              height="18"
              rx="4"
              fill="#F1F5F9"
              stroke="#CBD5E1"
            />
            <text
              x="88"
              y="64"
              textAnchor="middle"
              fill="#475569"
              fontSize="9"
              fontWeight="700"
              fontFamily="monospace"
            >
              Opsi B
            </text>
            <rect
              x="116"
              y="52"
              width="48"
              height="18"
              rx="4"
              fill="#ECFDF5"
              stroke="#A7F3D0"
            />
            <text
              x="140"
              y="64"
              textAnchor="middle"
              fill="#065F46"
              fontSize="8.5"
              fontWeight="700"
              fontFamily="monospace"
            >
              DISEGEL
            </text>
          </g>

          {/* Left Bottom Card: Lembar Nadia */}
          <g transform="translate(14, 112)">
            <rect
              width="180"
              height="82"
              rx="10"
              fill="#1E293B"
              stroke="#334155"
              strokeWidth="2"
            />
            <circle cx="28" cy="28" r="13" fill="#0F766E" />
            <text
              x="28"
              y="32"
              textAnchor="middle"
              fill="#FFFFFF"
              fontSize="11"
              fontWeight="700"
              fontFamily="sans-serif"
            >
              N
            </text>
            <text
              x="48"
              y="25"
              fill="#FFFFFF"
              fontSize="12"
              fontWeight="700"
              fontFamily="sans-serif"
            >
              Lembar Nadia
            </text>
            <text
              x="48"
              y="39"
              fill="#5EEAD4"
              fontSize="9"
              fontWeight="700"
              fontFamily="monospace"
            >
              10/10 TERKUNCI
            </text>
            <rect
              x="16"
              y="52"
              width="148"
              height="18"
              rx="4"
              fill="#0F172A"
              stroke="#334155"
            />
            <text
              x="90"
              y="64"
              textAnchor="middle"
              fill="#CBD5E1"
              fontSize="8.5"
              fontWeight="600"
              fontFamily="monospace"
            >
              SHA-256 · TERSEMBUNYI
            </text>
          </g>

          {/* Center Vault Seal Node */}
          <g transform="translate(275, 43)">
            <rect
              width="130"
              height="124"
              rx="14"
              fill="#FFFFFF"
              stroke="#0F766E"
              strokeWidth="2"
            />
            <circle
              cx="65"
              cy="46"
              r="24"
              fill="#F0FDFA"
              stroke="#0F766E"
              strokeWidth="2"
            />
            {/* Padlock SVG inside */}
            <rect
              x="55"
              y="44"
              width="20"
              height="15"
              rx="3"
              fill="#0F766E"
            />
            <path
              d="M 59 44 V 39 C 59 35.5, 71 35.5, 71 39 V 44"
              fill="none"
              stroke="#0F766E"
              strokeWidth="2.2"
            />
            <circle cx="65" cy="51" r="2" fill="#FFFFFF" />
            <text
              x="65"
              y="88"
              textAnchor="middle"
              fill="#1E293B"
              fontSize="11"
              fontWeight="800"
              fontFamily="sans-serif"
            >
              SEGEL GANDA
            </text>
            <text
              x="65"
              y="103"
              textAnchor="middle"
              fill="#0F766E"
              fontSize="9"
              fontWeight="700"
              fontFamily="monospace"
            >
              BUKA SERENTAK
            </text>
          </g>

          {/* Right Card: Piagam & Peta Keselarasan */}
          <g transform="translate(455, 16)">
            <rect
              width="210"
              height="178"
              rx="12"
              fill="#FFFFFF"
              stroke="#CBD5E1"
              strokeWidth="2"
            />
            <rect
              x="0"
              y="0"
              width="210"
              height="36"
              rx="10"
              fill="#1E293B"
            />
            <text
              x="16"
              y="22"
              fill="#5EEAD4"
              fontSize="10"
              fontWeight="700"
              fontFamily="monospace"
            >
              HASIL &amp; PIAGAM PASAL I-IV
            </text>

            {/* Score Gauge Bar */}
            <text
              x="16"
              y="58"
              fill="#1E293B"
              fontSize="12"
              fontWeight="800"
              fontFamily="sans-serif"
            >
              80% Selaras
            </text>
            <text
              x="194"
              y="58"
              textAnchor="end"
              fill="#0F766E"
              fontSize="10"
              fontWeight="700"
              fontFamily="monospace"
            >
              8 Cocok · 2 Diskusi
            </text>
            <rect
              x="16"
              y="66"
              width="178"
              height="9"
              rx="4.5"
              fill="#E2E8F0"
            />
            <rect
              x="16"
              y="66"
              width="142"
              height="9"
              rx="4.5"
              fill="#0F766E"
            />

            {/* Clause lines */}
            <rect
              x="16"
              y="88"
              width="178"
              height="22"
              rx="4"
              fill="#ECFDF5"
              stroke="#A7F3D0"
            />
            <text
              x="24"
              y="102"
              fill="#065F46"
              fontSize="9.5"
              fontWeight="700"
              fontFamily="sans-serif"
            >
              ✓ Kas Bersama 60% · Pribadi 40%
            </text>

            <rect
              x="16"
              y="116"
              width="178"
              height="22"
              rx="4"
              fill="#FFFBEB"
              stroke="#FDE68A"
            />
            <text
              x="24"
              y="130"
              fill="#92400E"
              fontSize="9.5"
              fontWeight="700"
              fontFamily="sans-serif"
            >
              ✎ Subsidi Orang Tua: Maks 10%
            </text>

            {/* Signatures */}
            <path
              d="M 24 162 Q 38 148, 52 160 T 80 156"
              fill="none"
              stroke="#1E293B"
              strokeWidth="1.8"
            />
            <path
              d="M 122 162 Q 138 146, 152 160 T 182 155"
              fill="none"
              stroke="#0F766E"
              strokeWidth="1.8"
            />
            <line
              x1="20"
              y1="167"
              x2="92"
              y2="167"
              stroke="#CBD5E1"
              strokeWidth="1"
            />
            <line
              x1="118"
              y1="167"
              x2="190"
              y2="167"
              stroke="#CBD5E1"
              strokeWidth="1"
            />
          </g>
        </svg>
      </div>

      {/* Compact Visual Stage Strip */}
      {onQuickJump && (
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <span className="text-xs font-bold text-[#475569]">
            Coba langsung halaman simulasi <strong className="text-[#1E293B]">VWS-DEMO</strong>:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {[
              { label: "1. Dashboard", path: "/room/VWS-DEMO" },
              { label: "2. 10 Skenario", path: "/room/VWS-DEMO/dilemma?module=1" },
              { label: "3. Ruang Tunggu", path: "/room/VWS-DEMO/waiting?module=1" },
              { label: "4. Peta Hasil", path: "/room/VWS-DEMO/result?module=1" },
              { label: "5. Piagam PDF", path: "/room/VWS-DEMO/charter?module=1" },
            ].map((item) => (
              <button
                key={item.path}
                type="button"
                onClick={() => onQuickJump(item.path)}
                className="min-h-[36px] px-2.5 py-1 rounded-md border border-[#CBD5E1] bg-[#F8FAF7] hover:bg-[#F0FDFA] hover:border-[#0F766E] text-xs font-bold text-[#1E293B] transition-colors cursor-pointer"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

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
            fill="#FFFFFF"
            stroke="#0F766E"
            strokeWidth="2"
          />
          <rect x="22" y="28" width="24" height="14" rx="2" fill="#CCFBF1" />
          <text
            x="22"
            y="58"
            fill="#1E293B"
            fontSize="10"
            fontWeight="700"
            fontFamily="monospace"
          >
            GAJI A
          </text>

          {/* Center Vault / Ledger */}
          <path
            d="M 90 47 L 116 47"
            stroke="#0F766E"
            strokeWidth="2"
            strokeDasharray="3 3"
          />
          <rect
            x="116"
            y="10"
            width="88"
            height="76"
            rx="10"
            fill="#1E293B"
          />
          <text
            x="160"
            y="30"
            textAnchor="middle"
            fill="#5EEAD4"
            fontSize="9"
            fontWeight="700"
            fontFamily="monospace"
          >
            KAS BERSAMA
          </text>
          <rect x="128" y="38" width="64" height="8" rx="4" fill="#334155" />
          <rect x="128" y="38" width="44" height="8" rx="4" fill="#10B981" />
          <text
            x="160"
            y="62"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="10"
            fontWeight="700"
            fontFamily="sans-serif"
          >
            Darurat 6 Bln
          </text>
          <text
            x="160"
            y="76"
            textAnchor="middle"
            fill="#CBD5E1"
            fontSize="8.5"
            fontFamily="monospace"
          >
            Utang &lt; 30%
          </text>

          {/* Right Card: Dompet B */}
          <path
            d="M 204 47 L 230 47"
            stroke="#0F766E"
            strokeWidth="2"
            strokeDasharray="3 3"
          />
          <rect
            x="230"
            y="18"
            width="78"
            height="58"
            rx="8"
            fill="#FFFFFF"
            stroke="#0F766E"
            strokeWidth="2"
          />
          <rect x="240" y="28" width="24" height="14" rx="2" fill="#CCFBF1" />
          <text
            x="240"
            y="58"
            fill="#1E293B"
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
            fill="#FFFFFF"
            stroke="#D97706"
            strokeWidth="1.8"
          />
          <text
            x="48"
            y="63"
            textAnchor="middle"
            fill="#92400E"
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
            stroke="#0F766E"
            strokeWidth="2.5"
            strokeDasharray="4 3"
          />
          <polygon
            points="160,16 122,44 198,44"
            fill="#1E293B"
          />
          <rect
            x="130"
            y="44"
            width="60"
            height="38"
            rx="4"
            fill="#FFFFFF"
            stroke="#1E293B"
            strokeWidth="2"
          />
          <text
            x="160"
            y="66"
            textAnchor="middle"
            fill="#0F766E"
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
            fill="#FFFFFF"
            stroke="#D97706"
            strokeWidth="1.8"
          />
          <text
            x="272"
            y="63"
            textAnchor="middle"
            fill="#92400E"
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
            stroke="#0F766E"
            strokeWidth="2.5"
          />
          {/* Node 1: Kesiapan */}
          <circle
            cx="64"
            cy="48"
            r="18"
            fill="#FFFFFF"
            stroke="#0F766E"
            strokeWidth="2"
          />
          <text
            x="64"
            y="52"
            textAnchor="middle"
            fill="#065F46"
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
            fill="#1E293B"
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
            fill="#1E293B"
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
            fill="#FFFFFF"
            stroke="#0F766E"
            strokeWidth="2"
          />
          <text
            x="256"
            y="52"
            textAnchor="middle"
            fill="#065F46"
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
            fill="#1E293B"
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
        <polygon points="160,56 146,82 174,82" fill="#1E293B" />
        <line
          x1="64"
          y1="52"
          x2="256"
          y2="52"
          stroke="#0F766E"
          strokeWidth="3"
        />
        {/* Left Pan: Peran Domestik */}
        <rect
          x="36"
          y="20"
          width="84"
          height="28"
          rx="6"
          fill="#FFFFFF"
          stroke="#1E293B"
          strokeWidth="1.8"
        />
        <text
          x="78"
          y="38"
          textAnchor="middle"
          fill="#1E293B"
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
    <div className="w-full rounded-xl bg-[#0F172A] border border-[#334155] p-4">
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
          fill="#1E293B"
          stroke="#10B981"
          strokeWidth="2"
        />
        <circle cx="44" cy="55" r="14" fill="#065F46" />
        <text
          x="44"
          y="59"
          textAnchor="middle"
          fill="#5EEAD4"
          fontSize="12"
          fontWeight="800"
          fontFamily="monospace"
        >
          ✓
        </text>
        <text
          x="68"
          y="49"
          fill="#FFFFFF"
          fontSize="12"
          fontWeight="700"
          fontFamily="sans-serif"
        >
          Kunci Anda
        </text>
        <text
          x="68"
          y="66"
          fill="#5EEAD4"
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
          stroke="#10B981"
          strokeWidth="2.5"
        />

        {/* Center Lock Core */}
        <circle
          cx="280"
          cy="55"
          r="38"
          fill={isUnlocked ? "#065F46" : "#1E293B"}
          stroke={isUnlocked ? "#5EEAD4" : "#F59E0B"}
          strokeWidth="2.5"
        />
        <text
          x="280"
          y="52"
          textAnchor="middle"
          fill="#FFFFFF"
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
          fill="#5EEAD4"
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
          stroke={isUnlocked ? "#10B981" : "#475569"}
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
          fill="#1E293B"
          stroke={isUnlocked ? "#10B981" : "#475569"}
          strokeWidth="2"
        />
        <circle
          cx="402"
          cy="55"
          r="14"
          fill={isUnlocked ? "#065F46" : "#334155"}
        />
        <text
          x="402"
          y="59"
          textAnchor="middle"
          fill="#FFFFFF"
          fontSize="11"
          fontWeight="800"
          fontFamily="monospace"
        >
          {isUnlocked ? "✓" : "2"}
        </text>
        <text
          x="426"
          y="49"
          fill="#FFFFFF"
          fontSize="12"
          fontWeight="700"
          fontFamily="sans-serif"
        >
          Kunci Pasangan
        </text>
        <text
          x="426"
          y="66"
          fill={isUnlocked ? "#5EEAD4" : "#FCD34D"}
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
            stroke="#E2E8F0"
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
          fill="#F0FDFA"
          stroke="#0F766E"
          strokeWidth="2.5"
          strokeDasharray="4 2"
        />
        <circle
          cx="40"
          cy="40"
          r="28"
          fill="#0F766E"
        />
        <text
          x="40"
          y="37"
          textAnchor="middle"
          fill="#5EEAD4"
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
