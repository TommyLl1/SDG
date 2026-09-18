import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { DerivedMetrics, EsgDataset, ForecastResult, PillarScores, ReportPeriod, SourceView, ValidationRecord } from '../types';
import { getFramework } from '../frameworks';
import type { FrameworkId } from '../types';
import { formatNumber, monthsForReport } from '../format';

function filename(org: string, period: ReportPeriod, ext: string): string {
  const slug = org.replace(/\s+/g, '-').toLowerCase();
  return `${slug}-esg-${period}-fy2026-ytd.${ext}`;
}

export function buildPdf(args: {
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
  const periodLabel = period === 'annual' ? 'FY2026 year-to-date (through 31 Aug 2026)' : `FY2026 ${period}`;

  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();

  const lastY = () => ((doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY ?? 160);

  const heading = (title: string) => {
    const y = lastY() + 26;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(0, 58, 112);
    doc.text(title, 40, y);
    return y + 10;
  };

  doc.setFillColor(0, 58, 112);
  doc.rect(0, 0, pageWidth, 92, 'F');
  doc.setFillColor(229, 183, 0);
  doc.rect(0, 92, pageWidth, 6, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text(dataset.organization.legalName, 40, 38);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Customer ESG evidence pack — ${periodLabel}`, 40, 58);
  doc.text(`${dataset.organization.stockCode} · ${fw.name}`, 40, 76);

  doc.setTextColor(60, 60, 60);
  doc.setFontSize(10);
  const intro = [
    `As of ${dataset.reportingPeriod.asOf}. ${dataset.reportingPeriod.basis}`,
    `Headquarters: ${dataset.organization.headquarters}. Regulator: ${dataset.organization.regulator}.`,
    `Score method: ${scores.method} Integrated score ${scores.integrated} (E ${scores.environmental} / S ${scores.social} / G ${scores.governance}).`,
  ];
  doc.text(doc.splitTextToSize(intro.join(' '), pageWidth - 80), 40, 122);

  autoTable(doc, {
    startY: 168,
    head: [['KPI', 'Value', 'Notes']],
    body: [
      ['Scope 1', `${formatNumber(sum(rows, (r) => r.scope1Tco2e), 1)} tCO₂e`, 'Diesel + dryer NG. R-134a omitted until a GWP is assigned.'],
      ['Scope 2 (location)', `${formatNumber(sum(rows, (r) => r.scope2LocationTco2e), 1)} tCO₂e`, 'kWh × weighted HK/Guangdong grid factor'],
      ['Scope 1–2', `${formatNumber(sum(rows, (r) => r.scope12LocationTco2e), 1)} tCO₂e`, `FY budget ${formatNumber(dataset.targets.annualScope12Tco2e, 0)} tCO₂e`],
      ['Renewable electricity', `${(sum(rows, (r) => r.renewableKwh) / Math.max(sum(rows, (r) => r.electricityKwh), 1) * 100).toFixed(1)}%`, `Target ${dataset.targets.renewableSharePct}%`],
      ['Water', `${formatNumber(sum(rows, (r) => r.waterM3), 0)} m³`, 'Plating, cooling towers and PCBA wash'],
      ['Waste / recycled', `${formatNumber(sum(rows, (r) => r.wasteTonnes), 0)} t / ${formatNumber(sum(rows, (r) => r.recycledTonnes), 0)} t`, `${((sum(rows, (r) => r.recycledTonnes) / Math.max(sum(rows, (r) => r.wasteTonnes), 1)) * 100).toFixed(1)}% recycled`],
      ['Headcount', `${dataset.social.snapshot.headcount}`, `${dataset.social.snapshot.female} female (${((dataset.social.snapshot.female / dataset.social.snapshot.headcount) * 100).toFixed(1)}%)`],
      ['LTIFR', metrics.ytd.ltifr.toFixed(2), `${metrics.ytd.lostTimeInjuries} LTI / ${formatNumber(metrics.ytd.hoursWorked, 0)} hours`],
      ['Training hours / employee', metrics.ytd.trainingHoursPerEmployee.toFixed(1), `YTD hours ${formatNumber(metrics.ytd.trainingHours, 0)}`],
      ['Compliance average', `${metrics.complianceAverage.toFixed(1)}%`, 'Unweighted mean of seven domains'],
    ],
    styles: { fontSize: 8, cellPadding: 4 },
    headStyles: { fillColor: [0, 58, 112], textColor: 255 },
    columnStyles: { 0: { cellWidth: 130 }, 1: { cellWidth: 110 } },
  });

  autoTable(doc, {
    startY: heading('Monthly activity (selected period)'),
    head: [['Month', 'Scope 1', 'Scope 2 loc.', 'Scope 1–2', 'kWh', 'Water m³', 'LTI', 'LTIFR YTD']],
    body: rows.map((r) => [
      r.label,
      formatNumber(r.scope1Tco2e, 1),
      formatNumber(r.scope2LocationTco2e, 1),
      formatNumber(r.scope12LocationTco2e, 1),
      formatNumber(r.electricityKwh, 0),
      formatNumber(r.waterM3, 0),
      String(r.lostTimeInjuries),
      r.ytdLtifr.toFixed(2),
    ]),
    styles: { fontSize: 8, cellPadding: 3 },
    headStyles: { fillColor: [0, 58, 112], textColor: 255 },
  });

  autoTable(doc, {
    startY: heading('Forecast (not an LLM output)'),
    head: [['Method', 'FY2026 projection', 'vs budget']],
    body: [
      ['OLS linear trend on Jan–Aug monthly Scope 1–2', `${formatNumber(forecast.fyLinearTco2e, 0)} tCO₂e`, `${forecast.linearVsTargetPct}%`],
      ['Trailing 3-month average held flat Sep–Dec', `${formatNumber(forecast.fyTrailingTco2e, 0)} tCO₂e`, `${(((forecast.fyTrailingTco2e - forecast.annualTarget) / forecast.annualTarget) * 100).toFixed(1)}%`],
    ],
    styles: { fontSize: 8, cellPadding: 4 },
    headStyles: { fillColor: [229, 183, 0], textColor: [0, 58, 112] },
  });

  autoTable(doc, {
    startY: heading('Validation queue at export'),
    head: [['ID', 'Severity', 'Status', 'Title']],
    body: validations.map((v) => [v.id, v.severity, v.status, v.title]),
    styles: { fontSize: 8, cellPadding: 3 },
    headStyles: { fillColor: [0, 58, 112], textColor: 255 },
  });

  autoTable(doc, {
    startY: heading('Data sources'),
    head: [['Source', 'Status', 'Last sync']],
    body: sources.map((s) => [s.name, s.statusLabel, s.relativeSync]),
    styles: { fontSize: 8, cellPadding: 3 },
    headStyles: { fillColor: [0, 58, 112], textColor: 255 },
  });

  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i += 1) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(108, 117, 125);
    doc.text(
      `Kaiheng Electric Limited · Management information · Page ${i} of ${pageCount}`,
      40,
      doc.internal.pageSize.getHeight() - 24,
    );
  }

  const blob = doc.output('blob');
  return { blob, name: filename(dataset.organization.shortName, period, 'pdf') };
}

function sum<T>(rows: T[], pick: (row: T) => number): number {
  return rows.reduce((acc, row) => acc + pick(row), 0);
}
