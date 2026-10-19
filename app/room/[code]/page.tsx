"use client";

import { use, Suspense } from "react";
import { useRouter } from "next/navigation";
import { DashboardPage } from "../../components/DashboardPage";
import { useRoom } from "../../lib/sessionStore";

interface PageProps {
  params: Promise<{ code: string }>;
}

function DashboardContent({
  paramsPromise,
}: {
  paramsPromise: Promise<{ code: string }>;
}) {
  const resolvedParams = use(paramsPromise);
  const roomCode = resolvedParams.code.toUpperCase();
  const router = useRouter();

  useRoom(roomCode);

  return (
    <DashboardPage
      onStartModule={(moduleId: number) =>
        router.push(`/room/${roomCode}/intro?module=${moduleId}`)
      }
      onRevealAnswers={(moduleId: number) =>
        router.push(`/room/${roomCode}/result?module=${moduleId}`)
      }
      onViewCharter={(moduleId: number) =>
        router.push(`/room/${roomCode}/charter?module=${moduleId}`)
      }
      onViewWaiting={(moduleId: number) =>
        router.push(`/room/${roomCode}/waiting?module=${moduleId}`)
      }
    />
  );
}

export default function RoomDashboardRoute({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F8FAF7] flex items-center justify-center text-sm font-semibold text-[#475569]">
          Memuat dashboard...
        </div>
      }
    >
      <DashboardContent paramsPromise={params} />
    </Suspense>
  );
}
