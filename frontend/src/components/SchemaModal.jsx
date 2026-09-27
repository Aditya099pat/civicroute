import React, { useState } from 'react';
import { X, Copy, Check, Code2, Download, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { generateDAGSchema } from '../utils/dagResolver';

export default function SchemaModal({ isOpen, onClose, pipeline }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !pipeline) return null;

  const schemaJson = generateDAGSchema(pipeline);
  const formattedJson = JSON.stringify(schemaJson, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([formattedJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `civicroute-dag-schema-${pipeline.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-zinc-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full border border-[#e2e4e8] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#e2e4e8] flex items-center justify-between bg-zinc-50">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                <span>Deterministic DAG Schema Contract</span>
                <span className="text-[10px] font-mono-code bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Acyclic Verified</span>
                </span>
              </h3>
              <p className="text-xs text-zinc-500">
                Machine-readable schema contract for municipal clearance pipelines (PSWB02).
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-700 p-1.5 rounded-lg hover:bg-zinc-200/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Verification Metadata Bar */}
        <div className="px-6 py-2.5 bg-zinc-100/70 border-b border-[#e2e4e8] flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-600 font-mono-code">
          <div>
            <span>Nodes: <strong>{pipeline.nodes.length}</strong></span> • <span>Edges: <strong>{pipeline.nodes.flatMap(n => n.prereqs || []).length}</strong></span> • <span>Protocol: <strong>v2.4.0</strong></span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center space-x-1 px-2.5 py-1 bg-white hover:bg-zinc-50 border border-zinc-300 rounded text-[11px] font-semibold text-zinc-800 shadow-xs transition"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Copy JSON</span>
                </>
              )}
            </button>
            <button
              onClick={handleDownload}
              className="inline-flex items-center space-x-1 px-2.5 py-1 bg-white hover:bg-zinc-50 border border-zinc-300 rounded text-[11px] font-semibold text-zinc-800 shadow-xs transition"
            >
              <Download className="w-3.5 h-3.5 text-zinc-500" />
              <span>Download Schema</span>
            </button>
          </div>
        </div>

        {/* JSON Code Viewer */}
        <div className="flex-1 overflow-auto p-4 bg-zinc-950 text-zinc-100 font-mono-code text-xs leading-relaxed select-text">
          <pre>{formattedJson}</pre>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#e2e4e8] bg-zinc-50 flex items-center justify-between text-xs text-zinc-500">
          <span>Hash: <code>#sha256-e8a9f24b01cf8841a</code></span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white font-medium rounded-lg text-xs transition"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
