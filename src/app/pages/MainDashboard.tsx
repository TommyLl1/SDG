import { Leaf, Users, Shield } from 'lucide-react';
import { ESGScoreCard } from '../components/ESGScoreCard';
import { KPICard } from '../components/KPICard';
import { ESGRadarChart } from '../components/ESGRadarChart';
import { InsightPanel } from '../components/InsightPanel';
import { PredictiveAnalytics } from '../components/PredictiveAnalytics';
import { ReportingPanel } from '../components/ReportingPanel';
import { PageHeader } from '../components/PageHeader';
import { CustomerDemandPanel } from '../components/CustomerDemandPanel';
import { SourceExamplesPanel } from '../components/SourceExamplesPanel';
import { useEsg } from '../context/EsgProvider';
import { formatNumber, formatPct } from '../../lib/format';
import { getFramework } from '../../lib/frameworks';

export function MainDashboard() {
  const { dataset, metrics, scores, radar, insights, settings } = useEsg();
  const fw = getFramework(settings.framework);
  const y = metrics.ytd;
  const emissionPct = (y.scope12LocationTco2e / metrics.prorated.scope12TargetTco2e) * 100;
  const yoy = ((y.scope12LocationTco2e - dataset.comparatives.fy2025JanAugScope12Tco2e) / dataset.comparatives.fy2025JanAugScope12Tco2e) * 100;
  const ltifrStatus = y.ltifr > settings.alerts.ltifr ? 'alert' : y.ltifr > dataset.targets.ltifr * 0.8 ? 'warning' : 'good';
  const complianceStatus = metrics.complianceAverage >= settings.alerts.complianceMinPct ? 'good' : 'warning';
  const emissionStatus = metrics.months.some((m) => m.scope12LocationTco2e > settings.alerts.monthlyEmissionTco2e)
    ? 'warning'
    : emissionPct <= 100
      ? 'good'
      : 'alert';

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Integrated ESG overview"
        subtitle={`${dataset.organization.legalName} · ${dataset.organization.productFocus} · ${fw.shortName} · ${dataset.reportingPeriod.label} through 31 Aug 2026`}
        accent="#E5B700"
      />

      <div className="bg-white border border-[#003A70]/10 rounded-lg p-6">
        <ESGScoreCard
          score={scores.integrated}
          environmental={scores.environmental}
          social={scores.social}
          governance={scores.governance}
          delta={scores.integrated - dataset.comparatives.q2IntegratedScore}
          method={scores.method}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <KPICard
          icon={<Leaf className="w-6 h-6" />}
          title="Scope 1–2 emission status"
          value={`${formatNumber(y.scope12LocationTco2e, 0)} tCO₂e`}
          target={`YTD budget ${formatNumber(metrics.prorated.scope12TargetTco2e, 0)} tCO₂e`}
          percentage={Math.min(emissionPct, 100)}
          trend={yoy < 0 ? 'down' : 'up'}
          trendLabel={`${yoy < 0 ? '' : '+'}${formatPct(yoy, 1)} YoY`}
          status={emissionStatus}
        />
        <KPICard
          icon={<Users className="w-6 h-6" />}
          title="Workforce & safety status"
          value={`LTIFR ${y.ltifr.toFixed(2)}`}
          target={`Target < ${dataset.targets.ltifr.toFixed(1)} · alert ${settings.alerts.ltifr.toFixed(2)}`}
          percentage={Math.min(100, (dataset.targets.ltifr / Math.max(y.ltifr, 0.01)) * 84)}
          trend="down"
          trendLabel={`${dataset.comparatives.fy2025Ltifr.toFixed(2)} → ${y.ltifr.toFixed(2)}`}
          status={ltifrStatus}
        />
        <KPICard
          icon={<Shield className="w-6 h-6" />}
          title="Governance compliance status"
          value={`${metrics.complianceAverage.toFixed(1)}%`}
          target={`Minimum ${settings.alerts.complianceMinPct}%`}
          percentage={metrics.complianceAverage}
          trend={metrics.complianceAverage >= dataset.comparatives.fy2025CompliancePct ? 'up' : 'down'}
          trendLabel={`${dataset.comparatives.fy2025CompliancePct}% FY2025`}
          status={complianceStatus}
        />
        <ReportingPanel />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CustomerDemandPanel />
        <SourceExamplesPanel />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-[#003A70]/10 rounded-lg p-6">
          <h3 className="text-[#003A70] mb-1">ESG risk radar</h3>
          <p className="text-[#6C757D] text-sm mb-4">Control scores 0–100. Higher is stronger control / lower residual risk.</p>
          <ESGRadarChart data={radar} />
        </div>
        <InsightPanel insights={insights} />
      </div>

      <PredictiveAnalytics />
    </div>
  );
}
