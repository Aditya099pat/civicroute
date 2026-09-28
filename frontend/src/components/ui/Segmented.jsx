import React from 'react';

/**
 * Segmented control (view switcher). options: [{ value, label, icon? }].
 */
export default function Segmented({ options = [], value, onChange, size = 'md', className = '' }) {
  const pad = size === 'sm' ? 'px-2.5 py-1 text-[11px]' : 'px-3 py-1.5 text-xs';
  return (
    <div
      className={`inline-flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800/80 p-1 rounded-xl border border-zinc-200 dark:border-zinc-700 ${className}`}
      role="tablist"
    >
      {options.map((opt) => {
        const active = opt.value === value;
        const Icon = opt.icon;
        return (
          <button
            key={opt.value}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(opt.value)}
            className={`inline-flex items-center gap-1.5 font-semibold rounded-lg transition-all duration-150 ${pad} ${
              active
                ? 'bg-white dark:bg-zinc-900 text-brand-700 dark:text-brand-300 shadow-card'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
          >
            {Icon && <Icon className="w-3.5 h-3.5" />}
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
