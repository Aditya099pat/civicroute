import React from 'react';

const TONES = {
  neutral: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700',
  brand: 'bg-brand-50 dark:bg-brand-950/60 text-brand-800 dark:text-brand-300 border-brand-200 dark:border-brand-800/70',
  success: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/70',
  warn: 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/60',
  info: 'bg-blue-50 dark:bg-blue-950/50 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800/70',
};

/** Small status/label chip with consistent tones in both themes. */
export default function Badge({ tone = 'neutral', className = '', children, ...props }) {
  return (
    <span
      className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full border ${TONES[tone]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
