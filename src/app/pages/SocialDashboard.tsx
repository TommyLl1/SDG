import { AlertTriangle, GraduationCap, TrendingDown, Users } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { DataIntegrationPanel } from '../components/DataIntegrationPanel';
import { ValidationPanel } from '../components/ValidationPanel';
import { SourceExamplesPanel } from '../components/SourceExamplesPanel';
import { PageHeader } from '../components/PageHeader';
import { useEsg } from '../context/EsgProvider';
import { formatNumber, formatPct, performanceLabel } from '../../lib/format';

export function SocialDashboard() {
  const { dataset, metrics, scores, settings } = useEsg();
  const y = metrics.ytd;
  const snap = dataset.social.snapshot;
  const label = performanceLabel(scores.social);
  const femalePct = (snap.female / snap.headcount) * 100;
  const trainingVs = (y.trainingHoursPerEmployee / metrics.prorated.trainingHoursPerEmployee) * 100;
  const ltifrTone = y.ltifr > settings.alerts.ltifr ? 'Alert' : y.ltifr > dataset.targets.ltifr * 0.8 ? 'Warning' : 'Good';

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Social dashboard"
        subtitle={`Workforce, HV electrical safety and training — unique headcount ${formatNumber(snap.headcount, 0)} as at 31 Aug 2026`}
        accent="#003A70"
      />

      <div className="bg-gradient-to-r from-[#003A70]/10 to-[#003A70]/5 border border-[#003A70]/30 rounded-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-[#003A70] rounded-full">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="text-[#6C757D] mb-1">Social performance</p>
              <div className="text-[#003A70]" style={{ fontSize: '3rem', lineHeight: 1 }}>
                {scores.social}
              </div>
              <span style={{ color: label.color }}>{label.label}</span>
            </div>
          </div>
          <div className="md:text-right">
            <p className="text-[#6C757D] mb-2">Total workforce</p>
            <div className="text-[#003A70]" style={{ fontSize: '2rem' }}>
              {formatNumber(snap.headcount, 0)}
            </div>
            <p className="text-[#6C757D]">
              {snap.departments.length} departments · {formatPct(femalePct, 1)} female · target {dataset.targets.femaleWorkforcePct}%
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-[#003A70]/10 rounded-lg p-6">
          <h3 className="text-[#003A70] mb-1">Workforce composition</h3>
          <p className="text-[#6C757D] text-sm mb-4">
            Gender and contract type are separate breakdowns of the same {formatNumber(snap.headcount, 0)} people — not additive.
          </p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={metrics.workforceBars}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
              <XAxis dataKey="category" stroke="#6C757D" />
              <YAxis stroke="#6C757D" />
              <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E5E5', borderRadius: 4 }} />
              <Bar dataKey="count" fill="#003A70" radius={[4, 4, 0, 0]} name="People" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-[#003A70]/10 rounded-lg p-6">
          <h3 className="text-[#003A70] mb-1">LTIFR and recordable incidents</h3>
          <p className="text-[#6C757D] text-sm mb-4">Monthly LTIFR uses that month’s hours. YTD LTIFR uses cumulative LTI and hours.</p>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={metrics.months}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
              <XAxis dataKey="label" stroke="#6C757D" />
              <YAxis yAxisId="left" stroke="#6C757D" />
              <YAxis yAxisId="right" orientation="right" stroke="#C82333" />
              <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E5E5', borderRadius: 4 }} />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="ytdLtifr" stroke="#E5B700" strokeWidth={2} name="YTD LTIFR" dot={{ fill: '#E5B700', r: 4 }} />
              <Line yAxisId="right" type="monotone" dataKey="recordableIncidents" stroke="#C82333" strokeWidth={2} name="Recordable incidents" dot={{ fill: '#C82333', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <Mini
          icon={<GraduationCap className="w-6 h-6 text-[#003A70]" />}
          tone={trainingVs >= 100 ? 'Ahead' : 'Below target'}
          toneGood={trainingVs >= 100}
          label="Training hours"
          value={formatNumber(y.trainingHours, 0)}
          note={`${y.trainingHoursPerEmployee.toFixed(1)} h / employee · YTD expected ${metrics.prorated.trainingHoursPerEmployee.toFixed(1)}`}
        />
        <Mini
          icon={<AlertTriangle className="w-6 h-6 text-[#E5B700]" />}
          tone={ltifrTone}
          toneGood={ltifrTone === 'Good'}
          label="LTIFR (lost time)"
          value={y.ltifr.toFixed(2)}
          note={`${y.lostTimeInjuries} LTI in ${formatNumber(y.hoursWorked, 0)} hours`}
        />
        <Mini
          icon={<TrendingDown className="w-6 h-6 text-[#28A745]" />}
          tone="Good"
          toneGood
          label="Absenteeism rate"
          value={formatPct(y.absenteeismPct, 1)}
          note="Absentee hours ÷ hours worked"
        />
        <Mini
          icon={<Users className="w-6 h-6 text-[#003A70]" />}
          tone={y.annualizedTurnoverPct <= dataset.targets.turnoverPct ? 'Normal' : 'Above target'}
          toneGood={y.annualizedTurnoverPct <= dataset.targets.turnoverPct}
          label="Annualised turnover"
          value={formatPct(y.annualizedTurnoverPct, 1)}
          note={`${y.leavers} leavers YTD · target ${dataset.targets.turnoverPct}%`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DataIntegrationPanel pillar="social" title="Social data sources" />
        <ValidationPanel pillar="social" aspect="Social" />
      </div>
      <SourceExamplesPanel pillar="social" />
    </div>
  );
}

function Mini({
  icon,
  tone,
  toneGood,
  label,
  value,
  note,
}: {
  icon: React.ReactNode;
  tone: string;
  toneGood: boolean;
  label: string;
  value: string;
  note: string;
}) {
  return (
    <div className="bg-white border border-[#003A70]/10 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        {icon}
        <span className={`px-2 py-1 rounded text-xs ${toneGood ? 'bg-[#28A745]/10 text-[#28A745]' : 'bg-[#E5B700]/10 text-[#E5B700]'}`}>{tone}</span>
      </div>
      <h3 className="text-[#6C757D] mb-2">{label}</h3>
      <div className="text-[#003A70]" style={{ fontSize: '2rem' }}>
        {value}
      </div>
      <p className="text-[#6C757D]">{note}</p>
    </div>
  );
}
