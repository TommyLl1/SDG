import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const srcData = join(root, 'src/data');
const examples = join(srcData, 'source-examples');
mkdirSync(examples, { recursive: true });

const factors = {
  dieselKgPerLitre: 2.68,
  naturalGasKgPerM3: 2.023,
  hkGridKgPerKwh: 0.66,
  gdGridKgPerKwh: 0.5703,
  residualMixKgPerKwh: 0.62,
};
const hkShare = 0.05;
const grid = factors.hkGridKgPerKwh * hkShare + factors.gdGridKgPerKwh * (1 - hkShare);

const envMonthly = [
  { month: '2026-01', label: 'Jan', dieselLitres: 5200, naturalGasM3: 2800, refrigerantKg: 0, electricityKwh: 168000, renewableKwh: 30240, waterM3: 1180, wasteTonnes: 14, recycledTonnes: 8 },
  { month: '2026-02', label: 'Feb', dieselLitres: 3800, naturalGasM3: 2200, refrigerantKg: 0, electricityKwh: 132000, renewableKwh: 26400, waterM3: 860, wasteTonnes: 10, recycledTonnes: 6 },
  { month: '2026-03', label: 'Mar', dieselLitres: 5600, naturalGasM3: 3000, refrigerantKg: 0, electricityKwh: 176000, renewableKwh: 33440, waterM3: 1240, wasteTonnes: 15, recycledTonnes: 9 },
  { month: '2026-04', label: 'Apr', dieselLitres: 5300, naturalGasM3: 2900, refrigerantKg: 0, electricityKwh: 171000, renewableKwh: 34200, waterM3: 1190, wasteTonnes: 14, recycledTonnes: 8 },
  { month: '2026-05', label: 'May', dieselLitres: 5700, naturalGasM3: 3100, refrigerantKg: 0, electricityKwh: 182000, renewableKwh: 38220, waterM3: 1280, wasteTonnes: 16, recycledTonnes: 9 },
  { month: '2026-06', label: 'Jun', dieselLitres: 6100, naturalGasM3: 3300, refrigerantKg: 0, electricityKwh: 191000, renewableKwh: 40110, waterM3: 1360, wasteTonnes: 17, recycledTonnes: 10 },
  { month: '2026-07', label: 'Jul', dieselLitres: 5900, naturalGasM3: 3200, refrigerantKg: 3.1, electricityKwh: 198000, renewableKwh: 39600, waterM3: 1420, wasteTonnes: 16, recycledTonnes: 9 },
  { month: '2026-08', label: 'Aug', dieselLitres: 5400, naturalGasM3: 3000, refrigerantKg: 2.4, electricityKwh: 186000, renewableKwh: 40920, waterM3: 1310, wasteTonnes: 15, recycledTonnes: 9 },
];

const socialMonthly = [
  { month: '2026-01', label: 'Jan', headcount: 118, hoursWorked: 21200, lostTimeInjuries: 0, recordableIncidents: 0, trainingHours: 210, absenteeHours: 510, leavers: 1 },
  { month: '2026-02', label: 'Feb', headcount: 120, hoursWorked: 18600, lostTimeInjuries: 0, recordableIncidents: 0, trainingHours: 180, absenteeHours: 430, leavers: 1 },
  { month: '2026-03', label: 'Mar', headcount: 122, hoursWorked: 22800, lostTimeInjuries: 1, recordableIncidents: 1, trainingHours: 260, absenteeHours: 560, leavers: 2 },
  { month: '2026-04', label: 'Apr', headcount: 123, hoursWorked: 22400, lostTimeInjuries: 0, recordableIncidents: 1, trainingHours: 270, absenteeHours: 520, leavers: 1 },
  { month: '2026-05', label: 'May', headcount: 125, hoursWorked: 23100, lostTimeInjuries: 0, recordableIncidents: 0, trainingHours: 280, absenteeHours: 540, leavers: 1 },
  { month: '2026-06', label: 'Jun', headcount: 126, hoursWorked: 23600, lostTimeInjuries: 0, recordableIncidents: 1, trainingHours: 290, absenteeHours: 570, leavers: 2 },
  { month: '2026-07', label: 'Jul', headcount: 127, hoursWorked: 23200, lostTimeInjuries: 0, recordableIncidents: 0, trainingHours: 300, absenteeHours: 530, leavers: 1 },
  { month: '2026-08', label: 'Aug', headcount: 128, hoursWorked: 22800, lostTimeInjuries: 0, recordableIncidents: 0, trainingHours: 310, absenteeHours: 505, leavers: 2 },
];

const depts = [
  { name: 'Connector molding & assembly', headcount: 52, site: 'dgws', genderFemale: 12, contract: 9 },
  { name: 'Charging-module SMT & test', headcount: 28, site: 'dgws', genderFemale: 12, contract: 6 },
  { name: 'Quality / HV lab', headcount: 11, site: 'dgws', genderFemale: 4, contract: 2 },
  { name: 'Product & process engineering', headcount: 12, site: 'dgws', genderFemale: 3, contract: 0 },
  { name: 'Supply chain', headcount: 8, site: 'dgws', genderFemale: 3, contract: 1 },
  { name: 'EHS', headcount: 5, site: 'dgws', genderFemale: 2, contract: 0 },
  { name: 'Sales & program', headcount: 6, site: 'hkhq', genderFemale: 3, contract: 0 },
  { name: 'Finance', headcount: 2, site: 'hkhq', genderFemale: 1, contract: 0 },
  { name: 'HR', headcount: 2, site: 'hkhq', genderFemale: 1, contract: 0 },
  { name: 'Corporate (HK)', headcount: 2, site: 'hkhq', genderFemale: 1, contract: 0 },
];

