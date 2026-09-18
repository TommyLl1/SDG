import { AlertTriangle, CheckCircle, ClipboardCheck, XCircle } from 'lucide-react';
import type { Pillar } from '../../lib/types';
import { useEsg } from '../context/EsgProvider';

export function ValidationPanel({ pillar, aspect }: { pillar: Pillar; aspect: string }) {
  const { validations, setValidationStatus, canResolveValidations } = useEsg();
  const rows = validations.filter((v) => v.pillar === pillar);
  const openRows = rows.filter((v) => v.status === 'open');
  const visible = openRows.length > 0 ? openRows : rows;

  return (
    <section className="bg-white border border-[#003A70]/10 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-2">
        <ClipboardCheck className="w-6 h-6 text-[#E5B700]" />
        <h3 className="text-[#003A70]">Validation queue — {aspect}</h3>
      </div>
      <p className="text-[#6C757D] text-sm mb-4">
        Rule-based checks on activity data, factors and registers. Acknowledge warnings; resolve errors that block the report pack.
      </p>
      <div className="space-y-3">
        {visible.map((item) => {
          const Icon = item.severity === 'error' ? XCircle : item.severity === 'warning' ? AlertTriangle : CheckCircle;
          const tone =
            item.severity === 'error'
              ? 'border-[#C82333] bg-[#C82333]/5'
              : item.severity === 'warning'
                ? 'border-[#E5B700] bg-[#E5B700]/5'
                : 'border-[#003A70] bg-[#003A70]/5';
          return (
            <article key={item.id} className={`p-4 rounded-lg border-l-4 ${tone}`}>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <Icon className="w-5 h-5" />
                  <span className="text-[#003A70]">{item.title}</span>
                  {item.blocksReport && <span className="text-xs px-2 py-0.5 bg-[#C82333] text-white rounded">Blocks report</span>}
                </div>
                <span className="text-xs uppercase tracking-wide text-[#6C757D]">{item.status}</span>
              </div>
              <p className="text-[#6C757D] text-sm mb-3">{item.description}</p>
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <span className="text-[#6C757D] text-xs">{item.type.replaceAll('_', ' ')}</span>
                {item.status === 'open' && (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={!canResolveValidations}
                      onClick={() => setValidationStatus(item.id, 'acknowledged')}
                      className="px-3 py-1 bg-[#E5B700] text-white rounded text-sm hover:bg-[#E5B700]/90 disabled:opacity-40"
                    >
                      Acknowledge
                    </button>
                    <button
                      type="button"
                      disabled={!canResolveValidations}
                      onClick={() => setValidationStatus(item.id, 'resolved')}
                      className="px-3 py-1 bg-[#28A745] text-white rounded text-sm hover:bg-[#28A745]/90 disabled:opacity-40"
                    >
                      Resolve
                    </button>
                  </div>
                )}
                {item.status !== 'open' && canResolveValidations && (
                  <button
                    type="button"
                    onClick={() => setValidationStatus(item.id, 'open')}
                    className="px-3 py-1 border border-[#003A70] text-[#003A70] rounded text-sm"
                  >
                    Reopen
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>
      <div className="mt-4 pt-4 border-t border-[#E5E5E5] text-[#6C757D] text-sm">
        {rows.filter((v) => v.status === 'open' && v.severity === 'error').length} open errors ·{' '}
        {rows.filter((v) => v.status === 'open' && v.severity === 'warning').length} open warnings
      </div>
    </section>
  );
}
