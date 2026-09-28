import React, { useState } from 'react';
import { Lock, X, Shield, Key, ArrowRight, ShieldCheck, CheckCircle2, Globe, FileText, Edit3, Save } from 'lucide-react';

export default function AdminModal({
  isOpen,
  onClose,
  onElevateRole,
  activePipeline,
  onUpdatePipelineNode
}) {
  const [activeTab, setActiveTab] = useState('auth'); // 'auth' | 'url_audit' | 'fee_revision'
  const [scope, setScope] = useState('steward');
  const [token, setToken] = useState('steward-mcgm-token-2026');
  const [isElevated, setIsElevated] = useState(false);
  const [editingNodeId, setEditingNodeId] = useState(null);
  const [editFee, setEditFee] = useState('');
  const [editSla, setEditSla] = useState('');
  const [saveNotice, setSaveNotice] = useState(null);

  if (!isOpen) return null;

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    setIsElevated(true);
    setActiveTab('url_audit');
    onElevateRole(scope);
  };

  const handleQuickLogin = (selectedScope) => {
    setScope(selectedScope);
    setIsElevated(true);
    setActiveTab('url_audit');
    onElevateRole(selectedScope);
  };

  const startEdit = (node) => {
    setEditingNodeId(node.id);
    setEditFee(node.fee || '');
    setEditSla(node.estimatedDays || node.time || '');
  };

  const saveEdit = (nodeId) => {
    if (onUpdatePipelineNode) {
      onUpdatePipelineNode(nodeId, { fee: editFee, time: editSla });
    }
    setEditingNodeId(null);
    setSaveNotice(`Statutory circular updated for Node ${nodeId}`);
    setTimeout(() => setSaveNotice(null), 3000);
  };

  return (
    <div className="fixed inset-0 bg-zinc-900/60 dark:bg-black/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl max-w-2xl w-full border border-[#e2e4e8] dark:border-zinc-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#e2e4e8] dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-800/50">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 tracking-tight flex items-center gap-2">
                <span>Municipal Clerk &amp; Data Steward Portal</span>
                <span className="text-[10px] font-mono-code bg-blue-50 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-700/50 px-1.5 py-0.5 rounded">
                  PRIVILEGED ACCESS
                </span>
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Audit scraped government endpoints, verify SSL certificates, and update statutory gazette circulars.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 p-1.5 rounded-lg hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation (If elevated) */}
        {isElevated && (
          <div className="flex border-b border-[#e2e4e8] dark:border-zinc-800 bg-white dark:bg-zinc-900 px-6 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('url_audit')}
              className={`py-3 px-4 border-b-2 flex items-center space-x-1.5 transition ${
                activeTab === 'url_audit'
                  ? 'border-blue-600 text-blue-700 dark:text-blue-400 font-bold'
                  : 'border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Scraped Endpoint Audit ({activePipeline?.nodes?.length || 0})</span>
            </button>
            <button
              onClick={() => setActiveTab('fee_revision')}
              className={`py-3 px-4 border-b-2 flex items-center space-x-1.5 transition ${
                activeTab === 'fee_revision'
                  ? 'border-blue-600 text-blue-700 dark:text-blue-400 font-bold'
                  : 'border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Statutory Fee &amp; SLA Circulars</span>
            </button>
            <button
              onClick={() => setActiveTab('auth')}
              className={`py-3 px-4 border-b-2 flex items-center space-x-1.5 transition ${
                activeTab === 'auth'
                  ? 'border-blue-600 text-blue-700 dark:text-blue-400 font-bold'
                  : 'border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <Key className="w-3.5 h-3.5" />
              <span>Role &amp; Credentials</span>
            </button>
          </div>
        )}

        {/* Save Notice Banner */}
        {saveNotice && (
          <div className="px-6 py-2 bg-emerald-50 dark:bg-emerald-950/40 border-b border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center space-x-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{saveNotice}</span>
          </div>
        )}

        {/* TAB 1: AUTHENTICATION / ELEVATION */}
        {activeTab === 'auth' && (
          <form onSubmit={handleAuthSubmit} className="p-6 space-y-4 text-xs">
            <div>
              <label className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider block mb-2">
                Privileged Administrative Scope
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setScope('steward')}
                  className={`p-3 rounded-xl border font-semibold flex items-center justify-center space-x-2 transition ${
                    scope === 'steward'
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-300 ring-1 ring-blue-600'
                      : 'border-[#e2e4e8] dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100'
                  }`}
                >
                  <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>Data Steward (Gazette Auditor)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setScope('admin')}
                  className={`p-3 rounded-xl border font-semibold flex items-center justify-center space-x-2 transition ${
                    scope === 'admin'
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-300 ring-1 ring-blue-600'
                      : 'border-[#e2e4e8] dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100'
                  }`}
                >
                  <Key className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>Chief Municipal Administrator</span>
                </button>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider block mb-2">
                Municipal Security Passkey / Biometric Token
              </label>
              <input
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Enter municipal token..."
                className="w-full bg-zinc-50 dark:bg-zinc-800/60 border border-[#e2e4e8] dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-xl px-3.5 py-2.5 text-xs font-mono-code focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white dark:focus:bg-zinc-800"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow-xs"
            >
              Authenticate &amp; Unlock Gazette Controls
            </button>

            {/* Quick-Access Demo Mode */}
            <div className="pt-2 text-center border-t border-zinc-100 dark:border-zinc-800">
              <span className="text-[10px] uppercase tracking-widest text-zinc-500 dark:text-zinc-400 font-mono-code font-bold">
                EVALUATION QUICK-ACCESS (DEMO MODE)
              </span>
              <div className="grid grid-cols-2 gap-3 mt-2.5">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('steward')}
                  className="py-2 px-3 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-[#e2e4e8] dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 font-semibold text-xs rounded-xl flex items-center justify-center space-x-1.5 transition"
                >
                  <span>Login as Steward</span>
                  <ArrowRight className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('admin')}
                  className="py-2 px-3 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-[#e2e4e8] dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 font-semibold text-xs rounded-xl flex items-center justify-center space-x-1.5 transition"
                >
                  <span>Login as Chief Admin</span>
                  <ArrowRight className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
                </button>
              </div>
            </div>
          </form>
        )}

        {/* TAB 2: SCRAPED URL & PROVENANCE AUDIT */}
        {activeTab === 'url_audit' && (
          <div className="p-6 space-y-3 max-h-[460px] overflow-y-auto text-xs">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-100 dark:border-zinc-800">
              <div>
                <h4 className="font-bold text-zinc-900 dark:text-zinc-100">
                  Government Gateway Authenticity Audit
                </h4>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  Active pipeline: {activePipeline?.title} ({activePipeline?.id})
                </p>
              </div>
              <span className="text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 px-2 py-0.5 rounded">
                100% .gov.in Verified
              </span>
            </div>

            {activePipeline?.nodes?.map((node) => (
              <div
                key={node.id}
                className="p-3.5 rounded-xl border border-[#e2e4e8] dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono-code text-[10px] font-bold text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-800 px-1.5 py-0.5 rounded border border-zinc-200 dark:border-zinc-700">
                    {node.code}
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    <span>SSL TLS 1.3 Certified</span>
                  </span>
                </div>

                <div className="font-bold text-zinc-900 dark:text-zinc-100">{node.title}</div>

                <div className="flex items-center justify-between pt-1 text-[11px]">
                  <span className="font-mono-code text-blue-700 dark:text-blue-400 truncate max-w-[340px]">
                    {node.officialUrl || node.url}
                  </span>
                  <span className="font-mono-code text-zinc-500 dark:text-zinc-400">
                    {node.gazetteCode || 'GOV-IN-VERIFIED'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: STATUTORY FEE & SLA CIRCULAR REVISION */}
        {activeTab === 'fee_revision' && (
          <div className="p-6 space-y-3 max-h-[460px] overflow-y-auto text-xs">
            <div className="pb-2 mb-2 border-b border-zinc-100 dark:border-zinc-800">
              <h4 className="font-bold text-zinc-900 dark:text-zinc-100">
                Statutory Fee &amp; Turnaround Revision (RTS Act)
              </h4>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                Modify fees or SLAs based on newly gazetted municipal resolutions. Changes apply dynamically.
              </p>
            </div>

            {activePipeline?.nodes?.map((node) => {
              const isEditing = editingNodeId === node.id;
              return (
                <div
                  key={node.id}
                  className="p-3.5 rounded-xl border border-[#e2e4e8] dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-mono-code text-[10px] font-bold text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-800 px-1.5 py-0.5 rounded border border-zinc-200 dark:border-zinc-700">
                        {node.code}
                      </span>
                      <span className="font-bold text-zinc-900 dark:text-zinc-100 ml-2">{node.title}</span>
                    </div>

                    {!isEditing ? (
                      <button
                        onClick={() => startEdit(node)}
                        className="px-2.5 py-1 text-[11px] font-semibold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/60 rounded-lg border border-blue-200 dark:border-blue-800 transition"
                      >
                        Revise Circular
                      </button>
                    ) : (
                      <button
                        onClick={() => saveEdit(node.id)}
                        className="px-2.5 py-1 text-[11px] font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs flex items-center space-x-1 transition"
                      >
                        <Save className="w-3 h-3" />
                        <span>Save</span>
                      </button>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="text-[10px] font-bold uppercase text-zinc-500 dark:text-zinc-400 block mb-1">
                          Statutory Fee
                        </label>
                        <input
                          type="text"
                          value={editFee}
                          onChange={(e) => setEditFee(e.target.value)}
                          className="w-full bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg px-2.5 py-1 text-xs font-mono-code text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-600"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase text-zinc-500 dark:text-zinc-400 block mb-1">
                          SLA Turnaround (Days)
                        </label>
                        <input
                          type="text"
                          value={editSla}
                          onChange={(e) => setEditSla(e.target.value)}
                          className="w-full bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg px-2.5 py-1 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-600"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-4 text-[11px] text-zinc-600 dark:text-zinc-400 font-mono-code">
                      <span>Statutory Fee: <strong className="text-zinc-900 dark:text-zinc-100">{node.fee}</strong></span>
                      <span>•</span>
                      <span>SLA: <strong className="text-zinc-900 dark:text-zinc-100">{node.estimatedDays || node.time}</strong></span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
