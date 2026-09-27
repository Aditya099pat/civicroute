import React, { useState } from 'react';
import { Plus, CheckCircle2, AlertTriangle, Sparkles, Search, Layers } from 'lucide-react';

export default function Sidebar({
  pipelines,
  activeKey,
  onSelectPipeline,
  onNewPipeline
}) {
  const [filterText, setFilterText] = useState('');
  const keys = Object.keys(pipelines);

  const filteredKeys = keys.filter((key) => {
    const item = pipelines[key];
    if (!filterText) return true;
    return (
      item.title.toLowerCase().includes(filterText.toLowerCase()) ||
      item.id.toLowerCase().includes(filterText.toLowerCase()) ||
      item.category?.toLowerCase().includes(filterText.toLowerCase())
    );
  });

  return (
    <aside className="w-80 bg-white border-r border-slate-200 flex flex-col shrink-0 z-10 shadow-xs">
      {/* Sidebar Header */}
      <div className="p-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
        <div className="flex items-center space-x-2">
          <Layers className="w-4 h-4 text-blue-700" />
          <span className="text-xs font-bold tracking-tight text-slate-800 uppercase">
            Active Civic Roadmaps ({keys.length})
          </span>
        </div>
        <button
          onClick={onNewPipeline}
          className="text-slate-500 hover:text-slate-900 p-1.5 rounded-lg hover:bg-slate-200/60 transition"
          title="Synthesize New Clearance Route"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Filter */}
      <div className="p-2.5 border-b border-slate-100 bg-white">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
          <input
            type="text"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            placeholder="Filter roadmaps..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white"
          />
        </div>
      </div>

      {/* Pipeline Item List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {filteredKeys.map((key) => {
          const item = pipelines[key];
          const isActive = activeKey === key;
          const isActionNeeded = item.tier?.toLowerCase().includes('action');
          const isDynamic = item.tier?.toLowerCase().includes('synthesized');

          return (
            <div
              key={key}
              onClick={() => onSelectPipeline(key)}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                isActive
                  ? 'border-blue-600 bg-blue-50/50 shadow-xs ring-1 ring-blue-600/30'
                  : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/80 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono-code text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  {item.id}
                </span>

                {isDynamic ? (
                  <span className="inline-flex items-center space-x-1 text-[10px] font-semibold text-blue-800 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                    <Sparkles className="w-2.5 h-2.5" />
                    <span>Synthesized</span>
                  </span>
                ) : isActionNeeded ? (
                  <span className="inline-flex items-center space-x-1 text-[10px] font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                    <AlertTriangle className="w-2.5 h-2.5" />
                    <span>Action needed</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center space-x-1 text-[10px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    <span>Verified</span>
                  </span>
                )}
              </div>

              <h3 className="text-xs font-bold text-slate-900 tracking-tight line-clamp-2 leading-snug">
                {item.title}
              </h3>

              <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-100 font-mono-code">
                <span className="font-semibold text-slate-700">{item.totalFee}</span>
                <span>{item.nodes?.length || 0} clearances</span>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
