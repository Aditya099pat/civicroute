import React from 'react';

/**
 * Surface primitive: consistent radius, border, background and shadow in both themes.
 * `interactive` adds hover elevation for clickable cards.
 */
export default function Card({ interactive = false, className = '', children, ...props }) {
  return (
    <div
      className={`bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-card transition-all duration-200 ${
        interactive ? 'hover:shadow-card-hover hover:border-zinc-300 dark:hover:border-zinc-700 cursor-pointer' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
