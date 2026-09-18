import type { ReportFormat, ReportPeriod } from '../types';
import type { buildPdf } from './pdf';

type Pack = Parameters<typeof buildPdf>[0];

function downloadBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

export async function generateReport(format: ReportFormat, period: ReportPeriod, pack: Pack): Promise<void> {
  if (format === 'pdf') {
    const { buildPdf } = await import('./pdf');
    const file = buildPdf({ ...pack, period });
    downloadBlob(file.blob, file.name);
    return;
  }
  const { buildExcel } = await import('./excel');
  const file = buildExcel({ ...pack, period });
  downloadBlob(file.blob, file.name);
}
