export type FrameworkId = 'eu-customer' | 'hkex' | 'gri' | 'issb' | 'tcfd';
export type UserRole = 'administrator' | 'analyst' | 'viewer';
export type Pillar = 'environmental' | 'social' | 'governance';

export interface CustomerRequirement {
  id: string;
  name: string;
  region: string;
  relationship: string;
  products: string;
  asksFor: string;
  dueDate: string;
  status: string;
}

export interface SourceExampleFile {
  id: string;
  file: string;
  pillar: Pillar;
  system: string;
  grain: string;
  feeds: string;
  note: string;
  headers: string[];
  preview: string[][];
}
export type SourceStatus = 'healthy' | 'stale' | 'failed';
export type ValidationSeverity = 'error' | 'warning' | 'info';
export type ValidationStatus = 'open' | 'acknowledged' | 'resolved';
export type ReportFormat = 'pdf' | 'xlsx';
export type ReportPeriod = 'annual' | 'Q1' | 'Q2' | 'Q3' | 'Q4';
export type KpiStatus = 'good' | 'warning' | 'alert';

export interface Organization {
  legalName: string;
  chineseName: string;
  shortName: string;
  stockCode: string;
  industry: string;
  productFocus: string;
  headquarters: string;
  region: string;
  regulator: string;
  listingBoard: string;
  sites: Site[];
  customers: CustomerRequirement[];
  contacts: {
    sustainabilityLead: string;
    title: string;
    email: string;
  };
}

export interface Site {
  id: string;
  name: string;
  location: string;
  type: string;
  headcount: number;
  electricityShare: number;
  gridFactorKey: 'hkGrid' | 'gdGrid';
}

export interface ReportingPeriod {
  fiscalYear: number;
  label: string;
  start: string;
  end: string;
  asOf: string;
  lastCompleteMonth: string;
  completeMonths: number;
  basis: string;
}

export interface EmissionFactors {
  dieselKgPerLitre: number;
  naturalGasKgPerM3: number;
  hkGridKgPerKwh: number;
  gdGridKgPerKwh: number;
  residualMixKgPerKwh: number;
}

export interface Targets {
  annualScope12Tco2e: number;
  renewableSharePct: number;
  wasteRecycledPct: number;
  ltifr: number;
  trainingHoursPerEmployeeYear: number;
  femaleWorkforcePct: number;
  turnoverPct: number;
  compliancePct: number;
  netZeroYear: number;
  reduction2030PctFromFy2024: number;
  fy2024BaselineScope12Tco2e: number;
}

export interface Comparatives {
  priorIntegratedScore: number;
  fy2025Scope12Tco2e: number;
  fy2025JanAugScope12Tco2e: number;
  fy2025Ltifr: number;
  fy2025FemalePct: number;
  fy2025TrainingHoursPerEmployee: number;
  fy2025CompliancePct: number;
  fy2025RenewablePct: number;
  q2IntegratedScore: number;
}

export interface EnvironmentalMonth {
  month: string;
  label: string;
  dieselLitres: number;
  naturalGasM3: number;
  refrigerantKg: number;
  electricityKwh: number;
  renewableKwh: number;
  waterM3: number;
  wasteTonnes: number;
  recycledTonnes: number;
}

export interface SocialMonth {
  month: string;
  label: string;
  headcount: number;
  hoursWorked: number;
  lostTimeInjuries: number;
  recordableIncidents: number;
  trainingHours: number;
  absenteeHours: number;
  leavers: number;
}

export interface WorkforceSnapshot {
  ltiNote: string;
  headcount: number;
  male: number;
  female: number;
  permanent: number;
  contract: number;
  femaleInManagementPct: number;
  departments: { name: string; headcount: number }[];
}

export interface ComplianceDomain {
  domain: string;
  score: number;
  frameworkRefs: string[];
}

export interface AuditItem {
  id: string;
  title: string;
  status: 'completed' | 'upcoming';
  date: string;
  issues: number;
  owner: string;
}

export interface PolicyAdherence {
  policy: string;
  total: number;
  acknowledged: number;
}

export interface Whistleblowing {
  openCases: number;
  closedYtd: number;
  agingOver90Days: number;
  policyReviewsScheduled: number;
}

export interface DataSourceRecord {
  id: string;
  name: string;
  pillar: Pillar;
  system: string;
  endpoint: string;
  lastSyncAt: string;
  notes: string;
  failed?: boolean;
}

