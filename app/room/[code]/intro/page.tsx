"use client";

import { use, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ModuleIntroPage } from "../../../components/ModuleIntroPage";
import { useRoom } from "../../../lib/sessionStore";

interface PageProps {
  params: Promise<{ code: string }>;
}

function ModuleIntroContent({ paramsPromise }: { paramsPromise: Promise<{ code: string }> }) {
  const resolvedParams = use(paramsPromise);
  const roomCode = resolvedParams.code.toUpperCase();
  const router = useRouter();
  const searchParams = useSearchParams();
  const moduleId = Number(searchParams.get("module") || "1");

  const { isModuleUnlocked } = useRoom(roomCode);

  // Security Gate: Redirect to dashboard if trying to access locked module directly
  useEffect(() => {
    if (!isModuleUnlocked(moduleId)) {
      alert(`Modul ${moduleId} masih terkunci! Selesaikan Modul ${moduleId - 1} terlebih dahulu.`);
      router.replace(`/room/${roomCode}`);
    }
  }, [moduleId, isModuleUnlocked, roomCode, router]);

  if (!isModuleUnlocked(moduleId)) {
    return null;
  }

  return (
    <ModuleIntroPage
      moduleId={moduleId}
      onBack={() => router.push(`/room/${roomCode}`)}
      onStartDilemma={() => router.push(`/room/${roomCode}/dilemma?module=${moduleId}`)}
    />
  );
}

export default function ModuleIntroRoute({ params }: PageProps) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F1F5F9] flex items-center justify-center text-sm text-slate-500">Memuat modul...</div>}>
      <ModuleIntroContent paramsPromise={params} />
    </Suspense>
  );
}
