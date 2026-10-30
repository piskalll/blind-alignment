import crypto from "crypto";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { MODULES, SCENARIOS } from "../../data/scenarios";
import { matchScore } from "../../lib/scoring";
import {
  computeChoicesAlignmentScore,
  extractTrackTagFromCode,
  maskParticipantName,
  sanitizeChoicesOnly,
} from "../../lib/analyticsLogger";
import type { Answer, OptionKey } from "../../lib/sessionStore";

const AUTH_COOKIE_NAME = "vowsync_analytics_auth";

const computeAuthToken = (adminPin: string): string => {
  return crypto
    .createHmac("sha256", adminPin)
    .update("vowsync-analytics-session-v1")
    .digest("hex");
};

const safeStringEqual = (a: string, b: string): boolean => {
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
};

interface RawAnalyticsRow {
  room_code: string;
  track_tag: string;
  host_masked: string | null;
  guest_masked: string | null;
  guest_joined: boolean | null;
  host_answers: Record<string, OptionKey> | null;
  guest_answers: Record<string, OptionKey> | null;
  host_locked_modules: number[] | null;
  guest_locked_modules: number[] | null;
  completed_modules: number[] | null;
  alignment_score: number | null;
  created_at: string | null;
  updated_at: string | null;
}

const getServerSupabase = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "";
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
};

const sanitizeAnswerRecord = (
  raw: unknown
): Record<string, OptionKey> => {
  if (!raw || typeof raw !== "object") return {};
  const out: Record<string, OptionKey> = {};
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    const numId = Number(k);
    if (!Number.isInteger(numId) || numId < 1 || numId > 40) continue;
    if (v === "A" || v === "B" || v === "C") {
      out[String(numId)] = v;
    }
  }
  return out;
};