const workers = [];
let id = 1001;
for (const dept of depts) {
  for (let i = 0; i < dept.headcount; i += 1) {
    const female = i < dept.genderFemale;
    const contract = i >= dept.headcount - dept.contract;
    workers.push({
      worker_id: `W-${id}`,
      status: 'active',
      site_id: dept.site,
      department: dept.name,
      gender: female ? 'female' : 'male',
      contract_type: contract ? 'contract' : 'permanent',
      hire_date: hireDate(id),
      as_of: '2026-08-31',
    });
    id += 1;
  }
}

const duplicate = workers.find((w) => w.department.startsWith('Connector') && w.contract_type === 'permanent' && w.gender === 'male');
const dupId = duplicate.worker_id;
const contractorClone = {
  ...duplicate,
  contract_type: 'contract',
  hire_date: '2024-01-09',
  note: 'OPEN contractor record — not closed after conversion',
};
duplicate.hire_date = '2026-08-04';
duplicate.note = 'Permanent conversion 4 Aug 2026 — unique headcount uses one ID';

const workforceRows = [];
for (const w of workers) {
  if (w.worker_id === dupId) workforceRows.push(contractorClone);
  workforceRows.push(w);
}

const overdueHv = workers.filter((w) => w.department.startsWith('Connector')).slice(0, 11).map((w) => w.worker_id);
const overduePdpo = workers.filter((w) => w.site_id === 'dgws' && w.contract_type === 'contract').slice(0, 10).map((w) => w.worker_id);

