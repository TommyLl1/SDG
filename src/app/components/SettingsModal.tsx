import { useEffect, useState } from 'react';
import { Bell, Database, FileText, Settings as SettingsIcon, User, X } from 'lucide-react';
import { useEsg, type SettingsTab } from '../context/EsgProvider';
import { FRAMEWORKS } from '../../lib/frameworks';
import { SourceExamplesPanel } from './SourceExamplesPanel';
import type { FrameworkId, UserRole } from '../../lib/types';

const tabs: { id: SettingsTab; label: string; icon: typeof FileText }[] = [
  { id: 'regulatory', label: 'Regulatory', icon: FileText },
  { id: 'mapping', label: 'Mapping', icon: SettingsIcon },
  { id: 'alerts', label: 'Alerts', icon: Bell },
  { id: 'api', label: 'API', icon: Database },
  { id: 'user', label: 'User', icon: User },
];

export function SettingsModal() {
  const {
    dataset,
    settings,
    settingsOpen,
    settingsTab,
    setSettingsOpen,
    openSettings,
    updateSettings,
    sources,
    testConnection,
    canEditMappings,
  } = useEsg();
  const [saved, setSaved] = useState<string | null>(null);
  const [frameworkDraft, setFrameworkDraft] = useState<FrameworkId>(settings.framework);
  const [factorDraft, setFactorDraft] = useState(settings.factors);
  const [alertDraft, setAlertDraft] = useState(settings.alerts);

  useEffect(() => {
    setFrameworkDraft(settings.framework);
    setFactorDraft(settings.factors);
    setAlertDraft(settings.alerts);
  }, [settings, settingsOpen]);

  useEffect(() => {
    if (!settingsOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSettingsOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [settingsOpen, setSettingsOpen]);

  if (!settingsOpen) return null;

  const flash = (msg: string) => {
    setSaved(msg);
    window.setTimeout(() => setSaved(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-6" role="presentation" onClick={() => setSettingsOpen(false)}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
        className="relative w-full max-w-4xl bg-white rounded-lg border border-[#003A70]/10 p-6 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Close settings"
          className="absolute top-4 right-4 p-2 text-[#6C757D] hover:bg-[#F8F9FA] rounded"
          onClick={() => setSettingsOpen(false)}
        >
          <X className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-2 text-[#003A70] mb-4">
          <SettingsIcon className="w-6 h-6 text-[#E5B700]" />
          <h2 id="settings-title">System configuration</h2>
        </div>

        <div role="tablist" aria-label="Settings sections" className="grid grid-cols-5 bg-[#003A70]/5 rounded p-1 mb-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = settingsTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active}
                className={`flex items-center justify-center gap-2 py-2 px-2 text-sm rounded ${
                  active ? 'bg-[#E5B700] text-white' : 'text-[#003A70]'
                }`}
                onClick={() => openSettings(tab.id)}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {saved && <p className="mb-3 text-[#28A745] text-sm">{saved}</p>}

        {settingsTab === 'regulatory' && (
          <div className="space-y-4">
            <Header title="Regulatory framework" note="This changes required metrics, Scope 2 methods and the integrated-score weights used on every dashboard." />
            <div className="space-y-3">
              {FRAMEWORKS.map((fw) => (
                <label
                  key={fw.id}
                  className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer ${
                    frameworkDraft === fw.id ? 'border-[#E5B700]' : 'border-[#003A70]/20 hover:border-[#E5B700]'
                  }`}
                >
                  <input
                    type="radio"
                    name="framework"
                    value={fw.id}
                    checked={frameworkDraft === fw.id}
                    onChange={() => setFrameworkDraft(fw.id)}
                    className="w-4 h-4 accent-[#E5B700]"
                  />
                  <div>
                    <div className="text-[#003A70]">
                      {fw.name}
                      {fw.primary ? <span className="ml-2 text-xs text-[#E5B700]">Primary</span> : null}
                    </div>
                    <div className="text-[#6C757D] text-sm">{fw.description}</div>
                  </div>
                </label>
              ))}
            </div>
            <button
              type="button"
              className="w-full py-3 px-4 bg-[#003A70] text-white rounded hover:bg-[#003A70]/90"
              onClick={() => {
                updateSettings({ framework: frameworkDraft });
                flash(`Framework set to ${FRAMEWORKS.find((f) => f.id === frameworkDraft)?.shortName}. Score weights and required metrics updated.`);
              }}
            >
              Apply regulatory framework
            </button>
          </div>
        )}

        {settingsTab === 'mapping' && (
          <MappingTab
            canEdit={canEditMappings}
            factorDraft={factorDraft}
            setFactorDraft={setFactorDraft}
            onSave={() => {
              updateSettings({ factors: factorDraft });
              flash('Emission factors saved. Scope 1–2 and the forecast have been recalculated.');
            }}
          />
        )}

        {settingsTab === 'alerts' && (
          <div className="space-y-4">
            <Header title="Alert thresholds" note="These fire on the dashboards and in the insight list. They do not rewrite historical activity." />
            <Field
              label="Emission threshold (tCO₂e / month)"
              hint="Alert when any complete month exceeds this location-based Scope 1–2 total."
              value={alertDraft.monthlyEmissionTco2e}
              onChange={(v) => setAlertDraft({ ...alertDraft, monthlyEmissionTco2e: v })}
            />
            <Field
              label="LTIFR warning threshold"
              hint="Alert when year-to-date LTIFR exceeds this value."
              value={alertDraft.ltifr}
              step={0.05}
              onChange={(v) => setAlertDraft({ ...alertDraft, ltifr: v })}
            />
            <Field
              label="Compliance score minimum (%)"
              hint="Alert when the unweighted domain average falls below this floor."
              value={alertDraft.complianceMinPct}
              onChange={(v) => setAlertDraft({ ...alertDraft, complianceMinPct: v })}
            />
            <Field
              label="YTD training hours / employee (information)"
              hint="Used as the prorated training floor in insights."
              value={alertDraft.trainingHoursPerEmployeeYtd}
              onChange={(v) => setAlertDraft({ ...alertDraft, trainingHoursPerEmployeeYtd: v })}
            />
            <button
              type="button"
              className="w-full py-3 px-4 bg-[#003A70] text-white rounded"
              onClick={() => {
                updateSettings({ alerts: alertDraft });
                flash('Alert thresholds updated.');
              }}
            >
              Update alert settings
            </button>
          </div>
        )}

        {settingsTab === 'api' && (
          <div className="space-y-4">
            <Header title="Data source connectors" note="Internal system paths — not public internet APIs. Test connection stamps last sync to the reporting as-of timestamp." />
            <div className="space-y-3">
              {sources.map((api) => (
                <article key={api.id} className="p-4 bg-white border border-[#003A70]/10 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-[#003A70]">{api.name}</h4>
                    <span
                      className={`px-3 py-1 text-white rounded text-sm ${
                        api.status === 'healthy' ? 'bg-[#28A745]' : api.status === 'stale' ? 'bg-[#E5B700]' : 'bg-[#C82333]'
                      }`}
                    >
                      {api.statusLabel}
                    </span>
                  </div>
                  <p className="text-[#6C757D] text-sm mb-1">{api.endpoint}</p>
                  <p className="text-[#6C757D] text-sm mb-3">{api.notes}</p>
                  <button
                    type="button"
                    className="py-2 px-4 border border-[#E5B700] text-[#E5B700] rounded hover:bg-[#E5B700]/10 text-sm"
                    onClick={() => {
                      testConnection(api.id);
                      flash(`${api.name} re-synchronised to as-of ${dataset.reportingPeriod.asOf}.`);
                    }}
                  >
                    Test connection
                  </button>
                </article>
              ))}
            </div>
            <SourceExamplesPanel />
          </div>
        )}

        {settingsTab === 'user' && (
          <div className="space-y-4">
            <Header title="User profile and role" note="Role is a local switch for this frontend. Administrator can edit mappings and export. Analyst can export and resolve validations. Viewer can inspect only." />
            <div className="p-4 bg-white border border-[#003A70]/10 rounded-lg">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-[#E5B700] rounded-full flex items-center justify-center text-white text-2xl">ZJ</div>
                <div>
                  <h4 className="text-[#003A70]">{dataset.organization.contacts.sustainabilityLead}</h4>
                  <p className="text-[#6C757D]">{dataset.organization.contacts.email}</p>
                  <p className="text-[#6C757D] text-sm">{dataset.organization.contacts.title}</p>
                </div>
              </div>
              <label className="block text-[#003A70] mb-2" htmlFor="role">
                Active role
              </label>
              <select
                id="role"
                value={settings.role}
                onChange={(e) => updateSettings({ role: e.target.value as UserRole })}
                className="w-full p-2 border border-[#E5E5E5] rounded focus:outline-none focus:border-[#E5B700]"
              >
                <option value="administrator">Administrator — export and edit mappings</option>
                <option value="analyst">Analyst — export and resolve validations</option>
                <option value="viewer">Viewer — no export, no queue actions</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Header({ title, note }: { title: string; note: string }) {
  return (
    <div className="border-l-4 border-[#E5B700] pl-4">
      <h3 className="text-[#003A70] mb-2">{title}</h3>
      <p className="text-[#6C757D]">{note}</p>
    </div>
  );
}

function Field({
  label,
  hint,
  value,
  step = 1,
  onChange,
}: {
  label: string;
  hint: string;
  value: number;
  step?: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="p-4 bg-white border border-[#003A70]/10 rounded-lg">
      <label className="text-[#003A70] mb-2 block">{label}</label>
      <input
        type="number"
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full p-2 border border-[#E5E5E5] rounded focus:outline-none focus:border-[#E5B700]"
      />
      <p className="text-[#6C757D] text-sm mt-1">{hint}</p>
    </div>
  );
}

function MappingTab({
  canEdit,
  factorDraft,
  setFactorDraft,
  onSave,
}: {
  canEdit: boolean;
  factorDraft: ReturnType<typeof useEsg>['settings']['factors'];
  setFactorDraft: (value: ReturnType<typeof useEsg>['settings']['factors']) => void;
  onSave: () => void;
}) {
  const { settings } = useEsg();
  const fw = FRAMEWORKS.find((item) => item.id === settings.framework)!;

  return (
    <div className="space-y-4">
      <Header title="ESG indicator mapping" note={`${fw.shortName} formulas. Changing a factor recalculates Scope 1–2, intensity and the forecast immediately after save.`} />
      <ul className="text-sm text-[#6C757D] list-disc pl-5">
        {fw.requiredMetrics.map((m) => (
          <li key={m}>{m}</li>
        ))}
      </ul>
      <div className="bg-[#003A70]/5 rounded-lg p-4 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#003A70]/20">
              <th className="text-left text-[#003A70] py-2">Raw input</th>
              <th className="text-left text-[#003A70] py-2">Standard metric</th>
              <th className="text-left text-[#003A70] py-2">Formula</th>
            </tr>
          </thead>
          <tbody>
            {fw.mappings.map((row) => (
              <tr key={row.metric} className="border-b border-[#E5E5E5]">
                <td className="py-3 text-[#6C757D]">{row.input}</td>
                <td className="py-3 text-[#003A70]">{row.metric}</td>
                <td className="py-3">
                  <code className="text-xs bg-[#E5B700]/10 text-[#003A70] px-2 py-1 rounded">{row.formula}</code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {(
          [
            ['dieselKgPerLitre', 'Diesel factor (kgCO₂e / L)'],
            ['naturalGasKgPerM3', 'Natural gas factor (kgCO₂e / m³)'],
            ['hkGridKgPerKwh', 'Hong Kong grid (kgCO₂e / kWh)'],
            ['gdGridKgPerKwh', 'Guangdong grid (kgCO₂e / kWh)'],
            ['residualMixKgPerKwh', 'Residual mix (market-based, kgCO₂e / kWh)'],
          ] as const
        ).map(([key, label]) => (
          <label key={key} className="text-sm text-[#003A70]">
            {label}
            <input
              type="number"
              step="0.0001"
              disabled={!canEdit}
              value={factorDraft[key]}
              onChange={(e) => setFactorDraft({ ...factorDraft, [key]: Number(e.target.value) })}
              className="mt-1 w-full p-2 border border-[#E5E5E5] rounded disabled:bg-[#F8F9FA]"
            />
          </label>
        ))}
      </div>
      {!canEdit && <p className="text-[#C82333] text-sm">Viewer/Analyst cannot edit factors. Switch to Administrator.</p>}
      <button type="button" disabled={!canEdit} onClick={onSave} className="w-full py-3 px-4 bg-[#003A70] text-white rounded disabled:opacity-40">
        Save mapping configuration
      </button>
    </div>
  );
}
