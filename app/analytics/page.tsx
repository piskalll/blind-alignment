import React, { Suspense } from "react";
import { AnalyticsDashboardPage } from "../components/AnalyticsDashboardPage";

export default function AnalyticsRoutePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F8FAF7] flex items-center justify-center text-sm font-semibold text-[#475569]">
          Memuat panel analytics...
        </div>
      }
    >
      <AnalyticsDashboardPage />
    </Suspense>
  );
}
