import React, { useState, useRef, useEffect } from 'react';
import { Printer, ShieldCheck, ChevronDown, CheckCircle2, MapPin, Building2, Sun, Moon, Share2, FileDown } from 'lucide-react';
import { CITIES, MUMBAI_WARDS, getCity } from '../data/jurisdictions';

export default function Header({
  onExportDocket,
  onExportPdf,
  onShare,
  canExport = false,
  onOpenAdmin,
  selectedWard,
  onSelectWard,
  selectedCity = 'mumbai',
  onSelectCity,
  onGoHome,
  theme = 'light',
  onToggleTheme
}) {
  const [isWardDropdownOpen, setIsWardDropdownOpen] = useState(false);
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const wardRef = useRef(null);
  const cityRef = useRef(null);

  // Close dropdowns when clicking outside or pressing Escape.
  useEffect(() => {
    const onClickOutside = (e) => {
      if (wardRef.current && !wardRef.current.contains(e.target)) setIsWardDropdownOpen(false);
      if (cityRef.current && !cityRef.current.contains(e.target)) setIsCityDropdownOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') { setIsWardDropdownOpen(false); setIsCityDropdownOpen(false); }
    };
    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  const wards = MUMBAI_WARDS;
  const currentCity = getCity(selectedCity);
  const currentWardLabel = wards.find(w => w.id === selectedWard)?.label || wards[0].label;

  return (
    <header className="bg-white dark:bg-zinc-900/95 border-b border-zinc-200 dark:border-zinc-800 shadow-xs sticky top-0 z-30 w-full backdrop-blur-md transition-colors duration-200">
      {/* Centered Container with generous breadth (height) and shifted inward towards center */}
      <div className="max-w-7xl mx-auto px-8 sm:px-12 lg:px-16 py-4.5 sm:py-5.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Brand Identity & Municipal Scope (Clickable to redirect home) */}
        <div
          onClick={onGoHome}
          className="flex items-center space-x-4 cursor-pointer group select-none"
          title="Return to CivicRoute Homepage"
        >
          {/* Prominent, Clearly Visible Logo */}
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden shrink-0 border-2 border-zinc-200/90 dark:border-zinc-700 shadow-md bg-white dark:bg-zinc-800 flex items-center justify-center p-1.5 group-hover:border-blue-400 dark:group-hover:border-blue-500 group-hover:shadow-lg transition">
            <img
              src="/logo.png"
              alt="CivicRoute Logo"
              className="w-full h-full object-contain group-hover:scale-105 transition"
            />
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                CivicRoute
              </span>
              <span className="text-xs text-zinc-300 dark:text-zinc-600">•</span>
              <span className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                Municipal Bureaucracy Path Visualizer
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-[11px] text-zinc-500 dark:text-zinc-400 mt-1">
              {/* City / Municipal Body Selector */}
              <div className="relative inline-block" ref={cityRef} onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
                  className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-brand-50 dark:bg-brand-950/50 hover:bg-brand-100 dark:hover:bg-brand-900/60 text-brand-800 dark:text-brand-300 border border-brand-200 dark:border-brand-800/70 transition"
                >
                  <Building2 className="w-2.5 h-2.5" />
                  <span>{currentCity.body}, {currentCity.label}</span>
                  <ChevronDown className="w-3 h-3" />
                </button>
                {isCityDropdownOpen && (
                  <div className="absolute left-0 mt-1 w-60 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-xl py-1 z-50 animate-in fade-in zoom-in-95">
                    <div className="px-3 py-1.5 text-[10px] font-bold text-zinc-400 uppercase tracking-wider border-b border-zinc-100 dark:border-zinc-700">
                      Select City / Municipal Body
                    </div>
                    {CITIES.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => { onSelectCity && onSelectCity(c.id); setIsCityDropdownOpen(false); }}
                        className={`w-full text-left px-3 py-2 text-xs transition flex items-center justify-between ${
                          selectedCity === c.id
                            ? 'bg-brand-50 dark:bg-brand-950/60 font-semibold text-brand-900 dark:text-brand-300'
                            : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700/60'
                        }`}
                      >
                        <span>{c.body} · {c.label}, {c.state}</span>
                        {c.seeded
                          ? <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold">seeded</span>
                          : <span className="text-[9px] text-brand-500 font-bold">AI</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <span className="text-zinc-300 dark:text-zinc-600">•</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-semibold inline-flex items-center gap-1" title="Links point to official .gov.in portals; each is live-checked in the inspector">
                <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span>official .gov.in portals</span>
              </span>

              {/* Interactive Ward Switcher Dropdown (Mumbai only) */}
              {selectedCity === 'mumbai' && <span className="text-zinc-300 dark:text-zinc-600">•</span>}
              <div className={`relative inline-block ${selectedCity === 'mumbai' ? '' : 'hidden'}`} ref={wardRef} onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => setIsWardDropdownOpen(!isWardDropdownOpen)}
                  className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200/80 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 transition"
                >
                  <MapPin className="w-2.5 h-2.5 text-zinc-500 dark:text-zinc-400" />
                  <span>{currentWardLabel}</span>
                  <ChevronDown className="w-3 h-3 text-zinc-500 dark:text-zinc-400" />
                </button>

                {isWardDropdownOpen && (
                  <div className="absolute left-0 mt-1 w-64 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-xl py-1 z-50 animate-in fade-in zoom-in-95">
                    <div className="px-3 py-1.5 text-[10px] font-bold text-zinc-400 uppercase tracking-wider border-b border-zinc-100 dark:border-zinc-700">
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
                            ? 'bg-blue-50 dark:bg-blue-950/60 font-semibold text-blue-900 dark:text-blue-300'
                            : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700/60'
                        }`}
                      >
                        <span>{w.label}</span>
                        {selectedWard === w.id && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
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
          {/* Light / Dark Mode Toggle Button (Positioned left of Citizen Action Docket) */}
          <button
            onClick={onToggleTheme}
            className="inline-flex items-center space-x-1.5 px-3 py-2 sm:py-2.5 rounded-xl text-xs font-semibold bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700/80 shadow-xs transition select-none group"
            title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle color theme"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform duration-200" />
                <span className="hidden sm:inline font-medium">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-zinc-600 group-hover:-rotate-12 transition-transform duration-200" />
                <span className="hidden sm:inline font-medium">Dark</span>
              </>
            )}
          </button>

          {/* Share Pathway Button */}
          {onShare && (
            <button
              onClick={onShare}
              disabled={!canExport}
              className="inline-flex items-center space-x-1.5 px-3 py-2 sm:py-2.5 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-200 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700/80 border border-zinc-300 dark:border-zinc-700 shadow-xs transition disabled:opacity-40 disabled:cursor-not-allowed"
              title="Copy a shareable link that restores this pathway and your progress"
            >
              <Share2 className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
              <span className="hidden sm:inline">Share</span>
            </button>
          )}

          {/* Citizen Docket Export: Print + PDF */}
          <div className="inline-flex rounded-xl border border-zinc-300 dark:border-zinc-700 overflow-hidden shadow-xs">
            <button
              onClick={onExportDocket}
              className="inline-flex items-center space-x-1.5 px-3 py-2 sm:py-2.5 text-xs font-semibold text-zinc-700 dark:text-zinc-200 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700/80 transition"
              title="Print high-contrast compliance docket for in-person municipal ward counters"
            >
              <Printer className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
              <span className="hidden sm:inline">Docket</span>
            </button>
            {onExportPdf && (
              <button
                onClick={onExportPdf}
                className="inline-flex items-center space-x-1.5 px-3 py-2 sm:py-2.5 text-xs font-semibold text-zinc-700 dark:text-zinc-200 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700/80 border-l border-zinc-300 dark:border-zinc-700 transition"
                title="Download the compliance docket as a PDF file"
              >
                <FileDown className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
                <span className="hidden sm:inline">PDF</span>
              </button>
            )}
          </div>

          {/* Steward & Admin Portal Button */}
          <button
            onClick={onOpenAdmin}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 sm:py-2.5 rounded-xl text-xs font-semibold text-white bg-zinc-900 dark:bg-zinc-800 hover:bg-zinc-800 dark:hover:bg-zinc-700 border border-transparent dark:border-zinc-700 shadow-xs transition"
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
