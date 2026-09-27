import React, { useState } from 'react';
import Header from './components/Header';
import SearchConsole from './components/SearchConsole';
import MilestoneList from './components/MilestoneList';
import StepDrawer from './components/StepDrawer';
import AdminModal from './components/AdminModal';
import PrintDocket from './components/PrintDocket';
import Footer from './components/Footer';
import { INITIAL_PIPELINES, searchOrSynthesizePipeline } from './data/pipelines';
import { resolveDAG, calculateReadiness } from './utils/dagResolver';
import { printComplianceDocket } from './utils/printUtils';
import './App.css';
import './styles/variables.css';
import './styles/animations.css';

/**
 * Main CivicRoute Application Component
 * Municipal Bureaucracy Path Visualizer
 * Hybrid Dashboard & Horizontal Topological Lineage Navigator
 */
export default function App() {
  // Application State
  const [pipelines, setPipelines] = useState(INITIAL_PIPELINES);
  const [activeKey, setActiveKey] = useState('cloud_kitchen');
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [selectedWard, setSelectedWard] = useState('k_west');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [notification, setNotification] = useState(null);
  const [activeSearchQuery, setActiveSearchQuery] = useState('');
  const [isDynamicRoute, setIsDynamicRoute] = useState(false);

  // Derived state for the currently active pipeline
  const activePipeline = pipelines[activeKey] || Object.values(pipelines)[0];
  const readiness = calculateReadiness(activePipeline?.nodes || []);
  const selectedNode = activePipeline?.nodes.find((n) => n.id === selectedNodeId) || null;

  // Handler: Search-first intent processing & dynamic pipeline synthesis
  const handleSearchIntent = (query) => {
    setActiveSearchQuery(query);
    const result = searchOrSynthesizePipeline(query, pipelines);
    if (!result) return;

    if (result.isDynamic) {
      setPipelines((prev) => ({
        [result.key]: result.pipeline,
        ...prev
      }));
      setActiveKey(result.key);
      setIsDynamicRoute(true);
      showNotification(`Analyzed Intent: Synthesized verified clearance roadmap for "${query}"`);
    } else {
      setActiveKey(result.key);
      setIsDynamicRoute(false);
      showNotification(`Identified Verified Municipal Pipeline: ${result.pipeline.title}`);
    }
    setSelectedNodeId(null);
  };

  // Handler: Toggle a milestone's completion status & dynamically cascade DAG locks/unlocks
  const handleToggleNode = (nodeId) => {
    setPipelines((prev) => {
      const currentPipeline = prev[activeKey];
      if (!currentPipeline) return prev;
      const updatedNodes = resolveDAG(currentPipeline.nodes, nodeId);

      const toggledNode = updatedNodes.find(n => n.id === nodeId);
      if (toggledNode) {
        showNotification(
          toggledNode.status === 'completed'
            ? `Milestone "${toggledNode.title}" certified. Downstream clearances unlocked.`
            : `Milestone "${toggledNode.title}" set to pending.`
        );
      }

      return {
        ...prev,
        [activeKey]: {
          ...currentPipeline,
          nodes: updatedNodes
        }
      };
    });
  };

  // Handler: Admin / Steward updates to node fee or SLA
  const handleUpdatePipelineNode = (nodeId, { fee, time }) => {
    setPipelines((prev) => {
      const currentPipeline = prev[activeKey];
      if (!currentPipeline) return prev;

      const updatedNodes = currentPipeline.nodes.map((node) => {
        if (node.id === nodeId) {
          return { ...node, fee: fee || node.fee, time: time || node.time };
        }
        return node;
      });

      return {
        ...prev,
        [activeKey]: {
          ...currentPipeline,
          nodes: updatedNodes
        }
      };
    });
  };

  // Handler: Admin role elevation
  const handleElevateRole = (scope) => {
    showNotification(
      `Role elevated to Municipal ${scope === 'admin' ? 'Chief Administrator' : 'Data Steward'}. Gazette audit active.`
    );
  };

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  return (
    <div className="app-container bg-[#f1f2f4] text-zinc-900 font-sans min-h-screen flex flex-col">
      {/* Toast Notification Banner */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 bg-zinc-900 border border-zinc-700 text-white px-4 py-2.5 rounded-xl shadow-xl text-xs font-semibold flex items-center space-x-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
          <span>{notification}</span>
        </div>
      )}

      {/* 1. Top Navigation Bar (Polished, clean, no problem code, no parser/hash, no schema button) */}
      <Header
        onExportDocket={printComplianceDocket}
        onOpenAdmin={() => setIsAdminOpen(true)}
        selectedWard={selectedWard}
        onSelectWard={setSelectedWard}
      />

      {/* 2. Main Canvas Area */}
      <main className="main-content flex-1 max-w-7xl mx-auto w-full px-4 py-6 space-y-6">
        {/* Centered Floating Search Console & Metric Ribbon */}
        <SearchConsole
          pipeline={activePipeline}
          readinessScore={readiness.percentage}
          onSearchIntent={handleSearchIntent}
          activeSearchQuery={activeSearchQuery}
          isDynamic={isDynamicRoute}
        />

        {/* Horizontal Topological Milestone Roadmap Canvas */}
        <MilestoneList
          pipeline={activePipeline}
          nodes={activePipeline?.nodes || []}
          selectedNodeId={selectedNodeId}
          onSelectNode={(id) => setSelectedNodeId(id)}
          onToggleNode={handleToggleNode}
          onExportDocket={printComplianceDocket}
        />
      </main>

      {/* 3. Dynamic Side Explanation Panel (Drawer) */}
      <StepDrawer
        node={selectedNode}
        allNodes={activePipeline?.nodes || []}
        isOpen={!!selectedNodeId}
        onClose={() => setSelectedNodeId(null)}
        onToggleStatus={handleToggleNode}
        onSelectNode={(id) => setSelectedNodeId(id)}
      />

      {/* 4. Privileged Clerk / Steward Audit Modal */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onElevateRole={handleElevateRole}
        activePipeline={activePipeline}
        onUpdatePipelineNode={handleUpdatePipelineNode}
      />

      {/* 5. Clean Institutional Footer (Polished, no problem code, no schema link) */}
      <Footer
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* 6. Printable Compliance Action Docket */}
      <PrintDocket pipeline={activePipeline} />
    </div>
  );
}
