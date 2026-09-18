import { TrendingUp, TrendingDown } from 'lucide-react';
import { performanceLabel } from '../../lib/format';

interface ESGScoreCardProps {
  score: number;
  environmental: number;
  social: number;
  governance: number;
  delta: number;
  method: string;
}

export function ESGScoreCard({ score, environmental, social, governance, delta, method }: ESGScoreCardProps) {
  const performance = performanceLabel(score);
  const circumference = 2 * Math.PI * 56;

  return (
    <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">
      <div className="flex items-center gap-8">
        <div className="relative" aria-hidden="true">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 128 128">
            <circle cx="64" cy="64" r="56" stroke="#E5E5E5" strokeWidth="12" fill="none" />
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke={performance.color}
              strokeWidth="12"
              fill="none"
              strokeDasharray={`${(score / 100) * circumference} ${circumference}`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[#003A70]" style={{ fontSize: '2rem' }}>
              {score}
            </span>
          </div>
        </div>
        <div>
          <p className="text-[#6C757D] mb-1">ESG integrated score</p>
          <h2 className="text-[#003A70] mb-2">Composite performance rating</h2>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded text-white" style={{ backgroundColor: performance.color }}>
              {performance.label}
            </span>
            <div className={`flex items-center gap-1 ${delta >= 0 ? 'text-[#28A745]' : 'text-[#C82333]'}`}>
              {delta >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span>
                {delta >= 0 ? '+' : ''}
                {delta.toFixed(0)} pts vs Q2
              </span>
            </div>
          </div>
          <p className="text-[#6C757D] text-sm mt-2 max-w-xl">{method}</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-8 text-center">
        <div className="border-r border-[#E5E5E5] pr-8">
          <div className="text-[#28A745]" style={{ fontSize: '2rem' }}>
            {environmental}
          </div>
          <div className="text-[#6C757D]">Environmental</div>
        </div>
        <div className="border-r border-[#E5E5E5] pr-8">
          <div className="text-[#E5B700]" style={{ fontSize: '2rem' }}>
            {social}
          </div>
          <div className="text-[#6C757D]">Social</div>
        </div>
        <div>
          <div className="text-[#003A70]" style={{ fontSize: '2rem' }}>
            {governance}
          </div>
          <div className="text-[#6C757D]">Governance</div>
        </div>
      </div>
    </div>
  );
}
