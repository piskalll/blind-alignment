"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SCENARIOS } from "../data/scenarios";
import { supabase, isSupabaseConfigured } from "./supabase";

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

interface CloudStatePayload {
  v: number;
  host?: ParticipantState;
  guest?: ParticipantState;
  compromises?: CompromiseItem[];
  completedModules?: number[];
}

const parseCloudPayload = (statusField: unknown): CloudStatePayload | null => {
  if (typeof statusField !== "string" || !statusField.trim().startsWith("{")) {
    return null;
  }
  try {
    const parsed = JSON.parse(statusField) as CloudStatePayload;
    if (parsed && typeof parsed === "object" && parsed.v === 1) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
};

const mergeParticipant = (
  primary: ParticipantState | undefined,
  secondary: ParticipantState | undefined,
  fallbackName: string,
  forceJoined: boolean
): ParticipantState => {
  const base = primary || secondary || emptyParticipant(fallbackName, forceJoined);
  const other = secondary || primary || emptyParticipant(fallbackName, forceJoined);

  const mergedLockedModules = Array.from(
    new Set([...(other.lockedModules || []), ...(base.lockedModules || [])])
  );

  return {
    name: base.name || other.name || fallbackName,
    isJoined: Boolean(
      forceJoined || base.isJoined || other.isJoined || base.name || other.name
    ),
    locked: Boolean(
      base.locked || other.locked || mergedLockedModules.length > 0
    ),
    lockedModules: mergedLockedModules,
    answers: { ...(other.answers || {}), ...(base.answers || {}) },
    signature: base.signature || other.signature,
  };
};

const mergeCompromises = (
  baseList: CompromiseItem[] = [],
  overrideList: CompromiseItem[] = []
): CompromiseItem[] => {
  const map = new Map<number, CompromiseItem>();
  for (const item of baseList) {
    if (item && typeof item.scenarioId === "number") {
      map.set(item.scenarioId, item);
    }
  }
  for (const item of overrideList) {
    if (item && typeof item.scenarioId === "number") {
      map.set(item.scenarioId, item);
    }
  }
  return Array.from(map.values());
};

const buildRoomFromCloudRow = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  row: Record<string, any>,
  localRoom: RoomState | null,
  preferLocalRole?: Role | "both"
): RoomState => {
  const payload = parseCloudPayload(row.status);
  const hostName =
    row.host_name || payload?.host?.name || localRoom?.host?.name || "Host";
  const guestName =
    row.guest_name || payload?.guest?.name || localRoom?.guest?.name || "";

  const hostPrimary =
    preferLocalRole === "host" || preferLocalRole === "both"
      ? localRoom?.host
      : payload?.host;
  const hostSecondary =
    preferLocalRole === "host" || preferLocalRole === "both"
      ? payload?.host
      : localRoom?.host;

  const guestPrimary =
    preferLocalRole === "guest" || preferLocalRole === "both"
      ? localRoom?.guest
      : payload?.guest;
  const guestSecondary =
    preferLocalRole === "guest" || preferLocalRole === "both"
      ? payload?.guest
      : localRoom?.guest;

  const mergedHost = mergeParticipant(hostPrimary, hostSecondary, hostName, true);
  const mergedGuest = mergeParticipant(
    guestPrimary,
    guestSecondary,
    guestName,
    Boolean(guestName)
  );

  const cloudCompleted = Array.isArray(row.completed_modules)
    ? row.completed_modules
    : [];
  const payloadCompleted = Array.isArray(payload?.completedModules)
    ? payload.completedModules
    : [];
  const localCompleted = Array.isArray(localRoom?.completedModules)
    ? localRoom.completedModules
    : [];

  const mergedCompleted = Array.from(
    new Set([...cloudCompleted, ...payloadCompleted, ...localCompleted])
  );

  const mergedCompromises = preferLocalRole
    ? mergeCompromises(payload?.compromises, localRoom?.compromises)
    : mergeCompromises(localRoom?.compromises, payload?.compromises);

  return {
    code: String(row.code || localRoom?.code || "").toUpperCase(),
    passcode: String(row.passcode || localRoom?.passcode || "0000"),
    host: mergedHost,
    guest: mergedGuest,
    compromises: mergedCompromises,
    completedModules: mergedCompleted,
  };
};

