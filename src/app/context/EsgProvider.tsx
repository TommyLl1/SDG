import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { esgDataset } from '../../data';
import type {
  AppSettings,
  DataSourceRecord,
  DerivedMetrics,
  ForecastResult,
  InsightItem,
  PillarScores,
  RadarPoint,
  SourceView,
  ValidationRecord,
  ValidationStatus,
} from '../../lib/types';
import { deriveMetrics } from '../../lib/formulas';
import { computeScores, radarPoints, riskFromScore } from '../../lib/scoring';
import { forecastEmissions } from '../../lib/forecast';
import { viewSources } from '../../lib/sources';
import { buildInsights } from '../../lib/insights';
import {
  SETTINGS_KEY,
  SOURCE_KEY,
  VALIDATION_KEY,
  canEditMappings,
  canExport,
  canResolveValidations,
  defaultSettings,
  loadJson,
  saveJson,
} from '../../lib/storage';

export type SettingsTab = 'regulatory' | 'mapping' | 'alerts' | 'api' | 'user';

interface EsgContextValue {
  dataset: typeof esgDataset;
  settings: AppSettings;
  metrics: DerivedMetrics;
  scores: PillarScores;
  forecast: ForecastResult;
  validations: ValidationRecord[];
  sources: SourceView[];
  sourceRecords: DataSourceRecord[];
  insights: InsightItem[];
  radar: RadarPoint[];
  riskMatrix: { aspect: string; shortTerm: number; mediumTerm: number; longTerm: number }[];
  openBlockers: ValidationRecord[];
  settingsOpen: boolean;
  settingsTab: SettingsTab;
  setSettingsOpen: (open: boolean) => void;
  openSettings: (tab?: SettingsTab) => void;
  updateSettings: (patch: Partial<AppSettings> | ((prev: AppSettings) => AppSettings)) => void;
  setValidationStatus: (id: string, status: ValidationStatus) => void;
  testConnection: (id: string) => void;
  canExport: boolean;
  canEditMappings: boolean;
  canResolveValidations: boolean;
}

const EsgContext = createContext<EsgContextValue | null>(null);

function mergeValidationStatus(records: ValidationRecord[]): ValidationRecord[] {
  const overrides = loadJson<Record<string, ValidationStatus>>(VALIDATION_KEY, {});
  return records.map((row) => ({ ...row, status: overrides[row.id] ?? row.status }));
}

function mergeSources(records: DataSourceRecord[]): DataSourceRecord[] {
  const overrides = loadJson<Record<string, Partial<DataSourceRecord>>>(SOURCE_KEY, {});
  return records.map((row) => ({ ...row, ...overrides[row.id] }));
}

