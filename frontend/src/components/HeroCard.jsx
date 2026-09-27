import React from 'react';
import { MapPin, AlertTriangle } from 'lucide-react';

export default function HeroCard({ pipeline, readinessScore }) {
  if (!pipeline) return null;

  return (
    <div className="bg-[#0d172a] border border-[#1a2846] rounded-2xl p-6 shadow-xl relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          {/* Avatar / Icon Initials Circle */}
          <div className="w-14 h-14 rounded-full bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-400 font-bold text-lg shadow-inner">
            {pipeline.shortCode || 'CR'}
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono-code text-[10px] font-bold text-slate-400 bg-[#14203d] px-2 py-0.5 rounded border border-[#22355e]">
                ID {pipeline.id}
              </span>
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-white mt-1">
              {pipeline.title}
            </h2>

            <div className="flex items-center space-x-2.5 text-xs text-[#94a3b8] mt-1.5">
              <span className="flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{pipeline.jurisdiction}</span>
              </span>
              <span>•</span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                {pipeline.tier}
              </span>
            </div>
          </div>
        </div>

        {/* Total Statutory Cost Box */}
        <div className="bg-[#111f3d] border border-[#1e3360] rounded-xl px-6 py-3.5 text-right shadow-inner">
          <span className="text-[10px] font-bold tracking-wider uppercase text-blue-400 block">
            Total Statutory Fees
          </span>
          <span className="font-mono-code text-2xl font-bold text-white tracking-tight mt-0.5 block">
            {pipeline.totalFee}
          </span>
        </div>
      </div>

      {/* METRIC TILES ROW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mt-6">
        <div className="bg-[#121e38] border border-[#1e2f54] rounded-xl p-3.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748b] block">
            PRIMARY MUNICIPAL DESK
          </span>
          <span className="text-sm font-semibold text-white mt-1 block">
            {pipeline.primaryDept}
          </span>
        </div>

        <div className="bg-[#121e38] border border-[#1e2f54] rounded-xl p-3.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748b] block">
            ESTIMATED CYCLE TIME
          </span>
          <span className="text-sm font-semibold text-white mt-1 block">
            {pipeline.cycleTime}
          </span>
        </div>

        <div className="bg-[#121e38] border border-[#1e2f54] rounded-xl p-3.5 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748b] block">
              READINESS CONFIDENCE
            </span>
            <span className="text-xs text-[#94a3b8] mt-0.5 block">
              Prerequisite compliance
            </span>
          </div>

          <div className="w-10 h-10 rounded-full border-2 border-emerald-400 flex items-center justify-center font-bold text-xs text-emerald-400 bg-emerald-950/30">
            {readinessScore}%
          </div>
        </div>
      </div>

      {/* PREREQUISITE CONFLICT / BLOCKER ALERT BANNER */}
      {pipeline.conflictText && (
        <div className="mt-4 p-3 bg-amber-950/20 border border-amber-500/30 rounded-xl flex items-center space-x-2.5 text-xs text-amber-200">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <div>
            <strong className="font-bold text-amber-300">Prerequisite Dependency: </strong>
            <span>{pipeline.conflictText}</span>
          </div>
        </div>
      )}
    </div>
  );
}