export const syncRoomToSupabase = async (
  localRoom: RoomState,
  activeRole: Role | "both"
): Promise<RoomState> => {
  const normalizedCode = localRoom.code.toUpperCase();
  if (
    !isSupabaseConfigured ||
    !supabase ||
    normalizedCode === "VWS-DEMO" ||
    normalizedCode === "VWS-000"
  ) {
    return localRoom;
  }

  try {
    const { data: existingRow } = await supabase
      .from("rooms")
      .select("*")
      .eq("code", normalizedCode)
      .maybeSingle();

    const merged = existingRow
      ? buildRoomFromCloudRow(existingRow, localRoom, activeRole)
      : localRoom;

    const payload: CloudStatePayload = {
      v: 1,
      host: merged.host,
      guest: merged.guest,
      compromises: merged.compromises || [],
      completedModules: merged.completedModules || [],
    };

    if (existingRow) {
      await supabase
        .from("rooms")
        .update({
          host_name: merged.host.name || existingRow.host_name,
          guest_name: merged.guest.name || existingRow.guest_name || null,
          completed_modules: merged.completedModules || [],
          status: JSON.stringify(payload),
        })
        .eq("code", normalizedCode);
    } else {
      await supabase.from("rooms").insert({
        code: normalizedCode,
        passcode: merged.passcode,
        host_name: merged.host.name || "Host",
        guest_name: merged.guest.name || null,
        completed_modules: merged.completedModules || [],
        status: JSON.stringify(payload),
      });
    }

    writeRoom(merged);
    return merged;
  } catch (err) {
    console.warn("Supabase sync warning:", err);
    return localRoom;
  }
};

export const pullRoomFromSupabase = async (
  code: string
): Promise<RoomState | null> => {
  const normalizedCode = code.toUpperCase();
  const localRoom = readRoom(normalizedCode);

  if (
    !isSupabaseConfigured ||
    !supabase ||
    !normalizedCode ||
    normalizedCode === "VWS-DEMO" ||
    normalizedCode === "VWS-000"
  ) {
    return localRoom;
  }

  try {
    const { data: row, error } = await supabase
      .from("rooms")
      .select("*")
      .eq("code", normalizedCode)
      .maybeSingle();

    if (error || !row) {
      return localRoom;
    }

    const currentRole =
      typeof window !== "undefined"
        ? ((sessionStorage.getItem(ROLE_KEY) as Role) || undefined)
        : undefined;

    const payload = parseCloudPayload(row.status);
    const merged = buildRoomFromCloudRow(row, localRoom, currentRole);

    if (JSON.stringify(merged) !== JSON.stringify(localRoom)) {
      writeRoom(merged);
    }

    // If this device has local answers/locks for currentRole not yet stored in cloud payload, push them up
    if (
      currentRole &&
      localRoom &&
      JSON.stringify(merged[currentRole]) !==
        JSON.stringify(payload?.[currentRole])
    ) {
      await syncRoomToSupabase(merged, currentRole);
    }

    return merged;
  } catch {
    return localRoom;
  }
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

export const deleteRoom = (code: string) => {
  if (typeof window === "undefined" || !code) return;
  localStorage.removeItem(KEY + code.toUpperCase());
  window.dispatchEvent(new Event("vowsync:update"));
};

export const deleteRoomAsync = async (
  code: string
): Promise<{ success: boolean; cloudDeleted: boolean }> => {
  const normalizedCode = code.toUpperCase();
  deleteRoom(normalizedCode);

  let cloudDeleted = false;
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from("rooms")
        .delete()
        .eq("code", normalizedCode);
      if (!error) {
        cloudDeleted = true;
      } else {
        console.warn("Supabase delete warning:", error.message);
      }
    } catch (err) {
      console.warn("Supabase delete error:", err);
    }
  }

  return { success: true, cloudDeleted };
};

