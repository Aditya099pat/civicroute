import React, { useState } from 'react';
import { Search, Sparkles, AlertTriangle, ArrowRight, ShieldCheck, Clock, CheckCircle2 } from 'lucide-react';

export default function SearchConsole({
  pipeline,
  readinessScore,
  onSearchIntent,
  activeSearchQuery = '',
  isDynamic = false
}) {
  const [searchInput, setSearchInput] = useState(activeSearchQuery);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearchIntent(searchInput.trim());
    }
  };

  const handleQuickSeed = (query) => {
    setSearchInput(query);
    onSearchIntent(query);
  };

  const popularPills = [
    { label: "Gumasta License", query: "Gumasta license registration" },
    { label: "FSSAI Food License", query: "FSSAI basic food license" },
    { label: "Fire NOC", query: "Fire safety inspection NOC" },
    { label: "Property Tax", query: "Property assessment tax clearance" },
    { label: "Commercial Water Connection", query: "Commercial water meter connection" },
    { label: "Rooftop Solar", query: "Commercial rooftop solar net-metering" }
  ];

  return (
    <div className="space-y-4 max-w-7xl mx-auto w-full">
      {/* 1. FLOATING SEARCH CARD (Exact styling from reference design) */}
      <div className="bg-white border border-[#e2e4e8] rounded-2xl p-6 shadow-xs text-center">
        <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto space-y-3.5">
          {/* Main Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="What civic or commercial task do you want to accomplish? (e.g., 'Register a cloud kitchen in Mumbai', 'Get a new water connection')"
              className="w-full pl-10 pr-4 py-2.5 bg-zinc-50/70 border border-[#e2e4e8] rounded-xl text-xs md:text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white focus:border-transparent transition shadow-xs"
            />
          </div>

          {/* Centered Submit Button */}
          <div>
            <button
              type="submit"
              className="inline-flex items-center space-x-1.5 px-5 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-semibold text-xs rounded-lg border border-zinc-300 shadow-xs transition"
            >
              <span>Search Dependency Path</span>
            </button>
          </div>

          {/* Popular Seed Pills */}
          <div className="flex items-center justify-center flex-wrap gap-1.5 text-xs pt-1">
            <span className="text-zinc-500 font-medium text-[11px] mr-1">Popular:</span>
            {popularPills.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => handleQuickSeed(p.query)}
                className="px-2.5 py-1 text-[11px] font-medium text-zinc-700 bg-zinc-100 hover:bg-zinc-200 hover:text-zinc-900 rounded-full border border-zinc-200/80 transition"
              >
                {p.label}
              </button>
            ))}
          </div>

          {isDynamic && (
            <div className="mt-2 p-2.5 bg-blue-50/80 border border-blue-200 rounded-xl text-center text-xs text-blue-900 flex items-center justify-center space-x-2">
              <Sparkles className="w-4 h-4 text-blue-700 shrink-0" />
              <span>
                <strong>Dynamic Intent Synthesized:</strong> Generated 4-stage verified prerequisite roadmap backed by State Portal endpoints.
              </span>
            </div>
          )}
        </form>
      </div>

      {/* 2. METRIC SUMMARY RIBBON (Modular Overview) */}
      {pipeline && (
        <div className="bg-white border border-[#e2e4e8] rounded-xl px-5 py-3 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 font-bold text-sm shrink-0">
              {pipeline.shortCode || 'CR'}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono-code text-[10px] font-bold text-zinc-500 bg-zinc-100 px-1.5 py-0.5 rounded">
                  {pipeline.id}
                </span>
                <span className="font-bold text-zinc-900 text-sm">{pipeline.title}</span>
              </div>
              <div className="text-[11px] text-zinc-500 mt-0.5">
                <span>{pipeline.jurisdiction}</span> • <span>Primary: {pipeline.primaryDept}</span>
              </div>
            </div>
          </div>

          {/* Metric Stats */}
          <div className="flex items-center flex-wrap gap-4 border-t md:border-t-0 pt-2 md:pt-0 border-zinc-100">
            <div>
              <span className="text-[10px] uppercase font-bold text-zinc-400 block">Total Statutory Fees</span>
              <span className="font-mono-code font-bold text-zinc-900 text-sm">{pipeline.totalFee}</span>
            </div>

            <div className="h-7 w-px bg-zinc-200 hidden sm:block" />

            <div>
              <span className="text-[10px] uppercase font-bold text-zinc-400 block">Statutory SLA</span>
              <span className="font-semibold text-zinc-800">{pipeline.cycleTime}</span>
            </div>

            <div className="h-7 w-px bg-zinc-200 hidden sm:block" />

            <div className="flex items-center space-x-2">
              <div>
                <span className="text-[10px] uppercase font-bold text-zinc-400 block">Readiness</span>
                <span className="font-semibold text-zinc-800">{readinessScore}% compliant</span>
              </div>
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-[10px] ${
                readinessScore === 100
                  ? 'border-emerald-500 text-emerald-800 bg-emerald-50'
                  : readinessScore > 0
                  ? 'border-blue-600 text-blue-800 bg-blue-50'
                  : 'border-zinc-300 text-zinc-500 bg-zinc-100'
              }`}>
                {readinessScore}%
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Prerequisite Blocker Alert Banner */}
      {pipeline?.conflictText && (
        <div className="p-3 bg-amber-50/90 border border-amber-200/90 rounded-xl flex items-start space-x-2.5 text-xs text-amber-900">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold text-amber-950">Active Prerequisite Bottleneck: </strong>
            <span className="text-amber-900">{pipeline.conflictText}</span>
          </div>
        </div>
      )}
    </div>
  );
}