export async function POST(request: NextRequest) {
  let body: { pin?: string; action?: string } = {};
  try {
    body = (await request.json()) as { pin?: string; action?: string };
  } catch {
    return NextResponse.json(
      { ok: false, error: "INVALID_BODY", message: "Format permintaan tidak valid." },
      { status: 400 }
    );
  }

  const cookieStore = await cookies();

  if (body.action === "logout") {
    cookieStore.delete(AUTH_COOKIE_NAME);
    return NextResponse.json({ ok: true });
  }

  const configuredPin = (process.env.ANALYTICS_ADMIN_PIN || "").trim();
  if (!configuredPin) {
    return NextResponse.json(
      {
        ok: false,
        error: "PIN_NOT_CONFIGURED",
        message:
          "Variabel server ANALYTICS_ADMIN_PIN belum diatur di .env.local.",
      },
      { status: 503 }
    );
  }

  const submittedPin = (body.pin || "").trim();
  if (!submittedPin || !safeStringEqual(submittedPin, configuredPin)) {
    return NextResponse.json(
      {
        ok: false,
        error: "INVALID_PIN",
        message: "PIN Rahasia Admin tidak sesuai.",
      },
      { status: 401 }
    );
  }

  const token = computeAuthToken(configuredPin);
  cookieStore.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  return NextResponse.json({ ok: true });
}

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const configuredPin = (process.env.ANALYTICS_ADMIN_PIN || "").trim();
  const sb = getServerSupabase();
  const supabaseConfigured = Boolean(sb);

  if (!configuredPin) {
    return NextResponse.json({
      authenticated: false,
      pinConfigured: false,
      supabaseConfigured,
    });
  }

  const sessionToken = cookieStore.get(AUTH_COOKIE_NAME)?.value || "";
  const expectedToken = computeAuthToken(configuredPin);
  if (!sessionToken || !safeStringEqual(sessionToken, expectedToken)) {
    return NextResponse.json({
      authenticated: false,
      pinConfigured: true,
      supabaseConfigured,
    });
  }

  if (!sb) {
    return NextResponse.json({
      authenticated: true,
      pinConfigured: true,
      supabaseConfigured: false,
      tableMissing: false,
    });
  }

  const tagFilter = (
    request.nextUrl.searchParams.get("tag") || "ALL"
  ).toUpperCase();

  const { data: allRows, error } = await sb
    .from("analytics_logs")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(1000);

  if (error) {
    const code = error.code || "";
    const msg = error.message || "";
    const isPermissionDenied =
      code === "42501" || /permission denied/i.test(msg);
    const isMissingTable =
      !isPermissionDenied &&
      (code === "42P01" ||
        code === "PGRST205" ||
        /could not find the table|does not exist/i.test(msg));

    return NextResponse.json({
      authenticated: true,
      pinConfigured: true,
      supabaseConfigured: true,
      tableMissing: isMissingTable,
      permissionDenied: isPermissionDenied,
      dbError: isMissingTable || isPermissionDenied ? null : `${code ? `[${code}] ` : ""}${msg}`,
    });
  }

  const rowMap = new Map<string, RawAnalyticsRow>();
  for (const r of (allRows || []) as RawAnalyticsRow[]) {
    if (r?.room_code) {
      rowMap.set(r.room_code.trim().toUpperCase(), r);
    }
  }

  // Also backfill any active rooms in `public.rooms` created before `analytics_logs` was active
  const { data: activeRooms, error: roomsError } = await sb
    .from("rooms")
    .select("code, host_name, guest_name, completed_modules, status, created_at")
    .limit(500);

  const customCountByRoom = new Map<string, number>();

  if (!roomsError && Array.isArray(activeRooms)) {
    const backfillRows: RawAnalyticsRow[] = [];

    for (const roomRow of activeRooms) {
      const normalizedCode = String(roomRow?.code || "")
        .trim()
        .toUpperCase();
      const trackTag = extractTrackTagFromCode(normalizedCode);
      if (!trackTag) continue;

      let parsedPayload: {
        v?: number;
        host?: {
          name?: string;
          isJoined?: boolean;
          locked?: boolean;
          lockedModules?: number[];
          answers?: Record<number, Answer>;
        };
        guest?: {
          name?: string;
          isJoined?: boolean;
          locked?: boolean;
          lockedModules?: number[];
          answers?: Record<number, Answer>;
        };
        completedModules?: number[];
        customScenarios?: unknown[];
      } | null = null;

      if (
        typeof roomRow.status === "string" &&
        roomRow.status.trim().startsWith("{")
      ) {
        try {
          parsedPayload = JSON.parse(roomRow.status);
        } catch {
          parsedPayload = null;
        }
      }

      const customCount = Array.isArray(parsedPayload?.customScenarios)
        ? parsedPayload.customScenarios.length
        : 0;
      customCountByRoom.set(normalizedCode, customCount);

      const hostChoices = sanitizeChoicesOnly(parsedPayload?.host?.answers);
      const guestChoices = sanitizeChoicesOnly(parsedPayload?.guest?.answers);
      const guestNameRaw = String(
        roomRow.guest_name || parsedPayload?.guest?.name || ""
      ).trim();
      const guestJoined = Boolean(
        guestNameRaw.length > 0 || parsedPayload?.guest?.isJoined
      );

      const normalizeModArr = (
        arr: unknown,
        legacyLocked?: boolean
      ): number[] => {
        const list = Array.isArray(arr)
          ? arr
              .map(Number)
              .filter(
                (m) => m === 1 || m === 2 || m === 3 || m === 4 || m === 5
              )
          : [];
        if (legacyLocked && !list.includes(1)) list.push(1);
        return Array.from(new Set(list)).sort((a, b) => a - b);
      };

      const completedMerged = Array.from(
        new Set([
          ...normalizeModArr(roomRow.completed_modules),
          ...normalizeModArr(parsedPayload?.completedModules),
        ])
      ).sort((a, b) => a - b);

      const candidate: RawAnalyticsRow = {
        room_code: normalizedCode,
        track_tag: trackTag,
        host_masked:
          maskParticipantName(
            roomRow.host_name || parsedPayload?.host?.name
          ) || "H***",
        guest_masked: guestJoined
          ? maskParticipantName(guestNameRaw) || "G***"
          : null,
        guest_joined: guestJoined,
        host_answers: hostChoices,
        guest_answers: guestChoices,
        host_locked_modules: normalizeModArr(
          parsedPayload?.host?.lockedModules,
          parsedPayload?.host?.locked
        ),
        guest_locked_modules: normalizeModArr(
          parsedPayload?.guest?.lockedModules,
          parsedPayload?.guest?.locked
        ),
        completed_modules: completedMerged,
        alignment_score: guestJoined
          ? computeChoicesAlignmentScore(hostChoices, guestChoices)
          : null,
        created_at: roomRow.created_at || new Date().toISOString(),
        updated_at: roomRow.created_at || new Date().toISOString(),
      };

      const existing = rowMap.get(normalizedCode);
      const existingHostCount = existing
        ? Object.keys(sanitizeAnswerRecord(existing.host_answers)).length
        : 0;
      const existingGuestCount = existing
        ? Object.keys(sanitizeAnswerRecord(existing.guest_answers)).length
        : 0;
      const existingCompletedCount = Array.isArray(existing?.completed_modules)
        ? existing.completed_modules.length
        : 0;

      const isNewerOrMissing =
        !existing ||
        (!existing.guest_joined && candidate.guest_joined) ||
        Object.keys(hostChoices).length > existingHostCount ||
        Object.keys(guestChoices).length > existingGuestCount ||
        completedMerged.length > existingCompletedCount;

      if (isNewerOrMissing) {
        const mergedRow: RawAnalyticsRow = existing
          ? {
              ...existing,
              guest_joined: Boolean(
                existing.guest_joined || candidate.guest_joined
              ),
              guest_masked: candidate.guest_masked || existing.guest_masked,
              host_answers: {
                ...sanitizeAnswerRecord(existing.host_answers),
                ...hostChoices,
              },
              guest_answers: {
                ...sanitizeAnswerRecord(existing.guest_answers),
                ...guestChoices,
              },
              host_locked_modules: Array.from(
                new Set([
                  ...(existing.host_locked_modules || []),
                  ...(candidate.host_locked_modules || []),
                ])
              ).sort((a, b) => a - b),
              guest_locked_modules: Array.from(
                new Set([
                  ...(existing.guest_locked_modules || []),
                  ...(candidate.guest_locked_modules || []),
                ])
              ).sort((a, b) => a - b),
              completed_modules: Array.from(
                new Set([
                  ...(existing.completed_modules || []),
                  ...completedMerged,
                ])
              ).sort((a, b) => a - b),
              alignment_score:
                candidate.alignment_score ?? existing.alignment_score,
            }
          : candidate;

        rowMap.set(normalizedCode, mergedRow);
        backfillRows.push(mergedRow);
      }
    }

    if (backfillRows.length > 0) {
      await sb
        .from("analytics_logs")
        .upsert(backfillRows, { onConflict: "room_code" });
    }
  }

  const typedAllRows = Array.from(rowMap.values()).sort((a, b) => {
    const timeA = a.updated_at ? new Date(a.updated_at).getTime() : 0;
    const timeB = b.updated_at ? new Date(b.updated_at).getTime() : 0;
    return timeB - timeA;
  });

  const availableTags = Array.from(
    new Set(
      typedAllRows
        .map((r) => (r.track_tag || "").trim().toUpperCase())
        .filter(Boolean)
    )
  ).sort((a, b) => {
    if (a === "PUBLIK") return -1;
    if (b === "PUBLIK") return 1;
    return a.localeCompare(b);
  });

  const filteredRows =
    tagFilter === "ALL"
      ? typedAllRows
      : typedAllRows.filter(
          (r) => (r.track_tag || "").trim().toUpperCase() === tagFilter
        );

  const normalizedSessions = filteredRows.map((row) => {
    const hostAnswers = sanitizeAnswerRecord(row.host_answers);
    const guestAnswers = sanitizeAnswerRecord(row.guest_answers);
    const guestJoined = Boolean(row.guest_joined);
    const hostLockedModules = Array.isArray(row.host_locked_modules)
      ? row.host_locked_modules.map(Number)
      : [];
    const guestLockedModules = Array.isArray(row.guest_locked_modules)
      ? row.guest_locked_modules.map(Number)
      : [];
    const completedModules = Array.isArray(row.completed_modules)
      ? row.completed_modules.map(Number)
      : [];
    const normalizedCodeKey = row.room_code.trim().toUpperCase();
    const customQuestionCount = customCountByRoom.get(normalizedCodeKey) || 0;

    return {
      roomCode: row.room_code,
      trackTag: (row.track_tag || "CUSTOM").toUpperCase(),
      hostMasked: row.host_masked || "H***",
      guestMasked: guestJoined ? row.guest_masked || "G***" : null,
      guestJoined,
      hostAnswerCount: Object.keys(hostAnswers).length,
      guestAnswerCount: Object.keys(guestAnswers).length,
      hostLockedModules,
      guestLockedModules,
      completedModules,
      customQuestionCount,
      alignmentScore:
        typeof row.alignment_score === "number" ? row.alignment_score : null,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      hostAnswers,
      guestAnswers,
    };
  });

  const totalRooms = normalizedSessions.length;
  const pairedRooms = normalizedSessions.filter((s) => s.guestJoined).length;
  const soloRooms = totalRooms - pairedRooms;
  const totalUsers = totalRooms + pairedRooms;

  const completedAnyRoomsList = normalizedSessions.filter(
    (s) => s.completedModules.length > 0
  );
  const completedAnyModuleRooms = completedAnyRoomsList.length;
  const completedAnyModuleUsers = completedAnyRoomsList.reduce(
    (acc, s) => acc + (s.guestJoined ? 2 : 1),
    0
  );
  const completedAllModulesRooms = normalizedSessions.filter((s) =>
    [1, 2, 3, 4].every((m) => s.completedModules.includes(m))
  ).length;

  const roomsWithCustomQuestions = normalizedSessions.filter(
    (s) =>
      s.customQuestionCount > 0 ||
      s.completedModules.includes(5) ||
      s.hostLockedModules.includes(5) ||
      s.guestLockedModules.includes(5)
  ).length;
  const totalCustomQuestionsCreated = normalizedSessions.reduce(
    (acc, s) => acc + s.customQuestionCount,
    0
  );
  const bothLockedCustomRooms = normalizedSessions.filter(
    (s) =>
      s.hostLockedModules.includes(5) && s.guestLockedModules.includes(5)
  ).length;
  const completedCustomRooms = normalizedSessions.filter((s) =>
    s.completedModules.includes(5)
  ).length;

  const scoredSessions = normalizedSessions.filter(
    (s) => typeof s.alignmentScore === "number"
  );
  const averageAlignment =
    scoredSessions.length > 0
      ? Math.round(
          scoredSessions.reduce((acc, s) => acc + (s.alignmentScore || 0), 0) /
            scoredSessions.length
        )
      : null;

  const moduleFunnel = MODULES.map((mod) => {
    const modScenarioIds = SCENARIOS.filter((s) => s.moduleId === mod.id).map(
      (s) => String(s.id)
    );

    let startedRooms = 0;
    let startedUsers = 0;
    let bothLockedRooms = 0;
    let completedRooms = 0;
    let completedUsers = 0;

    for (const sess of normalizedSessions) {
      const hostStarted = modScenarioIds.some((id) => Boolean(sess.hostAnswers[id]));
      const guestStarted =
        sess.guestJoined &&
        modScenarioIds.some((id) => Boolean(sess.guestAnswers[id]));

      if (hostStarted || guestStarted) {
        startedRooms += 1;
      }
      if (hostStarted) startedUsers += 1;
      if (guestStarted) startedUsers += 1;

      if (
        sess.hostLockedModules.includes(mod.id) &&
        sess.guestLockedModules.includes(mod.id)
      ) {
        bothLockedRooms += 1;
      }

      if (sess.completedModules.includes(mod.id)) {
        completedRooms += 1;
        completedUsers += sess.guestJoined ? 2 : 1;
      }
    }

    return {
      moduleId: mod.id,
      title: mod.title,
      startedRooms,
      startedUsers,
      bothLockedRooms,
      completedRooms,
      completedUsers,
    };
  });

  const scenarioStats = SCENARIOS.map((sc) => {
    const idKey = String(sc.id);
    let countA = 0;
    let countB = 0;
    let countC = 0;
    let pairedComparisons = 0;
    let conflictCount = 0;
    let severeConflictCount = 0;

    for (const sess of normalizedSessions) {
      const h = sess.hostAnswers[idKey];
      const g = sess.guestJoined ? sess.guestAnswers[idKey] : undefined;

      if (h === "A") countA += 1;
      else if (h === "B") countB += 1;
      else if (h === "C") countC += 1;

      if (g === "A") countA += 1;
      else if (g === "B") countB += 1;
      else if (g === "C") countC += 1;

      if (h && g) {
        pairedComparisons += 1;
        if (h !== g) {
          conflictCount += 1;
          if (matchScore({ choice: h }, { choice: g }) < 50) {
            severeConflictCount += 1;
          }
        }
      }
    }

    const totalResponses = countA + countB + countC;
    const pctA =
      totalResponses > 0 ? Math.round((countA / totalResponses) * 100) : 0;
    const pctB =
      totalResponses > 0 ? Math.round((countB / totalResponses) * 100) : 0;
    const pctC =
      totalResponses > 0 ? Math.round((countC / totalResponses) * 100) : 0;
    const conflictRate =
      pairedComparisons > 0
        ? Math.round((conflictCount / pairedComparisons) * 100)
        : 0;

    return {
      id: sc.id,
      moduleId: sc.moduleId,
      categoryLabel: sc.categoryLabel,
      title: sc.title,
      options: sc.options,
      totalResponses,
      countA,
      countB,
      countC,
      pctA,
      pctB,
      pctC,
      pairedComparisons,
      conflictCount,
      severeConflictCount,
      conflictRate,
    };
  });

  const topConflictScenarios = [...scenarioStats]
    .filter((s) => s.pairedComparisons > 0 && s.conflictCount > 0)
    .sort((a, b) => {
      if (b.conflictRate !== a.conflictRate) {
        return b.conflictRate - a.conflictRate;
      }
      if (b.severeConflictCount !== a.severeConflictCount) {
        return b.severeConflictCount - a.severeConflictCount;
      }
      return b.conflictCount - a.conflictCount;
    })
    .slice(0, 6);

  return NextResponse.json({
    authenticated: true,
    pinConfigured: true,
    supabaseConfigured: true,
    tableMissing: false,
    dbError: null,
    selectedTag: tagFilter,
    availableTags,
    summary: {
      totalRooms,
      totalUsers,
      pairedRooms,
      soloRooms,
      completedAnyModuleRooms,
      completedAnyModuleUsers,
      completedAllModulesRooms,
      averageAlignment,
      moduleFunnel,
      customAdoption: {
        roomsWithCustomQuestions,
        totalCustomQuestionsCreated,
        bothLockedCustomRooms,
        completedCustomRooms,
      },
    },
    topConflictScenarios,
    scenarioStats,
    sessions: normalizedSessions,
  });
}
