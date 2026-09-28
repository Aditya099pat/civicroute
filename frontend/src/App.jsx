import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SearchConsole from './components/SearchConsole';
import MilestoneList from './components/MilestoneList';
import WelcomeCatalog from './components/WelcomeCatalog';
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
  // Application State with LocalStorage Persistence
  const [pipelines, setPipelines] = useState(() => {
    try {
      const saved = localStorage.getItem('civicroute_pipelines');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object' && Object.keys(parsed).length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn("Failed to load pipelines from localStorage:", e);
    }
    return INITIAL_PIPELINES;
  });

  const [activeKey, setActiveKey] = useState(() => {
    try {
      const saved = localStorage.getItem('civicroute_active_key');
      if (saved && saved !== 'null' && saved !== 'undefined') return saved;
    } catch (e) {
      console.warn("Failed to load activeKey from localStorage:", e);
    }
    // Do NOT load cloud_kitchen by default on fresh visit!
    return null;
  });

  const [selectedNodeId, setSelectedNodeId] = useState(null);

  const [selectedWard, setSelectedWard] = useState(() => {
    try {
      return localStorage.getItem('civicroute_selected_ward') || 'k_west';
    } catch {
      return 'k_west';
    }
  });

  // Dark/Light Theme state with LocalStorage persistence and system preference fallback
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('civicroute_theme');
      if (saved === 'dark' || saved === 'light') return saved;
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    } catch (e) {
      console.warn("Theme loading error:", e);
    }
    return 'light';
  });

  useEffect(() => {
    try {
      localStorage.setItem('civicroute_theme', theme);
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {
      console.warn("Theme persistence error:", e);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  const [activeSearchQuery, setActiveSearchQuery] = useState(() => {
    try {
      return localStorage.getItem('civicroute_search_query') || '';
    } catch {
      return '';
    }
  });

  const [isDynamicRoute, setIsDynamicRoute] = useState(() => {
    try {
      return localStorage.getItem('civicroute_is_dynamic') === 'true';
    } catch {
      return false;
    }
  });

  // Phase 2 Async Telemetry & Stepper State
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('');

  // Persist State to LocalStorage on Change
  useEffect(() => {
    try {
      localStorage.setItem('civicroute_pipelines', JSON.stringify(pipelines));
    } catch (e) {
      console.warn("Failed to save pipelines:", e);
    }
  }, [pipelines]);

  useEffect(() => {
    try {
      if (activeKey) {
        localStorage.setItem('civicroute_active_key', activeKey);
      } else {
        localStorage.removeItem('civicroute_active_key');
      }
    } catch (e) {
      console.warn("Failed to save activeKey:", e);
    }
  }, [activeKey]);

  useEffect(() => {
    try {
      if (activeSearchQuery) {
        localStorage.setItem('civicroute_search_query', activeSearchQuery);
      } else {
        localStorage.removeItem('civicroute_search_query');
      }
    } catch (e) {
      console.warn("Failed to save searchQuery:", e);
    }
  }, [activeSearchQuery]);

  useEffect(() => {
    try {
      localStorage.setItem('civicroute_selected_ward', selectedWard);
    } catch (e) {
      console.warn("Failed to save selectedWard:", e);
    }
  }, [selectedWard]);

  useEffect(() => {
    try {
      localStorage.setItem('civicroute_is_dynamic', String(isDynamicRoute));
    } catch (e) {
      console.warn("Failed to save isDynamicRoute:", e);
    }
  }, [isDynamicRoute]);

  // Derived state for the currently active pipeline
  const activePipeline = activeKey && pipelines[activeKey] ? pipelines[activeKey] : null;
  const readiness = activePipeline ? calculateReadiness(activePipeline.nodes || []) : { percentage: 0 };
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
    if (!activeKey) return;
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
    if (!activeKey) return;
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
    <div className="app-container bg-[#f1f2f4] dark:bg-[#090a0f] text-zinc-900 dark:text-zinc-100 font-sans min-h-screen flex flex-col transition-colors duration-200">
      {/* Toast Notification Banner */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 bg-zinc-900 dark:bg-zinc-800 border border-zinc-700 text-white px-4 py-2.5 rounded-xl shadow-xl text-xs font-semibold flex items-center space-x-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
          <span>{notification}</span>
        </div>
      )}

      {/* 1. Top Navigation Bar */}
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        onExportDocket={() => {
          if (activePipeline) {
            printComplianceDocket();
          } else {
            showNotification('Please select a municipal pathway to export citizen docket.');
          }
        }}
        onOpenAdmin={() => setIsAdminOpen(true)}
        selectedWard={selectedWard}
        onSelectWard={setSelectedWard}
        onGoHome={() => {
          setActiveKey(null);
          setActiveSearchQuery('');
          setIsDynamicRoute(false);
          setSelectedNodeId(null);
        }}
      />

      {/* 2. Main Canvas Area */}
      <main className="main-content flex-1 max-w-7xl mx-auto w-full px-4 py-6 space-y-6">
        {/* Active Resolution Loader Stepper */}
        {isLoading && (
          <div className="bg-white dark:bg-zinc-900 border border-blue-200 dark:border-blue-900/60 rounded-2xl p-4 shadow-sm flex items-center space-x-3.5 animate-pulse">
            <Loader2 className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-spin shrink-0" />
            <div>
              <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Synthesizing Official Regulatory Lineage</p>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">{loadingStatus}</p>
            </div>
          </div>
        )}

        {/* Integrated Command Omnibar & Metric Ribbon */}
        <SearchConsole
          pipeline={activePipeline}
          readinessScore={readiness.percentage}
          onSearchIntent={handleSearchIntent}
          activeSearchQuery={activeSearchQuery}
          isDynamic={isDynamicRoute}
          isLoading={isLoading}
        />

        {/* Dynamic Route View: If a pipeline is active, render workbench; otherwise render the Welcome Catalog */}
        {activePipeline ? (
          <MilestoneList
            pipeline={activePipeline}
            nodes={activePipeline?.nodes || []}
            selectedNodeId={selectedNodeId}
            onSelectNode={(id) => setSelectedNodeId(id)}
            onToggleNode={handleToggleNode}
            onExportDocket={printComplianceDocket}
            onResetPipeline={() => {
              setActiveKey(null);
              setActiveSearchQuery('');
              setIsDynamicRoute(false);
            }}
          />
        ) : (
          <WelcomeCatalog
            onSelectPipeline={(key, query) => {
              setActiveKey(key);
              setActiveSearchQuery(query || '');
              setIsDynamicRoute(false);
            }}
            onSearchIntent={handleSearchIntent}
          />
        )}
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
      {activePipeline && <PrintDocket pipeline={activePipeline} />}
    </div>
  );
}