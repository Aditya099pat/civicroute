import React from 'react';
import { Route, AlertCircle, Sparkles, Sliders } from 'lucide-react';

export default function Navbar({ activeTab, onSelectTab, needsReviewCount = 1, optimizedCount = 2 }) {
  return (
    <nav className="bg-[#091020] border-b border-[#1b2640] px-6 flex items-center space-x-7 text-xs font-semibold shrink-0">
      <button
        onClick={() => onSelectTab('overview')}
        className={`flex items-center space-x-2 py-3 border-b-2 transition ${
          activeTab === 'overview'
            ? 'border-blue-500 text-blue-400'
            : 'border-transparent text-[#94a3b8] hover:text-slate-200'
        }`}
      >
        <Route className="w-3.5 h-3.5" />
        <span>Civic Task Overview</span>
      </button>

      <button
        onClick={() => onSelectTab('needs_review')}
        className={`flex items-center space-x-1.5 py-3 border-b-2 transition ${
          activeTab === 'needs_review'
            ? 'border-amber-500 text-amber-400'
            : 'border-transparent text-[#94a3b8] hover:text-slate-200'
        }`}
      >
        <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
        <span>Needs Review</span>
        <span className="bg-amber-500/20 text-amber-400 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-amber-500/30">
          {needsReviewCount}
        </span>
      </button>

      <button
        onClick={() => onSelectTab('optimized')}
        className={`flex items-center space-x-1.5 py-3 border-b-2 transition ${
          activeTab === 'optimized'
            ? 'border-emerald-500 text-emerald-400'
            : 'border-transparent text-[#94a3b8] hover:text-slate-200'
        }`}
      >
        <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
        <span>Optimized Paths</span>
        <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-emerald-500/30">
          {optimizedCount}
        </span>
      </button>

      <button
        onClick={() => onSelectTab('settings')}
        className={`flex items-center space-x-2 py-3 border-b-2 transition ${
          activeTab === 'settings'
            ? 'border-blue-500 text-blue-400'
            : 'border-transparent text-[#94a3b8] hover:text-slate-200'
        }`}
      >
        <Sliders className="w-3.5 h-3.5" />
        <span>Municipal Ward Settings</span>
      </button>
    </nav>
  );
}
