"use client";

import { use, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AlignmentResultPage } from "../../../components/AlignmentResultPage";
import { useRoom } from "../../../lib/sessionStore";

interface PageProps {
  params: Promise<{ code: string }>;
}

function ResultContent({
  paramsPromise,
}: {
  paramsPromise: Promise<{ code: string }>;
}) {
  const resolvedParams = use(paramsPromise);
  const roomCode = resolvedParams.code.toUpperCase();
  const router = useRouter();
  const searchParams = useSearchParams();
  const moduleId = Number(searchParams.get("module") || "1");

  useRoom(roomCode);

  return (
    <AlignmentResultPage
      moduleId={moduleId}
      onProceedToCharter={() =>
        router.push(`/room/${roomCode}/charter?module=${moduleId}`)
      }
      onBackToDashboard={() => router.push(`/room/${roomCode}`)}
    />
  );
}

export default function ResultRoute({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F8FAF7] flex items-center justify-center text-sm font-semibold text-[#475569]">
          Memuat hasil keselarasan...
        </div>
      }
    >
      <ResultContent paramsPromise={params} />
    </Suspense>
  );
}
