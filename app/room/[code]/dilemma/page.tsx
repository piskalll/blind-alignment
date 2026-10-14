"use client";

import { use, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DilemmaRunnerPage } from "../../../components/DilemmaRunnerPage";
import { useRoom } from "../../../lib/sessionStore";

interface PageProps {
  params: Promise<{ code: string }>;
}

function DilemmaContent({ paramsPromise }: { paramsPromise: Promise<{ code: string }> }) {
  const resolvedParams = use(paramsPromise);
  const roomCode = resolvedParams.code.toUpperCase();
  const router = useRouter();
  const searchParams = useSearchParams();
  const moduleId = Number(searchParams.get("module") || "1");

  useRoom(roomCode);

  return (
    <DilemmaRunnerPage
      moduleId={moduleId}
      onBack={() => router.push(`/room/${roomCode}`)}
      onFinish={() => router.push(`/room/${roomCode}/waiting?module=${moduleId}`)}
    />
  );
}

export default function DilemmaRoute({ params }: PageProps) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F1F5F9] flex items-center justify-center text-sm text-slate-500">Memuat dilema...</div>}>
      <DilemmaContent paramsPromise={params} />
    </Suspense>
  );
}
