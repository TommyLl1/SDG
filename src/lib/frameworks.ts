import type { FrameworkId } from './types';

export interface FrameworkDefinition {
  id: FrameworkId;
  name: string;
  shortName: string;
  description: string;
  primary: boolean;
  scope2Methods: Array<'location' | 'market'>;
  requiredMetrics: string[];
  mappings: Array<{ input: string; metric: string; formula: string }>;
  scoreWeights: { e: number; s: number; g: number };
  scoreMethod: string;
}

export const FRAMEWORKS: FrameworkDefinition[] = [
  {
    id: 'eu-customer',
    name: 'EU / OEM customer due diligence',
    shortName: 'EU customer pack',
    description:
      'Primary pack for this demo: evidence a 128-person NEV-components supplier sends to EU buyers. Covers CSDDD / German LkSG supplier questions, CSRD value-chain GHG-energy-water-waste-safety, and customer Supplier Code of Conduct. Same activity data as GRI/HKEX; required metrics follow what procurement actually asks for.',
    primary: true,
    scope2Methods: ['location', 'market'],
    requiredMetrics: [
      'Scope 1 and Scope 2 (location-based) for the Dongguan workshop (charging-module and HV-connector cells) and the Hong Kong office',
      'Scope 2 market-based if renewable PPAs / on-site solar are claimed',
      'Energy, water (plating) and waste by hazardous / non-hazardous stream',
      'LTIFR, HV electrical-safety training, working hours',
      'Workforce composition (gender, contract type) and no child/forced labour attestation',
      'Anti-corruption and speak-up channel',
      'IATF 16949 / product safety overlay for automotive customers',
    ],
    mappings: [
      {
        input: 'electricity_meters.csv (meter × month kWh)',
        metric: 'Scope 2 location-based',
        formula: 'Σ kWh × site grid factor ÷ 1,000 = tCO₂e',
      },
      {
        input: 'diesel_tickets.csv + natural_gas_meters.csv',
        metric: 'Scope 1',
        formula: 'litres × 2.68 kg/L and m³ × 2.023 kg/m³, ÷ 1,000; unmapped tickets excluded',
      },
      {
        input: 'incidents.csv + hours_worked.csv',
        metric: 'LTIFR (OEM H&S question)',
        formula: '(lost-time rows ÷ hours) × 1,000,000',
      },
      {
        input: 'workforce_extract.csv (unique worker_id)',
        metric: 'Headcount / diversity / contract mix',
        formula: 'count distinct worker_id; gender and contract from current record',
      },
      {
        input: 'training_completions.csv',
        metric: 'HV electrical-safety coverage',
        formula: 'unique workers with a completion in the last 12 months ÷ unique headcount',
      },
    ],
    scoreWeights: { e: 0.4, s: 0.35, g: 0.25 },
    scoreMethod: 'EU customer pack weighting: Environmental 40%, Social 35% (safety and labour), Governance 25%.',
  },
  {
    id: 'hkex',
    name: 'HKEX ESG Code (Appendix C2)',
    shortName: 'HKEX ESG',
    description:
      'Optional listing-readiness overlay. Not the reason this pack exists — EU/OEM procurement is.',
    primary: false,
    scope2Methods: ['location'],
    requiredMetrics: [
      'A1.1/A1.2 Scope 1 and Scope 2 (location-based) tCO₂e',
      'A2.1 Energy consumption by type (kWh, litres, m³)',
      'A2.3 Renewable electricity share',
      'A3 Water consumption m³',
      'A1.3/A1.4 Hazardous and non-hazardous waste tonnes',
      'B1 Workforce by gender and employment type',
      'B2 LTIFR and work-related incidents',
      'B3 Training hours per employee',
      'B7 Anti-corruption training / policy adherence',
    ],
    mappings: [
      {
        input: 'Diesel (litres)',
        metric: 'Scope 1 — mobile and stationary combustion',
        formula: 'litres × diesel factor (kgCO₂e/L) ÷ 1,000 = tCO₂e',
      },
      {
        input: 'Natural gas (m³)',
        metric: 'Scope 1 — process heat',
        formula: 'm³ × NG factor (kgCO₂e/m³) ÷ 1,000 = tCO₂e',
      },
      {
        input: 'Purchased electricity (kWh)',
        metric: 'Scope 2 — location-based',
        formula: 'kWh × site grid factor (HK or Guangdong) ÷ 1,000 = tCO₂e',
      },
      {
        input: 'Lost-time injuries, hours worked',
        metric: 'LTIFR',
        formula: '(LTI ÷ hours worked) × 1,000,000',
      },
      {
        input: 'LMS completions, unique headcount',
        metric: 'Training hours per employee',
        formula: 'total training hours ÷ unique employees',
      },
      {
        input: 'Policy acknowledgements',
        metric: 'Policy adherence %',
        formula: 'acknowledged ÷ unique employees × 100',
      },
    ],
    scoreWeights: { e: 0.4, s: 0.3, g: 0.3 },
    scoreMethod: 'HKEX industrial weighting: Environmental 40%, Social 30%, Governance 30%.',
  },
  {
    id: 'gri',
    name: 'GRI Universal Standards 2021',
    shortName: 'GRI',
    description:
      'Adds intensity metrics (emissions per HKD million revenue) and equal E/S/G weighting for a GRI-referenced report.',
    primary: false,
    scope2Methods: ['location'],
    requiredMetrics: [
      '305-1 Scope 1 tCO₂e',
      '305-2 Scope 2 tCO₂e (location-based)',
      '305-4 GHG intensity (tCO₂e / HKD million revenue)',
      '302-1 Energy consumption',
      '303-5 Water consumption',
      '306-3 Waste generated',
      '401-1 Turnover',
      '403-9 Work-related injuries (LTIFR)',
      '404-1 Average training hours per employee',
      '405-1 Diversity of governance bodies and employees',
      '205-2 Anti-corruption communication and training',
    ],
    mappings: [
      {
        input: 'Scope 1 + Scope 2 tCO₂e, YTD revenue',
        metric: 'GRI 305-4 intensity',
        formula: 'Scope 1–2 tCO₂e ÷ YTD revenue (HKD million)',
      },
      {
        input: 'Diesel (litres)',
        metric: 'Scope 1',
        formula: 'litres × diesel factor ÷ 1,000 = tCO₂e',
      },
      {
        input: 'Electricity (kWh)',
        metric: 'Scope 2 location-based',
        formula: 'kWh × weighted grid factor ÷ 1,000 = tCO₂e',
      },
      {
        input: 'Leavers, average headcount',
        metric: 'Annualised turnover %',
        formula: '(leavers YTD ÷ average HC) × (12 ÷ months)',
      },
      {
        input: 'Training hours, unique headcount',
        metric: 'GRI 404-1',
        formula: 'total training hours ÷ unique employees',
      },
    ],
    scoreWeights: { e: 1 / 3, s: 1 / 3, g: 1 / 3 },
    scoreMethod: 'Equal GRI pillar weighting: Environmental, Social and Governance each 33.3%.',
  },
  {
    id: 'issb',
    name: 'ISSB IFRS S1 / S2',
    shortName: 'ISSB',
    description:
      'Climate-first disclosure. Requires location-based and market-based Scope 2, transition target tracking, and heavier environmental weight.',
    primary: false,
    scope2Methods: ['location', 'market'],
    requiredMetrics: [
      'IFRS S2 — Scope 1 tCO₂e',
      'IFRS S2 — Scope 2 location-based tCO₂e',
      'IFRS S2 — Scope 2 market-based tCO₂e',
      'Climate target: 42% reduction by 2030 vs FY2024',
      'Absolute Scope 1–2 vs annual carbon budget',
      'Transition actions (solar phase 2, grid factor residual mix)',
      'Governance of climate risks (board oversight score)',
    ],
    mappings: [
      {
        input: 'Purchased electricity (kWh), renewable kWh',
        metric: 'Scope 2 market-based',
        formula: '(kWh − renewable kWh) × residual-mix factor ÷ 1,000 = tCO₂e',
      },
      {
        input: 'Purchased electricity (kWh)',
        metric: 'Scope 2 location-based',
        formula: 'kWh × site grid factor ÷ 1,000 = tCO₂e',
      },
      {
        input: 'Diesel and natural gas',
        metric: 'Scope 1',
        formula: 'activity × factor ÷ 1,000 = tCO₂e (R-134a burn-in top-up excluded until a GWP is assigned)',
      },
      {
        input: 'FY forecast vs 2030 pathway',
        metric: 'Transition gap',
        formula: 'linear FY forecast − (FY2024 baseline × (1 − 42% × yearsElapsed/6))',
      },
    ],
    scoreWeights: { e: 0.5, s: 0.2, g: 0.3 },
    scoreMethod: 'ISSB climate-first weighting: Environmental 50%, Social 20%, Governance 30%.',
  },
  {
    id: 'tcfd',
    name: 'TCFD recommendations',
    shortName: 'TCFD',
    description:
      'Risk-oriented overlay. Same activity data, with radar and forecast treated as strategy/risk metrics rather than a compliance pack.',
    primary: false,
    scope2Methods: ['location'],
    requiredMetrics: [
      'Governance — board climate oversight',
      'Strategy — 2030 reduction pathway vs current linear forecast',
      'Risk management — ESG risk radar scores',
      'Metrics — Scope 1–2, energy mix, water, safety',
    ],
    mappings: [
      {
        input: 'Scope 1–2 monthly series',
        metric: 'Climate metric (TCFD)',
        formula: 'OLS linear trend on monthly location-based Scope 1–2',
      },
      {
        input: 'Pillar scores',
        metric: 'Risk radar (100 − residual risk)',
        formula: 'Each axis is a 0–100 control score derived from the same KPIs',
      },
      {
        input: 'Diesel, NG, electricity',
        metric: 'Scope 1–2',
        formula: 'Same HKEX activity × factor formulas',
      },
    ],
    scoreWeights: { e: 0.6, s: 0.1, g: 0.3 },
    scoreMethod: 'TCFD climate/risk weighting: Environmental 60%, Social 10%, Governance 30%.',
  },
];

export function getFramework(id: FrameworkId): FrameworkDefinition {
  return FRAMEWORKS.find((item) => item.id === id) ?? FRAMEWORKS[0];
}