export const fetchRoomsFromSupabase = async (): Promise<RoomState[]> => {
  const localRooms = listSavedRooms();

  if (!isSupabaseConfigured || !supabase) {
    return localRooms;
  }

  try {
    const { data, error } = await supabase
      .from("rooms")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(15);

    if (error || !data) {
      console.warn(
        "Supabase fetch rooms warning, falling back to local:",
        error?.message
      );
      return localRooms;
    }

    const cloudRooms: RoomState[] = data.map((row) => {
      const existingLocal = readRoom(row.code);
      return buildRoomFromCloudRow(row, existingLocal);
    });

    const mergedMap = new Map<string, RoomState>();
    for (const r of cloudRooms) {
      mergedMap.set(r.code, r);
      writeRoom(r);
    }
    for (const r of localRooms) {
      if (!mergedMap.has(r.code)) {
        mergedMap.set(r.code, r);
      }
    }

    return Array.from(mergedMap.values());
  } catch (err) {
    console.warn("Supabase fetch rooms error, falling back to local:", err);
    return localRooms;
  }
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

export interface CreateRoomAsyncResult {
  code: string;
  passcode: string;
  cloudSynced: boolean;
  message?: string;
}

export const createRoomAsync = async (
  hostUsername: string,
  code = generateRoomCode(),
  passcode = generatePasscode()
): Promise<CreateRoomAsyncResult> => {
  const normalizedCode = code.toUpperCase();
  const trimmedName = hostUsername.trim();

  createRoom(trimmedName, normalizedCode, passcode);
  const initialRoom = readRoom(normalizedCode);

  let cloudSynced = false;
  let message = "";

  if (isSupabaseConfigured && supabase) {
    try {
      const payload: CloudStatePayload = {
        v: 1,
        host: initialRoom?.host || emptyParticipant(trimmedName, true),
        guest: initialRoom?.guest || emptyParticipant("", false),
        compromises: [],
        completedModules: [],
      };

      const { error } = await supabase.from("rooms").insert({
        code: normalizedCode,
        passcode: passcode,
        host_name: trimmedName,
        guest_name: null,
        status: JSON.stringify(payload),
        completed_modules: [],
      });

      if (error) {
        console.warn("Supabase insert warning:", error.message);
        message = `Tersimpan secara lokal. (${error.message})`;
      } else {
        cloudSynced = true;
        message = "Tersimpan di Cloud Supabase & Lokal.";
      }
    } catch (err: unknown) {
      console.warn("Supabase network error:", err);
      message = "Tersimpan secara lokal (koneksi Supabase offline).";
    }
  }

  return { code: normalizedCode, passcode, cloudSynced, message };
};

export const joinRoomAsync = async (
  code: string,
  username: string,
  inputPasscode: string
): Promise<JoinResult & { cloudSynced?: boolean }> => {
  const normalizedCode = code.trim().toUpperCase();
  const trimmedUsername = username.trim();
  const trimmedPasscode = inputPasscode.trim();

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("rooms")
        .select("*")
        .eq("code", normalizedCode)
        .maybeSingle();

      if (!error && data) {
        if (data.passcode && data.passcode !== trimmedPasscode) {
          return { success: false, error: "WRONG_PIN", cloudSynced: true };
        }

        if (
          data.guest_name &&
          data.guest_name !== trimmedUsername &&
          data.host_name !== trimmedUsername
        ) {
          return { success: false, error: "ROOM_FULL", cloudSynced: true };
        }

        const isHost = data.host_name === trimmedUsername;
        const assignedRole: Role = isHost ? "host" : "guest";

        const currentLocal = readRoom(normalizedCode);
        const mergedRoom = buildRoomFromCloudRow(data, currentLocal);

        if (!isHost) {
          mergedRoom.guest = {
            ...mergedRoom.guest,
            name: data.guest_name || trimmedUsername,
            isJoined: true,
          };
        }

        const payload: CloudStatePayload = {
          v: 1,
          host: mergedRoom.host,
          guest: mergedRoom.guest,
          compromises: mergedRoom.compromises || [],
          completedModules: mergedRoom.completedModules || [],
        };

        await supabase
          .from("rooms")
          .update({
            guest_name: mergedRoom.guest.name || trimmedUsername,
            status: JSON.stringify(payload),
            completed_modules: mergedRoom.completedModules || [],
          })
          .eq("code", normalizedCode);

        writeRoom(mergedRoom);
        sessionStorage.setItem(ROLE_KEY, assignedRole);
        sessionStorage.setItem(CODE_KEY, normalizedCode);

        return { success: true, role: assignedRole, cloudSynced: true };
      }
    } catch (err) {
      console.warn("Supabase join fetch error, falling back to local:", err);
    }
  }

  const localResult = joinRoom(normalizedCode, trimmedUsername, trimmedPasscode);
  return { ...localResult, cloudSynced: false };
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
  void syncRoomToSupabase(next, "both");
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

  const answerSyncTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  // Real-time cloud synchronization (Polling + Supabase Realtime channel)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const code = resolveActiveCode();
    if (
      !code ||
      code === "VWS-DEMO" ||
      code === "VWS-000" ||
      !isSupabaseConfigured ||
      !supabase
    ) {
      return;
    }

    // Initial pull on mount
    void pullRoomFromSupabase(code);

    // Poll every 2.5 seconds so partner progress and locks appear automatically across devices
    const intervalId = setInterval(() => {
      void pullRoomFromSupabase(code);
    }, 2500);

    const handleVisibilityOrFocus = () => {
      if (document.visibilityState === "visible") {
        void pullRoomFromSupabase(code);
      }
    };

    window.addEventListener("focus", handleVisibilityOrFocus);
    document.addEventListener("visibilitychange", handleVisibilityOrFocus);

    // Also subscribe to Supabase Realtime postgres_changes with unique topic to avoid collision
    const sb = supabase;
    const channelTopic = `vowsync-${code}-${Math.random().toString(36).slice(2, 8)}`;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let channel: any = null;

    try {
      channel = sb
        .channel(channelTopic)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "rooms",
            filter: `code=eq.${code}`,
          },
          () => {
            void pullRoomFromSupabase(code);
          }
        )
        .subscribe();
    } catch (err) {
      console.warn("Supabase Realtime subscription caught error:", err);
    }

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("focus", handleVisibilityOrFocus);
      document.removeEventListener("visibilitychange", handleVisibilityOrFocus);
      if (channel) {
        try {
          void sb.removeChannel(channel);
        } catch {
          // Ignore removal error
        }
      }
    };
  }, [resolveActiveCode]);

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
    const code = resolveActiveCode();
    const currentRoom = (code ? readRoom(code) : null) || room;
    if (!currentRoom) return;
    const currentRole = (sessionStorage.getItem(ROLE_KEY) as Role) || role;

    const next: RoomState = {
      ...currentRoom,
      [currentRole]: {
        ...currentRoom[currentRole],
        answers: {
          ...currentRoom[currentRole].answers,
          [questionId]: answer,
        },
      },
    };
    writeRoom(next);

    if (answerSyncTimerRef.current) {
      clearTimeout(answerSyncTimerRef.current);
    }
    answerSyncTimerRef.current = setTimeout(() => {
      const latestLocal = readRoom(next.code) || next;
      void syncRoomToSupabase(latestLocal, currentRole);
    }, 300);
  };

  const lockAnswers = (moduleId: number = 1) => {
    const code = resolveActiveCode();
    const currentRoom = (code ? readRoom(code) : null) || room;
    if (!currentRoom) return;
    const currentRole = (sessionStorage.getItem(ROLE_KEY) as Role) || role;

    if (answerSyncTimerRef.current) {
      clearTimeout(answerSyncTimerRef.current);
      answerSyncTimerRef.current = null;
    }

    const currentLocked = currentRoom[currentRole].lockedModules || [];
    const updatedLocked = currentLocked.includes(moduleId)
      ? currentLocked
      : [...currentLocked, moduleId];

    const next: RoomState = {
      ...currentRoom,
      [currentRole]: {
        ...currentRoom[currentRole],
        locked: true,
        lockedModules: updatedLocked,
      },
    };
    writeRoom(next);
    void syncRoomToSupabase(next, currentRole);
  };

  const saveSignature = (dataUrl: string) => {
    const code = resolveActiveCode();
    if (!code) return;
    const currentRoom = readRoom(code);
    if (!currentRoom) return;
    const currentRole = (sessionStorage.getItem(ROLE_KEY) as Role) || role;
    const next: RoomState = {
      ...currentRoom,
      [currentRole]: {
        ...currentRoom[currentRole],
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
      },
    };
    writeRoom(next);
    void syncRoomToSupabase(next, currentRole);
  };

  const saveCompromise = (compromise: CompromiseItem) => {
    const code = resolveActiveCode();
    const currentRoom = (code ? readRoom(code) : null) || room;
    if (!currentRoom) return;
    const currentRole = (sessionStorage.getItem(ROLE_KEY) as Role) || role;
    const current = currentRoom.compromises || [];
    const filtered = current.filter(
      (c) => c.scenarioId !== compromise.scenarioId
    );
    const next: RoomState = {
      ...currentRoom,
      compromises: [...filtered, compromise],
    };
    writeRoom(next);
    void syncRoomToSupabase(next, currentRole);
  };

  const markModuleCompleted = (moduleId: number) => {
    const code = resolveActiveCode();
    if (!code) return;
    const currentRoom = readRoom(code);
    if (!currentRoom) return;
    const currentRole = (sessionStorage.getItem(ROLE_KEY) as Role) || role;
    const currentCompleted = currentRoom.completedModules || [];
    if (currentCompleted.includes(moduleId)) {
      return;
    }
    const next: RoomState = {
      ...currentRoom,
      completedModules: [...currentCompleted, moduleId],
    };
    writeRoom(next);
    void syncRoomToSupabase(next, currentRole);
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
