import { supabase, isSupabaseConfigured } from "./supabase";
import { matchScore } from "./scoring";
import type { Answer, OptionKey, RoomState } from "./sessionStore";

const RESERVED_TAGS = new Set(["DEMO", "000", "ADMIN", "NULL", "OFF"]);

/**
 * Normalizes a campaign/cohort tag from `?track=...` into an uppercase alphanumeric label (2-10 chars).
 */
export const sanitizeTrackTag = (
  raw: string | null | undefined
): string | null => {
  if (!raw) return null;
  const cleaned = raw
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 10);
  if (cleaned.length < 2 || RESERVED_TAGS.has(cleaned)) {
    return null;
  }
  return cleaned;
};

/**
 * Generates a unique 2-person Dual-Blind room code carrying the tracking tag prefix (e.g. VWS-UJI-482).
 */
export const generateTrackedRoomCode = (trackTag: string): string => {
  const cleanTag = sanitizeTrackTag(trackTag);
  const randomDigits = Math.floor(100 + Math.random() * 900);
  if (!cleanTag) {
    return `VWS-${randomDigits}`;
  }
  return `VWS-${cleanTag}-${randomDigits}`;
};

/**
 * Extracts the tracking tag from a room code if and only if the room belongs to a tracked cohort.
 * Standard public rooms (`VWS-482`) return `null` so their data is never logged to `analytics_logs`.
 */
export const extractTrackTagFromCode = (
  code: string | null | undefined
): string | null => {
  if (!code) return null;
  const normalized = code.trim().toUpperCase();
  if (normalized === "VWS-DEMO" || normalized === "VWS-000") {
    return null;
  }

  const prefixedMatch = normalized.match(/^VWS-([A-Z0-9]{2,10})-(\d{3,4})$/);
  if (prefixedMatch) {
    const tag = prefixedMatch[1];
    if (!RESERVED_TAGS.has(tag)) {
      return tag;
    }
  }

  const allowlistRaw = process.env.NEXT_PUBLIC_TRACKED_ROOM_CODES || "";
  if (allowlistRaw.trim()) {
    const allowlist = allowlistRaw
      .split(",")
      .map((item) => item.trim().toUpperCase())
      .filter(Boolean);
    if (allowlist.includes(normalized)) {
      return "CUSTOM";
    }
  }

  return null;
};

/**
 * Masks participant names for privacy-safe session history (e.g. "Bima" -> "B***").
 */
export const maskParticipantName = (
  name: string | null | undefined
): string | null => {
  const trimmed = (name || "").trim();
  if (!trimmed) return null;
  const firstChar = trimmed[0].toUpperCase();
  return `${firstChar}***`;
};

/**
 * Extracts strictly the A/B/C option keys, discarding personal notes and slider amounts.
 */
export const sanitizeChoicesOnly = (
  answers: Record<number, Answer> | undefined
): Record<string, OptionKey> => {
  const result: Record<string, OptionKey> = {};
  if (!answers) return result;

  for (const [key, value] of Object.entries(answers)) {
    const choice = value?.choice;
    if (choice === "A" || choice === "B" || choice === "C") {
      result[String(key)] = choice;
    }
  }
  return result;
};

/**
 * Computes average alignment score (0-100) across all scenarios answered by both partners.
 */
export const computeChoicesAlignmentScore = (
  hostChoices: Record<string, OptionKey>,
  guestChoices: Record<string, OptionKey>
): number | null => {
  let totalScore = 0;
  let pairedCount = 0;

  for (const [scenarioId, hostChoice] of Object.entries(hostChoices)) {
    const guestChoice = guestChoices[scenarioId];
    if (hostChoice && guestChoice) {
      totalScore += matchScore({ choice: hostChoice }, { choice: guestChoice });
      pairedCount += 1;
    }
  }

  if (pairedCount === 0) return null;
  return Math.round(totalScore / pairedCount);
};

export interface AnalyticsLogRow {
  room_code: string;
  track_tag: string;
  host_masked: string;
  guest_masked: string | null;
  guest_joined: boolean;
  host_answers: Record<string, OptionKey>;
  guest_answers: Record<string, OptionKey>;
  host_locked_modules: number[];
  guest_locked_modules: number[];
  completed_modules: number[];
  alignment_score: number | null;
  created_at?: string;
  updated_at: string;
}

const normalizeModuleList = (
  modules: number[] | undefined,
  legacyLocked?: boolean
): number[] => {
  const base = Array.isArray(modules)
    ? modules.filter((m) => [1, 2, 3, 4].includes(Number(m))).map(Number)
    : [];
  if (legacyLocked && !base.includes(1)) {
    base.push(1);
  }
  return Array.from(new Set(base)).sort((a, b) => a - b);
};

/**
 * Permanently upserts privacy-safe analytics data for tracked rooms (`VWS-<TAG>-<NNN>`).
 * Regular public rooms exit immediately with zero network traffic.
 */
export const syncAnalyticsLog = async (room: RoomState): Promise<void> => {
  const normalizedCode = (room?.code || "").trim().toUpperCase();
  const trackTag = extractTrackTagFromCode(normalizedCode);

  if (!trackTag || !isSupabaseConfigured || !supabase) {
    return;
  }

  try {
    const hostChoices = sanitizeChoicesOnly(room.host?.answers);
    const guestChoices = sanitizeChoicesOnly(room.guest?.answers);
    const guestJoined = Boolean(
      room.guest?.isJoined && (room.guest?.name || "").trim().length > 0
    );

    const payload: AnalyticsLogRow = {
      room_code: normalizedCode,
      track_tag: trackTag,
      host_masked: maskParticipantName(room.host?.name) || "H***",
      guest_masked: guestJoined
        ? maskParticipantName(room.guest?.name) || "G***"
        : null,
      guest_joined: guestJoined,
      host_answers: hostChoices,
      guest_answers: guestChoices,
      host_locked_modules: normalizeModuleList(
        room.host?.lockedModules,
        room.host?.locked
      ),
      guest_locked_modules: normalizeModuleList(
        room.guest?.lockedModules,
        room.guest?.locked
      ),
      completed_modules: normalizeModuleList(room.completedModules, false),
      alignment_score: guestJoined
        ? computeChoicesAlignmentScore(hostChoices, guestChoices)
        : null,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("analytics_logs")
      .upsert(payload, { onConflict: "room_code" });

    if (error) {
      console.warn("Supabase analytics_logs upsert warning:", error.message);
    }
  } catch (err) {
    console.warn("Analytics log sync skipped:", err);
  }
};
