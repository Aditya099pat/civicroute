import React, { useState } from 'react';
import Header from './components/Header';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import HeroCard from './components/HeroCard';
import MilestoneList from './components/MilestoneList';
import DetailDrawer from './components/DetailDrawer';
import AdminModal from './components/AdminModal';
import PrintDocket from './components/PrintDocket';
import { INITIAL_PIPELINES } from './data/pipelinesData';
import { toggleNodeAndRecalculate, calculateReadinessScore } from './utils/graphUtils';
import { printComplianceDocket } from './utils/printUtils';
import './App.css';
import './styles/variables.css';
import './styles/animations.css';

/**
 * Main CivicRoute Application Component
 * Manage municipal bureaucracy pipelines, prerequisite roadmaps, and DAG graph dependencies.
 */
export default function App() {
  // Application State
  const [pipelines, setPipelines] = useState(INITIAL_PIPELINES);
  const [activeKey, setActiveKey] = useState('cloud_kitchen');
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'tree'
  const [deptFilter, setDeptFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('overview');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  // Derived state for the currently active pipeline
  const activePipeline = pipelines[activeKey];
  const readinessScore = calculateReadinessScore(activePipeline?.nodes || []);
  const selectedNode = activePipeline?.nodes.find((n) => n.id === selectedNodeId) || null;

  // Handler: Switch between pipelines (Cloud Kitchen, Water Sanction, Street Vending)
  const handleSelectPipeline = (key) => {
    setActiveKey(key);
    setSelectedNodeId(null);
  };

  // Handler: Top Navbar tabs
  const handleSelectTab = (tab) => {
    setActiveTab(tab);
    if (tab === 'needs_review') {
      setActiveKey('street_vendor');
      setSelectedNodeId(null);
    } else if (tab === 'optimized') {
      setActiveKey('cloud_kitchen');
      setSelectedNodeId(null);
    }
  };

  // Handler: Toggle a milestone's completion status & dynamically recalculate downstream DAG blocks
  const handleToggleNode = (nodeId) => {
    setPipelines((prev) => {
      const currentPipeline = prev[activeKey];
      const updatedNodes = toggleNodeAndRecalculate(currentPipeline.nodes, nodeId);
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
    setIsAdminOpen(false);
    showNotification(
      `Role Elevated to Municipal ${scope === 'admin' ? 'Administrator' : 'Data Steward'}. Gazette audit privileges active.`
    );
  };

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  return (
    <div className="app-container select-none bg-[#080d1a] text-[#f1f5f9]">
      {/* Toast Notification Banner */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 bg-blue-600 border border-blue-400 text-white px-4 py-2.5 rounded-xl shadow-2xl text-xs font-semibold animate-bounce">
          {notification}
        </div>
      )}

      {/* 1. Header with Export Docket and Admin Portal */}
      <Header
        onExportDocket={printComplianceDocket}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* 2. Navigation Tabs (Overview, Needs Review, Optimized Paths, Settings) */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        needsReviewCount={1}
        optimizedCount={2}
      />

      {/* 3. Main Workspace Canvas */}
      <div className="workspace-canvas relative">
        {/* Left Sidebar: Active Pipelines List */}
        <Sidebar
          pipelines={pipelines}
          activeKey={activeKey}
          onSelectPipeline={handleSelectPipeline}
          onNewPipeline={() => showNotification("Drafting new municipal pipeline route...")}
        />

        {/* Central Canvas */}
        <main className="main-content space-y-5">
          {/* Active Pipeline Metrics & Conflict Warning */}
          <HeroCard
            pipeline={activePipeline}
            readinessScore={readinessScore}
          />

          {/* Clearances & Milestones (supports List View and Visual Lineage Tree) */}
          <MilestoneList
            nodes={activePipeline?.nodes || []}
            selectedNodeId={selectedNodeId}
            onSelectNode={(id) => setSelectedNodeId(id)}
            viewMode={viewMode}
            onChangeViewMode={setViewMode}
            deptFilter={deptFilter}
            onChangeDeptFilter={setDeptFilter}
          />

          {/* Slide-over Inspection Drawer for the Selected Milestone */}
          <DetailDrawer
            node={selectedNode}
            isOpen={!!selectedNodeId}
            onClose={() => setSelectedNodeId(null)}
            onToggleStatus={handleToggleNode}
          />
        </main>
      </div>

      {/* 4. Privileged Portal Authentication Modal */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onElevateRole={handleElevateRole}
      />

      {/* 5. Printable Compliance Docket */}
      <PrintDocket pipeline={activePipeline} />
    </div>
  );
}
