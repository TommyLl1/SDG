import type {
  AppSettings,
  DerivedMetrics,
  EmissionFactors,
  EnvironmentalMonth,
  EsgDataset,
  MonthlyComputed,
  SocialMonth,
} from './types';
import { ltifr, monthQuarter, round, trainingHoursPerEmployee, weightedGridFactor } from './format';

function joinMonths(env: EnvironmentalMonth[], social: SocialMonth[]): Array<EnvironmentalMonth & SocialMonth> {
  return env.map((row) => {
    const socialRow = social.find((item) => item.month === row.month);
    if (!socialRow) {
      throw new Error(`Social series missing month ${row.month}`);
    }
    return { ...row, ...socialRow };
  });
}

export function deriveMetrics(dataset: EsgDataset, factors: EmissionFactors): DerivedMetrics {
  const hkShare = dataset.organization.sites.find((s) => s.gridFactorKey === 'hkGrid')?.electricityShare ?? 0.12;
  const grid = weightedGridFactor(factors, hkShare);
  const joined = joinMonths(dataset.environmental.monthly, dataset.social.monthly);

  let cumHours = 0;
  let cumLti = 0;

  const months: MonthlyComputed[] = joined.map((row) => {
    const dieselTco2e = (row.dieselLitres * factors.dieselKgPerLitre) / 1000;
    const naturalGasTco2e = (row.naturalGasM3 * factors.naturalGasKgPerM3) / 1000;
    const scope1Tco2e = dieselTco2e + naturalGasTco2e;
    const scope2LocationTco2e = (row.electricityKwh * grid) / 1000;
    const residualKwh = Math.max(0, row.electricityKwh - row.renewableKwh);
    const scope2MarketTco2e = (residualKwh * factors.residualMixKgPerKwh) / 1000;
    cumHours += row.hoursWorked;
    cumLti += row.lostTimeInjuries;

    return {
      month: row.month,
      label: row.label,
      quarter: monthQuarter(row.month),
      dieselTco2e,
      naturalGasTco2e,
      scope1Tco2e,
      scope2LocationTco2e,
      scope2MarketTco2e,
      scope12LocationTco2e: scope1Tco2e + scope2LocationTco2e,
      electricityKwh: row.electricityKwh,
      electricityMwh: row.electricityKwh / 1000,
      renewableKwh: row.renewableKwh,
      renewableSharePct: row.electricityKwh === 0 ? 0 : (row.renewableKwh / row.electricityKwh) * 100,
      waterM3: row.waterM3,
      wasteTonnes: row.wasteTonnes,
      recycledTonnes: row.recycledTonnes,
      recycledPct: row.wasteTonnes === 0 ? 0 : (row.recycledTonnes / row.wasteTonnes) * 100,
      hoursWorked: row.hoursWorked,
      lostTimeInjuries: row.lostTimeInjuries,
      recordableIncidents: row.recordableIncidents,
      monthlyLtifr: ltifr(row.lostTimeInjuries, row.hoursWorked),
      ytdLtifr: ltifr(cumLti, cumHours),
      trainingHours: row.trainingHours,
      headcount: row.headcount,
    };
  });

  const n = months.length || 1;
  const snap = dataset.social.snapshot;
  const socialRaw = dataset.social.monthly;

  const sum = (pick: (row: (typeof joined)[number]) => number) => joined.reduce((acc, row) => acc + pick(row), 0);

  const dieselLitres = sum((r) => r.dieselLitres);
  const naturalGasM3 = sum((r) => r.naturalGasM3);
  const refrigerantKg = sum((r) => r.refrigerantKg);
  const electricityKwh = sum((r) => r.electricityKwh);
  const renewableKwh = sum((r) => r.renewableKwh);
  const waterM3 = sum((r) => r.waterM3);
  const wasteTonnes = sum((r) => r.wasteTonnes);
  const recycledTonnes = sum((r) => r.recycledTonnes);
  const hoursWorked = sum((r) => r.hoursWorked);
  const lostTimeInjuries = sum((r) => r.lostTimeInjuries);
  const recordableIncidents = sum((r) => r.recordableIncidents);
  const trainingHours = sum((r) => r.trainingHours);
  const absenteeHours = socialRaw.reduce((acc, row) => acc + row.absenteeHours, 0);
  const leavers = socialRaw.reduce((acc, row) => acc + row.leavers, 0);
  const avgHeadcount = socialRaw.reduce((acc, row) => acc + row.headcount, 0) / n;

  const scope1Tco2e = months.reduce((acc, row) => acc + row.scope1Tco2e, 0);
  const scope2LocationTco2e = months.reduce((acc, row) => acc + row.scope2LocationTco2e, 0);
  const scope2MarketTco2e = months.reduce((acc, row) => acc + row.scope2MarketTco2e, 0);

  const policyRows = dataset.governance.policies.map((policy) => ({
    ...policy,
    adherence: policy.total === 0 ? 0 : (policy.acknowledged / policy.total) * 100,
  }));

  const renewableSharePct = electricityKwh === 0 ? 0 : (renewableKwh / electricityKwh) * 100;
  const completeMonths = dataset.reportingPeriod.completeMonths;

  return {
    months,
    ytd: {
      scope1Tco2e,
      scope2LocationTco2e,
      scope2MarketTco2e,
      scope12LocationTco2e: scope1Tco2e + scope2LocationTco2e,
      electricityKwh,
      electricityMwh: electricityKwh / 1000,
      electricityMwhMonthlyAvg: electricityKwh / 1000 / n,
      dieselLitres,
      naturalGasM3,
      refrigerantKg,
      renewableKwh,
      renewableSharePct,
      waterM3,
      wasteTonnes,
      recycledTonnes,
      recycledPct: wasteTonnes === 0 ? 0 : (recycledTonnes / wasteTonnes) * 100,
      hoursWorked,
      lostTimeInjuries,
      recordableIncidents,
      ltifr: ltifr(lostTimeInjuries, hoursWorked),
      trainingHours,
      trainingHoursPerEmployee: trainingHoursPerEmployee(trainingHours, snap.headcount),
      absenteeismPct: hoursWorked === 0 ? 0 : (absenteeHours / hoursWorked) * 100,
      leavers,
      annualizedTurnoverPct: avgHeadcount === 0 ? 0 : (leavers / avgHeadcount) * (12 / completeMonths) * 100,
      intensityTco2ePerHkdMillion:
        dataset.environmental.revenueYtdHkdMillion === 0
          ? 0
          : (scope1Tco2e + scope2LocationTco2e) / dataset.environmental.revenueYtdHkdMillion,
    },
    prorated: {
      scope12TargetTco2e: dataset.targets.annualScope12Tco2e * (completeMonths / 12),
      trainingHoursPerEmployee: dataset.targets.trainingHoursPerEmployeeYear * (completeMonths / 12),
    },
    energyMix: [
      { name: 'Renewable', value: round(renewableSharePct, 1), color: '#28A745' },
      { name: 'Grid (non-renewable)', value: round(100 - renewableSharePct, 1), color: '#6C757D' },
    ],
    workforceBars: [
      { category: 'Male', count: snap.male },
      { category: 'Female', count: snap.female },
      { category: 'Permanent', count: snap.permanent },
      { category: 'Contract', count: snap.contract },
    ],
    policyRows,
    complianceAverage:
      dataset.governance.domains.reduce((acc, row) => acc + row.score, 0) / dataset.governance.domains.length,
    policyAdherenceAverage: policyRows.reduce((acc, row) => acc + row.adherence, 0) / policyRows.length,
  };
}

export function assertDatasetIntegrity(dataset: EsgDataset): string[] {
  const warnings: string[] = [];
  const snap = dataset.social.snapshot;
  if (snap.male + snap.female !== snap.headcount) {
    warnings.push('Gender split does not equal headcount.');
  }
  if (snap.permanent + snap.contract !== snap.headcount) {
    warnings.push('Employment type split does not equal headcount.');
  }
  const dept = snap.departments.reduce((acc, row) => acc + row.headcount, 0);
  if (dept !== snap.headcount) {
    warnings.push('Department headcount does not equal snapshot headcount.');
  }
  const lastSocial = dataset.social.monthly.at(-1);
  if (lastSocial && lastSocial.headcount !== snap.headcount) {
    warnings.push('Snapshot headcount does not match last complete month.');
  }
  if (dataset.environmental.monthly.length !== dataset.social.monthly.length) {
    warnings.push('Environmental and social monthly series lengths differ.');
  }
  return warnings;
}

export function deriveWithSettings(dataset: EsgDataset, settings: AppSettings): DerivedMetrics {
  return deriveMetrics(dataset, settings.factors);
}
