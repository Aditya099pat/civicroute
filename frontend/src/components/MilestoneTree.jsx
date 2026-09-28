import React from 'react';
import { ArrowDown, Check, Unlock, Lock, ExternalLink, ShieldCheck } from 'lucide-react';

export default function MilestoneTree({ nodes = [], selectedNodeId, onSelectNode, onToggleNode }) {
  return (
    <div className="bg-slate-50 dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800 rounded-xl p-6 mt-4">
      <div className="mb-5 text-center max-w-lg mx-auto">
        <h4 className="text-xs font-bold text-slate-900 dark:text-zinc-100 uppercase tracking-wider">
          Directed Prerequisite Lineage Graph (DAG)
        </h4>
        <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
          Topological clearance dependency flow. Milestones must be executed sequentially before dependent clearances are unlocked.
        </p>
      </div>

      <div className="flex flex-col items-center space-y-3">
        {nodes.map((node, index) => {
          const isSelected = selectedNodeId === node.id;
          const hasDownstream = index < nodes.length - 1;
          const isCompleted = node.status === 'completed';
          const isAvailable = node.status === 'available';
          const isLocked = node.status === 'locked';

          let badgeClasses = 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-zinc-700';
          let borderClasses = 'border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-slate-300 dark:hover:border-zinc-700';
          let icon = <Lock className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500" />;
          let iconBg = 'bg-slate-100 dark:bg-zinc-800 border-slate-200 dark:border-zinc-700';

          if (isCompleted) {
            badgeClasses = 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60';
            borderClasses = 'border-emerald-300 dark:border-emerald-700/60 bg-emerald-50/30 dark:bg-emerald-950/20';
            icon = <Check className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />;
            iconBg = 'bg-emerald-100 dark:bg-emerald-900/40 border-emerald-200 dark:border-emerald-800';
          } else if (isAvailable) {
            badgeClasses = 'bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800/60';
            borderClasses = 'border-blue-300 dark:border-blue-700/60 bg-blue-50/30 dark:bg-blue-950/20 ring-1 ring-blue-200 dark:ring-blue-800/40 shadow-xs';
            icon = <Unlock className="w-3.5 h-3.5 text-blue-700 dark:text-blue-400" />;
            iconBg = 'bg-blue-100 dark:bg-blue-900/40 border-blue-200 dark:border-blue-800';
          }

          const dept = node.department || node.dept;
          const time = node.estimatedDays || node.time;
          const url = node.officialUrl || node.url;
          const prereqs = node.prerequisites || node.prereqs || [];

          let domain = 'gov.in';
          if (url) {
            try {
              domain = new URL(url).hostname;
            } catch {
              domain = 'gov.in';
            }
          }

          return (
            <React.Fragment key={node.id}>
              <div
                onClick={() => onSelectNode(node.id)}
                className={`w-full max-w-xl p-4 rounded-xl border transition-all cursor-pointer shadow-xs ${borderClasses} ${
                  isSelected ? 'ring-2 ring-blue-600 scale-[1.01]' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg border shrink-0 mt-0.5 ${iconBg}`}>
                      {icon}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="font-mono-code text-[10px] text-slate-700 dark:text-zinc-300 font-bold bg-slate-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-zinc-700">
                          {node.code}
                        </span>
                        {dept && (
                          <>
                            <span className="text-slate-300 dark:text-zinc-700">•</span>
                            <span className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                              {dept}
                            </span>
                          </>
                        )}
                        {node.gazetteCode && (
                          <>
                            <span className="text-slate-300 dark:text-zinc-700">•</span>
                            <span className="font-mono-code text-[10px] text-slate-400 dark:text-zinc-500">
                              {node.gazetteCode}
                            </span>
                          </>
                        )}
                      </div>
                      <h5 className="text-xs font-bold text-slate-900 dark:text-zinc-100 mt-1">
                        {node.title}
                      </h5>

                      <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[11px] text-slate-500 dark:text-zinc-400 font-mono-code">
                        <span>Fee: {node.fee}</span>
                        {time && (
                          <>
                            <span>•</span>
                            <span>SLA: {time}</span>
                          </>
                        )}
                        {url && (
                          <>
                            <span>•</span>
                            <a
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center space-x-1 text-blue-700 dark:text-blue-400 hover:underline"
                            >
                              <ShieldCheck className="w-3 h-3 text-blue-700 dark:text-blue-400" />
                              <span>{domain}</span>
                              <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
                            </a>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${badgeClasses}`}>
                      {isCompleted ? 'Satisfied' : isAvailable ? 'Ready to File' : 'Blocked'}
                    </span>
                  </div>
                </div>

                {prereqs.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-slate-200/80 dark:border-zinc-800 flex items-center space-x-1.5 text-[10px] text-slate-500 dark:text-zinc-400">
                    <span className="font-medium text-slate-600 dark:text-zinc-400">Prerequisite requirement:</span>
                    {prereqs.map((pid) => (
                      <span
                        key={pid}
                        className="bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 px-1.5 py-0.2 rounded font-mono-code"
                      >
                        Step {pid}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {hasDownstream && (
                <div className="flex flex-col items-center">
                  <div className="w-0.5 h-3 bg-slate-300 dark:bg-zinc-700" />
                  <ArrowDown className="w-3.5 h-3.5 text-blue-700 dark:text-blue-400 -my-0.5" />
                  <div className="w-0.5 h-3 bg-slate-300 dark:bg-zinc-700" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
