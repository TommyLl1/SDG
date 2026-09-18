import { Building2 } from 'lucide-react';
import { useEsg } from '../context/EsgProvider';

export function CustomerDemandPanel() {
  const { dataset } = useEsg();

  return (
    <section className="bg-white border border-[#003A70]/10 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-2">
        <Building2 className="w-6 h-6 text-[#E5B700]" />
        <h3 className="text-[#003A70]">Why this pack exists — EU and OEM customers</h3>
      </div>
      <p className="text-[#6C757D] text-sm mb-4">
        Kaiheng is a 128-person NEV electrical-components company (12 in Hong Kong, 116 in one Dongguan workshop). EU RFQ customers will not place the order without supplier ESG evidence. Demo products only: charging modules and HV connectors.
      </p>
      <div className="space-y-3">
        {dataset.organization.customers.map((c) => (
          <article key={c.id} className="p-4 border border-[#003A70]/10 rounded-lg">
            <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
              <h4 className="text-[#003A70]">{c.name}</h4>
              <span className="text-xs px-2 py-1 bg-[#E5B700]/15 text-[#003A70] rounded">{c.status}</span>
            </div>
            <p className="text-[#6C757D] text-sm">
              {c.region} · {c.relationship} · {c.products}
            </p>
            <p className="text-[#003A70] text-sm mt-2">{c.asksFor}</p>
            <p className="text-[#6C757D] text-xs mt-1">Due {c.dueDate}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
