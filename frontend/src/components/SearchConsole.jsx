import React, { useState, useCallback } from 'react';
import { Search, ArrowRight, ShieldCheck, CheckCircle2, Lock, AlertTriangle, Sparkles, Mic } from 'lucide-react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';

export default function SearchConsole({
  pipeline,
  readinessScore,
  onSearchIntent,
  activeSearchQuery = '',
  isLoading = false,
  onPersonalize
}) {
  const [searchInput, setSearchInput] = useState(activeSearchQuery);

  const handleVoiceResult = useCallback((transcript) => setSearchInput(transcript), []);
  const { supported: voiceSupported, listening, start: startVoice } = useSpeechRecognition({
    lang: 'en-IN',
    onResult: handleVoiceResult,
  });

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
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-xs transition-colors duration-200">
        <form onSubmit={handleSearchSubmit} className="max-w-4xl mx-auto space-y-2.5">
          {/* Main Search Omnibar with Integrated Action Button */}
          <div className="relative flex items-center w-full">
            <Search className="w-4 h-4 text-zinc-400 dark:text-zinc-500 absolute left-3.5 pointer-events-none" />
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
              className={`w-full pl-10 ${voiceSupported ? 'pr-44 sm:pr-52' : 'pr-36 sm:pr-40'} py-2.5 sm:py-3 bg-zinc-50/80 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs md:text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white dark:focus:bg-zinc-800 focus:border-transparent transition shadow-xs`}
            />
            <div className="absolute right-1.5 top-1.5 bottom-1.5 flex items-center gap-1.5">
              {voiceSupported && (
                <button
                  type="button"
                  onClick={startVoice}
                  className={`h-full px-2.5 rounded-lg border transition flex items-center ${
                    listening
                      ? 'bg-red-50 dark:bg-red-950/50 border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 animate-pulse'
                      : 'bg-white dark:bg-zinc-700 border-zinc-200 dark:border-zinc-600 text-zinc-500 dark:text-zinc-300 hover:text-brand-600 dark:hover:text-brand-400'
                  }`}
                  title={listening ? 'Listening…' : 'Speak your request'}
                  aria-label="Voice search"
                >
                  <Mic className="w-4 h-4" />
                </button>
              )}
              <button
                type="submit"
                disabled={isLoading || !searchInput.trim()}
                className="h-full px-3.5 sm:px-4 bg-zinc-900 hover:bg-zinc-800 dark:bg-brand-600 dark:hover:bg-brand-500 active:bg-black text-white font-semibold text-xs rounded-lg shadow-xs transition flex items-center space-x-1.5 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
              >
                <span>Resolve Pathway</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick Sample Tags (Flat, subtle text buttons with 'Try:' prefix) */}
          <div className="flex items-center justify-start sm:justify-center flex-wrap gap-1.5 text-xs pt-0.5">
            <span className="text-zinc-500 dark:text-zinc-400 font-medium text-xs mr-0.5">Try:</span>
            {popularPills.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => handleQuickSeed(p.query)}
                className="px-2 py-0.5 text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition font-medium"
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Institutional Provenance Citation */}
          <div className="pt-1.5 flex items-center justify-center">
            <div className="inline-flex items-center space-x-1.5 text-[11px] text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/80 px-3 py-1 rounded-md">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Audited against Maharashtra Municipal Corporations Act (MMCA) § 129 &amp; Citizen Charter (2026)</span>
            </div>
          </div>
        </form>
      </div>

      {/* 2. METRIC SUMMARY RIBBON (Modular Overview) */}
      {pipeline && (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-5 py-3 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs transition-colors duration-200">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/80 flex items-center justify-center text-blue-700 dark:text-blue-300 font-bold text-sm shrink-0">
              {pipeline.shortCode || 'CR'}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono-code text-[10px] font-bold text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded border border-zinc-200 dark:border-zinc-700">
                  {pipeline.id}
                </span>
                <span className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">{pipeline.title}</span>
              </div>
              <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                <span>{pipeline.jurisdiction}</span> • <span>Primary: {pipeline.primaryDept}</span>
              </div>
            </div>
          </div>

          {/* Metric Stats */}
          <div className="flex items-center flex-wrap gap-4 border-t md:border-t-0 pt-2 md:pt-0 border-zinc-100 dark:border-zinc-800">
            {onPersonalize && (
              <button
                onClick={onPersonalize}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-950/50 border border-brand-200 dark:border-brand-800/60 hover:bg-brand-100 dark:hover:bg-brand-900/60 transition order-last md:order-first"
                title="Answer a few questions to tailor this pathway to you"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Personalize</span>
              </button>
            )}
            <div>
              <span className="text-[10px] uppercase font-bold text-zinc-400 dark:text-zinc-500 block">Total Statutory Fees</span>
              <span className="font-mono-code font-bold text-zinc-900 dark:text-zinc-100 text-sm">{pipeline.totalFee}</span>
            </div>

            <div className="h-7 w-px bg-zinc-200 dark:bg-zinc-700 hidden sm:block" />

            <div>
              <span className="text-[10px] uppercase font-bold text-zinc-400 dark:text-zinc-500 block">Statutory SLA</span>
              <span className="font-semibold text-zinc-800 dark:text-zinc-200">{pipeline.cycleTime}</span>
            </div>

            <div className="h-7 w-px bg-zinc-200 dark:bg-zinc-700 hidden sm:block" />

            <div className="flex items-center space-x-2">
              <div className="min-w-[120px]">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-zinc-400 dark:text-zinc-500 block">Readiness</span>
                  <span className="text-[10px] font-bold text-zinc-700 dark:text-zinc-300">{readinessScore}%</span>
                </div>
                <div className="mt-1 h-1.5 w-full rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden" role="progressbar" aria-valuenow={readinessScore} aria-valuemin={0} aria-valuemax={100}>
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      readinessScore === 100 ? 'bg-emerald-500' : 'bg-blue-500 dark:bg-blue-400'
                    }`}
                    style={{ width: `${readinessScore}%` }}
                  />
                </div>
              </div>

              {/* Concrete Status Iconography */}
              {readinessScore === 100 ? (
                <div className="flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/70">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 fill-emerald-100 dark:fill-emerald-950" />
                  <span>Satisfied</span>
                </div>
              ) : readinessScore > 0 ? (
                <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-50 dark:bg-blue-950/50 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800/70">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600 dark:bg-blue-400"></span>
                  </span>
                  <span>Ready to File</span>
                </div>
              ) : (
                <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
                  <Lock className="w-3 h-3 text-zinc-400 dark:text-zinc-500" />
                  <span>Locked</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Prerequisite Blocker Alert Banner */}
      {pipeline?.conflictText && (
        <div className="p-3 bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200/90 dark:border-amber-800/60 rounded-xl flex items-start space-x-2.5 text-xs text-amber-900 dark:text-amber-200">
          <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold text-amber-950 dark:text-amber-100">Active Prerequisite Bottleneck: </strong>
            <span className="text-amber-900 dark:text-amber-300">{pipeline.conflictText}</span>
          </div>
        </div>
      )}
    </div>
  );
}
