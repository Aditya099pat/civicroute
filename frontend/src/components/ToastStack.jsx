import React from 'react';
import { CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

const TONES = {
  info: { icon: Info, dot: 'bg-blue-400', ring: 'border-zinc-700' },
  success: { icon: CheckCircle2, dot: 'bg-emerald-400', ring: 'border-emerald-700/60' },
  warn: { icon: AlertTriangle, dot: 'bg-amber-400', ring: 'border-amber-700/60' },
};

export default function ToastStack({ toasts = [], onDismiss }) {
  if (!toasts.length) return null;
  return (
    <div
      className="fixed top-4 right-4 z-[60] flex flex-col gap-2 max-w-[92vw] sm:max-w-sm"
      role="region"
      aria-live="polite"
      aria-label="Notifications"
    >
      {toasts.map((t) => {
        const tone = TONES[t.type] || TONES.info;
        const Icon = tone.icon;
        return (
          <div
            key={t.id}
            className={`bg-zinc-900 dark:bg-zinc-800 border ${tone.ring} text-white px-3.5 py-2.5 rounded-xl shadow-xl text-xs font-semibold flex items-start gap-2.5 animate-in fade-in slide-in-from-top-2 duration-200`}
          >
            <Icon className="w-4 h-4 shrink-0 mt-0.5 text-zinc-200" />
            <span className="flex-1 leading-snug">{t.message}</span>
            <button
              onClick={() => onDismiss(t.id)}
              className="shrink-0 text-zinc-400 hover:text-white transition"
              aria-label="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
