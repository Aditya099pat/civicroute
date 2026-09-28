import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SearchConsole from './components/SearchConsole';
import MilestoneList from './components/MilestoneList';
import WelcomeCatalog from './components/WelcomeCatalog';
import StepDrawer from './components/StepDrawer';
import AdminModal from './components/AdminModal';
import PrintDocket from './components/PrintDocket';
import Footer from './components/Footer';
import ToastStack from './components/ToastStack';
import { INITIAL_PIPELINES } from './data/pipelines';
import { resolveDAG, calculateReadiness, resolveDependencies } from './utils/dagResolver';
import { fetchBureaucracyPath } from './utils/api';
import { printComplianceDocket, downloadComplianceDocketPdf } from './utils/printUtils';
import { buildShareUrl, parseShareState } from './utils/shareState';
import { useToasts } from './hooks/useToasts';
import { useVerification } from './hooks/useVerification';
import { Loader2 } from 'lucide-react';
import './App.css';
import './styles/variables.css';
import './styles/animations.css';

// Keep at most this many synthesized (dyn_*) pipelines in localStorage so the
// store cannot grow without bound across many searches.
const MAX_DYNAMIC_PIPELINES = 8;

function pruneDynamicPipelines(pipelines) {
  const dynamicKeys = Object.keys(pipelines)
    .filter((k) => k.startsWith('dyn_'))
    .sort((a, b) => Number(b.split('_')[1] || 0) - Number(a.split('_')[1] || 0));
  if (dynamicKeys.length <= MAX_DYNAMIC_PIPELINES) return pipelines;
  const keep = new Set(dynamicKeys.slice(0, MAX_DYNAMIC_PIPELINES));
  const next = {};
  for (const [key, value] of Object.entries(pipelines)) {
    if (!key.startsWith('dyn_') || keep.has(key)) next[key] = value;
  }
  return next;
}

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
  const { toasts, notify, dismiss } = useToasts();

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

  // Live, honest verification of official portal URLs for the active pipeline.
  const verification = useVerification(activePipeline?.nodes || []);

  // Helper: Toast Notifications (stackable)
  const showNotification = (msg, type = 'info') => notify(msg, type);

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

    const location = selectedWard === 'k_west'
      ? 'Mumbai (MCGM Ward K-West)'
      : 'Mumbai, Maharashtra';

    try {
      const { pipeline, isOfflineFallback, matchKey, isDynamic } =
        await fetchBureaucracyPath(query, location);
      clearTimeout(stepTimer);

      // Offline fallback that matched a verified seed: reuse its stable key.
      if (isOfflineFallback && matchKey && !isDynamic) {
        setActiveKey(matchKey);
        setIsDynamicRoute(false);
        showNotification(`Identified Verified Municipal Pipeline: ${pipeline.title}`, 'success');
        return;
      }

      const generatedKey = `dyn_${Date.now()}`;
      setPipelines((prev) => pruneDynamicPipelines({ [generatedKey]: pipeline, ...prev }));
      setActiveKey(generatedKey);
      setIsDynamicRoute(true);
      showNotification(
        isOfflineFallback
          ? `Offline Engine: Synthesized clearance roadmap for "${query}"`
          : `Live Engine Resolved: Compiled clearance roadmap for "${query}"`,
        'success'
      );
    } finally {
      clearTimeout(stepTimer);
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

  // Handler: Export the docket (print) with an active-pipeline guard.
  const handleExportDocket = () => {
    if (activePipeline) printComplianceDocket();
    else showNotification('Select a municipal pathway first to export a citizen docket.', 'warn');
  };

  // Handler: Download the docket as a real PDF file.
  const handleExportPdf = async () => {
    if (!activePipeline) {
      showNotification('Select a municipal pathway first to export a citizen docket.', 'warn');
      return;
    }
    try {
      await downloadComplianceDocketPdf(`civicroute-docket-${activePipeline.id || 'route'}.pdf`);
      showNotification('Citizen action docket exported as PDF.', 'success');
    } catch (err) {
      console.warn('PDF export failed, falling back to print dialog:', err);
      printComplianceDocket();
    }
  };

  // Handler: Copy a shareable link that restores this pathway + progress.
  const handleShare = async () => {
    if (!activePipeline) {
      showNotification('Select a municipal pathway first to share it.', 'warn');
      return;
    }
    const completed = (activePipeline.nodes || []).filter((n) => n.status === 'completed').map((n) => n.id);
    const url = buildShareUrl({
      key: isDynamicRoute ? null : activeKey,
      query: isDynamicRoute ? activeSearchQuery : null,
      completed,
      ward: selectedWard,
    });
    try {
      await navigator.clipboard.writeText(url);
      showNotification('Shareable link copied to clipboard.', 'success');
    } catch {
      showNotification('Copy failed — you can copy the link from the address bar.', 'warn');
    }
  };

  // Restore state from a shared link on first load (before falling back to localStorage).
  useEffect(() => {
    const shared = parseShareState();
    if (!shared) return;
    if (shared.ward) setSelectedWard(shared.ward);

    const applyCompleted = (key) => {
      if (!shared.completed?.length) return;
      setPipelines((prev) => {
        const p = prev[key];
        if (!p) return prev;
        const completedSet = new Set(shared.completed);
        const marked = (p.nodes || []).map((n) => (completedSet.has(n.id) ? { ...n, status: 'completed' } : n));
        return { ...prev, [key]: { ...p, nodes: resolveDependencies(marked) } };
      });
    };

    if (shared.key && INITIAL_PIPELINES[shared.key]) {
      setActiveKey(shared.key);
      setIsDynamicRoute(false);
      applyCompleted(shared.key);
    } else if (shared.query) {
      setActiveSearchQuery(shared.query);
      handleSearchIntent(shared.query);
    }
    // Clear share params from the URL so a refresh doesn't re-trigger.
    window.history.replaceState({}, '', window.location.pathname);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="app-container bg-[#f1f2f4] dark:bg-[#090a0f] text-zinc-900 dark:text-zinc-100 font-sans min-h-screen flex flex-col transition-colors duration-200">
      {/* Stackable Toast Notifications */}
      <ToastStack toasts={toasts} onDismiss={dismiss} />

      {/* 1. Top Navigation Bar */}
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        onExportDocket={handleExportDocket}
        onExportPdf={handleExportPdf}
        onShare={handleShare}
        canExport={!!activePipeline}
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
        {/* Active Resolution Loader Stepper + Skeleton */}
        {isLoading && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-zinc-900 border border-blue-200 dark:border-blue-900/60 rounded-2xl p-4 shadow-sm flex items-center space-x-3.5">
              <Loader2 className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-spin shrink-0" />
              <div>
                <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Synthesizing Official Regulatory Lineage</p>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">{loadingStatus}</p>
              </div>
            </div>
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 grid grid-cols-2 gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-32 rounded-xl bg-zinc-100 dark:bg-zinc-800/60 animate-pulse" />
                ))}
              </div>
              <div className="lg:col-span-4 space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-16 rounded-xl bg-zinc-100 dark:bg-zinc-800/60 animate-pulse" />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Integrated Command Omnibar & Metric Ribbon */}
        <SearchConsole
          pipeline={activePipeline}
          readinessScore={readiness.percentage}
          onSearchIntent={handleSearchIntent}
          activeSearchQuery={activeSearchQuery}
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
            onExportDocket={handleExportDocket}
            onExportPdf={handleExportPdf}
            onShare={handleShare}
            verification={verification}
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
        verification={verification}
      />

      {/* 4. Privileged Clerk / Steward Audit Modal */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onElevateRole={handleElevateRole}
        activePipeline={activePipeline}
        onUpdatePipelineNode={handleUpdatePipelineNode}
        verification={verification}
      />

      {/* 5. Clean Institutional Footer */}
      <Footer
        onOpenAdmin={() => setIsAdminOpen(true)}
        onNotify={showNotification}
      />

      {/* 6. Printable Compliance Action Docket */}
      {activePipeline && <PrintDocket pipeline={activePipeline} />}
    </div>
  );
}