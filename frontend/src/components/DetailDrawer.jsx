import React from 'react';
import { X, Check, FileCheck, ShieldCheck, ExternalLink } from 'lucide-react';

export default function DetailDrawer({ node, isOpen, onClose, onToggleStatus }) {
  if (!isOpen || !node) return null;

  const isCompleted = node.status === 'completed';
  const isAvailable = node.status === 'available';
  const isLocked = node.status === 'locked';

  let cardClasses = 'p-3.5 rounded-xl border border-slate-700 bg-[#0d162b] flex items-center justify-between';
  let cardTitle = 'Status: Blocked';
  let cardDesc = 'Pending parent clearance milestones.';
  let btnText = 'Locked';
  let btnClasses = 'px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 text-slate-500 cursor-not-allowed';

  if (isCompleted) {
    cardClasses = 'p-3.5 rounded-xl border border-emerald-500/30 bg-[#0c1a2f] flex items-center justify-between';
    cardTitle = 'Status: Completed & Verified';
    cardDesc = 'Prerequisite certified and unlocked.';
    btnText = 'Mark Incomplete';
    btnClasses = 'px-3 py-1.5 rounded-lg text-xs font-bold bg-[#142646] hover:bg-[#1a325c] text-emerald-300 border border-emerald-500/30 transition';
  } else if (isAvailable) {
    cardClasses = 'p-3.5 rounded-xl border border-blue-500/30 bg-[#121f3d] flex items-center justify-between';
    cardTitle = 'Status: Available';
    cardDesc = 'All prerequisites satisfied. Ready to apply.';
    btnText = 'Mark Complete';
    btnClasses = 'px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition';
  }

  return (
    <aside className="w-[420px] bg-[#0c1426] border-l border-[#1b2640] shadow-2xl flex flex-col absolute right-0 top-0 bottom-0 z-30 animate-slide-in-right">
      <div className="p-5 border-b border-[#1b2640] flex items-center justify-between bg-[#0e182e]">
        <div>
          <span className="font-mono-code text-[10px] uppercase font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
            PREREQUISITE NODE {node.code}
          </span>
          <h4 className="text-sm font-bold text-white mt-1.5 leading-snug">{node.title}</h4>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-[#192648] transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
        {/* Completion Toggle Status Card */}
        <div className={cardClasses}>
          <div>
            <div className="font-bold text-xs text-white">{cardTitle}</div>
            <div className="text-[11px] text-[#94a3b8] mt-0.5">{cardDesc}</div>
          </div>
          <button
            onClick={() => onToggleStatus(node.id)}
            disabled={isLocked}
            className={btnClasses}
          >
            {btnText}
          </button>
        </div>

        {/* Meta Specification Tiles */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="p-3 bg-[#111a30] rounded-xl border border-[#1b2640]">
            <span className="text-[#64748b] block text-[10px] font-bold uppercase tracking-wider">
              Department
            </span>
            <span className="font-semibold text-slate-200 mt-1 block truncate">
              {node.dept}
            </span>
          </div>

          <div className="p-3 bg-[#111a30] rounded-xl border border-[#1b2640]">
            <span className="text-[#64748b] block text-[10px] font-bold uppercase tracking-wider">
              Statutory Fee
            </span>
            <span className="font-mono-code font-bold text-slate-200 mt-1 block">
              {node.fee}
            </span>
          </div>

          <div className="p-3 bg-[#111a30] rounded-xl border border-[#1b2640]">
            <span className="text-[#64748b] block text-[10px] font-bold uppercase tracking-wider">
              SLA Duration
            </span>
            <span className="font-semibold text-slate-200 mt-1 block">
              {node.time}
            </span>
          </div>

          <div className="p-3 bg-[#111a30] rounded-xl border border-[#1b2640]">
            <span className="text-[#64748b] block text-[10px] font-bold uppercase tracking-wider">
              Submission Mode
            </span>
            <span className="font-semibold text-slate-200 mt-1 block">
              {node.type}
            </span>
          </div>
        </div>

        {/* Required Proofs */}
        <div className="pt-2">
          <h5 className="font-bold text-slate-200 mb-2 flex items-center space-x-1.5">
            <FileCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>Required Documents &amp; Enclosures</span>
          </h5>
          <div className="bg-[#111a30] border border-[#1b2640] rounded-xl p-3">
            <ul className="space-y-2">
              {node.docs &&
                node.docs.map((doc, idx) => (
                  <li key={idx} className="flex items-center space-x-2 text-slate-300 text-xs">
                    <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span>{doc}</span>
                  </li>
                ))}
            </ul>
          </div>
        </div>

        {/* Verified Official Government Source */}
        <div className="pt-2">
          <h5 className="font-bold text-slate-200 mb-2 flex items-center space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Verified Official Portal</span>
          </h5>
          <div className="p-3.5 bg-emerald-950/20 border border-emerald-500/30 rounded-xl">
            <p className="text-[11px] text-emerald-300 mb-2 leading-relaxed">
              Crawled from State Digital Gateway &amp; Municipal Gazette. Direct application link:
            </p>
            <a
              href={node.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 hover:underline"
            >
              <span className="truncate max-w-[260px] font-mono-code text-[11px]">
                {node.url}
              </span>
              <ExternalLink className="w-3.5 h-3.5 shrink-0" />
            </a>
          </div>
        </div>
      </div>
    </aside>
  );
}
