import type { AppSettings, DerivedMetrics, EsgDataset, PillarScores } from './types';
import { getFramework } from './frameworks';

export const SETTINGS_KEY = 'kaiheng.esg.settings.v3';
export const VALIDATION_KEY = 'kaiheng.esg.validation-status';
export const SOURCE_KEY = 'kaiheng.esg.source-overrides';
export const SESSION_KEY = 'kaiheng.esg.session';

export function hasSession(): boolean {
  try {
    return localStorage.getItem(SESSION_KEY) === '1';
  } catch {
    return false;
  }
}

export function setSession(): void {
  localStorage.setItem(SESSION_KEY, '1');
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
}

export function defaultSettings(dataset: EsgDataset): AppSettings {
  return {
    framework: 'eu-customer',
    role: 'administrator',
    factors: { ...dataset.factors },
    alerts: {
      monthlyEmissionTco2e: 140,
      ltifr: 2.0,
      complianceMinPct: 95,
      trainingHoursPerEmployeeYtd: 16,
    },
  };
}

export function loadJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return { ...fallback, ...JSON.parse(raw) } as T;
  } catch {
    return fallback;
  }
}

export function saveJson(key: string, value: unknown): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export function canExport(role: AppSettings['role']): boolean {
  return role === 'administrator' || role === 'analyst';
}

export function canEditMappings(role: AppSettings['role']): boolean {
  return role === 'administrator';
}

export function canResolveValidations(role: AppSettings['role']): boolean {
  return role === 'administrator' || role === 'analyst';
}

export function requiredMetricsFor(settings: AppSettings, metrics: DerivedMetrics, scores: PillarScores) {
  const fw = getFramework(settings.framework);
  return {
    framework: fw,
    integratedScore: scores.integrated,
    scope12: metrics.ytd.scope12LocationTco2e,
  };
}
