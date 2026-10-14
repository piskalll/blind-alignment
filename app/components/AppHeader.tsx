import React from "react";
import { Lock } from "lucide-react";

interface HeaderProps {
  roomCode?: string;
  progressText?: string;
  isEncrypted?: boolean;
  userNames?: string;
  showAvatars?: boolean;
}

export const AppHeader: React.FC<HeaderProps> = ({
  roomCode,
  progressText = "Module 1: Financial Principles",
  isEncrypted = true,
  userNames = "Bima & Sarah",
  showAvatars = true,
}) => {
  const parts = userNames.split("&").map((s) => s.trim());
  const initial1 = parts[0]?.[0]?.toUpperCase() || "Y";
  const initial2 = parts[1]?.[0]?.toUpperCase() || "P";

  return (
    <header className="w-full bg-[#FFFFFF] border-b border-[#E2E8F0] px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-40 shadow-xs">
      {/* Brand */}
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-full bg-[#1E293B] text-white flex items-center justify-center font-bold text-xs shadow-xs">
          VS
        </div>
        <div>
          <div className="flex items-center space-x-1.5">
            <span className="font-bold text-[#1E293B] text-base leading-none tracking-tight">VowSync</span>
            <span className="text-[10px] uppercase font-semibold text-[#0F766E] tracking-wider px-1.5 py-0.5 bg-[#0F766E]/10 rounded-sm">Dual-Blind</span>
          </div>
          <span className="text-[11px] text-[#475569] font-medium block mt-0.5">
            {roomCode ? `Room ${roomCode}` : "SalingPaham"}
          </span>
        </div>
      </div>

      {/* Badges and Partner Status */}
      <div className="flex items-center space-x-2 sm:space-x-4">
        {progressText && (
          <div className="hidden md:flex items-center space-x-1.5 px-3 py-1 bg-[#D97706]/10 text-[#D97706] text-xs font-semibold rounded-full border border-[#D97706]/20">
            <span className="w-2 h-2 rounded-full bg-[#D97706] animate-pulse"></span>
            <span>{progressText}</span>
          </div>
        )}

        {isEncrypted && (
          <div className="flex items-center space-x-1.5 px-3 py-1 bg-[#0F766E]/10 text-[#0F766E] text-xs font-semibold rounded-full border border-[#0F766E]/20">
            <Lock className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">E2E Encrypted</span>
            <span className="sm:hidden">E2EE</span>
          </div>
        )}

        {showAvatars && (
          <div className="flex items-center space-x-2 pl-1 sm:pl-3 border-l border-[#E2E8F0]">
            <div className="flex -space-x-2 overflow-hidden">
              <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#1E293B] text-white text-xs font-bold ring-2 ring-white">
                {initial1}
              </div>
              <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#0F766E] text-white text-xs font-bold ring-2 ring-white">
                {initial2}
              </div>
            </div>
            <span className="hidden lg:inline text-xs font-semibold text-[#1E293B]">
              {userNames}
            </span>
          </div>
        )}
      </div>
    </header>
  );
};
