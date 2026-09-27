import React from 'react';
import { Compass, Sun, Printer, Lock } from 'lucide-react';

export default function Header({ onExportDocket, onOpenAdmin }) {
  return (
    <header className="bg-[#0b1325] border-b border-[#1b2640] px-6 py-3 flex items-center justify-between shrink-0">
      <div className="flex items-center space-x-3.5">
        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
          <Compass className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-base font-bold tracking-tight text-white">
              CivicRoute &amp; Bureaucracy Engine
            </h1>
            <span className="text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded">
              PSWB02
            </span>
          </div>
          <p className="text-xs text-[#94a3b8]">
            Resolve civic fragmentation, generate prerequisite roadmaps, and audit municipal workflows.
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <button
          className="text-[#64748b] hover:text-white p-2 rounded-lg transition"
          title="Toggle Light/Dark"
        >
          <Sun className="w-4 h-4 text-amber-400" />
        </button>

        <button
          onClick={onExportDocket}
          className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-[#131d36] hover:bg-[#1a284a] rounded-lg border border-[#223359] transition"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Export Docket</span>
        </button>

        <button
          onClick={onOpenAdmin}
          className="flex items-center space-x-2 px-3.5 py-1.5 text-xs font-semibold text-sky-400 bg-sky-950/40 hover:bg-sky-900/40 border border-sky-500/30 rounded-lg shadow-sm transition"
        >
          <Lock className="w-3.5 h-3.5 text-sky-400" />
          <span>Steward &amp; Admin Portal</span>
        </button>
      </div>
    </header>
  );
}
