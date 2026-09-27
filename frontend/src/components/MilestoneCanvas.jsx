import React from 'react';
import { Lock, Unlock, Check, ArrowRight, ShieldCheck, ExternalLink, FileText, CheckCircle2, ChevronRight, Layers, List, GitFork } from 'lucide-react';

export default function MilestoneCanvas({
  pipeline,
  nodes = [],
  selectedNodeId,
  onSelectNode,
  onToggleNode,
  onExportDocket
}) {
  if (!pipeline) return null;

  // Extract all pending documents across available and locked nodes
  const pendingDocs = nodes
    .filter(n => n.status !== 'completed')
    .flatMap(n => n.docs || [])
    .slice(0, 4);

  return (
    <div className="bg-white border border-[#e2e4e8] rounded-2xl shadow-xs overflow-hidden max-w-7xl mx-auto w-full">
      {/* Container Header */}
      <div className="px-6 py-4 border-b border-[#e2e4e8] flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-bold text-zinc-800">Generated Path:</span>
          <span className="text-sm font-extrabold text-zinc-950">{pipeline.title}</span>
        </div>

        <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full shrink-0">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Verified Official Source</span>
        </div>
      </div>

      {/* Main Grid: Horizontal Pipeline Canvas + Right Summary Panel */}
      <div className="grid grid-cols-1 xl:grid-cols-4 p-6 gap-6 items-start">
        {/* LEFT 3 COLS: Horizontal Milestone Pipeline */}
        <div className="xl:col-span-3 overflow-x-auto pb-4 pt-1">
          <div className="flex items-stretch space-x-3 min-w-max">
            {nodes.map((node, index) => {
              const isSelected = selectedNodeId === node.id;
              const hasNext = index < nodes.length - 1;
              const isCompleted = node.status === 'completed';
              const isAvailable = node.status === 'available';
              const isLocked = node.status === 'locked';

              // Domain extraction
              let domain = 'gov.in';
              try {
                domain = new URL(node.url).hostname;
              } catch {
                domain = 'gov.in';
              }

              // Card styling exactly matching reference image
              let cardClasses = 'border-[#e2e4e8] bg-zinc-50/70 hover:bg-zinc-100/70';
              let badgeClasses = 'bg-zinc-200 text-zinc-700';
              let badgeText = `${index + 1}. Blocked`;

              if (isCompleted) {
                cardClasses = 'border-emerald-400 bg-emerald-50/20 hover:bg-emerald-50/40';
                badgeClasses = 'bg-emerald-100 text-emerald-800 border border-emerald-200';
                badgeText = `${index + 1}. Complete`;
              } else if (isAvailable) {
                cardClasses = 'border-blue-500 bg-blue-50/20 hover:bg-blue-50/40 ring-1 ring-blue-500/30';
                badgeClasses = 'bg-blue-100 text-blue-800 border border-blue-200';
                badgeText = `${index + 1}. Ready`;
              }

              return (
                <React.Fragment key={node.id}>
                  {/* Individual Milestone Card */}
                  <div
                    onClick={() => onSelectNode(node.id)}
                    className={`w-52 sm:w-56 p-4 rounded-xl border flex flex-col justify-between transition-all cursor-pointer shadow-xs ${cardClasses} ${
                      isSelected ? 'ring-2 ring-blue-600 scale-[1.02] shadow-sm' : ''
                    }`}
                  >
                    <div>
                      {/* Top Status Pill */}
                      <div className="flex items-center justify-between mb-2.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeClasses}`}>
                          {badgeText}
                        </span>
                        <span className="font-mono-code text-[10px] text-zinc-400">
                          {node.code}
                        </span>
                      </div>

                      {/* Title */}
                      <h4 className="text-xs font-bold text-zinc-900 leading-snug line-clamp-2">
                        {index + 1}. {node.title.replace(/\([^)]*\)/g, '').trim()}
                      </h4>

                      {/* Node Metadata Specs */}
                      <div className="mt-2.5 space-y-1 text-[11px] text-zinc-600">
                        {node.dept && (
                          <div className="truncate">
                            <span className="text-zinc-400">Dept:</span> {node.dept}
                          </div>
                        )}
                        {node.fee && node.fee !== '₹0' && (
                          <div>
                            <span className="text-zinc-400">Fee:</span>{' '}
                            <span className="font-mono-code font-semibold text-zinc-800">{node.fee}</span>
                          </div>
                        )}
                        {node.time && (
                          <div>
                            <span className="text-zinc-400">SLA:</span> {node.time}
                          </div>
                        )}
                        {node.url && (
                          <div className="truncate">
                            <span className="text-zinc-400">Source:</span>{' '}
                            <a
                              href={node.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="text-blue-600 hover:underline font-mono-code text-[10px]"
                            >
                              {domain}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Bottom Status / Action */}
                    <div className="mt-4 pt-2.5 border-t border-zinc-200/70">
                      {isCompleted ? (
                        <div className="text-[11px] font-bold text-emerald-700 flex items-center space-x-1">
                          <span>Status: Completed</span>
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      ) : isAvailable ? (
                        <div className="space-y-2">
                          <div className="text-[11px] font-bold text-blue-700">
                            Status: Ready to File
                          </div>
                          <a
                            href={node.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="w-full py-1.5 px-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[11px] rounded-lg shadow-xs flex items-center justify-center space-x-1 transition"
                          >
                            <span>Open Official Portal</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      ) : (
                        <div className="text-[11px] text-zinc-500 font-medium">
                          <div className="flex items-center space-x-1">
                            <span>Status: Locked</span>
                            <Lock className="w-3 h-3 text-zinc-400" />
                          </div>
                          {node.prereqs && node.prereqs.length > 0 && (
                            <span className="text-[10px] text-zinc-400 font-mono-code">
                              (Requires: #{node.prereqs.join(', #')})
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Directional Connector Arrow */}
                  {hasNext && (
                    <div className="flex items-center text-zinc-400 font-bold text-lg select-none px-0.5">
                      →
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* RIGHT 1 COL: Path Summary & Missing Documents Checklist */}
        <div className="xl:border-l xl:border-[#e2e4e8] xl:pl-6 space-y-5 pt-2">
          {/* Path Summary */}
          <div>
            <h4 className="text-sm font-bold text-zinc-900 border-b border-zinc-100 pb-2">
              Path Summary
            </h4>
            <div className="mt-2.5 space-y-1.5 text-xs text-zinc-600">
              <div className="flex justify-between">
                <span>Total Statutory Fees:</span>
                <span className="font-mono-code font-bold text-zinc-900">{pipeline.totalFee}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Time:</span>
                <span className="font-semibold text-zinc-900">{pipeline.cycleTime}</span>
              </div>
              <div className="flex justify-between">
                <span>Pipeline Milestones:</span>
                <span className="font-semibold text-zinc-900">{nodes.length} Steps</span>
              </div>
              <div className="flex justify-between">
                <span>Readiness Score:</span>
                <span className="font-semibold text-emerald-700">
                  {Math.round((nodes.filter(n => n.status === 'completed').length / nodes.length) * 100)}%
                </span>
              </div>
            </div>
          </div>

          {/* Missing Documents Checklist */}
          <div>
            <h4 className="text-sm font-bold text-zinc-900 border-b border-zinc-100 pb-2">
              Missing Documents Checklist
            </h4>
            <ul className="mt-2.5 space-y-2 text-xs text-zinc-600">
              {pendingDocs.length > 0 ? (
                pendingDocs.map((doc, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="w-3.5 h-3.5 rounded border border-zinc-300 mt-0.5 shrink-0" />
                    <span className="text-[11px] leading-snug">{doc}</span>
                  </li>
                ))
              ) : (
                <li className="text-[11px] text-emerald-700 font-medium">
                  ✓ All milestone document enclosures ready!
                </li>
              )}
            </ul>
          </div>

          {/* Download Action Docket Button */}
          <div className="pt-2">
            <button
              onClick={onExportDocket}
              className="w-full py-2.5 px-3 bg-white hover:bg-zinc-50 border border-zinc-300 text-zinc-800 font-semibold text-xs rounded-xl shadow-xs transition flex items-center justify-center space-x-1.5"
            >
              <FileText className="w-3.5 h-3.5 text-zinc-500" />
              <span>Download Print-Ready Action Docket</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
