"use client";

import React, { useState } from "react";
import { JoinRoomPage } from "./components/JoinRoomPage";
import { DashboardPage } from "./components/DashboardPage";
import { ModuleIntroPage } from "./components/ModuleIntroPage";
import { DilemmaRunnerPage } from "./components/DilemmaRunnerPage";
import { WaitingRevealPage } from "./components/WaitingRevealPage";
import { AlignmentResultPage } from "./components/AlignmentResultPage";
import { FinalCharterPage } from "./components/FinalCharterPage";

type PageScreen =
  | "join-room"
  | "dashboard"
  | "module-intro"
  | "dilemma-runner"
  | "waiting-reveal"
  | "alignment-result"
  | "final-charter";

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<PageScreen>("dashboard");

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <div className="flex-1">
        {currentScreen === "join-room" && (
          <JoinRoomPage
            onEnter={() => setCurrentScreen("dashboard")}
          />
        )}

        {currentScreen === "dashboard" && (
          <DashboardPage
            onStartModule={() => setCurrentScreen("module-intro")}
            onRevealAnswers={() => setCurrentScreen("alignment-result")}
          />
        )}

        {currentScreen === "module-intro" && (
          <ModuleIntroPage
            onBack={() => setCurrentScreen("dashboard")}
            onStartDilemma={() => setCurrentScreen("dilemma-runner")}
          />
        )}

        {currentScreen === "dilemma-runner" && (
          <DilemmaRunnerPage
            onBack={() => setCurrentScreen("module-intro")}
            onFinish={() => setCurrentScreen("waiting-reveal")}
          />
        )}

        {currentScreen === "waiting-reveal" && (
          <WaitingRevealPage
            onRevealTogether={() => setCurrentScreen("alignment-result")}
            onBackToDashboard={() => setCurrentScreen("dashboard")}
          />
        )}

        {currentScreen === "alignment-result" && (
          <AlignmentResultPage
            onProceedToCharter={() => setCurrentScreen("final-charter")}
            onBackToDashboard={() => setCurrentScreen("dashboard")}
          />
        )}

        {currentScreen === "final-charter" && (
          <FinalCharterPage
            onBackToDashboard={() => setCurrentScreen("dashboard")}
          />
        )}
      </div>
    </div>
  );
}
