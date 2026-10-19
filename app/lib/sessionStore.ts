"use client";

import { useCallback, useEffect, useState } from "react";
import { SCENARIOS } from "../data/scenarios";

export type Role = "host" | "guest";
export type OptionKey = "A" | "B" | "C";

export interface Answer {
  choice?: OptionKey;
  amount?: number;
  note?: string;
}

export interface SignatureData {
  dataUrl: string;
  signedAt: string;
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
  lockedModules?: number[];
  signature?: SignatureData;
  isJoined: boolean;
}

export interface RoomState {
  code: string;
  passcode: string;
  host: ParticipantState;
  guest: ParticipantState;
  compromises?: CompromiseItem[];
  completedModules?: number[];
}

export type RoomData = RoomState;

const KEY = "vowsync:room:";
const ROLE_KEY = "vowsync:role";
const CODE_KEY = "vowsync:code";
const THEME_KEY = "vowsync:theme";

const emptyParticipant = (
  name: string,
  isJoined: boolean = false
): ParticipantState => ({
  name,
  answers: {},
  locked: false,
  lockedModules: [],
  isJoined,
});

export const readRoom = (code: string): RoomState | null => {
  if (typeof window === "undefined" || !code) return null;
  try {
    const raw = localStorage.getItem(KEY + code.toUpperCase());
    return raw ? (JSON.parse(raw) as RoomState) : null;
  } catch {
    return null;
  }
};

const writeRoom = (room: RoomState) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY + room.code.toUpperCase(), JSON.stringify(room));
  window.dispatchEvent(new Event("vowsync:update"));
};

export const listSavedRooms = (): RoomState[] => {
  if (typeof window === "undefined") return [];
  const rooms: RoomState[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith(KEY)) {
      try {
        const parsed = JSON.parse(localStorage.getItem(k) || "") as RoomState;
        if (parsed && parsed.code) {
          rooms.push(parsed);
        }
      } catch {
        // Ignore malformed entries
      }
    }
  }
  return rooms;
};

export const activateRoomSession = (code: string, role: Role = "host") => {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(CODE_KEY, code.toUpperCase());
  sessionStorage.setItem(ROLE_KEY, role);
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
  const normalizedCode = code.toUpperCase();
  writeRoom({
    code: normalizedCode,
    passcode,
    host: emptyParticipant(hostUsername, true),
    guest: emptyParticipant("", false),
    compromises: [],
    completedModules: [],
  });

  sessionStorage.setItem(ROLE_KEY, "host");
  sessionStorage.setItem(CODE_KEY, normalizedCode);
  return { code: normalizedCode, passcode };
};

export const createDemoRoom = (): RoomState => {
  const code = "VWS-DEMO";
  const existing = readRoom(code);
  if (existing) {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(ROLE_KEY, "host");
      sessionStorage.setItem(CODE_KEY, code);
    }
    return existing;
  }

  const demoRoom: RoomState = {
    code,
    passcode: "2026",
    host: {
      name: "Bima (Simulasi)",
      isJoined: true,
      locked: true,
      lockedModules: [1],
      answers: {
        1: {
          choice: "B",
          note: "Sebaiknya utang konsumtif sebelum menikah diselesaikan masing-masing.",
        },
        2: { choice: "B" },
        3: {
          choice: "B",
          note: "Dari pos pribadi agar tidak memicu kecemburuan.",
        },
        4: {
          choice: "A",
          amount: 3500000,
          note: "Kesehatan orang tua prioritas darurat.",
        },
        5: { choice: "B" },
        6: { choice: "A" },
        7: { choice: "B" },
        8: { choice: "B", note: "Lebih baik uangnya untuk DP rumah." },
        9: {
          choice: "A",
          note: "Adik bungsu masih butuh dibantu 2 semester lagi.",
        },
        10: { choice: "A" },
      },
    },
    guest: {
      name: "Nadia (Simulasi)",
      isJoined: true,
      locked: true,
      lockedModules: [1],
      answers: {
        1: { choice: "B" },
        2: { choice: "B" },
        3: { choice: "B" },
        4: {
          choice: "C",
          amount: 1500000,
          note: "Perlu batas aman agar dana darurat inti tidak habis.",
        },
        5: { choice: "B" },
        6: { choice: "A" },
        7: { choice: "B" },
        8: { choice: "B" },
        9: {
          choice: "B",
          note: "Khawatir mengganggu kas utama jika dijadikan kewajiban tetap.",
        },
        10: { choice: "A" },
      },
    },
    compromises: [
      {
        scenarioId: 4,
        title: "Dana Darurat Medis Orang Tua",
        agreementText:
          "Bantuan medis darurat orang tua diambil dari rekening bersama maksimal Rp 2.500.000; selebihnya didiskusikan bersama dalam 24 jam.",
      },
    ],
    completedModules: [1],
  };

  writeRoom(demoRoom);
  if (typeof window !== "undefined") {
    sessionStorage.setItem(ROLE_KEY, "host");
    sessionStorage.setItem(CODE_KEY, code);
  }
  return demoRoom;
};

