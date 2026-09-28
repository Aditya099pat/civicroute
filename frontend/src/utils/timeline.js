/**
 * Critical-Path / CPM scheduling over a clearance DAG.
 *
 * Turns each node's `estimatedDays` text into numeric durations, then computes
 * an earliest-start / earliest-finish schedule, the critical path (the chain
 * that dictates total time), which clearances can run in parallel, and a
 * realistic earliest-completion date (business days).
 */
import { checkDAGCycles } from './dagResolver';

/** Parse "3-5 Business Days" | "Instant (Existing)" | "1 Day" -> { min, max }. */
export function parseDuration(text = '') {
  const t = String(text).toLowerCase();
  if (t.includes('instant')) return { min: 0, max: 0 };
  const nums = (t.match(/\d+/g) || []).map(Number);
  if (nums.length === 0) return { min: 0, max: 0 };
  if (nums.length === 1) return { min: nums[0], max: nums[0] };
  return { min: Math.min(...nums), max: Math.max(...nums) };
}

const durOf = (node) => parseDuration(node.estimatedDays || node.time || '').max;
const prereqsOf = (node, byId) =>
  (node.prerequisites || node.prereqs || []).filter((p) => byId.has(p));

/** Add `n` business days (skipping Sat/Sun) to a start date. */
export function businessDaysFromNow(n, from = new Date()) {
  const d = new Date(from);
  let added = 0;
  while (added < n) {
    d.setDate(d.getDate() + 1);
    const day = d.getDay();
    if (day !== 0 && day !== 6) added += 1;
  }
  return d;
}

/**
 * Compute the full CPM schedule.
 * Returns per-node timing, the critical path, parallel groups, and totals.
 */
export function computeSchedule(nodes = []) {
  if (!nodes.length) {
    return { schedule: new Map(), criticalIds: new Set(), parallelGroups: [], projectDays: 0, sequentialDays: 0, order: [] };
  }
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const { order: topo } = checkDAGCycles(nodes);
  const order = topo.length === nodes.length ? topo : nodes.map((n) => n.id); // cycle fallback

  // Forward pass: earliest start / finish.
  const es = new Map();
  const ef = new Map();
  order.forEach((id) => {
    const node = byId.get(id);
    const parents = prereqsOf(node, byId);
    const start = parents.length ? Math.max(...parents.map((p) => ef.get(p) ?? 0)) : 0;
    es.set(id, start);
    ef.set(id, start + durOf(node));
  });
  const projectDays = Math.max(0, ...order.map((id) => ef.get(id)));

  // Backward pass: latest start / finish -> slack -> critical.
  const lf = new Map();
  const ls = new Map();
  const successors = new Map(nodes.map((n) => [n.id, []]));
  nodes.forEach((n) => prereqsOf(n, byId).forEach((p) => successors.get(p).push(n.id)));
  [...order].reverse().forEach((id) => {
    const node = byId.get(id);
    const succ = successors.get(id) || [];
    const latestFinish = succ.length ? Math.min(...succ.map((s) => ls.get(s) ?? projectDays)) : projectDays;
    lf.set(id, latestFinish);
    ls.set(id, latestFinish - durOf(node));
  });

  const criticalIds = new Set();
  const schedule = new Map();
  nodes.forEach((n) => {
    const slack = (ls.get(n.id) ?? 0) - (es.get(n.id) ?? 0);
    const critical = slack <= 0;
    if (critical) criticalIds.add(n.id);
    schedule.set(n.id, {
      es: es.get(n.id) ?? 0,
      ef: ef.get(n.id) ?? 0,
      duration: durOf(n),
      slack: Math.max(0, slack),
      critical,
    });
  });

  // Parallel groups: nodes sharing a dependency rank (same depth) with >1 member.
  const rank = new Map();
  const visiting = new Set();
  const calcRank = (id) => {
    if (rank.has(id)) return rank.get(id);
    if (visiting.has(id)) return 0;
    visiting.add(id);
    const ps = prereqsOf(byId.get(id), byId);
    const r = ps.length ? 1 + Math.max(...ps.map(calcRank)) : 0;
    visiting.delete(id);
    rank.set(id, r);
    return r;
  };
  nodes.forEach((n) => calcRank(n.id));
  const byRank = [];
  nodes.forEach((n) => {
    const r = rank.get(n.id);
    (byRank[r] = byRank[r] || []).push(n);
  });
  const parallelGroups = byRank
    .filter((g) => g && g.length > 1)
    .map((g) => g.map((n) => ({ id: n.id, title: n.title })));

  const sequentialDays = nodes.reduce((sum, n) => sum + durOf(n), 0);

  return { schedule, criticalIds, parallelGroups, projectDays, sequentialDays, order };
}

/** Format a Date as "12 Nov 2026". */
export function formatDate(date) {
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}
