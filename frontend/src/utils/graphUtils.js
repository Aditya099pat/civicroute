/**
 * Re-evaluates node statuses across a pipeline DAG based on completed nodes.
 *
 * @param {Array} nodes - list of pipeline nodes
 * @param {string} toggledNodeId - id of node toggled
 * @returns {Array} updated nodes list
 */
export function toggleNodeAndRecalculate(nodes, toggledNodeId) {
  const targetNode = nodes.find(n => n.id === toggledNodeId);
  if (!targetNode || targetNode.status === 'locked') {
    return nodes;
  }

  // Toggle status between completed and available
  const newTargetStatus = targetNode.status === 'completed' ? 'available' : 'completed';

  const updatedNodes = nodes.map(n => {
    if (n.id === toggledNodeId) {
      return { ...n, status: newTargetStatus };
    }
    return { ...n };
  });

  // Iteratively update prerequisite requirements
  let changed = true;
  while (changed) {
    changed = false;
    const completedIds = new Set(
      updatedNodes.filter(n => n.status === 'completed').map(n => n.id)
    );

    for (let i = 0; i < updatedNodes.length; i++) {
      const node = updatedNodes[i];
      if (node.status === 'completed') continue;

      const allParentsMet = (node.prereqs || []).every(pid => completedIds.has(pid));
      const expectedStatus = allParentsMet ? 'available' : 'locked';

      if (node.status !== expectedStatus) {
        node.status = expectedStatus;
        changed = true;
      }
    }
  }

  return updatedNodes;
}

/**
 * Calculates pipeline readiness percentage
 */
export function calculateReadinessScore(nodes = []) {
  if (!nodes.length) return 0;
  const completed = nodes.filter(n => n.status === 'completed').length;
  return Math.round((completed / nodes.length) * 100);
}
