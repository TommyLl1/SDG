import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { ArrowRight, Cable, FileSpreadsheet, Leaf, Plug, ShieldCheck, Users } from 'lucide-react';
import { esgDataset } from '../../data';
import { hasSession } from '../../lib/storage';

const org = esgDataset.organization;

export function HomePage() {
  const signedIn = hasSession();

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#003A70]">
      <header className="bg-[#003A70] border-b border-[#E5B700]/30">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div>
            <p className="text-[#E5B700] text-sm leading-tight">{org.shortName}</p>
            <p className="text-white/70 text-xs">{org.chineseName}</p>
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
              <p className="text-[#E5B700] text-sm mb-3">Real-time ESG reporting</p>
              <h1 className="text-white mb-4" style={{ fontSize: '2.25rem', lineHeight: 1.2 }}>
                Supplier evidence pack for NEV charging modules and 400/800 V connectors
              </h1>
              <p className="text-white/80 max-w-2xl">
                {org.legalName} is a 128-person unlisted manufacturer. EU buyers will not close an RFQ
                without GHG, energy, water, waste, safety and labour evidence. This system turns workshop
                meters, tickets and HR extracts into a live CSDDD / LkSG / CSRD value-chain pack.
              </p>
            </div>
            <div className="border border-[#E5B700]/40 p-6 space-y-3">
              <p className="text-[#E5B700] text-sm">Demo boundary</p>
              <p className="text-white text-sm">{org.productFocus}</p>
              <p className="text-white/70 text-sm">
                Kowloon Bay sales office (12) · one leased Dongguan workshop (116)
              </p>
              <p className="text-white/70 text-sm">{esgDataset.reportingPeriod.label} · as of {esgDataset.reportingPeriod.asOf.slice(0, 10)}</p>
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 py-14">
          <h2 className="mb-2">Who this pack is for</h2>
          <p className="text-[#6C757D] mb-8 max-w-3xl">
            Quality and sustainability leads who need to answer OEM due-diligence questions from the same
            activity data they already keep on the shop floor — not a listed-group ESG suite.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {org.customers.map((customer) => (
              <article key={customer.id} className="bg-white border border-[#003A70]/10 p-6">
                <p className="text-[#E5B700] text-sm mb-1">{customer.region}</p>
                <h3 className="mb-2">{customer.name}</h3>
                <p className="text-[#6C757D] text-sm mb-3">{customer.asksFor}</p>
                <p className="text-sm">{customer.status}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-[#003A70]/10 bg-white">
          <div className="max-w-6xl mx-auto px-6 py-14 grid md:grid-cols-3 gap-10">
            <Feature
              icon={<Leaf className="w-5 h-5" />}
              title="Environmental"
              body="Scope 1–2 from electricity, diesel, natural gas and F-gas logs. Plating water and hazardous sludge versus copper scrap."
            />
            <Feature
              icon={<Users className="w-5 h-5" />}
              title="Social"
              body="128-person roster, LTIFR from hours and incidents, and 800 V electrical-safety authorisation coverage."
            />
            <Feature
              icon={<ShieldCheck className="w-5 h-5" />}
              title="Governance"
              body="IATF 16949 / OEM RFQ gates, speak-up channel, and report blockers that hold the customer pack until they are cleared."
            />
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 py-14">
          <h2 className="mb-2">How you enter</h2>
          <p className="text-[#6C757D] mb-8 max-w-3xl">
            Sign in, upload source files, or point at an internal connector. This demo does not check
            credentials or files — any input continues to the live dashboards.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <Step icon={<Cable className="w-5 h-5" />} title="Sign in" body="Type any name or password and continue." />
            <Step icon={<FileSpreadsheet className="w-5 h-5" />} title="Upload data" body="Attach CSV, JSON or Excel extracts from meters, HR or EHS." />
            <Step icon={<Plug className="w-5 h-5" />} title="Connect API" body="Paste any internal path or endpoint and continue." />
          </div>
          <Link
            to={signedIn ? '/dashboard' : '/login'}
            className="mt-10 inline-flex items-center gap-2 px-6 py-3 bg-[#003A70] text-white rounded hover:bg-[#003A70]/90"
          >
            {signedIn ? 'Return to dashboards' : 'Enter the system'}
            <ArrowRight className="w-4 h-4" />
          </Link>
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
