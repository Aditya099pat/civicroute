import React from 'react';

const VARIANTS = {
  primary:
    'bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white border border-transparent shadow-card',
  secondary:
    'bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700/80 text-zinc-800 dark:text-zinc-100 border border-zinc-300 dark:border-zinc-700 shadow-card',
  ghost:
    'bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-transparent',
  dark:
    'bg-zinc-900 hover:bg-zinc-800 active:bg-black dark:bg-brand-600 dark:hover:bg-brand-500 text-white border border-transparent shadow-card',
};

const SIZES = {
  sm: 'px-3 py-1.5 text-xs gap-1.5 rounded-lg',
  md: 'px-4 py-2.5 text-sm gap-2 rounded-xl',
  lg: 'px-5 py-3 text-sm gap-2 rounded-xl',
};

/** Shared button primitive with consistent variants, sizes, focus and motion. */
export default function Button({ variant = 'primary', size = 'md', className = '', children, ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center font-semibold transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-1 dark:focus-visible:ring-offset-zinc-900 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
