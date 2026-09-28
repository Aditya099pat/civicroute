import React from 'react';
import { ArrowDown, Check, Unlock, Lock, ExternalLink, ShieldCheck } from 'lucide-react';

export default function MilestoneTree({ nodes = [], selectedNodeId, onSelectNode, onToggleNode }) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mt-4">
      <div className="mb-5 text-center max-w-lg mx-auto">
        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          Directed Prerequisite Lineage Graph (DAG)
        </h4>
        <p className="text-[11px] text-slate-500 mt-0.5">
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

          let badgeClasses = 'bg-slate-100 text-slate-600 border-slate-200';
          let borderClasses = 'border-slate-200 bg-white hover:border-slate-300';
          let icon = <Lock className="w-3.5 h-3.5 text-slate-400" />;
          let iconBg = 'bg-slate-100 border-slate-200';

          if (isCompleted) {
            badgeClasses = 'bg-emerald-50 text-emerald-800 border-emerald-200';
            borderClasses = 'border-emerald-300 bg-emerald-50/30';
            icon = <Check className="w-3.5 h-3.5 text-emerald-700" />;
            iconBg = 'bg-emerald-100 border-emerald-200';
          } else if (isAvailable) {
            badgeClasses = 'bg-blue-50 text-blue-800 border-blue-200';
            borderClasses = 'border-blue-300 bg-blue-50/30 ring-1 ring-blue-200 shadow-xs';
            icon = <Unlock className="w-3.5 h-3.5 text-blue-700" />;
            iconBg = 'bg-blue-100 border-blue-200';
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
                        <span className="font-mono-code text-[10px] text-slate-700 font-bold bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                          {node.code}
                        </span>
                        {dept && (
                          <>
                            <span className="text-slate-300">•</span>
                            <span className="text-xs font-semibold text-slate-700">
                              {dept}
                            </span>
                          </>
                        )}
                        {node.gazetteCode && (
                          <>
                            <span className="text-slate-300">•</span>
                            <span className="font-mono-code text-[10px] text-slate-400">
                              {node.gazetteCode}
                            </span>
                          </>
                        )}
                      </div>
                      <h5 className="text-xs font-bold text-slate-900 mt-1">
                        {node.title}
                      </h5>

                      <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[11px] text-slate-500 font-mono-code">
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
                              className="inline-flex items-center space-x-1 text-blue-700 hover:underline"
                            >
                              <ShieldCheck className="w-3 h-3 text-blue-700" />
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
                  <div className="mt-2 pt-2 border-t border-slate-200/80 flex items-center space-x-1.5 text-[10px] text-slate-500">
                    <span className="font-medium text-slate-600">Prerequisite requirement:</span>
                    {prereqs.map((pid) => (
                      <span
                        key={pid}
                        className="bg-slate-100 border border-slate-200 text-slate-700 px-1.5 py-0.2 rounded font-mono-code"
                      >
                        Step {pid}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {hasDownstream && (
                <div className="flex flex-col items-center">
                  <div className="w-0.5 h-3 bg-slate-300" />
                  <ArrowDown className="w-3.5 h-3.5 text-blue-700 -my-0.5" />
                  <div className="w-0.5 h-3 bg-slate-300" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
