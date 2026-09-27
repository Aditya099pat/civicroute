import React from 'react';
import { Route, AlertCircle, Sparkles, Sliders, CheckCircle } from 'lucide-react';

export default function Navbar({
  activeTab,
  onSelectTab,
  needsReviewCount = 1,
  optimizedCount = 3
}) {
  return (
    <nav className="bg-white border-b border-slate-200 px-6 flex items-center space-x-6 text-xs font-semibold shrink-0">
      <button
        onClick={() => onSelectTab('overview')}
        className={`flex items-center space-x-2 py-3 border-b-2 transition ${
          activeTab === 'overview'
            ? 'border-blue-700 text-blue-700 font-bold'
            : 'border-transparent text-slate-600 hover:text-slate-900'
        }`}
      >
        <Route className="w-3.5 h-3.5" />
        <span>Intent Discovery &amp; Roadmaps</span>
      </button>

      <button
        onClick={() => onSelectTab('needs_review')}
        className={`flex items-center space-x-1.5 py-3 border-b-2 transition ${
          activeTab === 'needs_review'
            ? 'border-amber-600 text-amber-800 font-bold'
            : 'border-transparent text-slate-600 hover:text-slate-900'
        }`}
      >
        <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
        <span>Pending Clearance Review</span>
        <span className="bg-amber-50 text-amber-800 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-amber-200">
          {needsReviewCount}
        </span>
      </button>

      <button
        onClick={() => onSelectTab('optimized')}
        className={`flex items-center space-x-1.5 py-3 border-b-2 transition ${
          activeTab === 'optimized'
            ? 'border-emerald-600 text-emerald-800 font-bold'
            : 'border-transparent text-slate-600 hover:text-slate-900'
        }`}
      >
        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
        <span>Optimized Clearance Routes</span>
        <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-emerald-200">
          {optimizedCount}
        </span>
      </button>

      <button
        onClick={() => onSelectTab('settings')}
        className={`flex items-center space-x-2 py-3 border-b-2 transition ${
          activeTab === 'settings'
            ? 'border-blue-700 text-blue-700 font-bold'
            : 'border-transparent text-slate-600 hover:text-slate-900'
        }`}
      >
        <Sliders className="w-3.5 h-3.5" />
        <span>Municipal Ward Gazette Settings</span>
      </button>
    </nav>
  );
}
