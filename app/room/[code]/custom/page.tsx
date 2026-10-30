"use client";

import { use, Suspense } from "react";
import { CustomQuestionsStudioPage } from "../../../components/CustomQuestionsStudioPage";

interface PageProps {
  params: Promise<{ code: string }>;
}

function CustomStudioContent({
  paramsPromise,
}: {
  paramsPromise: Promise<{ code: string }>;
}) {
  const resolvedParams = use(paramsPromise);
  const roomCode = resolvedParams.code.toUpperCase();

  return <CustomQuestionsStudioPage roomCode={roomCode} />;
}

export default function CustomQuestionsRoute({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F8FAF7] flex items-center justify-center text-sm font-semibold text-[#475569]">
          Memuat bank pertanyaan kustom...
        </div>
      }
    >
      <CustomStudioContent paramsPromise={params} />
    </Suspense>
  );
}
