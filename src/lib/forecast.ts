import type { DerivedMetrics, EsgDataset, ForecastPoint, ForecastResult } from './types';
import { round } from './format';

function ordinaryLeastSquares(ys: number[]): { slope: number; intercept: number } {
  const n = ys.length;
  const xs = ys.map((_, i) => i);
  const sumX = xs.reduce((a, b) => a + b, 0);
  const sumY = ys.reduce((a, b) => a + b, 0);
  const sumXY = xs.reduce((a, x, i) => a + x * ys[i], 0);
  const sumX2 = xs.reduce((a, x) => a + x * x, 0);
  const denom = n * sumX2 - sumX * sumX;
  const slope = denom === 0 ? 0 : (n * sumXY - sumX * sumY) / denom;
  const intercept = (sumY - slope * sumX) / n;
  return { slope, intercept };
}

const FUTURE_LABELS = [
  { month: '2026-09', label: 'Sep' },
  { month: '2026-10', label: 'Oct' },
  { month: '2026-11', label: 'Nov' },
  { month: '2026-12', label: 'Dec' },
];

export function forecastEmissions(dataset: EsgDataset, metrics: DerivedMetrics): ForecastResult {
  const actuals = metrics.months.map((row) => row.scope12LocationTco2e);
  const { slope, intercept } = ordinaryLeastSquares(actuals);
  const trailingWindow = actuals.slice(-3);
  const trailingAvg3 = trailingWindow.reduce((a, b) => a + b, 0) / trailingWindow.length;
  const monthlyTarget = dataset.targets.annualScope12Tco2e / 12;

  const series: ForecastPoint[] = [
    ...metrics.months.map((row, index) => ({
      month: row.month,
      label: row.label,
      actual: round(row.scope12LocationTco2e, 1),
      linear: round(intercept + slope * index, 1),
      trailingAvg: index >= actuals.length - 1 ? round(trailingAvg3, 1) : null,
      targetPace: round(monthlyTarget, 1),
    })),
    ...FUTURE_LABELS.map((row, offset) => {
      const x = actuals.length + offset;
      return {
        month: row.month,
        label: row.label,
        actual: null,
        linear: round(intercept + slope * x, 1),
        trailingAvg: round(trailingAvg3, 1),
        targetPace: round(monthlyTarget, 1),
      };
    }),
  ];

  const fyLinearTco2e =
    metrics.ytd.scope12LocationTco2e +
    FUTURE_LABELS.reduce((acc, _, offset) => acc + (intercept + slope * (actuals.length + offset)), 0);
  const fyTrailingTco2e = metrics.ytd.scope12LocationTco2e + trailingAvg3 * FUTURE_LABELS.length;

  return {
    method:
      'Ordinary least squares on Jan–Aug monthly location-based Scope 1–2 totals (x = month index). Trailing average uses the last three complete months. Neither method is a climate scenario or an LLM forecast.',
    slope: round(slope, 2),
    intercept: round(intercept, 1),
    trailingAvg3: round(trailingAvg3, 1),
    fyLinearTco2e: round(fyLinearTco2e, 0),
    fyTrailingTco2e: round(fyTrailingTco2e, 0),
    annualTarget: dataset.targets.annualScope12Tco2e,
    linearVsTargetPct: round(((fyLinearTco2e - dataset.targets.annualScope12Tco2e) / dataset.targets.annualScope12Tco2e) * 100, 1),
    series,
  };
}

export function linearFit(ys: number[]): { slope: number; intercept: number } {
  return ordinaryLeastSquares(ys);
}
