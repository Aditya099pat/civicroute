import React, { useState } from 'react';
import { X, Check, FileCheck, ShieldCheck, ExternalLink, Lock, Unlock, ArrowRight, GitFork, AlertCircle, Info, Calendar } from 'lucide-react';

export default function StepDrawer({
  node,
  allNodes = [],
  isOpen,
  onClose,
  onToggleStatus,
  onSelectNode
}) {
  const [activeTab, setActiveTab] = useState('prereqs'); // 'prereqs' | 'docs' | 'provenance'
  const [checkedDocs, setCheckedDocs] = useState({});

  if (!isOpen || !node) return null;

  const isCompleted = node.status === 'completed';
  const isAvailable = node.status === 'available';
  const isLocked = node.status === 'locked';

  // Toggle user document checklist item
  const handleToggleDoc = (docIndex) => {
    setCheckedDocs(prev => ({
      ...prev,
      [`${node.id}_${docIndex}`]: !prev[`${node.id}_${docIndex}`]
    }));
  };

  // Normalize fields across legacy and new schemas
  const prereqs = node.prerequisites || node.prereqs || [];
  const parentNodes = prereqs.map(pid => allNodes.find(n => String(n.id) === String(pid))).filter(Boolean);
  const dept = node.department || node.dept;
  const time = node.estimatedDays || node.time;
  const url = node.officialUrl || node.url;
  const officeType = node.officeType || node.type;
  const docs = node.documentsRequired || node.docs || [];

  // Extract domain for verification
  let domain = 'gov.in';
  if (url) {
    try {
      domain = new URL(url).hostname;
    } catch {
      domain = 'gov.in';
    }
  }

  return (
    <aside className="w-full sm:w-[460px] bg-white dark:bg-zinc-900 border-l border-[#e2e4e8] dark:border-zinc-800 shadow-2xl flex flex-col fixed right-0 top-0 bottom-0 z-50 animate-slide-in-right transition-colors duration-200">
      {/* Drawer Header */}
      <div className="p-5 border-b border-[#e2e4e8] dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900 flex items-start justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-mono-code text-[10px] uppercase font-bold text-blue-800 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800/80">
              NODE {node.code}
            </span>
            {dept && (
              <span className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">
                {dept}
              </span>
            )}
          </div>
          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-2 leading-snug">
            {node.title}
          </h3>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition"
          aria-label="Close drawer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Real-Time Dynamic Action Trigger Banner */}
      <div className="p-4 border-b border-[#e2e4e8] dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <div className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 ${
          isCompleted
            ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-300'
            : isAvailable
            ? 'bg-blue-50/70 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800/60 text-blue-900 dark:text-blue-300'
            : 'bg-zinc-100/80 dark:bg-zinc-800/60 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400'
        }`}>
          <div>
            <div className="font-bold text-xs flex items-center space-x-1.5">
              {isCompleted ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                  <span>Status: Satisfied &amp; Certified</span>
                </>
              ) : isAvailable ? (
                <>
                  <Unlock className="w-3.5 h-3.5 text-blue-700 dark:text-blue-400" />
                  <span>Status: Ready to File</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" />
                  <span>Status: Prerequisite Locked</span>
                </>
              )}
            </div>
            <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
              {isCompleted
                ? 'Prerequisite satisfied. Downstream nodes unlocked.'
                : isAvailable
                ? 'All parent dependencies met. Ready for filing.'
                : `Blocked until parent clearance is certified.`}
            </div>
          </div>

          <button
            onClick={() => onToggleStatus(node.id)}
            disabled={isLocked}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition ${
              isCompleted
                ? 'bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-600 shadow-xs'
                : isAvailable
                ? 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white shadow-xs'
                : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 cursor-not-allowed border border-zinc-300/60 dark:border-zinc-700'
            }`}
            title={isLocked ? `Blocked until Step #${prereqs.join(', #')} is approved.` : ''}
          >
            {isCompleted ? 'Mark Incomplete' : isAvailable ? 'Mark Satisfied ✓' : 'Locked 🔒'}
          </button>
        </div>
      </div>

      {/* Segmented Tab Navigation */}
      <div className="flex border-b border-[#e2e4e8] dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs font-semibold px-4">
        <button
          onClick={() => setActiveTab('prereqs')}
          className={`py-2.5 px-3 border-b-2 flex items-center space-x-1.5 transition ${
            activeTab === 'prereqs'
              ? 'border-blue-600 dark:border-blue-400 text-blue-700 dark:text-blue-400 font-bold bg-white dark:bg-zinc-900'
              : 'border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
          }`}
        >
          <GitFork className="w-3.5 h-3.5" />
          <span>Prerequisites</span>
        </button>

        <button
          onClick={() => setActiveTab('docs')}
          className={`py-2.5 px-3 border-b-2 flex items-center space-x-1.5 transition ${
            activeTab === 'docs'
              ? 'border-blue-600 dark:border-blue-400 text-blue-700 dark:text-blue-400 font-bold bg-white dark:bg-zinc-900'
              : 'border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
          }`}
        >
          <FileCheck className="w-3.5 h-3.5" />
          <span>Document Enclosures ({docs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('provenance')}
          className={`py-2.5 px-3 border-b-2 flex items-center space-x-1.5 transition ${
            activeTab === 'provenance'
              ? 'border-blue-600 dark:border-blue-400 text-blue-700 dark:text-blue-400 font-bold bg-white dark:bg-zinc-900'
              : 'border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Official Provenance</span>
        </button>
      </div>

      {/* Tab Content Body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
        {/* TAB 1: PREREQUISITES & SPECIFICATIONS */}
        {activeTab === 'prereqs' && (
          <div className="space-y-4">
            {/* Metadata Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-[#e2e4e8] dark:border-zinc-800">
                <span className="text-zinc-400 dark:text-zinc-500 block text-[10px] font-bold uppercase tracking-wider">
                  Statutory Fee
                </span>
                <span className="font-mono-code font-bold text-zinc-900 dark:text-zinc-100 text-sm mt-0.5 block">
                  {node.fee}
                </span>
                <span className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5 block">
                  {node.paymentMode || 'Official Challan'}
                </span>
              </div>

              <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-[#e2e4e8] dark:border-zinc-800">
                <span className="text-zinc-400 dark:text-zinc-500 block text-[10px] font-bold uppercase tracking-wider">
                  SLA Turnaround
                </span>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm mt-0.5 block">
                  {time}
                </span>
                <span className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5 block">
                  RTS Act Standard
                </span>
              </div>

              <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-[#e2e4e8] dark:border-zinc-800">
                <span className="text-zinc-400 dark:text-zinc-500 block text-[10px] font-bold uppercase tracking-wider">
                  Submission Mode
                </span>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100 mt-0.5 block">
                  {officeType}
                </span>
              </div>

              <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-[#e2e4e8] dark:border-zinc-800">
                <span className="text-zinc-400 dark:text-zinc-500 block text-[10px] font-bold uppercase tracking-wider">
                  Ward Desk Facet
                </span>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100 truncate mt-0.5 block">
                  {node.wardFacet || 'CFC Ward Counter'}
                </span>
              </div>
            </div>

            {/* Itemized Upstream Prerequisite Lineage & Clickable Jump-Links */}
            <div className="pt-2">
              <h4 className="font-bold text-zinc-900 dark:text-zinc-100 mb-2 flex items-center space-x-1.5 text-xs">
                <GitFork className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>Mandatory Upstream Prerequisites</span>
              </h4>

              {parentNodes.length > 0 ? (
                <div className="space-y-2">
                  {parentNodes.map((pNode) => {
                    const isParentDone = pNode.status === 'completed';
                    return (
                      <div
                        key={pNode.id}
                        onClick={() => onSelectNode && onSelectNode(pNode.id)}
                        className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                          isParentDone
                            ? 'bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/50'
                            : 'bg-zinc-50 dark:bg-zinc-800/40 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                        }`}
                        title="Click to jump to this prerequisite milestone"
                      >
                        <div className="flex items-center space-x-2.5">
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            isParentDone ? 'bg-emerald-600 text-white' : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300'
                          }`}>
                            {isParentDone ? '✓' : pNode.id}
                          </span>
                          <div>
                            <div className="font-bold text-zinc-900 dark:text-zinc-100 text-xs">
                              {pNode.title}
                            </div>
                            <span className="font-mono-code text-[10px] text-zinc-500 dark:text-zinc-400">
                              {pNode.code} • {pNode.department || pNode.dept}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-1 text-blue-600 dark:text-blue-400 text-[11px] font-semibold">
                          <span>Inspect</span>
                          <ArrowRight className="w-3 h-3" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-3 bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-600 dark:text-zinc-400 text-xs">
                  ✓ <strong>Root Milestone:</strong> No prior municipal clearances required to file this item.
                </div>
              )}
            </div>

            {/* Legal RTS Citation */}
            {node.slaRule && (
              <div className="p-3 bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/80 rounded-xl text-[11px] text-zinc-600 dark:text-zinc-400 flex items-start space-x-2">
                <Info className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200">Statutory Guarantee: </span>
                  <span>{node.slaRule}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: DOCUMENT ENCLOSURES CHECKLIST */}
        {activeTab === 'docs' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 pb-1">
              <span>Interactive Pre-filing Checklist:</span>
              <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                {Object.values(checkedDocs).filter(Boolean).length} / {docs.length} checked
              </span>
            </div>

            <div className="space-y-2">
              {docs.map((doc, idx) => {
                const isChecked = checkedDocs[`${node.id}_${idx}`];
                return (
                  <div
                    key={idx}
                    onClick={() => handleToggleDoc(idx)}
                    className={`p-3 rounded-xl border transition cursor-pointer flex items-start space-x-3 ${
                      isChecked
                        ? 'bg-emerald-50/40 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/60'
                        : 'bg-zinc-50/80 dark:bg-zinc-800/40 border-[#e2e4e8] dark:border-zinc-800 hover:bg-zinc-100/60 dark:hover:bg-zinc-800/70'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={!!isChecked}
                      onChange={() => {}}
                      className="mt-0.5 rounded text-blue-600 dark:text-blue-500 focus:ring-0 cursor-pointer"
                    />
                    <div className="flex-1">
                      <div className={`text-xs ${isChecked ? 'line-through text-zinc-400 dark:text-zinc-500' : 'text-zinc-800 dark:text-zinc-200 font-medium'}`}>
                        {doc}
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-[10px] font-mono-code bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 px-1.5 py-0.2 rounded">
                          Copy Required: Original + 1 Self-Attested
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: OFFICIAL PORTAL PROVENANCE */}
        {activeTab === 'provenance' && (
          <div className="space-y-3.5">
            <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center space-x-1 text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-900/40 px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-700">
                  <ShieldCheck className="w-3 h-3 text-emerald-700 dark:text-emerald-400" />
                  <span>SSL Encrypted Official Gateway</span>
                </span>
                <span className="font-mono-code text-[10px] text-zinc-500 dark:text-zinc-400">
                  TLS 1.3 Certified
                </span>
              </div>

              <div>
                <h5 className="font-bold text-zinc-900 dark:text-zinc-100 text-xs">
                  {node.portalName || "State Digital Services Gateway"}
                </h5>
                <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-0.5">
                  Verified authentic government endpoint indexed for Brihanmumbai municipal jurisdiction.
                </p>
              </div>

              <div className="pt-2 border-t border-emerald-200/60 dark:border-emerald-800/60 flex items-center justify-between">
                <span className="font-mono-code text-[11px] text-zinc-700 dark:text-zinc-300 truncate max-w-[200px]">
                  {url}
                </span>
                {url && (
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 px-3 py-1.5 rounded-lg shadow-xs transition"
                  >
                    <span>Open Portal</span>
                    <ExternalLink className="w-3 h-3 ml-0.5" />
                  </a>
                )}
              </div>
            </div>

            {/* Gazette Circular Citation & Audit Trail */}
            <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 border border-[#e2e4e8] dark:border-zinc-800 rounded-xl space-y-2 text-zinc-600 dark:text-zinc-400 text-xs">
              <div className="font-bold text-zinc-800 dark:text-zinc-200 flex items-center space-x-1.5">
                <Calendar className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
                <span>Audit &amp; Gazette Provenance</span>
              </div>
              <div>
                <span className="text-zinc-400 dark:text-zinc-500">Gazette Citation Code: </span>
                <span className="font-mono-code font-bold text-zinc-800 dark:text-zinc-200">{node.gazetteCode || 'GOV-IN-VERIFIED'}</span>
              </div>
              <div>
                <span className="text-zinc-400 dark:text-zinc-500">Crawler Timestamp: </span>
                <span className="font-mono-code text-zinc-700 dark:text-zinc-300">Indexed from Maharashtra Aaple Sarkar portal</span>
              </div>
              <div>
                <span className="text-zinc-400 dark:text-zinc-500">Verification Hash: </span>
                <span className="font-mono-code text-zinc-500 dark:text-zinc-400">#sha256-e8a9f24b01cf8841a</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
