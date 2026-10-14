"use client";

import { useCallback, useEffect, useState } from "react";

export type Role = "host" | "guest";
export type OptionKey = "A" | "B" | "C";

export interface Answer {
  choice?: OptionKey;
  amount?: number;
  note?: string;
}

export interface SignatureData {
  dataUrl: string;
  signedAt: string; // ISO string
}

export interface CompromiseItem {
  scenarioId: number;
  title: string;
  agreementText: string;
}

interface ParticipantState {
  name: string;
  answers: Record<number, Answer>;
  locked: boolean;
  lockedModules?: number[]; // modules that this user has locked
  signature?: SignatureData;
  isJoined: boolean;
}

export interface RoomState {
  code: string;
  passcode: string; // 4-digit PIN for access control
  host: ParticipantState;
  guest: ParticipantState;
  compromises?: CompromiseItem[];
  completedModules?: number[]; // list of completed module IDs (e.g. [1, 2])
}

const KEY = "vowsync:room:";
const ROLE_KEY = "vowsync:role";
const CODE_KEY = "vowsync:code";

const emptyParticipant = (name: string, isJoined: boolean = false): ParticipantState => ({
  name,
  answers: {},
  locked: false,
  isJoined,
});

export const readRoom = (code: string): RoomState | null => {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(KEY + code);
  return raw ? (JSON.parse(raw) as RoomState) : null;
};

const writeRoom = (room: RoomState) => {
  localStorage.setItem(KEY + room.code, JSON.stringify(room));
  window.dispatchEvent(new Event("vowsync:update"));
};

export const generateRoomCode = () =>
  "VWS-" + Math.floor(100 + Math.random() * 900);

export const generatePasscode = () =>
  Math.floor(1000 + Math.random() * 9000).toString();

export interface CreateRoomResult {
  code: string;
  passcode: string;
}

export const createRoom = (
  hostUsername: string,
  code = generateRoomCode(),
  passcode = generatePasscode()
): CreateRoomResult => {
  writeRoom({
    code,
    passcode,
    host: emptyParticipant(hostUsername, true),
    guest: emptyParticipant("", false),
    compromises: [],
  });

  sessionStorage.setItem(ROLE_KEY, "host");
  sessionStorage.setItem(CODE_KEY, code);
  return { code, passcode };
};

export type JoinResult =
  | { success: true; role: Role }
  | { success: false; error: "NOT_FOUND" | "WRONG_PIN" | "ROOM_FULL" };

export const joinRoom = (
  code: string,
  username: string,
  inputPasscode: string
): JoinResult => {
  const room = readRoom(code);
  if (!room) {
    return { success: false, error: "NOT_FOUND" };
  }

  // Verify PIN
  if (room.passcode && room.passcode !== inputPasscode.trim()) {
    return { success: false, error: "WRONG_PIN" };
  }

  // Check if current user is returning host
  const existingRole = sessionStorage.getItem(ROLE_KEY);
  const existingCode = sessionStorage.getItem(CODE_KEY);
  if (existingCode === code && existingRole === "host") {
    room.host.name = username;
    writeRoom(room);
    return { success: true, role: "host" };
  }

  // Check if current user is returning guest
  if (existingCode === code && existingRole === "guest") {
    room.guest.name = username;
    writeRoom(room);
    return { success: true, role: "guest" };
  }

  // If Guest slot is already taken by another person
  if (room.guest.isJoined && room.guest.name !== username) {
    return { success: false, error: "ROOM_FULL" };
  }

  // Join as guest
  room.guest.name = username;
  room.guest.isJoined = true;
  writeRoom(room);
  sessionStorage.setItem(ROLE_KEY, "guest");
  sessionStorage.setItem(CODE_KEY, code);
  return { success: true, role: "guest" };
};

