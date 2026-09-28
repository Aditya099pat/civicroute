import React, { useEffect, useState } from 'react';
import { Store, Utensils, Flame, Building2, Sun, Droplets, ShieldCheck, ChevronRight, FileText, CalendarClock, Sparkles, MapPin } from 'lucide-react';
import { fetchPipelineCatalog } from '../utils/api';

const HIGHLIGHTS = [
  { icon: ShieldCheck, label: 'Live .gov.in verification', desc: 'Every portal link is checked in real time' },
  { icon: CalendarClock, label: 'Critical-path timelines', desc: 'See the real finish date & parallel steps' },
  { icon: Sparkles, label: 'AI step guidance', desc: 'Ask grounded questions on any clearance' },
  { icon: MapPin, label: 'Any Indian city', desc: 'Mumbai seeds + AI for other municipalities' },
];

// Presentation metadata (icon + short description) keyed by pipeline key.
// Data such as title/fee/SLA comes from the backend catalog (single source of truth).
const PRESENTATION = {
  cloud_kitchen: { icon: Utensils, desc: 'Complete commercial licensing covering PAN, Gumasta Shop Act, Fire NOC, FSSAI registration, and Health Trade license.' },
  gumasta_license: { icon: Store, desc: 'Mandatory commercial establishment registration for shops, offices, and trading firms under the Maharashtra Shops Act.' },
  fssai_license: { icon: Utensils, desc: 'Statutory food operator clearance and hygiene compliance certification for restaurants, cafes, and manufacturers.' },
  fire_noc: { icon: Flame, desc: 'Building safety compliance, firefighting equipment installation audit, and municipal CFO certification.' },
  property_tax: { icon: Building2, desc: 'Official municipal revenue record update, SAC number transfer, and zero-dues tax clearance certification.' },
  rooftop_solar: { icon: Sun, desc: 'Structural roof stability sanction, DISCOM grid connectivity feasibility, CEI inspection, and bi-directional meter setup.' },
  water_connection: { icon: Droplets, desc: 'Municipal water main tapping sanction, licensed plumber line laying, water quality potability report, and meter commissioning.' },
};

export default function WelcomeCatalog({ onSelectPipeline }) {
  const [catalog, setCatalog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchPipelineCatalog().then(({ catalog, isOfflineFallback }) => {
      if (cancelled) return;
      setCatalog(catalog);
      setOffline(isOfflineFallback);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="max-w-7xl mx-auto w-full space-y-6">
      {/* Hero band */}
      <div className="relative overflow-hidden rounded-2xl border border-brand-200/80 dark:border-brand-800/50 bg-gradient-to-br from-brand-50 via-white to-white dark:from-brand-950/50 dark:via-zinc-900 dark:to-zinc-900 p-6 sm:p-8 animate-fade-in-up">
        <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-brand-200/40 dark:bg-brand-800/20 blur-3xl pointer-events-none" />
        <div className="relative">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-brand-800 dark:text-brand-300 bg-white/70 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800/60 px-2.5 py-1 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5" /> Verified civic-tech navigator
          </span>
          <h1 className="mt-3 text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-100 max-w-2xl">
            Turn Indian civic bureaucracy into a clear, verifiable plan.
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl">
            CivicRoute maps every statutory clearance into a dependency graph, checks the official portals live, estimates a realistic timeline, and guides you step by step — search a task above or pick a pathway below.
          </p>

          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {HIGHLIGHTS.map((h) => {
              const Icon = h.icon;
              return (
                <div key={h.label} className="flex items-start gap-2.5 p-3 rounded-xl bg-white/80 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800">
                  <div className="w-8 h-8 rounded-lg bg-brand-600 text-white flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100 leading-tight">{h.label}</div>
                    <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5 leading-snug">{h.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Directory */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-card overflow-hidden w-full p-6 sm:p-8 space-y-6 transition-colors duration-200">
      {/* Header Banner */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/80 px-2.5 py-0.5 rounded-full">
              Municipal Compliance Directory
            </span>
            <span className="text-zinc-300 dark:text-zinc-600">•</span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
              Brihanmumbai Municipal Corporation (MCGM)
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight mt-1.5">
            Select a Regulatory Pathway to Begin
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-2xl">
            Choose from the standardized civic clearance procedures below, or type your specific commercial or civic intent into the command omnibar above.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/70 px-3 py-1.5 rounded-xl shrink-0">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>{loading ? 'Loading pathways…' : `${catalog.length} Reference Pathways`}</span>
        </div>
      </div>

      {offline && !loading && (
        <div className="text-[11px] text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-lg px-3 py-2">
          Showing bundled reference data — the live catalog service is offline.
        </div>
      )}

      {/* Grid of Pathways */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-44 rounded-xl bg-zinc-100 dark:bg-zinc-800/60 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {catalog.map((item) => {
            const pres = PRESENTATION[item.key] || {};
            const Icon = pres.icon || FileText;
            return (
              <div
                key={item.key}
                onClick={() => onSelectPipeline(item.key, item.title)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter') onSelectPipeline(item.key, item.title); }}
                className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-800/40 hover:bg-white dark:hover:bg-zinc-800 hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-card-hover transition-all cursor-pointer flex flex-col justify-between group focus:outline-none focus:ring-2 focus:ring-brand-500 animate-fade-in-up"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 rounded-xl bg-white dark:bg-zinc-700/80 border border-zinc-200 dark:border-zinc-600 flex items-center justify-center text-zinc-800 dark:text-zinc-200 group-hover:bg-brand-600 group-hover:text-white group-hover:border-brand-600 transition">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="font-mono-code text-[10px] font-bold text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded border border-zinc-200 dark:border-zinc-700">
                      {item.id}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition leading-snug">
                    {item.title}
                  </h3>
                  <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 font-medium">
                    {item.primaryDept}
                  </div>
                  {pres.desc && (
                    <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-2.5 leading-relaxed line-clamp-2">
                      {pres.desc}
                    </p>
                  )}
                </div>

                <div className="mt-5 pt-3.5 border-t border-zinc-200/80 dark:border-zinc-700/80 flex items-center justify-between">
                  <div className="flex items-center space-x-3 text-[11px] text-zinc-600 dark:text-zinc-400">
                    <span className="font-mono-code font-bold text-zinc-900 dark:text-zinc-100">{item.totalFee}</span>
                    <span className="text-zinc-300 dark:text-zinc-600">•</span>
                    <span className="text-zinc-500 dark:text-zinc-400">{item.stageCount} stages</span>
                  </div>

                  <div className="flex items-center space-x-1 text-xs font-semibold text-brand-600 dark:text-brand-400 group-hover:translate-x-0.5 transition">
                    <span>Open Roadmap</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      </div>
    </div>
  );
}
