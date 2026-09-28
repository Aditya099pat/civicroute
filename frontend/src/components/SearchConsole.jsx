import React, { useState } from 'react';
import { Search, ArrowRight, ShieldCheck, CheckCircle2, Lock, AlertTriangle } from 'lucide-react';

export default function SearchConsole({
  pipeline,
  readinessScore,
  onSearchIntent,
  activeSearchQuery = '',
  isDynamic = false,
  isLoading = false
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
      {/* 1. INTEGRATED COMMAND OMNIBAR */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-xs">
        <form onSubmit={handleSearchSubmit} className="max-w-4xl mx-auto space-y-2.5">
          {/* Main Search Omnibar with Integrated Action Button */}
          <div className="relative flex items-center w-full">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSearchSubmit(e);
                }
              }}
              placeholder="What civic or commercial task do you want to accomplish? (e.g., 'Register a cloud kitchen in Mumbai', 'Get a new water connection')"
              className="w-full pl-10 pr-36 sm:pr-40 py-2.5 sm:py-3 bg-zinc-50/80 border border-zinc-200 rounded-xl text-xs md:text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-800 focus:bg-white focus:border-transparent transition shadow-xs"
            />
            <button
              type="submit"
              disabled={isLoading || !searchInput.trim()}
              className="absolute right-1.5 top-1.5 bottom-1.5 px-3.5 sm:px-4 bg-zinc-900 hover:bg-zinc-800 active:bg-black text-white font-semibold text-xs rounded-lg shadow-xs transition flex items-center space-x-1.5 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
            >
              <span>Resolve Pathway</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Sample Tags (Flat, subtle text buttons with 'Try:' prefix) */}
          <div className="flex items-center justify-start sm:justify-center flex-wrap gap-1.5 text-xs pt-0.5">
            <span className="text-zinc-500 font-medium text-xs mr-0.5">Try:</span>
            {popularPills.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => handleQuickSeed(p.query)}
                className="px-2 py-0.5 text-xs text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-md transition font-medium"
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Institutional Provenance Citation */}
          <div className="pt-1.5 flex items-center justify-center">
            <div className="inline-flex items-center space-x-1.5 text-[11px] text-zinc-500 bg-zinc-50 border border-zinc-200 px-3 py-1 rounded-md">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Audited against Maharashtra Municipal Corporations Act (MMCA) § 129 &amp; Citizen Charter (2026)</span>
            </div>
          </div>
        </form>
      </div>

      {/* 2. METRIC SUMMARY RIBBON (Modular Overview) */}
      {pipeline && (
        <div className="bg-white border border-zinc-200 rounded-xl px-5 py-3 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 font-bold text-sm shrink-0">
              {pipeline.shortCode || 'CR'}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono-code text-[10px] font-bold text-zinc-500 bg-zinc-100 px-1.5 py-0.5 rounded border border-zinc-200">
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
              
              {/* Concrete Status Iconography */}
              {readinessScore === 100 ? (
                <div className="flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 fill-emerald-100" />
                  <span>Satisfied</span>
                </div>
              ) : readinessScore > 0 ? (
                <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-800 border border-blue-200">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                  </span>
                  <span>Ready to File</span>
                </div>
              ) : (
                <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-zinc-100 text-zinc-600 border border-zinc-200">
                  <Lock className="w-3 h-3 text-zinc-400" />
                  <span>Locked</span>
                </div>
              )}
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
