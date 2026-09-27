import React from 'react';
import { Plus, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function Sidebar({ pipelines, activeKey, onSelectPipeline, onNewPipeline }) {
  const keys = Object.keys(pipelines);

  return (
    <aside className="w-72 bg-[#091122] border-r border-[#1b2640] flex flex-col shrink-0">
      <div className="p-3 border-b border-[#1b2640] flex items-center justify-between">
        <span className="text-[10px] font-bold tracking-wider text-[#64748b] uppercase">
          Active Civic Pipelines ({keys.length})
        </span>
        <button
          onClick={onNewPipeline}
          className="text-[#64748b] hover:text-white p-1 rounded hover:bg-[#131e36] transition"
          title="Create New Pipeline"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {keys.map((key) => {
          const item = pipelines[key];
          const isActive = activeKey === key;
          const isActionNeeded = item.tier.toLowerCase().includes('action');

          return (
            <div
              key={key}
              onClick={() => onSelectPipeline(key)}
              className={`p-3.5 rounded-xl border cursor-pointer transition ${
                isActive
                  ? 'border-blue-500/50 bg-[#121d38] shadow-md shadow-blue-500/10'
                  : 'border-[#1b2640] hover:border-[#2d3f66] bg-[#0c1426]'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono-code text-[10px] text-[#94a3b8] bg-[#0c152a] px-1.5 py-0.5 rounded border border-[#213054]">
                  {item.id}
                </span>

                {isActionNeeded ? (
                  <span className="flex items-center space-x-1 text-[10px] font-bold text-amber-400 bg-amber-950/40 border border-amber-500/30 px-2 py-0.5 rounded-full">
                    <AlertTriangle className="w-3 h-3" />
                    <span>Action needed</span>
                  </span>
                ) : (
                  <span className="flex items-center space-x-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Verified route</span>
                  </span>
                )}
              </div>

              <h3 className="text-xs font-bold text-white tracking-tight truncate">
                {item.title}
              </h3>
              <p className="font-mono-code text-xs text-[#94a3b8] mt-1">
                {item.totalFee} total fees
              </p>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
