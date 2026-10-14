"use client";

import { use, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { WaitingRevealPage } from "../../../components/WaitingRevealPage";
import { useRoom } from "../../../lib/sessionStore";

interface PageProps {
  params: Promise<{ code: string }>;
}

function WaitingContent({ paramsPromise }: { paramsPromise: Promise<{ code: string }> }) {
  const resolvedParams = use(paramsPromise);
  const roomCode = resolvedParams.code.toUpperCase();
  const router = useRouter();
  const searchParams = useSearchParams();
  const moduleId = Number(searchParams.get("module") || "1");

  const { isBothLocked } = useRoom(roomCode);
  const isLockedForThisModule = isBothLocked(moduleId);

  // Auto transition to result when both partners have locked for this specific module
  useEffect(() => {
    if (isLockedForThisModule) {
      router.push(`/room/${roomCode}/result?module=${moduleId}`);
    }
  }, [isLockedForThisModule, roomCode, router, moduleId]);

  return (
    <WaitingRevealPage
      onRevealTogether={() => router.push(`/room/${roomCode}/result?module=${moduleId}`)}
      onBackToDashboard={() => router.push(`/room/${roomCode}`)}
    />
  );
}

export default function WaitingRoute({ params }: PageProps) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F1F5F9] flex items-center justify-center text-sm text-slate-500">Memuat ruang tunggu...</div>}>
      <WaitingContent paramsPromise={params} />
    </Suspense>
  );
}
