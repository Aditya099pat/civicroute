import React, { useState } from 'react';
import { Printer, ShieldCheck, ChevronDown, CheckCircle2, MapPin } from 'lucide-react';

export default function Header({
  onExportDocket,
  onOpenAdmin,
  selectedWard,
  onSelectWard
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
    <header className="bg-white border-b border-[#e2e4e8] px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs sticky top-0 z-30">
      {/* Left: Brand Identity & Municipal Scope */}
      <div className="flex items-center space-x-3.5">
        <div className="w-10 h-10 rounded-xl overflow-hidden shadow-xs shrink-0 ring-1 ring-zinc-300 bg-[#070d19] flex items-center justify-center p-0.5">
          <img
            src="/logo.png"
            alt="CivicRoute Logo"
            className="w-full h-full object-contain"
          />
        </div>

        <div>
          <div className="flex items-center space-x-2">
            <span className="text-base font-bold text-zinc-900 tracking-tight">
              CivicRoute
            </span>
            <span className="text-xs text-zinc-300">•</span>
            <span className="text-xs text-zinc-600 font-medium">
              Municipal Bureaucracy Path Visualizer
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-[11px] text-zinc-500 mt-0.5">
            <span className="font-medium text-zinc-700">MCGM, Mumbai</span>
            <span className="text-zinc-300">•</span>
            <span>Maharashtra State</span>
            <span className="text-zinc-300">•</span>
            <span className="text-emerald-700 font-semibold inline-flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>.gov.in verified</span>
            </span>
            <span className="text-zinc-300">•</span>

            {/* Interactive Ward Switcher Dropdown */}
            <div className="relative inline-block">
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
        {/* Citizen Docket Print Button */}
        <button
          onClick={onExportDocket}
          className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-zinc-700 bg-white hover:bg-zinc-50 border border-[#e2e4e8] hover:border-zinc-300 shadow-xs transition"
          title="Print high-contrast compliance docket for in-person municipal ward counters"
        >
          <Printer className="w-3.5 h-3.5 text-zinc-500" />
          <span>Citizen Action Docket</span>
        </button>

        {/* Steward & Admin Portal Button */}
        <button
          onClick={onOpenAdmin}
          className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-zinc-900 hover:bg-zinc-800 shadow-xs transition"
          title="Restricted portal for data stewards and ward clerks"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
          <span>Clerk &amp; Steward Portal</span>
        </button>
      </div>
    </header>
  );
}
