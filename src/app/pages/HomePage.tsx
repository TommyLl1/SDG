import type { ReactNode } from 'react';
import { Link } from 'react-router';
import {
  ArrowRight,
  BarChart3,
  Database,
  FileSpreadsheet,
  FileText,
  Leaf,
  Plug,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { hasSession } from '../../lib/storage';

const PRODUCT = 'ESG Reporting System';

export function HomePage() {
  const signedIn = hasSession();

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#003A70]">
      <header className="bg-[#003A70] border-b border-[#E5B700]/30">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div>
            <p className="text-[#E5B700] text-sm leading-tight">{PRODUCT}</p>
            <p className="text-white/70 text-xs">Real-time report generation</p>
          </div>
          <Link
            to={signedIn ? '/dashboard' : '/login'}
            className="px-4 py-2 bg-[#E5B700] text-[#003A70] rounded hover:bg-[#E5B700]/90 text-sm"
          >
            {signedIn ? 'Open dashboards' : 'Sign in'}
          </Link>
        </div>
      </header>

      <main>
        <section className="bg-[#003A70] text-white">
          <div className="max-w-6xl mx-auto px-6 py-16 md:py-24 grid md:grid-cols-[1.4fr_1fr] gap-12 items-end">
            <div>
              <p className="text-[#E5B700] text-sm mb-3">From source data to an audit-ready pack</p>
              <h1 className="text-white mb-4" style={{ fontSize: '2.25rem', lineHeight: 1.2 }}>
                Generate live ESG reports from operational files and internal APIs
              </h1>
              <p className="text-white/80 max-w-2xl">
                This system ingests meters, tickets, workforce and compliance extracts, maps them to
                standard metrics, scores Environmental / Social / Governance, and exports a PDF or Excel
                evidence pack. Generation stays gated until required validations are cleared.
              </p>
            </div>
            <ol className="border border-[#E5B700]/40 p-6 space-y-4">
              <li className="text-sm">
                <span className="text-[#E5B700] block">1. Connect</span>
                <span className="text-white/80">Upload CSV / JSON / Excel or point at an internal API.</span>
              </li>
              <li className="text-sm">
                <span className="text-[#E5B700] block">2. Calculate</span>
                <span className="text-white/80">Scope 1–2, intensity, LTIFR, training and compliance scores.</span>
              </li>
              <li className="text-sm">
                <span className="text-[#E5B700] block">3. Validate</span>
                <span className="text-white/80">Open blockers hold the report until they are resolved.</span>
              </li>
              <li className="text-sm">
                <span className="text-[#E5B700] block">4. Export</span>
                <span className="text-white/80">Download the customer ESG pack as PDF or Excel.</span>
              </li>
            </ol>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 py-14">
          <h2 className="mb-2">What the generator produces</h2>
          <p className="text-[#6C757D] mb-8 max-w-3xl">
            One activity dataset feeds live dashboards and the same numbers that land in the downloaded pack.
            Switch the regulatory overlay without re-keying source files.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <article className="bg-white border border-[#003A70]/10 p-6">
              <FileText className="w-5 h-5 text-[#E5B700] mb-3" />
              <h3 className="mb-2">Reporting Centre</h3>
              <p className="text-[#6C757D] text-sm">
                Annual YTD or quarterly PDF / Excel packs. Export is blocked while required validations remain
                open, so incomplete evidence cannot leave the system as a finished report.
              </p>
            </article>
            <article className="bg-white border border-[#003A70]/10 p-6">
              <BarChart3 className="w-5 h-5 text-[#E5B700] mb-3" />
              <h3 className="mb-2">Live E / S / G dashboards</h3>
              <p className="text-[#6C757D] text-sm">
                Integrated score, pillar views, forecasts and insights update from the mapped source extracts.
                The same formulas appear in Settings → Mapping so the pack stays traceable.
              </p>
            </article>
          </div>
        </section>

        <section className="border-y border-[#003A70]/10 bg-white">
          <div className="max-w-6xl mx-auto px-6 py-14 grid md:grid-cols-3 gap-10">
            <Feature
              icon={<Leaf className="w-5 h-5" />}
              title="Environmental"
              body="Energy, water and waste roll into Scope 1–2, location- and market-based where the framework requires it, plus intensity and a simple emissions forecast."
            />
            <Feature
              icon={<Users className="w-5 h-5" />}
              title="Social"
              body="Workforce composition, hours, incidents and training coverage become LTIFR and labour metrics used in both the dashboard and the exported pack."
            />
            <Feature
              icon={<ShieldCheck className="w-5 h-5" />}
              title="Governance"
              body="Compliance scores, speak-up and quality-system checks sit on the report gate. Unresolved blockers keep generation from completing."
            />
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 py-14">
          <h2 className="mb-2">Framework overlays</h2>
          <p className="text-[#6C757D] mb-8 max-w-3xl">
            Required metrics and score weights change with the selected framework. Source activity stays the same.
          </p>
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
            {[
              'EU / OEM customer due diligence (CSDDD, LkSG, CSRD value chain)',
              'GRI',
              'ISSB IFRS S1 / S2',
              'TCFD',
              'HKEX ESG Code',
            ].map((name) => (
              <li key={name} className="bg-white border border-[#003A70]/10 px-4 py-3">
                {name}
              </li>
            ))}
          </ul>
        </section>

        <section className="border-t border-[#003A70]/10">
          <div className="max-w-6xl mx-auto px-6 py-14">
            <h2 className="mb-2">How you enter</h2>
            <p className="text-[#6C757D] mb-8 max-w-3xl">
              Sign in, upload source files, or connect an API. This demo does not check credentials or files —
              any input continues to the generator.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <Step icon={<Database className="w-5 h-5" />} title="Sign in" body="Type any name or password and continue." />
              <Step icon={<FileSpreadsheet className="w-5 h-5" />} title="Upload data" body="Attach CSV, JSON or Excel extracts from meters, HR, EHS or quality." />
              <Step icon={<Plug className="w-5 h-5" />} title="Connect API" body="Paste any internal path or endpoint and continue." />
            </div>
            <Link
              to={signedIn ? '/dashboard' : '/login'}
              className="mt-10 inline-flex items-center gap-2 px-6 py-3 bg-[#003A70] text-white rounded hover:bg-[#003A70]/90"
            >
              {signedIn ? 'Return to dashboards' : 'Start report generation'}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

function Feature({ icon, title, body }: { icon: ReactNode; title: string; body: string }) {
  return (
    <article>
      <div className="w-10 h-10 mb-4 flex items-center justify-center bg-[#003A70] text-[#E5B700]">{icon}</div>
      <h3 className="mb-2">{title}</h3>
      <p className="text-[#6C757D] text-sm">{body}</p>
    </article>
  );
}

function Step({ icon, title, body }: { icon: ReactNode; title: string; body: string }) {
  return (
    <article className="bg-white border border-[#003A70]/10 p-6">
      <div className="text-[#E5B700] mb-3">{icon}</div>
      <h3 className="mb-2">{title}</h3>
      <p className="text-[#6C757D] text-sm">{body}</p>
    </article>
  );
}
