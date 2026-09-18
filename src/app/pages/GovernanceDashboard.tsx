import { AlertCircle, CheckCircle, FileText, Shield } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { DataIntegrationPanel } from '../components/DataIntegrationPanel';
import { ValidationPanel } from '../components/ValidationPanel';
import { PageHeader } from '../components/PageHeader';
import { useEsg } from '../context/EsgProvider';
import { formatDate, formatPct, performanceLabel } from '../../lib/format';

export function GovernanceDashboard() {
  const { dataset, metrics, scores, settings } = useEsg();
  const label = performanceLabel(scores.governance);
  const vsPrior = metrics.complianceAverage - dataset.comparatives.fy2025CompliancePct;
  const belowFloor = metrics.complianceAverage < settings.alerts.complianceMinPct;

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Governance dashboard"
        subtitle="Compliance domains, audit calendar, policy adherence and speak-up channel"
        accent="#E5B700"
      />

      <div className="bg-gradient-to-r from-[#E5B700]/10 to-[#E5B700]/5 border border-[#E5B700]/30 rounded-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-[#E5B700] rounded-full">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="text-[#6C757D] mb-1">Governance performance</p>
              <div className="text-[#003A70]" style={{ fontSize: '3rem', lineHeight: 1 }}>
                {scores.governance}
              </div>
              <span style={{ color: label.color }}>{label.label}</span>
            </div>
          </div>
          <div className="md:text-right">
            <p className="text-[#6C757D] mb-2">Overall compliance score</p>
            <div className="text-[#003A70]" style={{ fontSize: '2rem' }}>
              {metrics.complianceAverage.toFixed(1)}%
            </div>
            <p className={belowFloor ? 'text-[#C82333]' : 'text-[#28A745]'}>
              {vsPrior >= 0 ? '+' : ''}
              {vsPrior.toFixed(1)} pts vs FY2025 · floor {settings.alerts.complianceMinPct}%
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-[#003A70]/10 rounded-lg p-6">
        <h3 className="text-[#003A70] mb-1">Governance compliance by domain</h3>
        <p className="text-[#6C757D] text-sm mb-4">
          Unweighted scores. Weakest domain is below the {settings.alerts.complianceMinPct}% alert floor.
        </p>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dataset.governance.domains} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
            <XAxis type="number" domain={[0, 100]} stroke="#6C757D" />
            <YAxis dataKey="domain" type="category" stroke="#6C757D" width={180} />
            <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E5E5', borderRadius: 4 }} />
            <Bar dataKey="score" fill="#E5B700" radius={[0, 4, 4, 0]} name="Score" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white border border-[#003A70]/10 rounded-lg p-6">
        <h3 className="text-[#003A70] mb-4">Audit timeline</h3>
        <div className="space-y-3">
          {dataset.governance.audits.map((audit) => (
            <article
              key={audit.id}
              className={`flex items-center justify-between p-4 rounded-lg border ${
                audit.status === 'completed' ? 'bg-[#28A745]/5 border-[#28A745]/30' : 'bg-[#003A70]/5 border-[#003A70]/30'
              }`}
            >
              <div className="flex items-center gap-4">
                {audit.status === 'completed' ? (
                  <CheckCircle className="w-6 h-6 text-[#28A745]" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-[#003A70]" />
                )}
                <div>
                  <h4 className="text-[#003A70]">{audit.title}</h4>
                  <p className="text-[#6C757D]">
                    {formatDate(audit.date)} · {audit.owner}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className={`px-3 py-1 rounded text-sm text-white ${audit.status === 'completed' ? 'bg-[#28A745]' : 'bg-[#003A70]'}`}>
                  {audit.status === 'completed' ? 'Completed' : 'Upcoming'}
                </span>
                {audit.issues > 0 && <p className="text-[#C82333] mt-1">{audit.issues} issues found</p>}
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="bg-white border border-[#003A70]/10 rounded-lg p-6">
        <h3 className="text-[#003A70] mb-1">Policy adherence</h3>
        <p className="text-[#6C757D] text-sm mb-4">
          Average {formatPct(metrics.policyAdherenceAverage, 1)} · denominator is unique headcount {dataset.social.snapshot.headcount}
        </p>
        <div className="space-y-4">
          {metrics.policyRows.map((policy) => (
            <div key={policy.policy}>
              <div className="flex items-center justify-between mb-2 gap-4">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#003A70]" />
                  <span className="text-[#003A70]">{policy.policy}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[#6C757D]">
                    {policy.acknowledged} / {policy.total}
                  </span>
                  <span className="text-[#003A70]">{policy.adherence.toFixed(1)}%</span>
                </div>
              </div>
              <div className="w-full h-2 bg-[#E5E5E5] rounded-full overflow-hidden">
                <div className="h-full bg-[#E5B700] rounded-full" style={{ width: `${policy.adherence}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-[#003A70]/10 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <AlertCircle className="w-6 h-6 text-[#003A70]" />
            <span className="px-2 py-1 bg-[#E5B700]/10 text-[#E5B700] rounded text-xs">
              {dataset.governance.whistleblowing.agingOver90Days} aging &gt;90d
            </span>
          </div>
          <h3 className="text-[#6C757D] mb-2">Open speak-up cases</h3>
          <div className="text-[#003A70]" style={{ fontSize: '2rem' }}>
            {dataset.governance.whistleblowing.openCases}
          </div>
          <p className="text-[#6C757D]">Independent channel · identities not stored here</p>
        </div>
        <div className="bg-white border border-[#003A70]/10 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <CheckCircle className="w-6 h-6 text-[#28A745]" />
            <span className="px-2 py-1 bg-[#28A745]/10 text-[#28A745] rounded text-xs">Closed</span>
          </div>
          <h3 className="text-[#6C757D] mb-2">Closed cases YTD</h3>
          <div className="text-[#003A70]" style={{ fontSize: '2rem' }}>
            {dataset.governance.whistleblowing.closedYtd}
          </div>
          <p className="text-[#6C757D]">Calendar year 2026</p>
        </div>
        <div className="bg-white border border-[#003A70]/10 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <Shield className="w-6 h-6 text-[#E5B700]" />
            <span className="px-2 py-1 bg-[#003A70]/10 text-[#003A70] rounded text-xs">Q4</span>
          </div>
          <h3 className="text-[#6C757D] mb-2">Policy reviews scheduled</h3>
          <div className="text-[#003A70]" style={{ fontSize: '2rem' }}>
            {dataset.governance.whistleblowing.policyReviewsScheduled}
          </div>
          <p className="text-[#6C757D]">Company secretary calendar</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DataIntegrationPanel pillar="governance" title="Governance data sources" />
        <ValidationPanel pillar="governance" aspect="Governance" />
      </div>
    </div>
  );
}
