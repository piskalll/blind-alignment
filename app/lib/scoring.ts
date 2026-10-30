import { SCENARIOS, DilemmaScenario } from "../data/scenarios";
import type { Answer } from "./sessionStore";

export const CRITICAL_THRESHOLD = 50;

/** Options are ordered A-B-C; B is adjacent to both ends, A and C are polar opposites. */
export const matchScore = (a?: Answer, b?: Answer): number => {
  if (!a?.choice || !b?.choice) return 0;
  if (a.choice === b.choice) return 100;
  return a.choice === "B" || b.choice === "B" ? 70 : 30;
};

export interface ScenarioResult {
  scenario: DilemmaScenario;
  score: number;
  critical: boolean;
}

export interface AlignmentSummary {
  overall: number | null;
  byCategory: Record<string, number>;
  results: ScenarioResult[];
  essayScenarios: DilemmaScenario[];
}

export const computeAlignment = (
  mine: Record<number, Answer>,
  partner: Record<number, Answer>,
  moduleId: number = 1,
  overrideScenarios?: DilemmaScenario[]
): AlignmentSummary => {
  const scenariosToUse =
    overrideScenarios !== undefined
      ? overrideScenarios
      : (() => {
          const targetScenarios = SCENARIOS.filter((s) => s.moduleId === moduleId);
          return targetScenarios.length > 0 ? targetScenarios : SCENARIOS;
        })();

  const abcScenarios = scenariosToUse.filter((s) => s.questionType !== "essay");
  const essayScenarios = scenariosToUse.filter((s) => s.questionType === "essay");

  const results = abcScenarios.map((scenario) => {
    const score = matchScore(mine[scenario.id], partner[scenario.id]);
    return { scenario, score, critical: score < CRITICAL_THRESHOLD };
  });

  const sums: Record<string, { total: number; n: number }> = {};
  results.forEach((r) => {
    const label = r.scenario.categoryLabel || r.scenario.category;
    const c = (sums[label] ??= { total: 0, n: 0 });
    c.total += r.score;
    c.n += 1;
  });

  const byCategory = Object.fromEntries(
    Object.entries(sums).map(([k, v]) => [k, Math.round(v.total / v.n)])
  );
  const overall =
    results.length > 0
      ? Math.round(results.reduce((s, r) => s + r.score, 0) / results.length)
      : null;

  return { overall, byCategory, results, essayScenarios };
};
