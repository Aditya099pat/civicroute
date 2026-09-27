import React, { useState } from 'react';
import { Lock, X, Shield, Key, ArrowRight } from 'lucide-react';

export default function AdminModal({ isOpen, onClose, onElevateRole }) {
  const [scope, setScope] = useState('steward');
  const [token, setToken] = useState('steward-mcgm-token-2026');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onElevateRole(scope);
  };

  const handleQuickLogin = (selectedScope) => {
    setScope(selectedScope);
    onElevateRole(selectedScope);
  };

  return (
    <div className="fixed inset-0 bg-[#040813]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#0e172a] rounded-2xl max-w-lg w-full border border-[#223359] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#1b2640] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                Privileged Portal Authentication
              </h3>
              <p className="text-xs text-[#94a3b8]">
                Restricted access for Data Stewards &amp; Administrators
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-2">
              Select Privileged Scope
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setScope('steward')}
                className={`p-2.5 rounded-xl border font-semibold flex items-center justify-center space-x-2 transition ${
                  scope === 'steward'
                    ? 'border-blue-500 bg-blue-600/15 text-white'
                    : 'border-[#1e2f54] bg-[#111a30] text-[#94a3b8] hover:text-white'
                }`}
              >
                <Shield className="w-3.5 h-3.5 text-blue-400" />
                <span>Data Steward</span>
              </button>

              <button
                type="button"
                onClick={() => setScope('admin')}
                className={`p-2.5 rounded-xl border font-semibold flex items-center justify-center space-x-2 transition ${
                  scope === 'admin'
                    ? 'border-blue-500 bg-blue-600/15 text-white'
                    : 'border-[#1e2f54] bg-[#111a30] text-[#94a3b8] hover:text-white'
                }`}
              >
                <Key className="w-3.5 h-3.5 text-blue-400" />
                <span>Administrator</span>
              </button>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-2">
              Security Passkey / Token
            </label>
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Enter steward token..."
              className="w-full bg-[#111a30] border border-[#1f3056] text-white rounded-xl px-3.5 py-2.5 text-xs font-mono-code focus:outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow-lg shadow-blue-600/25"
          >
            Authenticate &amp; Elevate Role
          </button>

          <div className="pt-2 text-center">
            <span className="text-[10px] uppercase tracking-widest text-slate-500 font-mono-code font-bold">
              EVALUATION QUICK-ACCESS (DEMO MODE)
            </span>
            <div className="grid grid-cols-2 gap-3 mt-2.5">
              <button
                type="button"
                onClick={() => handleQuickLogin('steward')}
                className="py-2 px-3 bg-[#111a30] hover:bg-[#172342] border border-[#213257] text-white font-semibold text-xs rounded-xl flex items-center justify-center space-x-1 transition"
              >
                <span>Login as Steward</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('admin')}
                className="py-2 px-3 bg-[#111a30] hover:bg-[#172342] border border-[#213257] text-white font-semibold text-xs rounded-xl flex items-center justify-center space-x-1 transition"
              >
                <span>Login as Admin</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
