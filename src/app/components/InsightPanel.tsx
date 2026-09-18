import { AlertTriangle, ClipboardList, Clock } from 'lucide-react';
import type { InsightItem } from '../../lib/types';

export function InsightPanel({ insights }: { insights: InsightItem[] }) {
  return (
    <section className="bg-white border border-[#003A70]/10 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-2">
        <ClipboardList className="w-6 h-6 text-[#E5B700]" />
        <h3 className="text-[#003A70]">Rule-based insight summary</h3>
      </div>
      <p className="text-[#6C757D] text-sm mb-4">
        Derived from the same metrics, thresholds and validation queue as the rest of this pack. Not a language-model output.
      </p>
      <div className="space-y-3">
        {insights.map((insight) => (
          <article
            key={insight.id}
            className={`p-4 rounded-lg border-l-4 ${
              insight.priority === 'high'
                ? 'bg-[#C82333]/5 border-[#C82333]'
                : insight.priority === 'medium'
                  ? 'bg-[#E5B700]/5 border-[#E5B700]'
                  : 'bg-[#003A70]/5 border-[#003A70]'
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={
                  insight.priority === 'high'
                    ? 'text-[#C82333]'
                    : insight.priority === 'medium'
                      ? 'text-[#E5B700]'
                      : 'text-[#003A70]'
                }
              >
                {insight.priority === 'low' ? <Clock className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
              </div>
              <div>
                <h4 className="text-[#003A70] mb-1">{insight.title}</h4>
                <p className="text-[#6C757D]">{insight.message}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
