import React from 'react';
import { ArrowDown, Check, Unlock, Lock, ExternalLink } from 'lucide-react';

export default function MilestoneTree({ nodes = [], selectedNodeId, onSelectNode }) {
  return (
    <div className="bg-[#091224] border border-[#1b2a47] rounded-xl p-6 mt-4">
      <div className="mb-4">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider">
          Topological Clearance Flow
        </h4>
        <p className="text-[11px] text-[#94a3b8]">
          Prerequisites must be satisfied in topological order before downstream licenses unlock.
        </p>
      </div>

      <div className="flex flex-col items-center space-y-4">
        {nodes.map((node, index) => {
          const isSelected = selectedNodeId === node.id;
          const hasDownstream = index < nodes.length - 1;

          let badgeBg = 'bg-slate-800 text-slate-400 border-slate-700';
          let borderStyle = 'border-[#1e2e4a] bg-[#0e172a]';
          let icon = <Lock className="w-3.5 h-3.5 text-slate-400" />;

          if (node.status === 'completed') {
            badgeBg = 'bg-emerald-950/60 text-emerald-400 border-emerald-500/30';
            borderStyle = 'border-emerald-500/40 bg-[#0d1d33]';
            icon = <Check className="w-3.5 h-3.5 text-emerald-400" />;
          } else if (node.status === 'available') {
            badgeBg = 'bg-blue-950/60 text-blue-400 border-blue-500/30';
            borderStyle = 'border-blue-500/50 bg-[#111f3d] shadow-lg shadow-blue-500/10';
            icon = <Unlock className="w-3.5 h-3.5 text-blue-400" />;
          }

          return (
            <React.Fragment key={node.id}>
              <div
                onClick={() => onSelectNode(node.id)}
                className={`w-full max-w-xl p-4 rounded-xl border transition-all cursor-pointer ${borderStyle} ${
                  isSelected ? 'ring-2 ring-blue-500 scale-[1.01]' : 'hover:border-blue-400/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-[#14223f] border border-[#23355e]">
                      {icon}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono-code text-[10px] text-blue-400 font-bold">
                          {node.code}
                        </span>
                        <span className="text-xs text-slate-500">•</span>
                        <span className="text-[11px] font-semibold text-slate-300">
                          {node.dept}
                        </span>
                      </div>
                      <h5 className="text-xs font-bold text-white mt-0.5">{node.title}</h5>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeBg}`}
                    >
                      {node.status === 'completed'
                        ? 'Satisfied'
                        : node.status === 'available'
                        ? 'Ready'
                        : 'Blocked'}
                    </span>
                    <div className="text-[10px] text-[#64748b] font-mono-code mt-1">
                      {node.fee} • {node.time}
                    </div>
                  </div>
                </div>

                {node.prereqs && node.prereqs.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-[#182744] flex items-center space-x-1.5 text-[10px] text-slate-400">
                    <span>Prerequisites:</span>
                    {node.prereqs.map((pid) => (
                      <span
                        key={pid}
                        className="bg-[#142340] border border-[#21355a] text-blue-300 px-1.5 py-0.2 rounded font-mono-code"
                      >
                        Step {pid}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {hasDownstream && (
                <div className="flex flex-col items-center">
                  <div className="w-0.5 h-3 bg-[#1e2f52]" />
                  <ArrowDown className="w-3.5 h-3.5 text-blue-400 -my-0.5" />
                  <div className="w-0.5 h-3 bg-[#1e2f52]" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