function hireDate(n) {
  const year = 2016 + (n % 10);
  const month = String((n % 12) + 1).padStart(2, '0');
  const day = String((n % 27) + 1).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function csvEscape(v) {
  const s = v == null ? '' : String(v);
  return /[",\n]/.test(s) ? `"${s.replaceAll('"', '""')}"` : s;
}
function toCsv(headers, rows) {
  return [headers.join(','), ...rows.map((r) => headers.map((h) => csvEscape(r[h])).join(','))].join('\n') + '\n';
}

const meters = [
  { meter_id: 'HK-OFF-01', site_id: 'hkhq', meter_name: 'Kowloon Bay two-room office', process: 'offices', share: 0.05, renShare: 0 },
  { meter_id: 'DG-MOLD-04', site_id: 'dgws', meter_name: 'Injection presses 1–6 (HV connectors)', process: 'HV connector molding', share: 0.48, renShare: 0.75 },
  { meter_id: 'DG-PLT-02', site_id: 'dgws', meter_name: 'Small plating rectifier', process: 'connector plating', share: 0.22, renShare: 0 },
  { meter_id: 'DG-SMT-01', site_id: 'dgws', meter_name: 'Charging-module SMT cell', process: 'charging-module PCBA', share: 0.12, renShare: 0.08 },
  { meter_id: 'DG-AGE-03', site_id: 'dgws', meter_name: 'Two 800V burn-in racks', process: 'charging-module aging', share: 0.13, renShare: 0.17 },
];

const elecRows = [];
for (const m of envMonthly) {
  let kUsed = 0;
  let rUsed = 0;
  meters.forEach((meter, idx) => {
    const last = idx === meters.length - 1;
    const kwh = last ? m.electricityKwh - kUsed : Math.round(m.electricityKwh * meter.share);
    const ren = last ? m.renewableKwh - rUsed : Math.round(m.renewableKwh * meter.renShare);
    kUsed += kwh;
    rUsed += ren;
    elecRows.push({ ...meter, month: m.month, kwh, renewable_kwh: ren, uom: 'kWh', included_in_scope2: 'yes' });
  });
}

const dieselRows = [];
const dest = ['Guangzhou OEM sample shipment', 'Shenzhen warehouse run', 'Local Dongguan shuttle'];
for (const m of envMonthly) {
  const a = Math.round(m.dieselLitres * 0.42);
  const b = Math.round(m.dieselLitres * 0.33);
  const c = m.dieselLitres - a - b;
  dieselRows.push({ ticket_id: `DG-${m.month.slice(5)}-03`, ticket_date: `${m.month}-03`, site_id: 'dgws', destination: dest[0], litres: a, unit_as_logged: 'litres', mapped_to_scope1: 'yes', notes: '' });
  dieselRows.push({ ticket_id: `DG-${m.month.slice(5)}-12`, ticket_date: `${m.month}-12`, site_id: 'dgws', destination: dest[1], litres: b, unit_as_logged: 'litres', mapped_to_scope1: 'yes', notes: '' });
  dieselRows.push({ ticket_id: `DG-${m.month.slice(5)}-24`, ticket_date: `${m.month}-24`, site_id: 'dgws', destination: dest[2], litres: c, unit_as_logged: 'litres', mapped_to_scope1: 'yes', notes: '' });
  if (m.month === '2026-08') {
    dieselRows.push({
      ticket_id: 'DG-08-17',
      ticket_date: '2026-08-17',
      site_id: 'dgws',
      destination: dest[0],
      litres: 95,
      unit_as_logged: 'litres',
      mapped_to_scope1: 'no',
      notes: 'Unit mismatch: mapping expected kg; excluded from Scope 1',
    });
  }
}

const ngRows = envMonthly.map((m) => ({ meter_id: 'DG-NG-01', site_id: 'dgws', process: 'PA66 connector dryers', month: m.month, m3: m.naturalGasM3, uom: 'm3' }));
const waterRows = [];
for (const m of envMonthly) {
  const plate = Math.round(m.waterM3 * 0.62);
  const cool = Math.round(m.waterM3 * 0.22);
  const pcba = m.waterM3 - plate - cool;
  waterRows.push({ meter_id: 'DG-W-PLT', site_id: 'dgws', process: 'plating rinse', month: m.month, m3: plate, uom: 'm3' });
  waterRows.push({ meter_id: 'DG-W-CT', site_id: 'dgws', process: 'cooling tower', month: m.month, m3: cool, uom: 'm3' });
  waterRows.push({ meter_id: 'DG-W-DI', site_id: 'dgws', process: 'PCBA wash / DI', month: m.month, m3: pcba, uom: 'm3' });
}
const wasteRows = [];
for (const m of envMonthly) {
  const copper = Math.round(m.wasteTonnes * 0.44 * 10) / 10;
  const plastic = Math.round(m.wasteTonnes * 0.26 * 10) / 10;
  const sludge = Math.round(m.wasteTonnes * 0.14 * 10) / 10;
  const pack = Math.round((m.wasteTonnes - copper - plastic - sludge) * 10) / 10;
  const recC = Math.round(copper * 0.95 * 10) / 10;
  const recP = Math.round(plastic * 0.5 * 10) / 10;
  const recK = Math.round(Math.max(0, m.recycledTonnes - recC - recP) * 10) / 10;
  const ym = m.month.replace('-', '');
  wasteRows.push({ ticket_id: `W-${ym}-01`, site_id: 'dgws', stream: 'copper sprue', hazardous: 'no', month: m.month, tonnes: copper, recycled_tonnes: recC, destination: 'local scrap merchant' });
  wasteRows.push({ ticket_id: `W-${ym}-02`, site_id: 'dgws', stream: 'PBT/PA66 runner', hazardous: 'no', month: m.month, tonnes: plastic, recycled_tonnes: recP, destination: 'in-house regrind' });
  wasteRows.push({ ticket_id: `W-${ym}-03`, site_id: 'dgws', stream: 'plating sludge', hazardous: 'yes', month: m.month, tonnes: sludge, recycled_tonnes: 0, destination: 'licensed HW contractor' });
  wasteRows.push({ ticket_id: `W-${ym}-04`, site_id: 'dgws', stream: 'packaging / solder dross', hazardous: 'no', month: m.month, tonnes: pack, recycled_tonnes: recK, destination: 'municipal + metal recycler' });
}

const incidents = [
  { incident_id: 'INC-2026-031', date: '2026-03-09', site_id: 'dgws', line: 'HV connector crimp bench', severity: 'lost time', lost_time: 'yes', recordable: 'yes', hours_lost: 16, description: 'Crush injury on manual 800V crimp changeover — the YTD LTI' },
  { incident_id: 'INC-2026-044', date: '2026-04-15', site_id: 'dgws', line: 'Plating', severity: 'first aid', lost_time: 'no', recordable: 'yes', hours_lost: 0, description: 'Chemical splash to glove — no lost time' },
  { incident_id: 'INC-2026-062', date: '2026-06-11', site_id: 'dgws', line: 'Charging-module SMT', severity: 'first aid', lost_time: 'no', recordable: 'yes', hours_lost: 0, description: 'Minor laceration on PCB depanel' },
];

const trainingRows = [];
for (const w of workers) {
  const overdue = overdueHv.includes(w.worker_id);
  trainingRows.push({
    worker_id: w.worker_id,
    course: '800V electrical safety / LOTO',
    due_date: '2026-09-01',
    completed_at: overdue ? '' : `2026-0${(Number(w.worker_id.slice(2)) % 6) + 1}-${String((Number(w.worker_id.slice(2)) % 20) + 8).padStart(2, '0')}`,
    hours: 4,
    status: overdue ? 'overdue' : 'complete',
  });
  if (overduePdpo.includes(w.worker_id) || w.worker_id === workers[0].worker_id) {
    trainingRows.push({
      worker_id: w.worker_id,
      course: 'OEM data / PDPO',
      due_date: '2026-12-31',
      completed_at: overduePdpo.includes(w.worker_id) ? '' : '2026-02-03',
      hours: 0.5,
      status: overduePdpo.includes(w.worker_id) ? 'overdue' : 'complete',
    });
  }
}

const hoursRows = socialMonthly.map((m) => ({
  month: m.month,
  site_id: 'all',
  hours_worked: m.hoursWorked,
  lost_time_injuries: m.lostTimeInjuries,
  recordable_incidents: m.recordableIncidents,
  training_hours: m.trainingHours,
  absentee_hours: m.absenteeHours,
  leavers: m.leavers,
  headcount_eom: m.headcount,
}));

const female = workers.filter((w) => w.gender === 'female').length;
const contract = workers.filter((w) => w.contract_type === 'contract').length;
const male = workers.length - female;

const customers = [
  {
    id: 'cust-nds',
    name: 'Nordic Drive Systems GmbH',
    region: 'Germany / EU',
    relationship: 'First EU RFQ — charging modules',
    products: 'DC 20 kW charging modules (sample + 2k/year intent)',
    asksFor: 'LkSG + CSDDD supplier pack: Scope 1–2, energy, plating water, hazardous waste, LTIFR, labour, anti-corruption',
    dueDate: '2026-11-30',
    status: 'RFQ blocked until ESG pack is issued',
  },
  {
    id: 'cust-helix',
    name: 'Helix Powertrain SAS',
    region: 'France / EU',
    relationship: 'Prototype HV connector programme',
    products: '800 V connectors (low volume)',
    asksFor: 'CSRD value-chain data: GHG, energy mix, water, waste, hours, HV electrical-safety training',
    dueDate: '2026-12-15',
    status: 'Data request open',
  },
];

const organization = {
  legalName: 'Kaiheng Electric Limited',
  chineseName: '凯恒电气有限公司',
  shortName: 'Kaiheng Electric',
  stockCode: 'Unlisted',
  industry: 'New-energy vehicle electrical components',
  productFocus: 'EV charging modules (AC 7–22 kW, DC 20–40 kW) and 400/800 V high-voltage connectors',
  headquarters: 'Kowloon Bay, Hong Kong SAR',
  region: 'Hong Kong SAR and Greater Bay Area; first EU RFQs',
  regulator: 'Customer due diligence: EU CSDDD / German LkSG / CSRD value-chain requests, plus OEM Supplier Codes of Conduct',
  listingBoard: 'Private company. 12 people in Hong Kong, 116 in one leased Dongguan workshop. Not a listed group and not a multi-plant manufacturer.',
  sites: [
    {
      id: 'hkhq',
      name: 'Kowloon Bay sales office',
      location: 'Kowloon Bay, Hong Kong',
      type: 'Two-room sales and programme office',
      headcount: 12,
      electricityShare: 0.05,
      gridFactorKey: 'hkGrid',
    },
    {
      id: 'dgws',
      name: 'Dongguan workshop',
      location: 'Dongguan, Guangdong',
      type: 'Single leased factory: HV connector cell + charging-module SMT/burn-in cell',
      headcount: 116,
      electricityShare: 0.95,
      gridFactorKey: 'gdGrid',
    },
  ],
  customers,
  contacts: {
    sustainabilityLead: 'Zhou Jia-min',
    title: 'Quality and sustainability lead (also IATF management rep)',
    email: 'sustainability@kaiheng-electric.com',
  },
};

const dataset = {
  organization,
  reportingPeriod: {
    fiscalYear: 2026,
    label: 'FY2026 year-to-date',
    start: '2026-01-01',
    end: '2026-12-31',
    asOf: '2026-09-18T11:13:00+08:00',
    lastCompleteMonth: '2026-08',
    completeMonths: 8,
    basis:
      'Operational control over two sites: a Hong Kong sales office (12 people) and one Dongguan workshop (116 people) making EV charging modules and HV connectors only. Pack is for EU/OEM supplier questionnaires. Location-based Scope 2 is default; market-based Scope 2 is shown for the EU customer pack and ISSB. Management information, not year-end limited assurance except where an audit item is completed.',
  },
  factors,
  targets: {
    annualScope12Tco2e: 1600,
    renewableSharePct: 25,
    wasteRecycledPct: 60,
    ltifr: 2.0,
    trainingHoursPerEmployeeYear: 20,
    femaleWorkforcePct: 35,
    turnoverPct: 15,
    compliancePct: 95,
    netZeroYear: 2050,
    reduction2030PctFromFy2024: 42,
    fy2024BaselineScope12Tco2e: 1800,
  },
  comparatives: {
    priorIntegratedScore: 71,
    fy2025Scope12Tco2e: 1580,
    fy2025JanAugScope12Tco2e: 1080,
    fy2025Ltifr: 6.1,
    fy2025FemalePct: 29.0,
    fy2025TrainingHoursPerEmployee: 14.2,
    fy2025CompliancePct: 89.0,
    fy2025RenewablePct: 12,
    q2IntegratedScore: 71,
  },
  environmental: { revenueYtdHkdMillion: 82, monthly: envMonthly },
  social: {
    snapshot: {
      ltiNote: 'The single YTD lost-time injury was on the Dongguan HV connector crimp bench (March). With 128 people, one LTI moves LTIFR a long way — that is why the EU RFQ asks for hours as well as the rate.',
      headcount: 128,
      male,
      female,
      permanent: workers.length - contract,
      contract,
      femaleInManagementPct: 25.0,
      departments: depts.map((d) => ({ name: d.name, headcount: d.headcount })),
    },
    monthly: socialMonthly,
  },
  governance: {
    domains: [
      { domain: 'OEM data / PDPO', score: 94, frameworkRefs: ['HKEX B6', 'GRI 418'] },
      { domain: 'IATF 16949 quality system', score: 93, frameworkRefs: ['HKEX B6', 'GRI 416'] },
      { domain: 'Labour & HR policy', score: 91, frameworkRefs: ['HKEX B1', 'GRI 401'] },
      { domain: 'HV electrical safety', score: 81, frameworkRefs: ['HKEX B2', 'GRI 403'] },
      { domain: 'Plating & environmental permits', score: 92, frameworkRefs: ['HKEX A1–A4'] },
      { domain: 'Anti-corruption', score: 99, frameworkRefs: ['HKEX B7', 'GRI 205'] },
      { domain: 'Owner oversight', score: 90, frameworkRefs: ['HKEX Governance', 'IFRS S1'] },
    ],
    audits: [
      { id: 'aud-iatf', title: 'IATF surveillance — Dongguan workshop', status: 'completed', date: '2026-04-16', issues: 3, owner: 'Quality (outsourced auditor)' },
      { id: 'aud-esg', title: 'Customer ESG dry-run (Nordic Drive RFQ)', status: 'completed', date: '2026-08-20', issues: 2, owner: 'Zhou Jia-min' },
      { id: 'aud-preye', title: 'Plating permit and energy-meter check', status: 'upcoming', date: '2026-11-10', issues: 0, owner: 'EHS' },
      { id: 'aud-fy', title: 'FY2026 limited assurance if the EU RFQ is won', status: 'upcoming', date: '2027-02-16', issues: 0, owner: 'External assurer (quoted)' },
    ],
    policies: [
      { policy: 'Code of Conduct', total: 128, acknowledged: 124 },
      { policy: 'OEM data / PDPO', total: 128, acknowledged: 118 },
      { policy: 'Anti-corruption', total: 128, acknowledged: 128 },
      { policy: 'Whistleblower protection', total: 128, acknowledged: 125 },
      { policy: 'HV electrical safety', total: 128, acknowledged: 109 },
    ],
    whistleblowing: { openCases: 1, closedYtd: 2, agingOver90Days: 1, policyReviewsScheduled: 2 },
  },
  sources: [
    { id: 'src-ems', name: 'Dongguan workshop EMS', pillar: 'environmental', system: 'Press and rectifier meters', endpoint: 'internal://dongguan/ems', lastSyncAt: '2026-09-18T11:08:00+08:00', notes: 'Six injection presses, one plating rectifier, SMT cell, two burn-in racks.' },
    { id: 'src-diesel', name: 'Workshop diesel log', pillar: 'environmental', system: 'Paper tickets + spreadsheet', endpoint: 'internal://dongguan/diesel', lastSyncAt: '2026-09-18T11:05:00+08:00', notes: 'One van for OEM sample runs. August includes an unmapped 95 L ticket.' },
    { id: 'src-ng', name: 'Connector dryer NG meter', pillar: 'environmental', system: 'Municipal NG', endpoint: 'internal://dongguan/ng', lastSyncAt: '2026-09-18T11:02:00+08:00', notes: 'PA66 dryers only.' },
    { id: 'src-grid', name: 'Grid emission-factor feed', pillar: 'environmental', system: 'Published HK / Guangdong factors', endpoint: 'internal://catalog/grid-factors', lastSyncAt: '2026-09-17T23:40:00+08:00', notes: 'Stale vs 18 Sep as-of.' },
    { id: 'src-refrigerant', name: 'Burn-in F-gas notebook', pillar: 'environmental', system: 'Paper F-gas log', endpoint: 'internal://dongguan/f-gas', lastSyncAt: '2026-09-16T09:12:00+08:00', failed: true, notes: 'R-134a top-ups on two aging racks. No GWP in the catalog.' },
    { id: 'src-hris', name: 'Excel HR roster + MPF file', pillar: 'social', system: 'Spreadsheet HRIS', endpoint: 'internal://hr/roster', lastSyncAt: '2026-09-18T11:12:00+08:00', notes: `${dupId} appears twice after a contractor-to-permanent conversion.` },
    { id: 'src-ehs', name: 'EHS incident notebook', pillar: 'social', system: 'Workshop EHS log', endpoint: 'internal://ehs/incidents', lastSyncAt: '2026-09-18T11:10:00+08:00', notes: 'Three recordables YTD; one lost-time.' },
    { id: 'src-lms', name: 'HV safety attendance sheets', pillar: 'social', system: 'Classroom + scanned sheets', endpoint: 'internal://lms/hv-safety', lastSyncAt: '2026-09-18T10:28:00+08:00', notes: `${overdueHv.length} people past the 12-month 800V authorisation.` },
    { id: 'src-compliance', name: 'Owner / IATF tracker', pillar: 'governance', system: 'Quality shared folder', endpoint: 'internal://quality/compliance', lastSyncAt: '2026-09-18T11:00:00+08:00', notes: 'No dedicated compliance system — quality shared folder only.' },
    { id: 'src-speakup', name: 'Independent speak-up mailbox', pillar: 'governance', system: 'External email mailbox', endpoint: 'internal://integrity/cases', lastSyncAt: '2026-09-18T10:51:00+08:00', notes: 'One open case, aging over 90 days.' },
  ],
  validations: [
    { id: 'val-unit-diesel', pillar: 'environmental', type: 'unit_mismatch', severity: 'error', title: 'Diesel ticket unit mismatch', description: `Ticket DG-08-17 is 95 litres for a Guangzhou sample run. The mapping expected kilograms, so it is excluded from Scope 1. 95 L × ${factors.dieselKgPerLitre} kg/L would add ${(95 * factors.dieselKgPerLitre / 1000).toFixed(3)} tCO₂e.`, sourceId: 'src-diesel', status: 'open', blocksReport: true, detectedAt: '2026-09-02T09:14:00+08:00' },
    { id: 'val-r134a-factor', pillar: 'environmental', type: 'missing_emission_factor', severity: 'error', title: 'Missing R-134a GWP factor', description: 'Two 800V burn-in racks were topped up with R-134a (3.1 kg in July, 2.4 kg in August). No GWP is in the catalog. IPCC AR6 GWP-100 1,530 would add 8.42 tCO₂e.', sourceId: 'src-refrigerant', status: 'open', blocksReport: true, detectedAt: '2026-09-16T09:12:00+08:00' },
    { id: 'val-grid-stale', pillar: 'environmental', type: 'stale_source', severity: 'warning', title: 'Grid factor feed is stale', description: 'Last synced 23:40 on 17 Sep 2026. Scope 2 still uses HK 0.66 and Guangdong 0.5703 kg/kWh.', sourceId: 'src-grid', status: 'open', blocksReport: false, detectedAt: '2026-09-18T11:13:00+08:00' },
    { id: 'val-elec-spike', pillar: 'environmental', type: 'energy_spike', severity: 'warning', title: 'Burn-in kWh above four-week mean', description: 'Week of 14 Jul 2026, the two aging racks ran extra 800V soak for the Nordic Drive sample build (+36% vs the prior four weeks).', sourceId: 'src-ems', status: 'open', blocksReport: false, detectedAt: '2026-07-22T08:00:00+08:00' },
    { id: 'val-dup-worker', pillar: 'social', type: 'duplicate_employee', severity: 'error', title: 'Duplicate worker after conversion', description: `${dupId} exists twice: an open contractor row and a permanent row created 4 Aug 2026. Unique headcount is 128; the roster file has 129 rows.`, sourceId: 'src-hris', status: 'open', blocksReport: true, detectedAt: '2026-08-06T14:22:00+08:00' },
    { id: 'val-overdue-hv', pillar: 'social', type: 'overdue_training', severity: 'warning', title: 'Overdue 800 V electrical-safety authorisation', description: `${overdueHv.length} of 128 people are past the 12-month HV / LOTO due date (all on the connector cell). The YTD LTI was on that bench.`, sourceId: 'src-lms', status: 'open', blocksReport: false, detectedAt: '2026-09-18T10:28:00+08:00' },
    { id: 'val-pdpo', pillar: 'governance', type: 'policy_exception', severity: 'warning', title: 'OEM data / PDPO acknowledgement gap', description: '10 people have not acknowledged the OEM-drawing / PDPO policy (118 of 128 = 92.2%).', sourceId: 'src-lms', status: 'open', blocksReport: false, detectedAt: '2026-09-18T10:28:00+08:00' },
    { id: 'val-safety-domain', pillar: 'governance', type: 'below_threshold', severity: 'error', title: 'HV electrical-safety compliance below 95%', description: 'Domain score is 81 after the March LTI and 11 overdue 800V authorisations. Nordic Drive’s RFQ treats this as a blocker.', sourceId: 'src-compliance', status: 'open', blocksReport: true, detectedAt: '2026-09-01T09:00:00+08:00' },
    { id: 'val-case-aging', pillar: 'governance', type: 'policy_exception', severity: 'warning', title: 'Speak-up case open more than 90 days', description: 'The single open integrity case has been open 96 days. The mailbox is still monitored.', sourceId: 'src-speakup', status: 'open', blocksReport: false, detectedAt: '2026-09-12T17:00:00+08:00' },
  ],
};

writeFileSync(join(srcData, 'esg-dataset.json'), JSON.stringify(dataset, null, 2) + '\n');

writeFileSync(join(examples, 'electricity_meters.csv'), toCsv(['meter_id', 'site_id', 'meter_name', 'process', 'month', 'kwh', 'renewable_kwh', 'uom', 'included_in_scope2'], elecRows));
writeFileSync(join(examples, 'diesel_tickets.csv'), toCsv(['ticket_id', 'ticket_date', 'site_id', 'destination', 'litres', 'unit_as_logged', 'mapped_to_scope1', 'notes'], dieselRows));
writeFileSync(join(examples, 'natural_gas_meters.csv'), toCsv(['meter_id', 'site_id', 'process', 'month', 'm3', 'uom'], ngRows));
writeFileSync(join(examples, 'water_meters.csv'), toCsv(['meter_id', 'site_id', 'process', 'month', 'm3', 'uom'], waterRows));
writeFileSync(join(examples, 'waste_weighbridge.csv'), toCsv(['ticket_id', 'site_id', 'stream', 'hazardous', 'month', 'tonnes', 'recycled_tonnes', 'destination'], wasteRows));
writeFileSync(join(examples, 'hours_worked.csv'), toCsv(['month', 'site_id', 'hours_worked', 'lost_time_injuries', 'recordable_incidents', 'training_hours', 'absentee_hours', 'leavers', 'headcount_eom'], hoursRows));
writeFileSync(join(examples, 'incidents.csv'), toCsv(['incident_id', 'date', 'site_id', 'line', 'severity', 'lost_time', 'recordable', 'hours_lost', 'description'], incidents));
writeFileSync(join(examples, 'workforce_extract.csv'), toCsv(['worker_id', 'status', 'site_id', 'department', 'gender', 'contract_type', 'hire_date', 'as_of', 'note'], workforceRows.map((w) => ({ note: '', ...w }))));
writeFileSync(join(examples, 'training_completions.csv'), toCsv(['worker_id', 'course', 'due_date', 'completed_at', 'hours', 'status'], trainingRows));
writeFileSync(
  join(examples, 'refrigerant_topups.csv'),
  toCsv(
    ['log_id', 'site_id', 'asset', 'gas', 'date', 'kg', 'gwp_in_catalog', 'included_in_scope1', 'notes'],
    [
      { log_id: 'FG-2026-0712', site_id: 'dgws', asset: 'Burn-in rack 1', gas: 'R-134a', date: '2026-07-12', kg: 3.1, gwp_in_catalog: 'no', included_in_scope1: 'no', notes: 'Missing GWP' },
      { log_id: 'FG-2026-0829', site_id: 'dgws', asset: 'Burn-in rack 2', gas: 'R-134a', date: '2026-08-29', kg: 2.4, gwp_in_catalog: 'no', included_in_scope1: 'no', notes: 'Missing GWP' },
    ],
  ),
);

writeFileSync(join(examples, 'organization.json'), JSON.stringify(organization, null, 2) + '\n');
writeFileSync(join(examples, 'customers.json'), JSON.stringify(customers, null, 2) + '\n');
writeFileSync(join(examples, 'incidents.json'), JSON.stringify(incidents, null, 2) + '\n');
writeFileSync(join(examples, 'workforce.json'), JSON.stringify({ unique_headcount: 128, roster_rows: workforceRows.length, duplicate_worker_id: dupId, workers: workforceRows }, null, 2) + '\n');
writeFileSync(
  join(examples, 'monthly_activity.json'),
  JSON.stringify(
    {
      asOf: dataset.reportingPeriod.asOf,
      environmental: envMonthly,
      social: socialMonthly,
    },
    null,
    2,
  ) + '\n',
);

const pick = (row, headers) => headers.map((h) => (row[h] == null ? '' : String(row[h])));
const preview = (rows, headers, n = 4) => rows.slice(0, n).map((r) => pick(r, headers));
const elecHeaders = ['meter_id', 'site_id', 'meter_name', 'process', 'month', 'kwh', 'renewable_kwh', 'uom', 'included_in_scope2'];
const dieselHeaders = ['ticket_id', 'ticket_date', 'site_id', 'destination', 'litres', 'unit_as_logged', 'mapped_to_scope1', 'notes'];
const catalog = {
  description:
    'Source extracts for this 128-person company. Meter and ticket files are CSV; organisation, customers, roster and monthly activity are also JSON. Totals roll up to esg-dataset.json.',
  files: [
    { id: 'elec', file: 'src/data/source-examples/electricity_meters.csv', pillar: 'environmental', system: 'Workshop EMS', grain: 'meter × month', feeds: 'Scope 2', note: 'Five meters in one Dongguan workshop plus the HK office. kWh sums to the dashboard.', headers: elecHeaders, preview: preview(elecRows, elecHeaders, 5) },
    { id: 'diesel', file: 'src/data/source-examples/diesel_tickets.csv', pillar: 'environmental', system: 'Van tickets', grain: 'ticket', feeds: 'Scope 1 diesel', note: 'Mapped litres sum to YTD diesel. DG-08-17 (95 L) is excluded.', headers: dieselHeaders, preview: preview(dieselRows.filter((r) => r.ticket_date.startsWith('2026-08')), dieselHeaders, 4) },
    { id: 'ng', file: 'src/data/source-examples/natural_gas_meters.csv', pillar: 'environmental', system: 'NG meter', grain: 'meter × month', feeds: 'Scope 1 NG', note: 'One dryer meter.', headers: Object.keys(ngRows[0]), preview: preview(ngRows, Object.keys(ngRows[0]), 2) },
    { id: 'refrigerant', file: 'src/data/source-examples/refrigerant_topups.csv', pillar: 'environmental', system: 'F-gas notebook', grain: 'event', feeds: 'Scope 1 F-gas (excluded)', note: '5.5 kg R-134a with no GWP.', headers: ['log_id', 'site_id', 'asset', 'gas', 'date', 'kg', 'gwp_in_catalog', 'included_in_scope1', 'notes'], preview: [['FG-2026-0712', 'dgws', 'Burn-in rack 1', 'R-134a', '2026-07-12', '3.1', 'no', 'no', 'Missing GWP']] },
    { id: 'water', file: 'src/data/source-examples/water_meters.csv', pillar: 'environmental', system: 'Water meters', grain: 'meter × month', feeds: 'Water', note: 'Plating, cooling, PCBA wash.', headers: Object.keys(waterRows[0]), preview: preview(waterRows, Object.keys(waterRows[0]), 3) },
    { id: 'waste', file: 'src/data/source-examples/waste_weighbridge.csv', pillar: 'environmental', system: 'Weighbridge', grain: 'stream × month', feeds: 'Waste', note: 'Plating sludge is the hazardous stream.', headers: Object.keys(wasteRows[0]), preview: preview(wasteRows, Object.keys(wasteRows[0]), 4) },
    { id: 'monthly-json', file: 'src/data/source-examples/monthly_activity.json', pillar: 'environmental', system: 'Internal monthly close', grain: 'month (JSON)', feeds: 'Environmental + social monthly series', note: 'Same Jan–Aug 2026 activity that the dashboards sum. Companion to the meter CSVs.', headers: ['month', 'electricityKwh', 'dieselLitres', 'waterM3', 'hoursWorked', 'headcount'], preview: envMonthly.slice(0, 3).map((m, i) => [m.month, String(m.electricityKwh), String(m.dieselLitres), String(m.waterM3), String(socialMonthly[i].hoursWorked), String(socialMonthly[i].headcount)]) },
    { id: 'org-json', file: 'src/data/source-examples/organization.json', pillar: 'governance', system: 'Legal entity file', grain: 'company (JSON)', feeds: 'Sites and reporting boundary', note: 'Two sites only: HK sales office (12) and one leased Dongguan workshop (116).', headers: ['field', 'value'], preview: [['legalName', organization.legalName], ['sites', 'hkhq 12 + dgws 116'], ['productFocus', organization.productFocus]] },
    { id: 'customers-json', file: 'src/data/source-examples/customers.json', pillar: 'governance', system: 'RFQ tracker', grain: 'customer (JSON)', feeds: 'Why the pack exists', note: 'Nordic Drive and Helix only — no third global OEM in this pack.', headers: ['id', 'name', 'region', 'dueDate', 'status'], preview: customers.map((c) => [c.id, c.name, c.region, c.dueDate, c.status]) },
    { id: 'hours', file: 'src/data/source-examples/hours_worked.csv', pillar: 'social', system: 'Clock cards', grain: 'month', feeds: 'LTIFR hours', note: 'Full YTD.', headers: Object.keys(hoursRows[0]), preview: preview(hoursRows.filter((r) => r.month === '2026-03' || r.month === '2026-08'), Object.keys(hoursRows[0]), 2) },
    { id: 'incidents', file: 'src/data/source-examples/incidents.csv', pillar: 'social', system: 'EHS log', grain: 'incident', feeds: 'LTIFR numerator', note: 'Three recordables; INC-2026-031 is the LTI. Same rows in incidents.json.', headers: Object.keys(incidents[0]), preview: preview(incidents, Object.keys(incidents[0]), 3) },
    { id: 'incidents-json', file: 'src/data/source-examples/incidents.json', pillar: 'social', system: 'EHS log', grain: 'incident (JSON)', feeds: 'LTIFR numerator', note: 'JSON copy of incidents.csv.', headers: Object.keys(incidents[0]), preview: preview(incidents, Object.keys(incidents[0]), 3) },
    { id: 'workforce', file: 'src/data/source-examples/workforce_extract.csv', pillar: 'social', system: 'HR roster', grain: 'worker (full 128 + 1 duplicate)', feeds: 'Headcount', note: `Full roster. ${dupId} duplicated. Same payload in workforce.json.`, headers: ['worker_id', 'status', 'site_id', 'department', 'gender', 'contract_type', 'hire_date', 'as_of', 'note'], preview: preview(workforceRows.filter((w) => w.worker_id === dupId), ['worker_id', 'status', 'site_id', 'department', 'gender', 'contract_type', 'hire_date', 'as_of', 'note'], 2) },
    { id: 'workforce-json', file: 'src/data/source-examples/workforce.json', pillar: 'social', system: 'HR roster', grain: 'worker (JSON)', feeds: 'Headcount', note: `unique_headcount 128; roster_rows 129; duplicate ${dupId}.`, headers: ['unique_headcount', 'roster_rows', 'duplicate_worker_id'], preview: [['128', String(workforceRows.length), dupId]] },
    { id: 'training', file: 'src/data/source-examples/training_completions.csv', pillar: 'social', system: 'Attendance sheets', grain: 'worker × course (full HV course)', feeds: 'Training / overdue HV', note: `All 128 people on 800V safety; ${overdueHv.length} overdue.`, headers: Object.keys(trainingRows[0]), preview: preview(trainingRows.filter((r) => r.status === 'overdue'), Object.keys(trainingRows[0]), 3) },
  ],
};
writeFileSync(join(srcData, 'source-catalog.json'), JSON.stringify(catalog, null, 2) + '\n');

const s1 = envMonthly.reduce((t, m) => t + (m.dieselLitres * factors.dieselKgPerLitre + m.naturalGasM3 * factors.naturalGasKgPerM3) / 1000, 0);
const s2 = envMonthly.reduce((t, m) => t + (m.electricityKwh * grid) / 1000, 0);
const hours = socialMonthly.reduce((t, m) => t + m.hoursWorked, 0);
const lti = socialMonthly.reduce((t, m) => t + m.lostTimeInjuries, 0);
console.log({
  people: workers.length,
  male,
  female,
  contract,
  depts: depts.reduce((t, d) => t + d.headcount, 0),
  kwh: envMonthly.reduce((t, m) => t + m.electricityKwh, 0),
  s1: s1.toFixed(1),
  s2: s2.toFixed(1),
  s12: (s1 + s2).toFixed(1),
  hours,
  ltifr: ((lti / hours) * 1e6).toFixed(2),
  rosterRows: workforceRows.length,
  overdueHv: overdueHv.length,
  dupId,
});