export type JoinResult =
  | { success: true; role: Role }
  | { success: false; error: "NOT_FOUND" | "WRONG_PIN" | "ROOM_FULL" };

export const joinRoom = (
  code: string,
  username: string,
  inputPasscode: string
): JoinResult => {
  const normalizedCode = code.toUpperCase();
  const room = readRoom(normalizedCode);
  if (!room) {
    return { success: false, error: "NOT_FOUND" };
  }

  if (room.passcode && room.passcode !== inputPasscode.trim()) {
    return { success: false, error: "WRONG_PIN" };
  }

  const existingRole = sessionStorage.getItem(ROLE_KEY);
  const existingCode = sessionStorage.getItem(CODE_KEY);
  if (existingCode === normalizedCode && existingRole === "host") {
    room.host.name = username;
    writeRoom(room);
    return { success: true, role: "host" };
  }

  if (existingCode === normalizedCode && existingRole === "guest") {
    room.guest.name = username;
    writeRoom(room);
    return { success: true, role: "guest" };
  }

  if (room.guest.isJoined && room.guest.name !== username) {
    return { success: false, error: "ROOM_FULL" };
  }

  room.guest.name = username;
  room.guest.isJoined = true;
  writeRoom(room);
  sessionStorage.setItem(ROLE_KEY, "guest");
  sessionStorage.setItem(CODE_KEY, normalizedCode);
  return { success: true, role: "guest" };
};

export const useTheme = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const saved =
      (localStorage.getItem(THEME_KEY) as "light" | "dark") || "light";
    setTheme(saved);
    document.documentElement.setAttribute("data-theme", saved);

    const onThemeChange = () => {
      const current =
        (localStorage.getItem(THEME_KEY) as "light" | "dark") || "light";
      setTheme(current);
      document.documentElement.setAttribute("data-theme", current);
    };

    window.addEventListener("vowsync:theme", onThemeChange);
    return () => window.removeEventListener("vowsync:theme", onThemeChange);
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    localStorage.setItem(THEME_KEY, next);
    document.documentElement.setAttribute("data-theme", next);
    setTheme(next);
    window.dispatchEvent(new Event("vowsync:theme"));
  };

  return { theme, toggleTheme };
};

export const simulatePartnerLock = (
  moduleId: number = 1,
  explicitCode?: string
) => {
  if (typeof window === "undefined") return;
  const code = (
    explicitCode ||
    sessionStorage.getItem(CODE_KEY) ||
    ""
  ).toUpperCase();
  if (!code) return;
  const currentRoom = readRoom(code);
  if (!currentRoom) return;
  const currentRole = (sessionStorage.getItem(ROLE_KEY) as Role) || "host";
  const otherRole: Role = currentRole === "host" ? "guest" : "host";
  const modScenarios = SCENARIOS.filter((s) => s.moduleId === moduleId);

  const partnerAnswers: Record<number, Answer> = {
    ...currentRoom[otherRole].answers,
  };
  const myAnswers: Record<number, Answer> = {
    ...currentRoom[currentRole].answers,
  };

  const partnerChoices: OptionKey[] = [
    "B",
    "A",
    "B",
    "C",
    "B",
    "A",
    "B",
    "B",
    "B",
    "A",
  ];
  const myChoices: OptionKey[] = [
    "B",
    "B",
    "B",
    "A",
    "B",
    "A",
    "B",
    "B",
    "A",
    "A",
  ];

  modScenarios.forEach((sc, idx) => {
    if (!partnerAnswers[sc.id]?.choice) {
      partnerAnswers[sc.id] = {
        choice: partnerChoices[idx % partnerChoices.length],
        amount: sc.slider ? sc.slider.defaultValue : undefined,
        note:
          idx % 3 === 0
            ? "Prioritaskan kestabilan kas rumah tangga inti terlebih dahulu."
            : undefined,
      };
    }
    if (!myAnswers[sc.id]?.choice) {
      myAnswers[sc.id] = {
        choice: myChoices[idx % myChoices.length],
        amount: sc.slider
          ? sc.slider.defaultValue + sc.slider.step * 2
          : undefined,
      };
    }
  });

  const prevPartnerLocked = currentRoom[otherRole].lockedModules || [];
  const updatedPartnerLocked = prevPartnerLocked.includes(moduleId)
    ? prevPartnerLocked
    : [...prevPartnerLocked, moduleId];

  const prevMyLocked = currentRoom[currentRole].lockedModules || [];
  const updatedMyLocked = prevMyLocked.includes(moduleId)
    ? prevMyLocked
    : [...prevMyLocked, moduleId];

  const next: RoomState = {
    ...currentRoom,
    [currentRole]: {
      ...currentRoom[currentRole],
      locked: true,
      lockedModules: updatedMyLocked,
      answers: myAnswers,
    },
    [otherRole]: {
      ...currentRoom[otherRole],
      name:
        currentRoom[otherRole].isJoined && currentRoom[otherRole].name
          ? currentRoom[otherRole].name
          : "Pasangan (Simulasi)",
      isJoined: true,
      locked: true,
      lockedModules: updatedPartnerLocked,
      answers: partnerAnswers,
    },
  };
  writeRoom(next);
};

