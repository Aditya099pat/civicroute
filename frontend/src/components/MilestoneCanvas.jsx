import React, { useState } from 'react';
import { Lock, ShieldCheck, ExternalLink, FileText, CheckCircle2, ChevronRight, FileCheck, Building2, Check } from 'lucide-react';

export default function MilestoneCanvas({
  pipeline,
  nodes = [],
  selectedNodeId,
  onSelectNode,
  onToggleNode,
  onExportDocket
}) {
  const [checkedEnclosures, setCheckedEnclosures] = useState({});

  if (!pipeline) return null;

  const toggleEnclosure = (key) => {
    setCheckedEnclosures(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Extract pipeline-specific documents
  const pipelineDocs = nodes
    .flatMap(n => n.documentsRequired || n.docs || [])
    .filter((doc, idx, arr) => arr.indexOf(doc) === idx)
    .slice(0, 3);

  // Standard mandatory physical compliance enclosures for municipal submission
  const standardEnclosures = [
    {
      id: 'affidavit',
      title: '₹100 Non-Judicial Stamp Paper Self-Declaration & Indemnity',
      desc: 'Notarized affidavit on standard municipal format (Annexure-A)',
      requiredOriginal: true
    },
    {
      id: 'zero_dues',
      title: 'Latest Property Tax & Water Charges Zero-Dues Clearance Receipt',
      desc: 'Official MCGM receipt showing zero arrears for current fiscal year',
      requiredOriginal: false
    },
    {
      id: 'society_noc',
      title: 'Registered Society (CHS) NOC & Share Certificate Copy',
      desc: 'Managing Committee resolution or developer title consent',
      requiredOriginal: false
    }
  ];

  function RightConnector({ isCompleted }) {
    return (
      <div className="flex items-center justify-center px-1 self-center shrink-0">
        <div className="flex items-center">
          <div className={`h-[2px] w-2 sm:w-3.5 ${isCompleted ? 'bg-emerald-500' : 'bg-zinc-300'}`} />
          <div className={`w-6 h-6 rounded-full border flex items-center justify-center shadow-2xs transition-colors ${
            isCompleted
              ? 'bg-emerald-50 border-emerald-400 text-emerald-700'
              : 'bg-zinc-100 border-zinc-300 text-zinc-600'
          }`}>
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <div className={`h-[2px] w-2 sm:w-3.5 ${isCompleted ? 'bg-emerald-500' : 'bg-zinc-300'}`} />
        </div>
      </div>
    );
  }

  function DownConnector({ isCompleted, label = "Next Clearance Tier" }) {
    return (
      <div className="flex flex-col items-center justify-center shrink-0 my-1">
        <div className={`w-[2px] h-2.5 ${isCompleted ? 'bg-emerald-500' : 'bg-zinc-300'}`} />
        <div className={`inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full border text-[10px] font-bold shadow-2xs transition-colors ${
          isCompleted
            ? 'bg-emerald-50 border-emerald-400 text-emerald-800'
            : 'bg-zinc-100 border-zinc-300 text-zinc-700'
        }`}>
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          <span className="tracking-wide">{label}</span>
        </div>
        <div className={`w-[2px] h-2.5 ${isCompleted ? 'bg-emerald-500' : 'bg-zinc-300'}`} />
      </div>
    );
  }

  function LeftConnector({ isCompleted }) {
    return (
      <div className="flex items-center justify-center px-1 self-center shrink-0">
        <div className="flex items-center">
          <div className={`h-[2px] w-2 sm:w-3.5 ${isCompleted ? 'bg-emerald-500' : 'bg-zinc-300'}`} />
          <div className={`w-6 h-6 rounded-full border flex items-center justify-center shadow-2xs transition-colors ${
            isCompleted
              ? 'bg-emerald-50 border-emerald-400 text-emerald-700'
              : 'bg-zinc-100 border-zinc-300 text-zinc-600'
          }`}>
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <div className={`h-[2px] w-2 sm:w-3.5 ${isCompleted ? 'bg-emerald-500' : 'bg-zinc-300'}`} />
        </div>
      </div>
    );
  }

  const renderMilestoneCard = (node, index) => {
    if (!node) return null;
    const isSelected = selectedNodeId === node.id;
    const isCompleted = node.status === 'completed';
    const isAvailable = node.status === 'available';

    const dept = node.department || node.dept;
    const time = node.estimatedDays || node.time;
    const url = node.officialUrl || node.url;
    const prereqs = node.prerequisites || node.prereqs || [];

    let domain = 'gov.in';
    if (url) {
      try {
        domain = new URL(url).hostname;
      } catch {
        domain = 'gov.in';
      }
    }

    let cardClasses = 'border-zinc-200 bg-zinc-50/70 hover:bg-zinc-100/70';
    if (isCompleted) {
      cardClasses = 'border-emerald-300 bg-emerald-50/20 hover:bg-emerald-50/40';
    } else if (isAvailable) {
      cardClasses = 'border-blue-400 bg-blue-50/20 hover:bg-blue-50/40 ring-1 ring-blue-500/20';
    }

    return (
      <div
        onClick={() => onSelectNode(node.id)}
        className={`w-full p-4 rounded-xl border flex flex-col justify-between transition-all cursor-pointer shadow-xs ${cardClasses} ${
          isSelected ? 'ring-2 ring-blue-600 scale-[1.01] shadow-sm' : ''
        }`}
      >
        <div>
          {/* Top Concrete Status Badge */}
          <div className="flex items-center justify-between mb-2.5">
            {isCompleted ? (
              <span className="inline-flex items-center space-x-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                <CheckCircle2 className="w-3 h-3 text-emerald-600 fill-emerald-100" />
                <span>{index + 1}. Satisfied</span>
              </span>
            ) : isAvailable ? (
              <span className="inline-flex items-center space-x-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-600"></span>
                </span>
                <span>{index + 1}. Ready to File</span>
              </span>
            ) : (
              <span className="inline-flex items-center space-x-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600 border border-zinc-200">
                <Lock className="w-2.5 h-2.5 text-zinc-400" />
                <span>{index + 1}. Locked</span>
              </span>
            )}

            <span className="font-mono-code text-[10px] text-zinc-400 bg-white px-1.5 py-0.5 rounded border border-zinc-200">
              {node.code}
            </span>
          </div>

          {/* Title */}
          <h4 className="min-h-[38px] text-xs font-bold text-zinc-900 leading-snug break-words">
            {index + 1}. {node.title.replace(/\([^)]*\)/g, '').trim()}
          </h4>

          {/* Node Metadata Specs */}
          <div className="mt-2.5 space-y-1 text-[11px] text-zinc-600">
            {dept && (
              <div className="break-words leading-tight">
                <span className="text-zinc-400 font-medium">Dept:</span> {dept}
              </div>
            )}
            {node.fee && node.fee !== '₹0' && (
              <div>
                <span className="text-zinc-400 font-medium">Fee:</span>{' '}
                <span className="font-mono-code font-semibold text-zinc-800">{node.fee}</span>
              </div>
            )}
            {time && (
              <div>
                <span className="text-zinc-400 font-medium">SLA:</span> {time}
              </div>
            )}
            {url && (
              <div className="truncate">
                <span className="text-zinc-400 font-medium">Source:</span>{' '}
                <a
                  href={url}
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
        <div className="mt-4 pt-2.5 border-t border-zinc-200/80">
          {isCompleted ? (
            <div className="text-[11px] font-bold text-emerald-700 flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 fill-emerald-100" />
              <span>Satisfied &amp; Certified</span>
            </div>
          ) : isAvailable ? (
            <div className="space-y-2">
              <div className="text-[11px] font-bold text-blue-700 flex items-center space-x-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                </span>
                <span>Ready to File</span>
              </div>
              {url && (
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="w-full py-1.5 px-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[11px] rounded-lg shadow-xs flex items-center justify-center space-x-1 transition"
                >
                  <span>Open Official Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          ) : (
            <div className="text-[11px] text-zinc-500 font-medium">
              <div className="flex items-center space-x-1.5">
                <Lock className="w-3 h-3 text-zinc-400" />
                <span>Locked (Prereqs Pending)</span>
              </div>
              {prereqs.length > 0 && (
                <span className="text-[10px] text-zinc-400 font-mono-code block mt-0.5">
                  Requires: #{prereqs.join(', #')}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white border border-zinc-200 rounded-2xl shadow-xs overflow-hidden max-w-7xl mx-auto w-full p-5 sm:p-6">
      {/* Main Responsive 12-Column Grid: Left 8 Canvas + Right 4 Compliance Desk */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT CANVAS (lg:col-span-8): Topological Milestone Pipeline */}
        <div className="lg:col-span-8 flex flex-col min-w-0">
          {/* Milestone Pipeline Header */}
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-200">
            <div className="flex items-center space-x-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-600">
                Topological Milestone Pipeline
              </h3>
              <span className="text-[11px] font-semibold text-zinc-600 bg-zinc-100 px-2 py-0.5 rounded-full border border-zinc-200">
                {nodes.length} Clearance Stages
              </span>
            </div>
            <div className="flex items-center space-x-2 text-[11px] font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full shrink-0">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Verified Official Source</span>
            </div>
          </div>

          {/* Multi-Row Serpentine Topological Pipeline (Desktop) */}
          <div className="hidden lg:flex flex-col space-y-2.5 w-full">
            {/* If 3 or fewer nodes: single horizontal row */}
            {nodes.length <= 3 && (
              <div className="flex items-stretch gap-3">
                {nodes.map((node, idx) => (
                  <React.Fragment key={node.id}>
                    <div className="flex-1 min-w-0">{renderMilestoneCard(node, idx)}</div>
                    {idx < nodes.length - 1 && (
                      <RightConnector isCompleted={node.status === 'completed'} />
                    )}
                  </React.Fragment>
                ))}
              </div>
            )}

            {/* If 4 nodes: 2 rows of 2 nodes (Serpentine flow 1 -> 2 -> 3 -> 4) */}
            {nodes.length === 4 && (
              <div className="flex flex-col space-y-1">
                {/* Row 1: Node 1 -> Node 2 */}
                <div className="flex items-stretch gap-3">
                  <div className="flex-1 min-w-0">{renderMilestoneCard(nodes[0], 0)}</div>
                  <RightConnector isCompleted={nodes[0].status === 'completed'} />
                  <div className="flex-1 min-w-0">{renderMilestoneCard(nodes[1], 1)}</div>
                </div>

                {/* Turn Connector from Row 1 Node 2 down to Row 2 Node 3 */}
                <div className="grid grid-cols-2 gap-3 w-full py-0.5">
                  <div />
                  <div className="flex justify-center">
                    <DownConnector isCompleted={nodes[1].status === 'completed'} />
                  </div>
                </div>

                {/* Row 2: Node 4 <- Node 3 (serpentine: Node 4 on left, Node 3 on right) */}
                <div className="flex items-stretch gap-3">
                  <div className="flex-1 min-w-0">{renderMilestoneCard(nodes[3], 3)}</div>
                  <LeftConnector isCompleted={nodes[2].status === 'completed'} />
                  <div className="flex-1 min-w-0">{renderMilestoneCard(nodes[2], 2)}</div>
                </div>
              </div>
            )}

            {/* If 5 nodes: Row 1 (3 nodes) -> Down -> Row 2 (2 nodes, filling space) */}
            {nodes.length === 5 && (
              <div className="flex flex-col space-y-1">
                {/* Row 1: Node 1 -> Node 2 -> Node 3 */}
                <div className="flex items-stretch gap-2.5">
                  <div className="flex-1 min-w-0">{renderMilestoneCard(nodes[0], 0)}</div>
                  <RightConnector isCompleted={nodes[0].status === 'completed'} />
                  <div className="flex-1 min-w-0">{renderMilestoneCard(nodes[1], 1)}</div>
                  <RightConnector isCompleted={nodes[1].status === 'completed'} />
                  <div className="flex-1 min-w-0">{renderMilestoneCard(nodes[2], 2)}</div>
                </div>

                {/* Turn Connector from Node 3 down to Node 4 */}
                <div className="flex justify-end pr-14 sm:pr-20 py-0.5">
                  <DownConnector isCompleted={nodes[2].status === 'completed'} />
                </div>

                {/* Row 2: Node 5 <- Node 4 (serpentine: fills the empty space under Row 1) */}
                <div className="flex items-stretch gap-2.5">
                  <div className="flex-1 min-w-0">{renderMilestoneCard(nodes[4], 4)}</div>
                  <LeftConnector isCompleted={nodes[3].status === 'completed'} />
                  <div className="flex-1 min-w-0">{renderMilestoneCard(nodes[3], 3)}</div>
                </div>
              </div>
            )}

            {/* If 6 or more nodes: multi-row serpentine */}
            {nodes.length >= 6 && (
              <div className="flex flex-col space-y-1.5">
                {/* Row 1: First half */}
                <div className="flex items-stretch gap-2.5">
                  {nodes.slice(0, Math.ceil(nodes.length / 2)).map((node, idx) => (
                    <React.Fragment key={node.id}>
                      <div className="flex-1 min-w-0">{renderMilestoneCard(node, idx)}</div>
                      {idx < Math.ceil(nodes.length / 2) - 1 && (
                        <RightConnector isCompleted={node.status === 'completed'} />
                      )}
                    </React.Fragment>
                  ))}
                </div>

                {/* Turn */}
                <div className="flex justify-end pr-16 py-1">
                  <DownConnector isCompleted={nodes[Math.ceil(nodes.length / 2) - 1].status === 'completed'} />
                </div>

                {/* Row 2: Second half reversed */}
                <div className="flex items-stretch gap-2.5">
                  {nodes.slice(Math.ceil(nodes.length / 2)).reverse().map((node, idx, arr) => {
                    const actualIndex = nodes.length - 1 - idx;
                    return (
                      <React.Fragment key={node.id}>
                        <div className="flex-1 min-w-0">{renderMilestoneCard(node, actualIndex)}</div>
                        {idx < arr.length - 1 && (
                          <LeftConnector isCompleted={nodes[actualIndex - 1]?.status === 'completed'} />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Mobile Stacked Vertical Pipeline (Visible on smaller screens) */}
          <div className="flex lg:hidden flex-col space-y-3 w-full">
            {nodes.map((node, idx) => (
              <React.Fragment key={node.id}>
                <div className="w-full">{renderMilestoneCard(node, idx)}</div>
                {idx < nodes.length - 1 && (
                  <div className="flex justify-center py-1">
                    <DownConnector isCompleted={node.status === 'completed'} />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* RIGHT CANVAS (lg:col-span-4): Compliance Docket & Physical Enclosures Desk */}
        <div className="lg:col-span-4 lg:border-l lg:border-zinc-200 lg:pl-6 space-y-4 pt-1">
          {/* Desk Header */}
          <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-800 flex items-center space-x-1.5">
                <FileCheck className="w-4 h-4 text-blue-600" />
                <span>Compliance Docket &amp; Enclosures Desk</span>
              </h4>
              <p className="text-[11px] text-zinc-500 mt-0.5">
                Mandatory physical counter submissions for ward clearance
              </p>
            </div>
          </div>

          {/* Physical Enclosures & Affidavits Checklist */}
          <div className="space-y-2.5">
            <span className="text-[10px] uppercase font-bold text-zinc-400 block tracking-wider">
              Required Physical Enclosures
            </span>

            {/* Standard Institutional Affidavits */}
            {standardEnclosures.map((item) => {
              const isChecked = !!checkedEnclosures[item.id];
              return (
                <div
                  key={item.id}
                  onClick={() => toggleEnclosure(item.id)}
                  className={`p-3 rounded-xl border transition cursor-pointer flex items-start space-x-2.5 ${
                    isChecked
                      ? 'bg-emerald-50/40 border-emerald-200'
                      : 'bg-zinc-50/80 border-zinc-200 hover:bg-zinc-100/70'
                  }`}
                >
                  <div className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center border shrink-0 transition ${
                    isChecked ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-zinc-300 bg-white'
                  }`}>
                    {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <div className="flex-1">
                    <div className={`text-xs font-semibold leading-tight ${
                      isChecked ? 'text-zinc-500 line-through' : 'text-zinc-900'
                    }`}>
                      {item.title}
                    </div>
                    <div className="text-[10px] text-zinc-500 mt-0.5 leading-snug">
                      {item.desc}
                    </div>
                    <div className="mt-1 flex items-center space-x-1.5">
                      <span className="text-[9px] font-mono-code font-bold uppercase px-1.5 py-0.2 rounded bg-white border border-zinc-200 text-zinc-600">
                        {item.requiredOriginal ? 'Original + 1 Copy' : 'Self-Attested Copy'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Pipeline-Specific Document Enclosures */}
            {pipelineDocs.map((doc, idx) => {
              const docKey = `doc_${idx}`;
              const isChecked = !!checkedEnclosures[docKey];
              return (
                <div
                  key={docKey}
                  onClick={() => toggleEnclosure(docKey)}
                  className={`p-3 rounded-xl border transition cursor-pointer flex items-start space-x-2.5 ${
                    isChecked
                      ? 'bg-emerald-50/40 border-emerald-200'
                      : 'bg-zinc-50/80 border-zinc-200 hover:bg-zinc-100/70'
                  }`}
                >
                  <div className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center border shrink-0 transition ${
                    isChecked ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-zinc-300 bg-white'
                  }`}>
                    {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <div className="flex-1">
                    <div className={`text-xs font-semibold leading-tight ${
                      isChecked ? 'text-zinc-500 line-through' : 'text-zinc-900'
                    }`}>
                      {doc}
                    </div>
                    <div className="mt-1 flex items-center space-x-1.5">
                      <span className="text-[9px] font-mono-code font-bold uppercase px-1.5 py-0.2 rounded bg-white border border-zinc-200 text-zinc-600">
                        Stage Enclosure
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Institutional Counter Verification Notice */}
          <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl space-y-1 text-xs">
            <div className="flex items-center space-x-1.5 text-zinc-800 font-semibold">
              <Building2 className="w-3.5 h-3.5 text-zinc-500" />
              <span>Ward CFC Scrutiny Desk</span>
            </div>
            <p className="text-[11px] text-zinc-500">
              Inward scrutiny conducted at Citizen Facilitation Center (Counter 4). Verify physical seal impressions prior to token generation.
            </p>
          </div>

          {/* Primary Action Button: Download Citizen Action Docket */}
          <div className="pt-2">
            <button
              onClick={onExportDocket}
              className="w-full py-2.5 px-3 bg-zinc-900 hover:bg-zinc-800 active:bg-black text-white font-semibold text-xs rounded-xl shadow-xs transition flex items-center justify-center space-x-2"
              title="Generate and print physical compliance action docket"
            >
              <FileText className="w-3.5 h-3.5 text-zinc-300" />
              <span>Download Citizen Action Docket</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
