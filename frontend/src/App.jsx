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
import { Loader2 } from 'lucide-react';
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

  // Phase 2 Async Telemetry & Stepper State
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('');

  // Derived state for the currently active pipeline
  const activePipeline = pipelines[activeKey] || Object.values(pipelines)[0];
  const readiness = calculateReadiness(activePipeline?.nodes || []);
  const selectedNode = activePipeline?.nodes.find((n) => n.id === selectedNodeId) || null;

  // Helper: Toast Notifications
  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  // Handler: Search-first intent processing via live backend API with failover fallback
  const handleSearchIntent = async (query) => {
    if (!query || !query.trim()) return;

    setActiveSearchQuery(query);
    setSelectedNodeId(null);
    setIsLoading(true);
    setLoadingStatus('Connecting to Municipal Gazette & Compliance Index...');

    const stepTimer = setTimeout(() => {
      setLoadingStatus('Parsing prerequisites and compiling directed dependency graph...');
    }, 900);

    try {
      // 1. Attempt live API resolution
      const response = await fetch('http://localhost:5000/api/generate-path', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          location: selectedWard === 'k_west' ? 'Mumbai (MCGM Ward K-West)' : 'Mumbai, Maharashtra'
        })
      });

      clearTimeout(stepTimer);

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const data = await response.json();
      const generatedKey = `dyn_${Date.now()}`;

      // Structure synthesized backend output into pipeline state
      const synthesizedPipeline = {
        id: data.nodes?.[0]?.code || 'CIV-LIVE',
        title: data.task || query,
        jurisdiction: data.jurisdiction || 'Mumbai Municipal Corporation (MCGM)',
        totalFee: data.totalFee || 'Statutory Fee Schedule Attached',
        primaryDept: data.nodes?.[0]?.department || 'Municipal Facilitation Desk',
        cycleTime: '14 - 21 Business Days',
        nodes: data.nodes || [],
        edges: data.edges || []
      };

      setPipelines((prev) => ({
        [generatedKey]: synthesizedPipeline,
        ...prev
      }));
      setActiveKey(generatedKey);
      setIsDynamicRoute(true);
      showNotification(`Live Engine Resolved: Compiled clearance roadmap for "${query}"`);

    } catch (err) {
      clearTimeout(stepTimer);
      console.warn(`Backend unreachable (${err.message}). Using local synthesized pipeline.`);

      // 2. Safe Fallback to local verified definitions
      const result = searchOrSynthesizePipeline(query, pipelines);
      if (result) {
        if (result.isDynamic) {
          setPipelines((prev) => ({
            [result.key]: result.pipeline,
            ...prev
          }));
          setActiveKey(result.key);
          setIsDynamicRoute(true);
          showNotification(`Cached Engine: Synthesized clearance roadmap for "${query}"`);
        } else {
          setActiveKey(result.key);
          setIsDynamicRoute(false);
          showNotification(`Identified Verified Municipal Pipeline: ${result.pipeline.title}`);
        }
      }
    } finally {
      setIsLoading(false);
      setLoadingStatus('');
    }
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
          return {
            ...node,
            fee: fee || node.fee,
            estimatedDays: time || node.estimatedDays || node.time,
            time: time || node.time || node.estimatedDays
          };
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

  return (
    <div className="app-container bg-[#f1f2f4] text-zinc-900 font-sans min-h-screen flex flex-col">
      {/* Toast Notification Banner */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 bg-zinc-900 border border-zinc-700 text-white px-4 py-2.5 rounded-xl shadow-xl text-xs font-semibold flex items-center space-x-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
          <span>{notification}</span>
        </div>
      )}

      {/* 1. Top Navigation Bar */}
      <Header
        onExportDocket={printComplianceDocket}
        onOpenAdmin={() => setIsAdminOpen(true)}
        selectedWard={selectedWard}
        onSelectWard={setSelectedWard}
      />

      {/* 2. Main Canvas Area */}
      <main className="main-content flex-1 max-w-7xl mx-auto w-full px-4 py-6 space-y-6">
        {/* Active Resolution Loader Stepper */}
        {isLoading && (
          <div className="bg-white border border-blue-200 rounded-2xl p-4 shadow-sm flex items-center space-x-3.5 animate-pulse">
            <Loader2 className="w-5 h-5 text-blue-600 animate-spin shrink-0" />
            <div>
              <p className="text-xs font-bold text-zinc-900">Synthesizing Official Regulatory Lineage</p>
              <p className="text-[11px] text-zinc-500 mt-0.5">{loadingStatus}</p>
            </div>
          </div>
        )}

        {/* Centered Floating Search Console & Metric Ribbon */}
        <SearchConsole
          pipeline={activePipeline}
          readinessScore={readiness.percentage}
          onSearchIntent={handleSearchIntent}
          activeSearchQuery={activeSearchQuery}
          isDynamic={isDynamicRoute}
          isLoading={isLoading}
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

      {/* 5. Clean Institutional Footer */}
      <Footer
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* 6. Printable Compliance Action Docket */}
      <PrintDocket pipeline={activePipeline} />
    </div>
  );
}