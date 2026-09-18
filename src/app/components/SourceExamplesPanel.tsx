import { useState } from 'react';
import { Database } from 'lucide-react';
import { sourceCatalog } from '../../data';
import type { Pillar } from '../../lib/types';

export function SourceExamplesPanel({ pillar }: { pillar?: Pillar }) {
  const files = pillar ? sourceCatalog.files.filter((f) => f.pillar === pillar) : sourceCatalog.files;
  const [openId, setOpenId] = useState<string | null>(files[0]?.id ?? null);

  return (
    <section className="bg-white border border-[#003A70]/10 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-2">
        <Database className="w-6 h-6 text-[#003A70]" />
        <h3 className="text-[#003A70]">Example source extracts</h3>
      </div>
      <p className="text-[#6C757D] text-sm mb-4">{sourceCatalog.description}</p>
      <div className="space-y-2">
        {files.map((file) => {
          const open = openId === file.id;
          return (
            <article key={file.id} className="border border-[#003A70]/10 rounded-lg">
              <button
                type="button"
                className="w-full text-left p-3 flex items-start justify-between gap-3"
                onClick={() => setOpenId(open ? null : file.id)}
                aria-expanded={open}
              >
                <span>
                  <span className="text-[#003A70] block">{file.file.replace('src/data/source-examples/', '')}</span>
                  <span className="text-[#6C757D] text-sm">{file.feeds}</span>
                </span>
                <span className="text-xs text-[#6C757D] shrink-0">{file.grain}</span>
              </button>
              {open && (
                <div className="px-3 pb-3">
                  <p className="text-[#6C757D] text-sm mb-2">{file.note}</p>
                  <p className="text-[#6C757D] text-xs mb-2">
                    System: {file.system} · path {file.file}
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-[#003A70]/20">
                          {file.headers.map((h) => (
                            <th key={h} className="text-left text-[#003A70] py-1 pr-3 font-medium">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {file.preview.map((row, i) => (
                          <tr key={i} className="border-b border-[#E5E5E5]">
                            {row.map((cell, j) => (
                              <td key={j} className="py-1 pr-3 text-[#6C757D] whitespace-nowrap">
                                {cell || '—'}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
