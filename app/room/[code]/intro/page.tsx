"use client";

import { use, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock } from "lucide-react";
import { ModuleIntroPage } from "../../../components/ModuleIntroPage";
import { AppHeader } from "../../../components/AppHeader";
import { useRoom } from "../../../lib/sessionStore";

interface PageProps {
  params: Promise<{ code: string }>;
}

function ModuleIntroContent({
  paramsPromise,
}: {
  paramsPromise: Promise<{ code: string }>;
}) {
  const resolvedParams = use(paramsPromise);
  const roomCode = resolvedParams.code.toUpperCase();
  const router = useRouter();
  const searchParams = useSearchParams();
  const moduleId = Number(searchParams.get("module") || "1");

  const { isModuleUnlocked, myName, partnerName } = useRoom(roomCode);

  if (!isModuleUnlocked(moduleId)) {
    const prevMod = Math.max(1, moduleId - 1);
    return (
      <div className="min-h-screen bg-[#F8FAF7] text-[#1E293B] flex flex-col">
        <AppHeader
          roomCode={roomCode}
          moduleId={moduleId}
          progressText={`Modul ${moduleId}: Terkunci`}
          userNames={`${myName || "Anda"} & ${partnerName || "Pasangan"}`}
        />
        <main className="max-w-xl w-full mx-auto px-4 py-16 my-auto">
          <div className="bg-[#FFFFFF] border border-[#CBD5E1] rounded-xl p-6 sm:p-8 space-y-4">
            <div className="w-10 h-10 rounded-lg bg-[#FFFBEB] border border-[#FDE68A] text-[#92400E] flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#1E293B]">
              Modul {moduleId} Masih Terkunci
            </h1>
            <p className="text-sm text-[#475569] leading-relaxed">
              Kurikulum VowSync dirancang berurutan. Selesaikan dan sahkan{" "}
              <strong>Modul {prevMod}</strong> terlebih dahulu pada halaman
              Piagam Kesepakatan untuk membuka Modul {moduleId}.
            </p>
            <div className="flex flex-wrap gap-2.5 pt-2">
              <Link
                href={`/room/${encodeURIComponent(roomCode)}/intro?module=${prevMod}`}
                className="min-h-[44px] px-4 py-2.5 rounded-lg bg-[#0F766E] hover:bg-[#115E59] text-[#FFFFFF] text-xs font-bold inline-flex items-center"
              >
                Buka Modul {prevMod}
              </Link>
              <Link
                href={`/room/${encodeURIComponent(roomCode)}`}
                className="min-h-[44px] px-4 py-2.5 rounded-lg border border-[#CBD5E1] bg-[#FFFFFF] hover:bg-[#F1F5F9] text-[#1E293B] text-xs font-bold inline-flex items-center"
              >
                Kembali ke Dashboard
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <ModuleIntroPage
      moduleId={moduleId}
      onBack={() => router.push(`/room/${roomCode}`)}
      onStartDilemma={() =>
        router.push(`/room/${roomCode}/dilemma?module=${moduleId}`)
      }
    />
  );
}

export default function ModuleIntroRoute({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F8FAF7] flex items-center justify-center text-sm font-semibold text-[#475569]">
          Memuat modul...
        </div>
      }
    >
      <ModuleIntroContent paramsPromise={params} />
    </Suspense>
  );
}
