import React from 'react';
import { Layers, List, GitFork, Check, Unlock, Lock } from 'lucide-react';
import MilestoneTree from './MilestoneTree';

export default function MilestoneList({
  nodes = [],
  selectedNodeId,
  onSelectNode,
  viewMode,
  onChangeViewMode,
  deptFilter,
  onChangeDeptFilter
}) {
  const departments = [
    { id: 'all', label: 'All Clearances' },
    { id: 'MCGM', label: 'MCGM Ward' },
    { id: 'FSSAI', label: 'FSSAI / FoSCoS' },
    { id: 'Fire', label: 'Fire Safety' },
    { id: 'Identity', label: 'State Portal' }
  ];

  const filteredNodes = nodes.filter((node) => {
    if (deptFilter === 'all') return true;
    return node.dept.toLowerCase().includes(deptFilter.toLowerCase());
  });

  return (
    <div className="bg-[#0d172a] border border-[#1a2846] rounded-2xl p-6 shadow-xl">
      <div className="flex items-center justify-between pb-4 border-b border-[#1b2640]">
        <div>
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-bold text-white tracking-tight">
              Connected Municipal Clearances &amp; Approvals
            </h3>
          </div>
          <p className="text-xs text-[#94a3b8] mt-0.5">
            Topological lineage across State Revenue, Ward Health, Food Safety, and Fire Brigades.
          </p>
        </div>

        {/* View Switchers */}
        <div className="flex items-center space-x-1 bg-[#121e38] p-1 rounded-lg border border-[#1e2f54]">
          <button
            onClick={() => onChangeViewMode('list')}
            className={`flex items-center space-x-1.5 px-3 py-1 text-xs font-semibold rounded-md transition ${
              viewMode === 'list'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-[#94a3b8] hover:text-white'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>List View</span>
          </button>

          <button
            onClick={() => onChangeViewMode('tree')}
            className={`flex items-center space-x-1.5 px-3 py-1 text-xs font-semibold rounded-md transition ${
              viewMode === 'tree'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-[#94a3b8] hover:text-white'
            }`}
          >
            <GitFork className="w-3.5 h-3.5" />
            <span>Visual Lineage Tree</span>
          </button>
        </div>
      </div>

      {viewMode === 'tree' ? (
        <MilestoneTree
          nodes={nodes}
          selectedNodeId={selectedNodeId}
          onSelectNode={onSelectNode}
        />
      ) : (
        <>
          {/* Filter Pill Tags */}
          <div className="flex items-center space-x-2 pt-4 pb-2 overflow-x-auto text-xs">
            {departments.map((dept) => {
              const isSelected = deptFilter === dept.id;
              return (
                <button
                  key={dept.id}
                  onClick={() => onChangeDeptFilter(dept.id)}
                  className={`px-3 py-1 rounded-lg font-semibold transition text-xs ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-[#121e38] text-[#94a3b8] hover:text-white border border-[#1e2f54]'
                  }`}
                >
                  {dept.label}
                </button>
              );
            })}
          </div>

          {/* MILESTONE CARDS CONTAINER */}
          <div className="space-y-3 mt-3">
            {filteredNodes.map((node) => {
              const isSelected = selectedNodeId === node.id;

              let statusBadge = null;
              let borderClass = 'border-[#1b2640] hover:border-[#283b63] bg-[#0c1426]';
              let indicatorColor = 'bg-slate-600';

              if (node.status === 'completed') {
                indicatorColor = 'bg-emerald-400 ring-4 ring-emerald-500/20';
                borderClass = 'border-emerald-500/30 bg-[#0c192c]';
                statusBadge = (
                  <span className="flex items-center space-x-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                    <Check className="w-3 h-3" />
                    <span>Satisfied</span>
                  </span>
                );
              } else if (node.status === 'available') {
                indicatorColor = 'bg-blue-400 ring-4 ring-blue-500/20';
                borderClass = 'border-blue-500/40 bg-[#101b34]';
                statusBadge = (
                  <span className="flex items-center space-x-1 text-[10px] font-bold text-blue-400 bg-blue-950/40 border border-blue-500/30 px-2.5 py-0.5 rounded-full">
                    <Unlock className="w-3 h-3" />
                    <span>Ready to file</span>
                  </span>
                );
              } else {
                indicatorColor = 'bg-slate-600';
                borderClass = 'border-[#17223b] bg-[#091020] opacity-75';
                statusBadge = (
                  <span className="flex items-center space-x-1 text-[10px] font-bold text-slate-400 bg-slate-900/60 border border-slate-700/50 px-2.5 py-0.5 rounded-full">
                    <Lock className="w-3 h-3" />
                    <span>Prerequisite blocked</span>
                  </span>
                );
              }

              return (
                <div
                  key={node.id}
                  onClick={() => onSelectNode(node.id)}
                  className={`p-4 rounded-xl border transition cursor-pointer flex items-center justify-between ${borderClass} ${
                    isSelected ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3.5">
                    <div className={`w-2.5 h-2.5 rounded-full ${indicatorColor}`} />
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono-code text-[10px] text-slate-400">{node.code}</span>
                        <span className="text-xs text-slate-600">•</span>
                        <span className="text-[11px] font-bold text-blue-400">{node.dept}</span>
                      </div>

                      <h4 className="text-xs font-bold text-white mt-0.5">{node.title}</h4>

                      <div className="flex items-center space-x-3 text-[11px] text-[#64748b] mt-1.5 font-mono-code">
                        <span>Fee: {node.fee}</span>
                        <span>•</span>
                        <span>{node.time}</span>
                        <span>•</span>
                        <span>{node.type}</span>
                      </div>
                    </div>
                  </div>

                  <div>{statusBadge}</div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
