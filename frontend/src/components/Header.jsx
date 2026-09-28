import React, { useState } from 'react';
import { Printer, ShieldCheck, ChevronDown, CheckCircle2, MapPin } from 'lucide-react';

export default function Header({
  onExportDocket,
  onOpenAdmin,
  selectedWard,
  onSelectWard,
  onGoHome
}) {
  const [isWardDropdownOpen, setIsWardDropdownOpen] = useState(false);

  const wards = [
    { id: 'k_west', label: 'Ward K-West (Andheri W / Juhu)' },
    { id: 'g_south', label: 'Ward G-South (Worli / Lower Parel)' },
    { id: 'd_ward', label: 'Ward D (Malabar Hill / Grant Rd)' },
    { id: 'h_east', label: 'Ward H-East (Bandra E / Santacruz E)' }
  ];

  const currentWardLabel = wards.find(w => w.id === selectedWard)?.label || wards[0].label;

  return (
    <header className="bg-white border-b border-zinc-200 shadow-xs sticky top-0 z-30 w-full">
      {/* Centered Container with generous breadth (height) and shifted inward towards center */}
      <div className="max-w-7xl mx-auto px-8 sm:px-12 lg:px-16 py-4.5 sm:py-5.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Brand Identity & Municipal Scope (Clickable to redirect home) */}
        <div
          onClick={onGoHome}
          className="flex items-center space-x-4 cursor-pointer group select-none"
          title="Return to CivicRoute Homepage"
        >
          {/* Prominent, Clearly Visible Logo */}
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden shrink-0 border-2 border-zinc-200/90 shadow-md bg-white flex items-center justify-center p-1.5 group-hover:border-blue-400 group-hover:shadow-lg transition">
            <img
              src="/logo.png"
              alt="CivicRoute Logo"
              className="w-full h-full object-contain group-hover:scale-105 transition"
            />
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl sm:text-2xl font-black text-zinc-900 tracking-tight group-hover:text-blue-600 transition">
                CivicRoute
              </span>
              <span className="text-xs text-zinc-300">•</span>
              <span className="text-xs text-zinc-600 font-medium">
                Municipal Bureaucracy Path Visualizer
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-[11px] text-zinc-500 mt-1">
              <span className="font-semibold text-zinc-700">MCGM, Mumbai</span>
              <span className="text-zinc-300">•</span>
              <span>Maharashtra State</span>
              <span className="text-zinc-300">•</span>
              <span className="text-emerald-700 font-semibold inline-flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>.gov.in verified</span>
              </span>
              <span className="text-zinc-300">•</span>

              {/* Interactive Ward Switcher Dropdown (stopPropagation to avoid firing onGoHome) */}
              <div className="relative inline-block" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => setIsWardDropdownOpen(!isWardDropdownOpen)}
                  className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-zinc-100 hover:bg-zinc-200/80 text-zinc-800 border border-zinc-200 transition"
                >
                  <MapPin className="w-2.5 h-2.5 text-zinc-500" />
                  <span>{currentWardLabel}</span>
                  <ChevronDown className="w-3 h-3 text-zinc-500" />
                </button>

                {isWardDropdownOpen && (
                  <div className="absolute left-0 mt-1 w-64 bg-white border border-[#e2e4e8] rounded-xl shadow-lg py-1 z-50 animate-in fade-in zoom-in-95">
                    <div className="px-3 py-1.5 text-[10px] font-bold text-zinc-400 uppercase tracking-wider border-b border-zinc-100">
                      Select Jurisdiction Ward
                    </div>
                    {wards.map((w) => (
                      <button
                        key={w.id}
                        onClick={() => {
                          onSelectWard(w.id);
                          setIsWardDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs transition flex items-center justify-between ${
                          selectedWard === w.id
                            ? 'bg-blue-50 font-semibold text-blue-900'
                            : 'text-zinc-700 hover:bg-zinc-50'
                        }`}
                      >
                        <span>{w.label}</span>
                        {selectedWard === w.id && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Clean, Polished Action Buttons */}
        <div className="flex items-center space-x-2.5 self-end md:self-center">
          {/* Citizen Docket Print Button - Clean Slate/Zinc Outline */}
          <button
            onClick={onExportDocket}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-zinc-700 bg-white hover:bg-zinc-50 border border-zinc-300 hover:border-zinc-400 shadow-xs transition"
            title="Print high-contrast compliance docket for in-person municipal ward counters"
          >
            <Printer className="w-3.5 h-3.5 text-zinc-500" />
            <span>Citizen Action Docket</span>
          </button>

          {/* Steward & Admin Portal Button - Sleek Dark Zinc-900 Badge */}
          <button
            onClick={onOpenAdmin}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-white bg-zinc-900 hover:bg-zinc-800 shadow-xs transition"
            title="Restricted portal for data stewards and ward clerks"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>Clerk &amp; Steward Portal</span>
          </button>
        </div>
      </div>
    </header>
  );
}