export const useRoom = (explicitCode?: string) => {
  const [room, setRoom] = useState<RoomState | null>(null);
  const [role, setRole] = useState<Role>("host");

  const me = role && room ? room[role] : null;
  const partnerRole: Role = role === "host" ? "guest" : "host";
  const partner = partnerRole && room ? room[partnerRole] : null;

  const refresh = useCallback(() => {
    const code = explicitCode || sessionStorage.getItem(CODE_KEY);
    if (explicitCode && !sessionStorage.getItem(CODE_KEY)) {
      sessionStorage.setItem(CODE_KEY, explicitCode);
    }
    setRole((sessionStorage.getItem(ROLE_KEY) as Role) || "host");
    setRoom(code ? readRoom(code) : null);
  }, [explicitCode]);

  useEffect(() => {
    refresh();
    window.addEventListener("storage", refresh);
    window.addEventListener("vowsync:update", refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("vowsync:update", refresh);
    };
  }, [refresh]);

  const isUserLocked = (targetModuleId: number = 1) => {
    return me?.lockedModules?.includes(targetModuleId) || (targetModuleId === 1 && !!me?.locked);
  };

  const isPartnerLocked = (targetModuleId: number = 1) => {
    return partner?.lockedModules?.includes(targetModuleId) || (targetModuleId === 1 && !!partner?.locked);
  };

  const isBothLocked = (targetModuleId: number = 1) => {
    return isUserLocked(targetModuleId) && isPartnerLocked(targetModuleId);
  };

  const partnerLocked = isPartnerLocked(1);
  const bothLocked = isBothLocked(1);

  const saveAnswer = (questionId: number, answer: Answer) => {
    if (!room) return;
    const next = { ...room };
    next[role] = {
      ...next[role],
      answers: { ...next[role].answers, [questionId]: answer },
    };
    writeRoom(next);
  };

  const lockAnswers = (moduleId: number = 1) => {
    if (!room) return;
    const next = { ...room };
    const currentLocked = next[role].lockedModules || [];
    const updatedLocked = currentLocked.includes(moduleId) ? currentLocked : [...currentLocked, moduleId];
    next[role] = { ...next[role], locked: true, lockedModules: updatedLocked };
    writeRoom(next);
  };

  const saveSignature = (dataUrl: string) => {
    const code = explicitCode || (typeof window !== "undefined" ? sessionStorage.getItem(CODE_KEY) : null);
    if (!code) return;
    const currentRoom = readRoom(code);
    if (!currentRoom) return;
    const currentRole = (sessionStorage.getItem(ROLE_KEY) as Role) || role;
    const next = { ...currentRoom };
    next[currentRole] = {
      ...next[currentRole],
      signature: dataUrl
        ? {
            dataUrl,
            signedAt: new Date().toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
              timeZoneName: "short",
            }),
          }
        : undefined,
    };
    writeRoom(next);
  };

  const saveCompromise = (compromise: CompromiseItem) => {
    if (!room) return;
    const next = { ...room };
    const current = next.compromises || [];
    const filtered = current.filter((c) => c.scenarioId !== compromise.scenarioId);
    next.compromises = [...filtered, compromise];
    writeRoom(next);
  };

  const markModuleCompleted = (moduleId: number) => {
    const code = explicitCode || (typeof window !== "undefined" ? sessionStorage.getItem(CODE_KEY) : null);
    if (!code) return;
    const currentRoom = readRoom(code);
    if (!currentRoom) return;
    const currentCompleted = currentRoom.completedModules || [];
    if (currentCompleted.includes(moduleId)) {
      return; // Already completed, avoid unnecessary write and event loop
    }
    const next = {
      ...currentRoom,
      completedModules: [...currentCompleted, moduleId],
    };
    writeRoom(next);
  };

  const isModuleUnlocked = (moduleId: number) => {
    if (moduleId === 1) return true;
    const currentCompleted = room?.completedModules || [];
    // Module N is unlocked if Module N-1 is completed
    return currentCompleted.includes(moduleId - 1);
  };

  return {
    room,
    role,
    me,
    partner,
    myName: me?.name ?? "",
    partnerName: partner?.isJoined ? partner?.name : "Partner (Belum Bergabung)",
    partnerLocked,
    bothLocked,
    partnerAnswers: bothLocked ? partner?.answers ?? null : null,
    mySignature: me?.signature,
    partnerSignature: partner?.signature,
    compromises: room?.compromises || [],
    completedModules: room?.completedModules || [],
    saveAnswer,
    lockAnswers,
    saveSignature,
    saveCompromise,
    markModuleCompleted,
    isModuleUnlocked,
    isUserLocked,
    isPartnerLocked,
    isBothLocked,
  };
};
