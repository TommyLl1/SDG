import * as XLSX from 'xlsx';
import type { DerivedMetrics, EsgDataset, ForecastResult, PillarScores, ReportPeriod, SourceView, ValidationRecord } from '../types';
import type { FrameworkId } from '../types';
import { getFramework } from '../frameworks';
import { monthsForReport } from '../format';

export function buildExcel(args: {
  dataset: EsgDataset;
  metrics: DerivedMetrics;
  scores: PillarScores;
  forecast: ForecastResult;
  validations: ValidationRecord[];
  sources: SourceView[];
  framework: FrameworkId;
  period: ReportPeriod;
}): { blob: Blob; name: string } {
  const { dataset, metrics, scores, forecast, validations, sources, framework, period } = args;
  const fw = getFramework(framework);
  const rows = monthsForReport(metrics.months, period);
  const wb = XLSX.utils.book_new();

  const cover = [
    ['Company', dataset.organization.legalName],
    ['Stock code', dataset.organization.stockCode],
    ['Industry', dataset.organization.industry],
    ['Framework', fw.name],
    ['Period', period === 'annual' ? 'FY2026 YTD through 31 Aug 2026' : `FY2026 ${period}`],
    ['As of', dataset.reportingPeriod.asOf],
    ['Integrated score', scores.integrated],
    ['Environmental', scores.environmental],
    ['Social', scores.social],
    ['Governance', scores.governance],
    ['Score method', scores.method],
    ['Scope 1 tCO2e', metrics.ytd.scope1Tco2e],
    ['Scope 2 location tCO2e', metrics.ytd.scope2LocationTco2e],
    ['Scope 2 market tCO2e', metrics.ytd.scope2MarketTco2e],
    ['Scope 1-2 location tCO2e', metrics.ytd.scope12LocationTco2e],
    ['LTIFR', metrics.ytd.ltifr],
    ['Training hours / employee', metrics.ytd.trainingHoursPerEmployee],
    ['Compliance average %', metrics.complianceAverage],
    ['Basis', dataset.reportingPeriod.basis],
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(cover), 'Cover');

  const envHeader = [
    [
      'month',
      'scope1_tco2e',
      'scope2_location_tco2e',
      'scope2_market_tco2e',
      'scope12_location_tco2e',
      'electricity_kwh',
      'renewable_kwh',
      'water_m3',
      'waste_tonnes',
      'recycled_tonnes',
    ],
  ];
  const envBody = rows.map((r) => [
    r.month,
    r.scope1Tco2e,
    r.scope2LocationTco2e,
    r.scope2MarketTco2e,
    r.scope12LocationTco2e,
    r.electricityKwh,
    r.renewableKwh,
    r.waterM3,
    r.wasteTonnes,
    r.recycledTonnes,
  ]);
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([...envHeader, ...envBody]), 'Environmental');

  const socialHeader = [['month', 'headcount', 'hours_worked', 'lti', 'recordable', 'monthly_ltifr', 'ytd_ltifr', 'training_hours']];
  const socialBody = rows.map((r) => [
    r.month,
    r.headcount,
    r.hoursWorked,
    r.lostTimeInjuries,
    r.recordableIncidents,
    r.monthlyLtifr,
    r.ytdLtifr,
    r.trainingHours,
  ]);
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([...socialHeader, ...socialBody]), 'Social');

  const gov = [
    ['domain', 'score'],
    ...dataset.governance.domains.map((d) => [d.domain, d.score]),
    [],
    ['policy', 'acknowledged', 'total', 'adherence_pct'],
    ...metrics.policyRows.map((p) => [p.policy, p.acknowledged, p.total, p.adherence]),
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(gov), 'Governance');

  const val = [
    ['id', 'pillar', 'severity', 'status', 'blocks_report', 'title', 'description'],
    ...validations.map((v) => [v.id, v.pillar, v.severity, v.status, v.blocksReport, v.title, v.description]),
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(val), 'Validations');

  const src = [
    ['id', 'name', 'pillar', 'status', 'last_sync', 'endpoint'],
    ...sources.map((s) => [s.id, s.name, s.pillar, s.status, s.lastSyncAt, s.endpoint]),
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(src), 'Sources');

  const forecastSheet = [
    ['month', 'actual_tco2e', 'linear_tco2e', 'trailing_avg_tco2e', 'target_pace_tco2e'],
    ...forecast.series.map((p) => [p.month, p.actual, p.linear, p.trailingAvg, p.targetPace]),
    [],
    ['method', forecast.method],
    ['fy_linear', forecast.fyLinearTco2e],
    ['fy_trailing', forecast.fyTrailingTco2e],
    ['annual_target', forecast.annualTarget],
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(forecastSheet), 'Forecast');

  const factors = [
    ['factor', 'value', 'unit'],
    ['diesel', dataset.factors.dieselKgPerLitre, 'kgCO2e/L'],
    ['natural_gas', dataset.factors.naturalGasKgPerM3, 'kgCO2e/m3'],
    ['hk_grid', dataset.factors.hkGridKgPerKwh, 'kgCO2e/kWh'],
    ['gd_grid', dataset.factors.gdGridKgPerKwh, 'kgCO2e/kWh'],
    ['residual_mix', dataset.factors.residualMixKgPerKwh, 'kgCO2e/kWh'],
    [],
    ['required_metrics'],
    ...fw.requiredMetrics.map((m) => [m]),
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(factors), 'Methodology');

  const out = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const slug = dataset.organization.shortName.replace(/\s+/g, '-').toLowerCase();
  return {
    blob: new Blob([out], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
    name: `${slug}-esg-${period}-fy2026-ytd.xlsx`,
  };
}