export interface ValidationRecord {
  id: string;
  pillar: Pillar;
  type: string;
  severity: ValidationSeverity;
  title: string;
  description: string;
  sourceId: string;
  status: ValidationStatus;
  blocksReport: boolean;
  detectedAt: string;
}

export interface SourceCatalog {
  description: string;
  files: SourceExampleFile[];
}

export interface EsgDataset {
  organization: Organization;
  reportingPeriod: ReportingPeriod;
  factors: EmissionFactors;
  targets: Targets;
  comparatives: Comparatives;
  environmental: {
    monthly: EnvironmentalMonth[];
    revenueYtdHkdMillion: number;
  };
  social: {
    snapshot: WorkforceSnapshot;
    monthly: SocialMonth[];
  };
  governance: {
    domains: ComplianceDomain[];
    audits: AuditItem[];
    policies: PolicyAdherence[];
    whistleblowing: Whistleblowing;
  };
  sources: DataSourceRecord[];
  validations: ValidationRecord[];
}

export interface AlertThresholds {
  monthlyEmissionTco2e: number;
  ltifr: number;
  complianceMinPct: number;
  trainingHoursPerEmployeeYtd: number;
}

export interface AppSettings {
  framework: FrameworkId;
  role: UserRole;
  factors: EmissionFactors;
  alerts: AlertThresholds;
}

export interface MonthlyComputed {
  month: string;
  label: string;
  quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  dieselTco2e: number;
  naturalGasTco2e: number;
  scope1Tco2e: number;
  scope2LocationTco2e: number;
  scope2MarketTco2e: number;
  scope12LocationTco2e: number;
  electricityKwh: number;
  electricityMwh: number;
  renewableKwh: number;
  renewableSharePct: number;
  waterM3: number;
  wasteTonnes: number;
  recycledTonnes: number;
  recycledPct: number;
  hoursWorked: number;
  lostTimeInjuries: number;
  recordableIncidents: number;
  monthlyLtifr: number;
  ytdLtifr: number;
  trainingHours: number;
  headcount: number;
}

export interface DerivedMetrics {
  months: MonthlyComputed[];
  ytd: {
    scope1Tco2e: number;
    scope2LocationTco2e: number;
    scope2MarketTco2e: number;
    scope12LocationTco2e: number;
    electricityKwh: number;
    electricityMwh: number;
    electricityMwhMonthlyAvg: number;
    dieselLitres: number;
    naturalGasM3: number;
    refrigerantKg: number;
    renewableKwh: number;
    renewableSharePct: number;
    waterM3: number;
    wasteTonnes: number;
    recycledTonnes: number;
    recycledPct: number;
    hoursWorked: number;
    lostTimeInjuries: number;
    recordableIncidents: number;
    ltifr: number;
    trainingHours: number;
    trainingHoursPerEmployee: number;
    absenteeismPct: number;
    leavers: number;
    annualizedTurnoverPct: number;
    intensityTco2ePerHkdMillion: number;
  };
  prorated: {
    scope12TargetTco2e: number;
    trainingHoursPerEmployee: number;
  };
  energyMix: { name: string; value: number; color: string }[];
  workforceBars: { category: string; count: number }[];
  policyRows: { policy: string; total: number; acknowledged: number; adherence: number }[];
  complianceAverage: number;
  policyAdherenceAverage: number;
}

export interface PillarScores {
  environmental: number;
  social: number;
  governance: number;
  integrated: number;
  weights: { e: number; s: number; g: number };
  method: string;
}

export interface RadarPoint {
  subject: string;
  value: number;
  fullMark: number;
}

export interface ForecastPoint {
  month: string;
  label: string;
  actual: number | null;
  linear: number | null;
  trailingAvg: number | null;
  targetPace: number;
}

export interface ForecastResult {
  method: string;
  slope: number;
  intercept: number;
  trailingAvg3: number;
  fyLinearTco2e: number;
  fyTrailingTco2e: number;
  annualTarget: number;
  linearVsTargetPct: number;
  series: ForecastPoint[];
}

export interface InsightItem {
  id: string;
  priority: 'high' | 'medium' | 'low';
  title: string;
  message: string;
}

export interface SourceView {
  id: string;
  name: string;
  pillar: Pillar;
  system: string;
  endpoint: string;
  lastSyncAt: string;
  notes: string;
  status: SourceStatus;
  statusLabel: string;
  relativeSync: string;
}