export const useRoom = (explicitCode?: string) => {
  const resolveActiveCode = useCallback(() => {
    if (explicitCode) return explicitCode.toUpperCase();
    if (typeof window !== "undefined") {
      return (sessionStorage.getItem(CODE_KEY) || "").toUpperCase();
    }
    return "";
  }, [explicitCode]);

  const [room, setRoom] = useState<RoomState | null>(() => {
    if (typeof window === "undefined") return null;
    const code = resolveActiveCode();
    if (!code) return null;
    const existing = readRoom(code);
    if (!existing && code === "VWS-DEMO") {
      return createDemoRoom();
    }
    return existing;
  });

  const [role, setRole] = useState<Role>(() => {
    if (typeof window === "undefined") return "host";
    return (sessionStorage.getItem(ROLE_KEY) as Role) || "host";
  });

  const me = role && room ? room[role] : null;
  const partnerRole: Role = role === "host" ? "guest" : "host";
  const partner = partnerRole && room ? room[partnerRole] : null;

  const refresh = useCallback(() => {
    if (typeof window === "undefined") return;
    const code = resolveActiveCode();
    if (explicitCode && sessionStorage.getItem(CODE_KEY) !== code) {
      sessionStorage.setItem(CODE_KEY, code);
    }
    setRole((sessionStorage.getItem(ROLE_KEY) as Role) || "host");
    if (!code) {
      setRoom(null);
      return;
    }
    let loaded = readRoom(code);
    if (!loaded && code === "VWS-DEMO") {
      loaded = createDemoRoom();
    }
    setRoom(loaded);
  }, [explicitCode, resolveActiveCode]);

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
    return (
      me?.lockedModules?.includes(targetModuleId) ||
      (targetModuleId === 1 && !!me?.locked)
    );
  };

  const isPartnerLocked = (targetModuleId: number = 1) => {
    return (
      partner?.lockedModules?.includes(targetModuleId) ||
      (targetModuleId === 1 && !!partner?.locked)
    );
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
    const updatedLocked = currentLocked.includes(moduleId)
      ? currentLocked
      : [...currentLocked, moduleId];
    next[role] = { ...next[role], locked: true, lockedModules: updatedLocked };
    writeRoom(next);
  };

  const saveSignature = (dataUrl: string) => {
    const code = resolveActiveCode();
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
    const filtered = current.filter(
      (c) => c.scenarioId !== compromise.scenarioId
    );
    next.compromises = [...filtered, compromise];
    writeRoom(next);
  };

  const markModuleCompleted = (moduleId: number) => {
    const code = resolveActiveCode();
    if (!code) return;
    const currentRoom = readRoom(code);
    if (!currentRoom) return;
    const currentCompleted = currentRoom.completedModules || [];
    if (currentCompleted.includes(moduleId)) {
      return;
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
    return currentCompleted.includes(moduleId - 1);
  };

  return {
    room,
    role,
    me,
    partner,
    myName: me?.name || "Anda",
    partnerName:
      partner?.isJoined && partner?.name
        ? partner.name
        : "Pasangan (Belum Bergabung)",
    partnerLocked,
    bothLocked,
    partnerAnswers: partner?.answers ?? null,
    mySignature: me?.signature,
    partnerSignature: partner?.signature,
    compromises: room?.compromises || [],
    completedModules: room?.completedModules || [],
    saveAnswer,
    lockAnswers,
    simulatePartnerLock: (modId: number = 1) =>
      simulatePartnerLock(modId, resolveActiveCode()),
    saveSignature,
    saveCompromise,
    markModuleCompleted,
    isModuleUnlocked,
    isUserLocked,
    isPartnerLocked,
    isBothLocked,
  };
};
