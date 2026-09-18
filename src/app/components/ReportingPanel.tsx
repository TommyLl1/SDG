import { useState } from 'react';
import { CheckCircle, Download, FileText, XCircle } from 'lucide-react';
import { useEsg } from '../context/EsgProvider';
import { generateReport } from '../../lib/report';
import type { ReportFormat, ReportPeriod } from '../../lib/types';

export function ReportingPanel() {
  const { dataset, metrics, scores, forecast, validations, sources, settings, openBlockers, canExport } = useEsg();
  const [format, setFormat] = useState<ReportFormat>('pdf');
  const [quarter, setQuarter] = useState<'Q1' | 'Q2' | 'Q3'>('Q2');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const pack = {
    dataset,
    metrics,
    scores,
    forecast,
    validations,
    sources,
    framework: settings.framework,
  };

  async function run(period: ReportPeriod) {
    setError(null);
    if (!canExport) {
      setError('The current role cannot export. Switch to Analyst or Administrator in Settings → User.');
      return;
    }
    if (openBlockers.length > 0) {
      setError(
        `Generation is blocked until ${openBlockers.length} required validation${openBlockers.length === 1 ? ' is' : 's are'} resolved or acknowledged: ${openBlockers.map((v) => v.title).join('; ')}.`,
      );
      return;
    }
    if (period === 'Q3' && metrics.months.filter((m) => m.quarter === 'Q3').length < 3) {
      setError('Q3 is incomplete (July–August only). The file will still generate as a partial quarter if you confirm by resolving validations; this check is informational.');
    }
    if (period === 'Q4') {
      setError('Q4 2026 has not started. Choose Annual (YTD) or Q1–Q3.');
      return;
    }
    setBusy(true);
    try {
      await generateReport(format, period, pack);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Export failed.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="bg-white border-2 border-[#E5B700] rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-5 h-5 text-[#E5B700]" />
        <h3 className="text-[#003A70]">Reporting Center</h3>
      </div>

      <div className="space-y-3 mb-4">
        <button
          type="button"
          onClick={() => run('annual')}
          disabled={busy}
          className="w-full py-3 px-4 bg-white border-2 border-[#E5B700] text-[#E5B700] hover:bg-[#E5B700] hover:text-white transition-colors disabled:opacity-50"
        >
          <span className="flex items-center justify-between">
            <span>Generate customer ESG pack (YTD)</span>
            <Download className="w-4 h-4" />
          </span>
          <span className="block text-xs mt-1 opacity-80">Through 31 Aug 2026 · {format.toUpperCase()}</span>
        </button>
        <button
          type="button"
          onClick={() => run(quarter)}
          disabled={busy}
          className="w-full py-3 px-4 bg-white border-2 border-[#E5B700] text-[#E5B700] hover:bg-[#E5B700] hover:text-white transition-colors disabled:opacity-50"
        >
          <span className="flex items-center justify-between">
            <span>Generate quarterly pack</span>
            <Download className="w-4 h-4" />
          </span>
          <span className="block text-xs mt-1 opacity-80">{quarter} · {format.toUpperCase()}</span>
        </button>
      </div>

      <label className="text-[#6C757D] text-sm mb-2 block" htmlFor="report-format">
        File format
      </label>
      <select
        id="report-format"
        value={format}
        onChange={(e) => setFormat(e.target.value as ReportFormat)}
        className="w-full p-2 border-2 border-[#E5E5E5] text-[#003A70] focus:outline-none focus:border-[#E5B700] bg-white mb-3"
      >
        <option value="pdf">PDF</option>
        <option value="xlsx">Excel</option>
      </select>

      <label className="text-[#6C757D] text-sm mb-2 block" htmlFor="report-quarter">
        Quarter for quarterly pack
      </label>
      <select
        id="report-quarter"
        value={quarter}
        onChange={(e) => setQuarter(e.target.value as 'Q1' | 'Q2' | 'Q3')}
        className="w-full p-2 border-2 border-[#E5E5E5] text-[#003A70] focus:outline-none focus:border-[#E5B700] bg-white mb-4"
      >
        <option value="Q1">Q1 (Jan–Mar, complete)</option>
        <option value="Q2">Q2 (Apr–Jun, complete)</option>
        <option value="Q3">Q3 (Jul–Aug, partial)</option>
      </select>

      <div className="bg-[#003A70]/5 border border-[#003A70]/20 p-4">
        <div className="flex items-start gap-2 mb-2">
          <FileText className="w-4 h-4 text-[#E5B700] mt-0.5" />
          <p className="text-[#003A70] text-sm">
            Pack is the file you send to EU / OEM procurement under {settings.framework.toUpperCase()}. Open errors that block reports must be cleared first.
          </p>
        </div>
        <div className="flex items-center gap-2 ml-6">
          {openBlockers.length === 0 ? (
            <>
              <CheckCircle className="w-4 h-4 text-[#28A745]" />
              <span className="text-[#28A745] text-sm">No blocking validations</span>
            </>
          ) : (
            <>
              <XCircle className="w-4 h-4 text-[#C82333]" />
              <span className="text-[#C82333] text-sm">{openBlockers.length} blocking validation{openBlockers.length === 1 ? '' : 's'}</span>
            </>
          )}
        </div>
      </div>
      {error && <p className="text-[#C82333] text-sm mt-3">{error}</p>}
    </section>
  );
}