export function EsgProvider({ children }: { children: ReactNode }) {
  const dataset = esgDataset;
  const [settings, setSettings] = useState<AppSettings>(() =>
    loadJson(SETTINGS_KEY, defaultSettings(dataset)),
  );
  const [validations, setValidations] = useState<ValidationRecord[]>(() =>
    mergeValidationStatus(dataset.validations),
  );
  const [sourceRecords, setSourceRecords] = useState<DataSourceRecord[]>(() => mergeSources(dataset.sources));
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState<SettingsTab>('regulatory');

  const metrics = useMemo(() => deriveMetrics(dataset, settings.factors), [dataset, settings.factors]);
  const scores = useMemo(
    () => computeScores(dataset, metrics, settings.framework),
    [dataset, metrics, settings.framework],
  );
  const forecast = useMemo(() => forecastEmissions(dataset, metrics), [dataset, metrics]);
  const sources = useMemo(
    () => viewSources(sourceRecords, dataset.reportingPeriod.asOf),
    [sourceRecords, dataset.reportingPeriod.asOf],
  );
  const healthyPct = sources.length === 0 ? 100 : (sources.filter((s) => s.status === 'healthy').length / sources.length) * 100;
  const radar = useMemo(
    () => radarPoints(dataset, metrics, scores, healthyPct),
    [dataset, metrics, scores, healthyPct],
  );
  const insights = useMemo(
    () =>
      buildInsights({
        dataset,
        metrics,
        scores,
        forecast,
        validations,
        sources,
        frameworkId: settings.framework,
        alerts: settings.alerts,
      }),
    [dataset, metrics, scores, forecast, validations, sources, settings.framework, settings.alerts],
  );
  const openBlockers = useMemo(
    () => validations.filter((v) => v.status === 'open' && v.blocksReport),
    [validations],
  );

  const riskMatrix = useMemo(() => {
    const envShort = riskFromScore(scores.environmental);
    const socShort = riskFromScore(scores.social);
    const govShort = riskFromScore(scores.governance);
    const climateLong = riskFromScore(
      Math.max(20, 100 - Math.max(0, forecast.linearVsTargetPct + 15)),
    );
    return [
      {
        aspect: 'Environmental',
        shortTerm: envShort,
        mediumTerm: Math.min(95, envShort + (forecast.linearVsTargetPct > 0 ? 8 : 0)),
        longTerm: climateLong,
      },
      {
        aspect: 'Social',
        shortTerm: socShort,
        mediumTerm: Math.min(95, socShort + (metrics.ytd.ltifr > settings.alerts.ltifr ? 10 : 4)),
        longTerm: Math.max(20, socShort - 6),
      },
      {
        aspect: 'Governance',
        shortTerm: govShort,
        mediumTerm: govShort,
        longTerm: Math.max(18, govShort - 4),
      },
    ];
  }, [scores, forecast.linearVsTargetPct, metrics.ytd.ltifr, settings.alerts.ltifr]);

  const updateSettings = useCallback((patch: Partial<AppSettings> | ((prev: AppSettings) => AppSettings)) => {
    setSettings((prev) => {
      const next = typeof patch === 'function' ? patch(prev) : { ...prev, ...patch };
      saveJson(SETTINGS_KEY, next);
      return next;
    });
  }, []);

  const setValidationStatus = useCallback((id: string, status: ValidationStatus) => {
    setValidations((prev) => {
      const next = prev.map((row) => (row.id === id ? { ...row, status } : row));
      const overrides = Object.fromEntries(next.map((row) => [row.id, row.status]));
      saveJson(VALIDATION_KEY, overrides);
      return next;
    });
  }, []);

  const testConnection = useCallback(
    (id: string) => {
      setSourceRecords((prev) => {
        const next = prev.map((row) => {
          if (row.id !== id) return row;
          if (row.failed) {
            return { ...row, lastSyncAt: dataset.reportingPeriod.asOf, failed: false };
          }
          return { ...row, lastSyncAt: dataset.reportingPeriod.asOf };
        });
        const overrides = Object.fromEntries(next.map((row) => [row.id, { lastSyncAt: row.lastSyncAt, failed: row.failed }]));
        saveJson(SOURCE_KEY, overrides);
        return next;
      });
    },
    [dataset.reportingPeriod.asOf],
  );

  const openSettings = useCallback((tab?: SettingsTab) => {
    if (tab) setSettingsTab(tab);
    setSettingsOpen(true);
  }, []);

  const value: EsgContextValue = {
    dataset,
    settings,
    metrics,
    scores,
    forecast,
    validations,
    sources,
    sourceRecords,
    insights,
    radar,
    riskMatrix,
    openBlockers,
    settingsOpen,
    settingsTab,
    setSettingsOpen,
    openSettings,
    updateSettings,
    setValidationStatus,
    testConnection,
    canExport: canExport(settings.role),
    canEditMappings: canEditMappings(settings.role),
    canResolveValidations: canResolveValidations(settings.role),
  };

  return <EsgContext.Provider value={value}>{children}</EsgContext.Provider>;
}

export function useEsg() {
  const ctx = useContext(EsgContext);
  if (!ctx) throw new Error('useEsg must be used within EsgProvider');
  return ctx;
}
