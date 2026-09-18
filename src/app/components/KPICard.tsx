import { TrendingDown, TrendingUp, AlertTriangle } from 'lucide-react';
import type { KpiStatus } from '../../lib/types';

interface KPICardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  target: string;
  percentage: number;
  trend: 'up' | 'down';
  trendLabel: string;
  status: KpiStatus;
}

export function KPICard({ icon, title, value, target, percentage, trend, trendLabel, status }: KPICardProps) {
  const statusColor = status === 'good' ? '#28A745' : status === 'warning' ? '#E5B700' : '#C82333';

  return (
    <article className="bg-white border border-[#003A70]/10 rounded-lg p-6 hover:border-[#E5B700]/50 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-[#003A70]/5 rounded text-[#003A70]">{icon}</div>
        {status !== 'good' && (
          <AlertTriangle className="w-5 h-5" style={{ color: statusColor }} aria-hidden="true" />
        )}
      </div>
      <h3 className="text-[#6C757D] mb-2">{title}</h3>
      <div className="text-[#003A70] mb-1" style={{ fontSize: '1.75rem' }}>
        {value}
      </div>
      <div className="text-[#6C757D] mb-3">{target}</div>
      <div className="w-full h-2 bg-[#E5E5E5] rounded-full overflow-hidden mb-3">
        <div
          className="h-full rounded-full"
          style={{ width: `${Math.min(percentage, 100)}%`, backgroundColor: statusColor }}
        />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-[#6C757D]">{percentage.toFixed(1)}% of target</span>
        <div className="flex items-center gap-1" style={{ color: statusColor }}>
          {trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          <span>{trendLabel}</span>
        </div>
      </div>
    </article>
  );
}
