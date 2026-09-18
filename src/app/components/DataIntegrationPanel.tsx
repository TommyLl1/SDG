import { AlertTriangle, CheckCircle, Database, XCircle } from 'lucide-react';
import type { Pillar, SourceView } from '../../lib/types';
import { useEsg } from '../context/EsgProvider';

function statusIcon(status: SourceView['status']) {
  if (status === 'healthy') return <CheckCircle className="w-5 h-5 text-[#28A745]" />;
  if (status === 'stale') return <AlertTriangle className="w-5 h-5 text-[#E5B700]" />;
  return <XCircle className="w-5 h-5 text-[#C82333]" />;
}

function statusClass(status: SourceView['status']) {
  if (status === 'healthy') return 'border-[#28A745]/30 bg-[#28A745]/5';
  if (status === 'stale') return 'border-[#E5B700]/30 bg-[#E5B700]/5';
  return 'border-[#C82333]/30 bg-[#C82333]/5';
}

export function DataIntegrationPanel({ pillar, title }: { pillar: Pillar; title: string }) {
  const { sources, openSettings } = useEsg();
  const rows = sources.filter((s) => s.pillar === pillar);

  return (
    <section className="bg-white border border-[#003A70]/10 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Database className="w-6 h-6 text-[#003A70]" />
        <h3 className="text-[#003A70]">{title}</h3>
      </div>
      <div className="space-y-3">
        {rows.map((source) => (
          <article key={source.id} className={`flex items-center justify-between gap-3 p-4 rounded-lg border ${statusClass(source.status)}`}>
            <div className="flex items-center gap-3 min-w-0">
              {statusIcon(source.status)}
              <div className="min-w-0">
                <div className="text-[#003A70]">{source.name}</div>
                <div className="text-[#6C757D] text-sm">Last sync: {source.relativeSync}</div>
              </div>
            </div>
            <span
              className={`px-3 py-1 rounded text-sm text-white shrink-0 ${
                source.status === 'healthy' ? 'bg-[#28A745]' : source.status === 'stale' ? 'bg-[#E5B700]' : 'bg-[#C82333]'
              }`}
            >
              {source.statusLabel}
            </span>
          </article>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-[#E5E5E5]">
        <button
          type="button"
          onClick={() => openSettings('api')}
          className="w-full py-2 px-4 bg-[#003A70] text-white rounded hover:bg-[#003A70]/90 transition-colors"
        >
          Manage data sources
        </button>
      </div>
    </section>
  );
}
