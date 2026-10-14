"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { JoinRoomPage } from "./components/JoinRoomPage";

export default function Home() {
  const router = useRouter();

  const handleSuccess = (code: string) => {
    router.push(`/room/${code}`);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <div className="flex-1">
        <JoinRoomPage onSuccess={handleSuccess} />
      </div>
    </div>
  );
}
