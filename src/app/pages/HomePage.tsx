import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { ArrowRight, FileSpreadsheet, Leaf, Plug, ShieldCheck, Users } from 'lucide-react';
import { hasSession } from '../../lib/storage';
import { BRAND } from '../../lib/brand';

export function HomePage() {
  const signedIn = hasSession();
  const next = signedIn ? '/dashboard' : '/login';

  return (
    <div className="min-h-screen bg-[#365828] text-white">
      <header className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <p className="text-[#E5B700] tracking-wide">{BRAND.name}</p>
        <Link to={next} className="text-sm text-white/80 hover:text-white">
          {signedIn ? 'Dashboards' : 'Sign in'}
        </Link>
      </header>

      <main>
        <section className="max-w-6xl mx-auto px-6 pt-16 pb-20 md:pt-24 md:pb-28">
          <p className="text-[#E5B700] text-sm mb-4">ESG report generation</p>
          <h1 className="text-white mb-6" style={{ fontSize: 'clamp(2.5rem, 8vw, 5.5rem)', lineHeight: 0.95, fontWeight: 600 }}>
            Data in.
            <br />
            Pack out.
          </h1>
          <p className="text-white/80 text-lg max-w-md mb-10">
            Files or API → live E / S / G scores → PDF and Excel.
          </p>
          <Link
            to={next}
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#E5B700] text-[#365828] rounded hover:bg-[#E5B700]/90"
            style={{ fontSize: '1.125rem' }}
          >
            {signedIn ? 'Open dashboards' : 'Start'}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </section>

        <section className="border-t border-white/15">
          <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              ['01', 'Connect'],
              ['02', 'Score'],
              ['03', 'Gate'],
              ['04', 'Export'],
            ].map(([n, label]) => (
              <div key={label}>
                <p className="text-[#E5B700] text-sm mb-1">{n}</p>
                <p className="text-xl">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-[#F8F9FA] text-[#365828]">
          <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-6">
            <Pillar icon={<Leaf className="w-6 h-6" />} title="Environmental" note="Scope 1–2" />
            <Pillar icon={<Users className="w-6 h-6" />} title="Social" note="Labour & safety" />
            <Pillar icon={<ShieldCheck className="w-6 h-6" />} title="Governance" note="Report blockers" />
          </div>
          <div className="max-w-6xl mx-auto px-6 pb-16 flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#6C757D]">
            <span>GRI</span>
            <span>ISSB</span>
            <span>TCFD</span>
            <span>HKEX</span>
            <span>CSDDD / CSRD / LkSG</span>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 py-10 flex flex-wrap items-center gap-6 text-sm text-white/80">
          <span className="inline-flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-[#E5B700]" /> Upload
          </span>
          <span className="inline-flex items-center gap-2">
            <Plug className="w-4 h-4 text-[#E5B700]" /> API
          </span>
          <span>Any input continues. Nothing is checked.</span>
        </section>
      </main>
    </div>
  );
}

function Pillar({ icon, title, note }: { icon: ReactNode; title: string; note: string }) {
  return (
    <article className="border border-[#365828]/15 bg-white p-6">
      <div className="w-10 h-10 mb-4 flex items-center justify-center bg-[#365828] text-[#E5B700]">{icon}</div>
      <h2 className="mb-1">{title}</h2>
      <p className="text-[#6C757D] text-sm">{note}</p>
    </article>
  );
}
