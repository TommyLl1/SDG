import type { DerivedMetrics, EsgDataset, ForecastResult, InsightItem, PillarScores, SourceView, ValidationRecord } from './types';
import { formatNumber, formatPct, formatTco2e } from './format';
import { getFramework } from './frameworks';

export function buildInsights(args: {
  dataset: EsgDataset;
  metrics: DerivedMetrics;
  scores: PillarScores;
  forecast: ForecastResult;
  validations: ValidationRecord[];
  sources: SourceView[];
  frameworkId: ReturnType<typeof getFramework>['id'];
  alerts: { monthlyEmissionTco2e: number; ltifr: number; complianceMinPct: number };
}): InsightItem[] {
  const { dataset, metrics, forecast, validations, sources, frameworkId, alerts } = args;
  const fw = getFramework(frameworkId);
  const items: InsightItem[] = [];
  const openBlockers = validations.filter((v) => v.status === 'open' && v.blocksReport);
  const y = metrics.ytd;

  if (openBlockers.length > 0) {
    items.push({
      id: 'blockers',
      priority: 'high',
      title: 'Report pack is blocked',
      message: `${openBlockers.length} unresolved error${openBlockers.length === 1 ? '' : 's'} must be acknowledged or resolved before an annual or quarterly file can be generated: ${openBlockers.map((v) => v.title).join('; ')}.`,
    });
  }

  const latest = metrics.months.at(-1);
  if (latest && latest.scope12LocationTco2e > alerts.monthlyEmissionTco2e) {
    items.push({
      id: 'emission-alert',
      priority: 'high',
      title: 'Monthly emissions above alert threshold',
      message: `${latest.label} location-based Scope 1–2 was ${formatNumber(latest.scope12LocationTco2e, 0)} tCO₂e versus the configured alert of ${formatNumber(alerts.monthlyEmissionTco2e, 0)} tCO₂e/month. The threshold is set in Settings → Alerts.`,
    });
  }

  items.push({
    id: 'forecast',
    priority: forecast.linearVsTargetPct > 0 ? 'high' : 'medium',
    title: forecast.linearVsTargetPct > 0 ? 'Linear trend exceeds the FY carbon budget' : 'Linear trend remains inside the FY carbon budget',
    message: `OLS on Jan–Aug monthly totals projects ${formatTco2e(forecast.fyLinearTco2e)} for FY2026 versus a ${formatTco2e(forecast.annualTarget)} budget (${forecast.linearVsTargetPct > 0 ? '+' : ''}${forecast.linearVsTargetPct}%). Three-month trailing average projects ${formatTco2e(forecast.fyTrailingTco2e)}. ${forecast.method}`,
  });

  const yoy = ((y.scope12LocationTco2e - dataset.comparatives.fy2025JanAugScope12Tco2e) / dataset.comparatives.fy2025JanAugScope12Tco2e) * 100;
  items.push({
    id: 'yoy',
    priority: yoy < 0 ? 'low' : 'medium',
    title: 'Like-for-like Scope 1–2 versus Jan–Aug 2025',
    message: `YTD location-based Scope 1–2 is ${formatTco2e(y.scope12LocationTco2e)}, ${formatPct(Math.abs(yoy), 1)} ${yoy < 0 ? 'below' : 'above'} the ${formatTco2e(dataset.comparatives.fy2025JanAugScope12Tco2e)} recorded in the same eight months of FY2025.`,
  });

  if (y.ltifr > alerts.ltifr) {
    items.push({
      id: 'ltifr',
      priority: 'high',
      title: 'YTD LTIFR is above the alert threshold',
      message: `LTIFR is ${y.ltifr.toFixed(2)} from ${y.lostTimeInjuries} lost-time injuries in ${formatNumber(y.hoursWorked, 0)} hours. Alert threshold is ${alerts.ltifr.toFixed(2)}. Formula: (LTI ÷ hours) × 1,000,000. ${dataset.social.snapshot.ltiNote}`,
    });
  } else {
    items.push({
      id: 'ltifr',
      priority: y.ltifr > dataset.targets.ltifr * 0.8 ? 'medium' : 'low',
      title: 'YTD LTIFR is inside the corporate target',
      message: `LTIFR is ${y.ltifr.toFixed(2)} versus a target of < ${dataset.targets.ltifr.toFixed(1)} and an alert of ${alerts.ltifr.toFixed(2)}. ${dataset.social.snapshot.ltiNote}`,
    });
  }

  const weakest = [...dataset.governance.domains].sort((a, b) => a.score - b.score)[0];
  if (metrics.complianceAverage < alerts.complianceMinPct) {
    items.push({
      id: 'compliance',
      priority: 'high',
      title: 'Average compliance is below the minimum',
      message: `Simple average of seven governance domains is ${metrics.complianceAverage.toFixed(1)}% versus a ${alerts.complianceMinPct}% floor. Weakest domain: ${weakest?.domain} at ${weakest?.score}%.`,
    });
  }

  const nextAudit = dataset.governance.audits.find((a) => a.status === 'upcoming');
  if (nextAudit) {
    items.push({
      id: 'audit',
      priority: 'medium',
      title: 'Next assurance activity',
      message: `${nextAudit.title} is scheduled for ${nextAudit.date} (${nextAudit.owner}). ${fw.shortName} required metrics will be the evidence set.`,
    });
  }

  const stale = sources.filter((s) => s.status !== 'healthy');
  if (stale.length > 0) {
    items.push({
      id: 'sources',
      priority: stale.some((s) => s.status === 'failed') ? 'high' : 'medium',
      title: 'Data-source health',
      message: stale.map((s) => `${s.name}: ${s.statusLabel} (last sync ${s.relativeSync})`).join(' · '),
    });
  }

  if (fw.scope2Methods.includes('market')) {
    items.push({
      id: 'market',
      priority: 'low',
      title: 'Market-based Scope 2 is in view',
      message: `Location-based Scope 2 is ${formatTco2e(y.scope2LocationTco2e)}; market-based (residual mix on non-renewable kWh) is ${formatTco2e(y.scope2MarketTco2e)}. Renewable share is ${formatPct(y.renewableSharePct, 1)} versus a ${dataset.targets.renewableSharePct}% target.`,
    });
  }

  return items;
}
