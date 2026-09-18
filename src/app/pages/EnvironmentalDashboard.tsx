import { Droplet, Flame, Leaf, Trash2, Zap } from 'lucide-react';
import {
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
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
import { getFramework } from '../../lib/frameworks';

export function EnvironmentalDashboard() {
  const { dataset, metrics, scores, settings } = useEsg();
  const y = metrics.ytd;
  const fw = getFramework(settings.framework);
  const label = performanceLabel(scores.environmental);
  const vsTarget = ((y.scope12LocationTco2e - metrics.prorated.scope12TargetTco2e) / metrics.prorated.scope12TargetTco2e) * 100;
  const showMarket = fw.scope2Methods.includes('market');

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Environmental dashboard"
        subtitle={`${fw.shortName} · one Dongguan workshop (charging modules + HV connectors) and the HK office · operational control`}
        accent="#28A745"
      />

      <div className="bg-gradient-to-r from-[#28A745]/10 to-[#28A745]/5 border border-[#28A745]/30 rounded-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-[#28A745] rounded-full">
              <Leaf className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="text-[#6C757D] mb-1">Environmental performance</p>
              <div className="text-[#003A70]" style={{ fontSize: '3rem', lineHeight: 1 }}>
                {scores.environmental}
              </div>
              <span style={{ color: label.color }}>{label.label}</span>
            </div>
          </div>
          <div className="md:text-right">
            <p className="text-[#6C757D] mb-2">Scope 1–2 location-based YTD</p>
            <div className="text-[#003A70]" style={{ fontSize: '2rem' }}>
              {formatNumber(y.scope12LocationTco2e, 0)} tCO₂e
            </div>
            <p className={vsTarget <= 0 ? 'text-[#28A745]' : 'text-[#C82333]'}>
              {vsTarget <= 0 ? `${formatPct(Math.abs(vsTarget), 1)} below` : `${formatPct(vsTarget, 1)} above`} YTD budget of {formatNumber(metrics.prorated.scope12TargetTco2e, 0)} tCO₂e
            </p>
            {showMarket && (
              <p className="text-[#6C757D] mt-2">Market-based Scope 2: {formatNumber(y.scope2MarketTco2e, 0)} tCO₂e</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-[#003A70]/10 rounded-lg p-6">
          <h3 className="text-[#003A70] mb-1">Scope 1–2 monthly (tCO₂e)</h3>
          <p className="text-[#6C757D] text-sm mb-4">
            Scope 1 = diesel litres × {settings.factors.dieselKgPerLitre} + NG m³ × {settings.factors.naturalGasKgPerM3}, ÷ 1,000. Scope 2 location = kWh × weighted grid factor.
          </p>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={metrics.months}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
              <XAxis dataKey="label" stroke="#6C757D" />
              <YAxis stroke="#6C757D" />
              <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E5E5', borderRadius: 4 }} />
              <Legend />
              <Line type="monotone" dataKey="scope1Tco2e" stroke="#003A70" strokeWidth={2} name="Scope 1" />
              <Line type="monotone" dataKey="scope2LocationTco2e" stroke="#E5B700" strokeWidth={2} name="Scope 2 location" />
              {showMarket && (
                <Line type="monotone" dataKey="scope2MarketTco2e" stroke="#28A745" strokeWidth={2} name="Scope 2 market" />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-[#003A70]/10 rounded-lg p-6">
          <h3 className="text-[#003A70] mb-4">Energy mix (renewable vs grid)</h3>
          <div className="flex items-center justify-between gap-4">
            <ResponsiveContainer width="60%" height={250}>
              <PieChart>
                <Pie data={metrics.energyMix} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label={({ name, value }) => `${name}: ${value}%`}>
                  {metrics.energyMix.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-4">
              <div>
                <div className="text-[#28A745]" style={{ fontSize: '2rem' }}>
                  {formatPct(y.renewableSharePct, 1)}
                </div>
                <p className="text-[#6C757D]">Renewable electricity</p>
                <p className="text-[#6C757D] text-sm">Target {dataset.targets.renewableSharePct}%</p>
              </div>
              <div>
                <div className="text-[#6C757D]" style={{ fontSize: '2rem' }}>
                  {formatPct(100 - y.renewableSharePct, 1)}
                </div>
                <p className="text-[#6C757D]">Grid, non-renewable</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <Metric icon={<Zap className="w-6 h-6 text-[#E5B700]" />} label="Electricity consumption" value={`${formatNumber(y.electricityMwh, 0)} MWh`} note={`Monthly average ${formatNumber(y.electricityMwhMonthlyAvg, 0)} MWh`} tone="Normal" />
        <Metric icon={<Flame className="w-6 h-6 text-[#003A70]" />} label="Diesel (Scope 1)" value={`${formatNumber(y.dieselLitres, 0)} L`} note={`OEM milk-run fleet · ${formatNumber(y.naturalGasM3, 0)} m³ dryer NG`} tone="Normal" />
        <Metric icon={<Droplet className="w-6 h-6 text-[#003A70]" />} label="Water withdrawal" value={`${formatNumber(y.waterM3, 0)} m³`} note="Plating, cooling towers and PCBA wash" tone="Normal" />
        <Metric icon={<Trash2 className="w-6 h-6 text-[#6C757D]" />} label="Waste generated" value={`${formatNumber(y.wasteTonnes, 0)} t`} note={`${formatPct(y.recycledPct, 1)} recycled · target ${dataset.targets.wasteRecycledPct}%`} tone={y.recycledPct >= dataset.targets.wasteRecycledPct ? 'On track' : 'Watch'} />
      </div>

      {(fw.id === 'gri' || fw.id === 'eu-customer') && (
        <div className="bg-white border border-[#003A70]/10 rounded-lg p-6">
          <h3 className="text-[#003A70] mb-1">GRI 305-4 GHG intensity</h3>
          <p className="text-[#6C757D]">
            {y.intensityTco2ePerHkdMillion.toFixed(3)} tCO₂e per HKD million revenue (YTD revenue {formatNumber(dataset.environmental.revenueYtdHkdMillion, 0)} million).
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DataIntegrationPanel pillar="environmental" title="Environmental data sources" />
        <ValidationPanel pillar="environmental" aspect="Environmental" />
      </div>
      <SourceExamplesPanel pillar="environmental" />
    </div>
  );
}

function Metric({
  icon,
  label,
  value,
  note,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  note: string;
  tone: string;
}) {
  const good = tone === 'Normal' || tone === 'On track';
  return (
    <div className="bg-white border border-[#003A70]/10 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        {icon}
        <span className={`px-2 py-1 rounded text-xs ${good ? 'bg-[#28A745]/10 text-[#28A745]' : 'bg-[#E5B700]/10 text-[#E5B700]'}`}>{tone}</span>
      </div>
      <h3 className="text-[#6C757D] mb-2">{label}</h3>
      <div className="text-[#003A70]" style={{ fontSize: '1.75rem' }}>
        {value}
      </div>
      <p className="text-[#6C757D]">{note}</p>
    </div>
  );
}
