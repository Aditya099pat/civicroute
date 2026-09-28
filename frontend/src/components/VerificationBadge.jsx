import React from 'react';
import { ShieldCheck, ShieldAlert, ShieldQuestion, Loader2 } from 'lucide-react';

const TONES = {
  ok: {
    icon: ShieldCheck,
    cls: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/70',
  },
  pending: {
    icon: Loader2,
    cls: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700',
    spin: true,
  },
  warn: {
    icon: ShieldAlert,
    cls: 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/60',
  },
  unknown: {
    icon: ShieldQuestion,
    cls: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700',
  },
};

/**
 * Renders an honest verification badge from a useVerification statusFor() result.
 * Never fabricates: shows Verifying / Reachable · HTTPS / Unreachable / Not verified.
 */
export default function VerificationBadge({ status, className = '' }) {
  const tone = TONES[status?.tone] || TONES.unknown;
  const Icon = tone.icon;
  const title = status?.detail
    ? [
        status.detail.hostname,
        status.detail.statusCode ? `HTTP ${status.detail.statusCode}` : null,
        status.detail.tls?.protocol,
        status.detail.tls?.issuer ? `Issuer: ${status.detail.tls.issuer}` : null,
        status.detail.contentHash,
      ]
        .filter(Boolean)
        .join(' · ')
    : 'Verify on the official portal';
  return (
    <span
      title={title}
      className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${tone.cls} ${className}`}
    >
      <Icon className={`w-3 h-3 ${tone.spin ? 'animate-spin' : ''}`} />
      <span>{status?.label || 'Not verified'}</span>
    </span>
  );
}
