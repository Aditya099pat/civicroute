import React, { useMemo } from 'react';
import { Zap, CalendarClock, TrendingDown, Route } from 'lucide-react';
import { computeSchedule, businessDaysFromNow, formatDate } from '../utils/timeline';
import Card from './ui/Card';
import Badge from './ui/Badge';

/**
 * Critical-path timeline (Gantt) view: shows when each clearance can start/finish,
 * highlights the critical path, calls out parallelizable work, and gives a
 * realistic earliest-completion date.
 */
export default function TimelineView({ nodes = [], selectedNodeId, onSelectNode }) {
  const { schedule, criticalIds, parallelGroups, projectDays, sequentialDays, order } = useMemo(
    () => computeSchedule(nodes),
    [nodes]
  );

  if (!nodes.length) return null;

  const byId = new Map(nodes.map((n) => [n.id, n]));
  const savings = Math.max(0, sequentialDays - projectDays);
  const finishDate = projectDays > 0 ? formatDate(businessDaysFromNow(projectDays)) : 'Today';
  const criticalChain = order.filter((id) => criticalIds.has(id)).map((id) => byId.get(id)?.title).filter(Boolean);
  const scale = projectDays || 1;

  return (
    <Card className="max-w-7xl mx-auto w-full p-5 sm:p-6 space-y-5">
      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-xl bg-brand-50 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800/60">
          <div className="flex items-center gap-1.5 text-brand-700 dark:text-brand-300 text-[11px] font-bold uppercase tracking-wider">
            <CalendarClock className="w-3.5 h-3.5" /> Realistic timeline
          </div>
          <div className="mt-1 text-2xl font-black text-zinc-900 dark:text-zinc-100">
            ~{projectDays} <span className="text-sm font-bold text-zinc-500">business days</span>
          </div>
          <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
            Earliest finish by <span className="font-semibold text-zinc-700 dark:text-zinc-300">{finishDate}</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60">
          <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold uppercase tracking-wider">
            <TrendingDown className="w-3.5 h-3.5" /> Time saved by parallelising
          </div>
          <div className="mt-1 text-2xl font-black text-zinc-900 dark:text-zinc-100">
            {savings} <span className="text-sm font-bold text-zinc-500">days</span>
          </div>
          <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
            vs {sequentialDays} days if done strictly one-by-one
          </div>
        </div>

        <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300 text-[11px] font-bold uppercase tracking-wider">
            <Route className="w-3.5 h-3.5" /> Critical path
          </div>
          <div className="mt-1 text-[11px] text-zinc-600 dark:text-zinc-300 leading-snug line-clamp-3">
            {criticalChain.join('  →  ')}
          </div>
        </div>
      </div>

      {/* Parallel callouts */}
      {parallelGroups.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 dark:text-amber-300">
            <Zap className="w-3.5 h-3.5" /> Can run in parallel:
          </span>
          {parallelGroups.map((group, i) => (
            <Badge key={i} tone="warn">
              {group.map((n) => n.title.replace(/\([^)]*\)/g, '').trim()).join(' + ')}
            </Badge>
          ))}
        </div>
      )}

      {/* Gantt */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 px-1">
          <span>Clearance</span>
          <span>Day 0 → Day {projectDays}</span>
        </div>
        {order.map((id) => {
          const node = byId.get(id);
          if (!node) return null;
          const s = schedule.get(id);
          const isSelected = selectedNodeId === id;
          const leftPct = (s.es / scale) * 100;
          const widthPct = Math.max((s.duration / scale) * 100, s.duration === 0 ? 0 : 1.5);
          const slackPct = (s.slack / scale) * 100;
          return (
            <button
              key={id}
              onClick={() => onSelectNode && onSelectNode(id)}
              className={`w-full text-left grid grid-cols-[minmax(120px,200px)_1fr] gap-3 items-center rounded-xl p-2 transition ${
                isSelected ? 'ring-2 ring-brand-500 bg-brand-50/40 dark:bg-brand-950/20' : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
              }`}
            >
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono-code text-[10px] font-bold text-zinc-500 dark:text-zinc-400">{node.code}</span>
                  {s.critical && <span className="text-[9px] font-bold text-brand-700 dark:text-brand-300 uppercase">critical</span>}
                </div>
                <div className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 truncate">
                  {node.title.replace(/\([^)]*\)/g, '').trim()}
                </div>
              </div>
              <div className="relative h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800/60">
                {/* slack extension */}
                {s.slack > 0 && (
                  <div
                    className="absolute top-1/2 -translate-y-1/2 h-1.5 rounded-full bg-zinc-300/70 dark:bg-zinc-600/50"
                    style={{ left: `${leftPct + widthPct}%`, width: `${slackPct}%` }}
                  />
                )}
                {/* main bar */}
                <div
                  className={`absolute top-1/2 -translate-y-1/2 h-5 rounded-md flex items-center px-2 shadow-sm ${
                    s.critical ? 'bg-brand-600 text-white' : 'bg-blue-500/90 dark:bg-blue-500/80 text-white'
                  }`}
                  style={{ left: `${leftPct}%`, width: `${widthPct}%`, minWidth: s.duration === 0 ? '10px' : undefined }}
                  title={`Day ${s.es} → ${s.ef} (${s.duration}d${s.slack ? `, ${s.slack}d slack` : ''})`}
                >
                  <span className="text-[10px] font-bold whitespace-nowrap">
                    {s.duration === 0 ? '•' : `${s.duration}d`}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <p className="text-[10px] text-zinc-400 dark:text-zinc-500 pt-1">
        Timeline is an estimate computed from published SLA turnarounds (critical-path method). Actual times depend on ward workload and document readiness.
      </p>
    </Card>
  );
}
