import type { EmissionFactors, EnvironmentalMonth, MonthlyComputed, ReportPeriod } from './types';

export const COLORS = {
  navy: '#003A70',
  gold: '#E5B700',
  green: '#28A745',
  red: '#C82333',
  gray: '#6C757D',
  page: '#F8F9FA',
} as const;

export function round(value: number, digits = 3): number {
  const f = 10 ** digits;
  return Math.round(value * f) / f;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function formatNumber(value: number, digits = 0): string {
  return value.toLocaleString('en-HK', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

export function formatTco2e(value: number): string {
  return `${formatNumber(value, 0)} tCO₂e`;
}

export function formatPct(value: number, digits = 1): string {
  return `${value.toFixed(digits)}%`;
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-HK', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString('en-HK', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function relativeTime(fromIso: string, asOfIso: string): string {
  const ms = new Date(asOfIso).getTime() - new Date(fromIso).getTime();
  const minutes = Math.max(0, Math.round(ms / 60000));
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.round(hours / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
}

export function monthQuarter(month: string): MonthlyComputed['quarter'] {
  const m = Number(month.slice(5, 7));
  if (m <= 3) return 'Q1';
  if (m <= 6) return 'Q2';
  if (m <= 9) return 'Q3';
  return 'Q4';
}

export function monthsForReport(months: MonthlyComputed[], period: ReportPeriod): MonthlyComputed[] {
  if (period === 'annual') return months;
  return months.filter((row) => row.quarter === period);
}

export function weightedGridFactor(factors: EmissionFactors, electricityShareHk = 0.12): number {
  return factors.hkGridKgPerKwh * electricityShareHk + factors.gdGridKgPerKwh * (1 - electricityShareHk);
}

export function scope1FromActivity(
  month: Pick<EnvironmentalMonth, 'dieselLitres' | 'naturalGasM3'>,
  factors: EmissionFactors,
): { dieselTco2e: number; naturalGasTco2e: number; scope1Tco2e: number } {
  const dieselTco2e = (month.dieselLitres * factors.dieselKgPerLitre) / 1000;
  const naturalGasTco2e = (month.naturalGasM3 * factors.naturalGasKgPerM3) / 1000;
  return {
    dieselTco2e,
    naturalGasTco2e,
    scope1Tco2e: dieselTco2e + naturalGasTco2e,
  };
}

export function ltifr(lostTimeInjuries: number, hoursWorked: number): number {
  if (hoursWorked <= 0) return 0;
  return (lostTimeInjuries / hoursWorked) * 1_000_000;
}

export function trainingHoursPerEmployee(totalHours: number, headcount: number): number {
  if (headcount <= 0) return 0;
  return totalHours / headcount;
}

export function performanceLabel(score: number): { label: string; color: string } {
  if (score >= 90) return { label: 'Excellent', color: COLORS.green };
  if (score >= 75) return { label: 'Good', color: COLORS.gold };
  if (score >= 60) return { label: 'Adequate', color: '#D97706' };
  return { label: 'Needs improvement', color: COLORS.red };
}

export function statusFromThreshold(args: {
  value: number;
  target: number;
  invert?: boolean;
  warnBand?: number;
}): 'good' | 'warning' | 'alert' {
  const { value, target, invert = false, warnBand = 0.08 } = args;
  if (invert) {
    if (value <= target) return 'good';
    if (value <= target * (1 + warnBand)) return 'warning';
    return 'alert';
  }
  if (value >= target) return 'good';
  if (value >= target * (1 - warnBand)) return 'warning';
  return 'alert';
}
