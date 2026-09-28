import React, { useState } from 'react';
import MilestoneCanvas from './MilestoneCanvas';
import MilestoneTree from './MilestoneTree';
import { Layers, List, GitFork, CheckCircle2, Lock, ChevronRight } from 'lucide-react';

export default function MilestoneList({
  pipeline,
  nodes = [],
  selectedNodeId,
  onSelectNode,
  onToggleNode,
  onExportDocket,
  onResetPipeline
}) {
  const [viewMode, setViewMode] = useState('horizontal'); // 'horizontal' | 'list' | 'tree'

  return (
    <div className="space-y-3">
      {/* View Switcher Controls */}
      <div className="flex items-center justify-between px-2 max-w-7xl mx-auto w-full">
        <div className="text-xs font-semibold text-zinc-500 flex items-center space-x-2">
          <span>Topological Lineage Layout:</span>
          <span className="text-zinc-800 font-bold">{nodes.length} Milestones</span>
          {onResetPipeline && (
            <>
              <span className="text-zinc-300">•</span>
              <button
                onClick={onResetPipeline}
                className="text-[11px] font-medium text-zinc-500 hover:text-zinc-900 hover:underline transition"
              >
                Change Pathway
              </button>
            </>
          )}
        </div>

        <div className="flex items-center space-x-1 bg-white p-1 rounded-lg border border-zinc-200 shadow-xs text-xs">
          <button
            onClick={() => setViewMode('horizontal')}
            className={`px-3 py-1 font-semibold rounded-md transition ${
              viewMode === 'horizontal'
                ? 'bg-zinc-900 text-white'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            Horizontal Roadmap
          </button>

          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1 font-semibold rounded-md transition ${
              viewMode === 'list'
                ? 'bg-zinc-900 text-white'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            Tabular List
          </button>

          <button
            onClick={() => setViewMode('tree')}
            className={`px-3 py-1 font-semibold rounded-md transition ${
              viewMode === 'tree'
                ? 'bg-zinc-900 text-white'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            DAG Graph
          </button>
        </div>
      </div>

      {viewMode === 'horizontal' && (
        <MilestoneCanvas
          pipeline={pipeline}
          nodes={nodes}
          selectedNodeId={selectedNodeId}
          onSelectNode={onSelectNode}
          onToggleNode={onToggleNode}
          onExportDocket={onExportDocket}
        />
      )}

      {viewMode === 'tree' && (
        <div className="max-w-7xl mx-auto w-full bg-white border border-zinc-200 rounded-2xl p-6 shadow-xs">
          <MilestoneTree
            nodes={nodes}
            selectedNodeId={selectedNodeId}
            onSelectNode={onSelectNode}
            onToggleNode={onToggleNode}
          />
        </div>
      )}

      {viewMode === 'list' && (
        <div className="max-w-7xl mx-auto w-full bg-white border border-zinc-200 rounded-2xl p-6 shadow-xs space-y-3">
          <div className="border-b border-zinc-100 pb-3 flex justify-between items-center">
            <h4 className="text-sm font-bold text-zinc-900">
              Clearance Directory &amp; Prerequisite Checklist
            </h4>
            <span className="text-xs text-zinc-500">
              Click any row to open the multi-tab inspection drawer
            </span>
          </div>

          <div className="space-y-2.5">
            {nodes.map((node, index) => {
              const isSelected = selectedNodeId === node.id;
              const isCompleted = node.status === 'completed';
              const isAvailable = node.status === 'available';

              let borderClass = 'border-zinc-200 bg-zinc-50/60 hover:bg-zinc-100/60';
              if (isCompleted) borderClass = 'border-emerald-300 bg-emerald-50/30';
              if (isAvailable) borderClass = 'border-blue-400 bg-blue-50/20';

              return (
                <div
                  key={node.id}
                  onClick={() => onSelectNode(node.id)}
                  className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition shadow-xs ${borderClass} ${
                    isSelected ? 'ring-2 ring-blue-600' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                      isCompleted ? 'bg-emerald-600 text-white' : isAvailable ? 'bg-blue-600 text-white' : 'bg-zinc-200 text-zinc-600'
                    }`}>
                      {index + 1}
                    </span>

                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono-code text-[10px] text-zinc-500 bg-white px-1.5 py-0.5 rounded border border-zinc-200">
                          {node.code}
                        </span>
                        <span className="text-xs font-bold text-zinc-900">{node.title}</span>
                      </div>
                      <div className="text-[11px] text-zinc-500 mt-0.5 font-mono-code">
                        <span>{node.department || node.dept}</span> • <span>Fee: {node.fee}</span> • <span>SLA: {node.estimatedDays || node.time}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    {/* Concrete Status Iconography */}
                    {isCompleted ? (
                      <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 fill-emerald-100" />
                        <span>Satisfied</span>
                      </span>
                    ) : isAvailable ? (
                      <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-600"></span>
                        </span>
                        <span>Ready to File</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-zinc-100 text-zinc-600 border border-zinc-200">
                        <Lock className="w-2.5 h-2.5 text-zinc-400" />
                        <span>Locked</span>
                      </span>
                    )}
                    <ChevronRight className="w-4 h-4 text-zinc-400" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
