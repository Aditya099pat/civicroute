import React from 'react';
import { FolderCheck, Check } from 'lucide-react';
import { useDocumentVault } from '../hooks/useDocumentVault';

/**
 * Deduplicated master document checklist across the whole pathway, with a
 * progress meter and per-document step mapping. Check-state persists locally.
 */
export default function DocumentVault({ pipeline }) {
  const { docs, checked, toggle, readyCount, total } = useDocumentVault(pipeline);
  if (!total) return null;
  const pct = Math.round((readyCount / total) * 100);

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase font-bold text-zinc-400 dark:text-zinc-500 tracking-wider inline-flex items-center gap-1.5">
          <FolderCheck className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
          Document Vault
        </span>
        <span className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300">{readyCount}/{total} ready</span>
      </div>

      {/* Progress */}
      <div className="h-1.5 w-full rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${pct === 100 ? 'bg-emerald-500' : 'bg-brand-500'}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
        Every document across all {pipeline?.nodes?.length || 0} steps, deduplicated. Check items off as you gather them — saved on this device.
      </p>

      <div className="space-y-2 max-h-[280px] overflow-y-auto pr-0.5">
        {docs.map((doc) => {
          const isChecked = !!checked[doc.key];
          return (
            <div
              key={doc.key}
              onClick={() => toggle(doc.key)}
              className={`p-2.5 rounded-xl border transition cursor-pointer flex items-start gap-2.5 ${
                isChecked
                  ? 'bg-emerald-50/40 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/60'
                  : 'bg-zinc-50/80 dark:bg-zinc-800/40 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100/70 dark:hover:bg-zinc-800/70'
              }`}
            >
              <div className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center border shrink-0 transition ${
                isChecked ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800'
              }`}>
                {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className={`text-xs font-semibold leading-tight ${isChecked ? 'text-zinc-500 dark:text-zinc-500 line-through' : 'text-zinc-900 dark:text-zinc-100'}`}>
                  {doc.label}
                </div>
                <div className="mt-1 flex flex-wrap gap-1">
                  {doc.steps.map((s) => (
                    <span key={s.index} className="text-[9px] font-mono-code font-bold px-1.5 py-0.5 rounded bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400" title={s.title}>
                      Step {s.index}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
