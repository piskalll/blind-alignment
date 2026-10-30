"use client";

import { useEffect } from "react";
import Clarity from "@microsoft/clarity";

export const MicrosoftClarity: React.FC = () => {
  useEffect(() => {
    const projectId =
      process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID || "z5vxkhed8n";
    if (typeof window !== "undefined" && projectId) {
      try {
        Clarity.init(projectId);
      } catch (err) {
        console.warn("Gagal inisialisasi Microsoft Clarity:", err);
      }
    }
  }, []);

  return null;
};
