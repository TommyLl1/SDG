import type { DerivedMetrics, EsgDataset, FrameworkId, PillarScores, RadarPoint } from './types';
import { clamp, round } from './format';
import { getFramework } from './frameworks';

export function scaleToScore(value: number, target: number, invert: boolean): number {
  if (target <= 0) return 0;
  if (invert) {
    if (value <= 0) return 100;
    const ratio = value / target;
    if (ratio <= 1) return clamp(100 - ratio * 20, 70, 100);
    return clamp(80 - (ratio - 1) * 80, 20, 80);
  }
  const ratio = value / target;
  return clamp(ratio * 100, 20, 100);
}

export function computeScores(dataset: EsgDataset, metrics: DerivedMetrics, framework: FrameworkId): PillarScores {
  const fw = getFramework(framework);
  const t = dataset.targets;
  const y = metrics.ytd;

  const emissionVsYtd =
    t.annualScope12Tco2e === 0 ? 1 : metrics.prorated.scope12TargetTco2e / Math.max(y.scope12LocationTco2e, 1);
  const environmental = round(
    clamp(
      0.45 * clamp(emissionVsYtd * 90, 40, 100) +
        0.25 * scaleToScore(y.renewableSharePct, t.renewableSharePct, false) +
        0.15 * scaleToScore(y.recycledPct, t.wasteRecycledPct, false) +
        0.15 * 86,
      0,
      100,
    ),
    0,
  );

  const femalePct = (dataset.social.snapshot.female / dataset.social.snapshot.headcount) * 100;
  const social = round(
    clamp(
      0.35 * scaleToScore(y.ltifr, t.ltifr, true) +
        0.25 * scaleToScore(y.trainingHoursPerEmployee, metrics.prorated.trainingHoursPerEmployee, false) +
        0.2 * scaleToScore(femalePct, t.femaleWorkforcePct, false) +
        0.2 * scaleToScore(y.annualizedTurnoverPct, t.turnoverPct, true),
      0,
      100,
    ),
    0,
  );

  const governance = round(
    clamp(
      0.45 * scaleToScore(metrics.complianceAverage, t.compliancePct, false) +
        0.35 * scaleToScore(metrics.policyAdherenceAverage, 100, false) +
        0.2 * (dataset.governance.whistleblowing.agingOver90Days > 0 ? 78 : 92),
      0,
      100,
    ),
    0,
  );

  const integrated = round(
    environmental * fw.scoreWeights.e + social * fw.scoreWeights.s + governance * fw.scoreWeights.g,
    0,
  );

  return {
    environmental,
    social,
    governance,
    integrated,
    weights: fw.scoreWeights,
    method: fw.scoreMethod,
  };
}

export function radarPoints(
  dataset: EsgDataset,
  metrics: DerivedMetrics,
  scores: PillarScores,
  healthySourcePct: number,
): RadarPoint[] {
  const t = dataset.targets;
  const y = metrics.ytd;
  const femalePct = (dataset.social.snapshot.female / dataset.social.snapshot.headcount) * 100;

  return [
    { subject: 'Emission control', value: scores.environmental, fullMark: 100 },
    {
      subject: 'Energy mix',
      value: round(scaleToScore(y.renewableSharePct, t.renewableSharePct, false), 0),
      fullMark: 100,
    },
    {
      subject: 'Workforce stability',
      value: round(scaleToScore(y.annualizedTurnoverPct, t.turnoverPct, true), 0),
      fullMark: 100,
    },
    { subject: 'Safety', value: round(scaleToScore(y.ltifr, t.ltifr, true), 0), fullMark: 100 },
    { subject: 'Diversity', value: round(scaleToScore(femalePct, t.femaleWorkforcePct, false), 0), fullMark: 100 },
    { subject: 'Data integrity', value: round(healthySourcePct, 0), fullMark: 100 },
    { subject: 'Governance', value: scores.governance, fullMark: 100 },
  ];
}

export function riskFromScore(score: number): number {
  return round(clamp(100 - score, 5, 95), 0);
}
