import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Target, TrendingDown, Zap } from 'lucide-react';
import { useEsg } from '../context/EsgProvider';
import { formatNumber } from '../../lib/format';

function riskColor(value: number): string {
  if (value >= 70) return '#C82333';
  if (value >= 50) return '#E5B700';
  return '#28A745';
}

export function PredictiveAnalytics() {
  const { forecast, dataset, settings, riskMatrix, metrics, validations } = useEsg();
  const gdFactor = settings.factors.gdGridKgPerKwh;
  const solarKwh = 280_000;
  const solarReduction = (solarKwh * gdFactor) / 1000;
  const pdpo = metrics.policyRows.find((row) => /PDPO/i.test(row.policy));
  const overdue = validations.find((row) => row.type === 'overdue_training');

  const interventions = [
    {
      title: 'Dongguan workshop rooftop solar',
      impact: `−${formatNumber(solarReduction, 0)} tCO₂e / year on location-based Scope 2`,
      detail: `${formatNumber(solarKwh, 0)} kWh on the leased Dongguan roof × Guangdong factor ${gdFactor} kg/kWh. Engineering estimate, not a modelled probability.`,
      timeline: 'Commissioning Q4 2026',
    },
    {
      title: overdue?.title ?? 'Close overdue HV electrical-safety authorisations',
      impact: dataset.social.snapshot.ltiNote,
      detail: overdue?.description ?? 'Leading indicator only; no incident-reduction percentage is claimed.',
      timeline: 'By 31 Oct 2026',
    },
    {
      title: 'OEM data / PDPO acknowledgement campaign',
      impact: pdpo
        ? `Adherence from ${pdpo.adherence.toFixed(1)}% to 100% if ${pdpo.total - pdpo.acknowledged} remaining staff complete it`
        : 'Close remaining OEM-data acknowledgements',
      detail: 'Arithmetic on the policy register. Does not change the HV electrical-safety domain score.',
      timeline: 'By pre-year-end review 10 Nov 2026',
    },
  ];

  return (
    <section className="bg-gradient-to-br from-[#003A70] to-[#00294F] border border-[#E5B700]/30 rounded-lg p-6 text-white">
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <Zap className="w-6 h-6 text-[#E5B700]" />
        <h2>Predictive analytics — actuals, trend and target</h2>
        <span className="ml-auto px-3 py-1 bg-[#E5B700]/20 text-[#E5B700] rounded text-sm border border-[#E5B700]/50">
          OLS linear trend + 3-month trailing average
        </span>
      </div>
      <p className="text-white/70 text-sm mb-6 max-w-4xl">{forecast.method}</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-lg p-4">
          <h3 className="text-[#E5B700] mb-4">Scope 1–2 trajectory (tCO₂e / month)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={forecast.series}>
              <CartesianGrid strokeDasharray="3 3" stroke="#FFFFFF20" />
              <XAxis dataKey="label" stroke="#FFFFFF80" />
              <YAxis stroke="#FFFFFF80" />
              <Tooltip
                contentStyle={{ backgroundColor: '#003A70', border: '1px solid #E5B700', borderRadius: 4, color: '#FFFFFF' }}
              />
              <Legend />
              <Line type="monotone" dataKey="actual" stroke="#E5B700" strokeWidth={3} dot={{ fill: '#E5B700', r: 4 }} name="Actual" connectNulls={false} />
              <Line type="monotone" dataKey="linear" stroke="#FFFFFF" strokeWidth={2} strokeDasharray="5 5" name="Linear trend" dot={false} />
              <Line type="monotone" dataKey="trailingAvg" stroke="#28A745" strokeWidth={2} strokeDasharray="4 4" name="Trailing 3-mo avg" dot={false} />
              <Line type="monotone" dataKey="targetPace" stroke="#6C757D" strokeWidth={1} name="Even-pace budget" dot={false} />
            </LineChart>
          </ResponsiveContainer>
          <p className="text-white/70 text-sm mt-3">
            Linear FY projection {formatNumber(forecast.fyLinearTco2e, 0)} tCO₂e versus budget {formatNumber(dataset.targets.annualScope12Tco2e, 0)} tCO₂e ({forecast.linearVsTargetPct > 0 ? '+' : ''}
            {forecast.linearVsTargetPct}%). Trailing-average FY projection {formatNumber(forecast.fyTrailingTco2e, 0)} tCO₂e.
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <h3 className="text-[#E5B700] mb-4">Residual risk (100 − pillar score)</h3>
          <div className="space-y-3">
            {riskMatrix.map((item) => (
              <div key={item.aspect}>
                <div className="text-sm mb-2">{item.aspect}</div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    ['Near term', item.shortTerm],
                    ['Year-end', item.mediumTerm],
                    ['2030 path', item.longTerm],
                  ].map(([label, value]) => (
                    <div key={String(label)} className="p-3 rounded text-center text-xs text-white" style={{ backgroundColor: riskColor(Number(value)) }}>
                      <div className="opacity-90">{label}</div>
                      <div>{value}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-[#E5B700]" />
          <h3 className="text-[#E5B700]">Scenario actions (stated method, no invented confidence)</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {interventions.map((item) => (
            <article key={item.title} className="bg-white/10 border border-[#E5B700]/30 rounded-lg p-4">
              <h4 className="mb-2">{item.title}</h4>
              <div className="flex items-start gap-2 text-[#E5B700] mb-2">
                <TrendingDown className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{item.impact}</span>
              </div>
              <p className="text-sm text-white/70 mb-2">{item.detail}</p>
              <p className="text-sm text-white/60">Timeline: {item.timeline}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
