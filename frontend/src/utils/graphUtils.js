import { resolveDAG, calculateReadiness } from './dagResolver';

export function toggleNodeAndRecalculate(nodes, toggledNodeId) {
  return resolveDAG(nodes, toggledNodeId);
}

export function calculateReadinessScore(nodes = []) {
  return calculateReadiness(nodes).percentage;
}

export * from './dagResolver';
