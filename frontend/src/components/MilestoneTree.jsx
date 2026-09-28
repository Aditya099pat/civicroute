import React from 'react';
import { Check, Unlock, Lock } from 'lucide-react';

/**
 * True branching Directed Acyclic Graph view.
 * Nodes are laid out in layers by prerequisite depth (longest path from a root),
 * so fan-out (one clearance unlocking several) and fan-in (a clearance needing
 * multiple parents) are shown as real edges rather than a flat list.
 */

const NODE_W = 168;
const NODE_H = 58;
const ROW_GAP = 104;
const TOP_PAD = 28;
const SIDE_PAD = 20;
const VB_WIDTH = 860;

function computeLayout(nodes) {
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const prereqsOf = (n) => (n.prerequisites || n.prereqs || []).filter((p) => byId.has(p));

  const rank = new Map();
  const visiting = new Set();
  const calcRank = (id) => {
    if (rank.has(id)) return rank.get(id);
    if (visiting.has(id)) return 0; // cycle guard
    visiting.add(id);
    const ps = prereqsOf(byId.get(id));
    const r = ps.length ? 1 + Math.max(...ps.map(calcRank)) : 0;
    visiting.delete(id);
    rank.set(id, r);
    return r;
  };
  nodes.forEach((n) => calcRank(n.id));

  const layers = [];
  nodes.forEach((n) => {
    const r = rank.get(n.id);
    (layers[r] = layers[r] || []).push(n);
  });

  const pos = new Map();
  layers.forEach((layerNodes, r) => {
    const count = layerNodes.length;
    const usable = VB_WIDTH - SIDE_PAD * 2;
    layerNodes.forEach((n, i) => {
      const cx = count === 1 ? VB_WIDTH / 2 : SIDE_PAD + NODE_W / 2 + (i * (usable - NODE_W)) / (count - 1);
      const cy = TOP_PAD + r * ROW_GAP;
      pos.set(n.id, { x: cx, y: cy });
    });
  });

  const height = TOP_PAD * 2 + (layers.length - 1) * ROW_GAP + NODE_H;
  return { pos, height, prereqsOf };
}

const STATUS = {
  completed: { fill: '#059669', stroke: '#047857', text: '#ffffff', label: 'Satisfied', Icon: Check },
  available: { fill: '#2563eb', stroke: '#1d4ed8', text: '#ffffff', label: 'Ready', Icon: Unlock },
  locked: { fill: '#e4e4e7', stroke: '#d4d4d8', text: '#3f3f46', label: 'Locked', Icon: Lock },
};

export default function MilestoneTree({ nodes = [], selectedNodeId, onSelectNode }) {
  if (!nodes.length) return null;
  const { pos, height, prereqsOf } = computeLayout(nodes);

  const edges = [];
  nodes.forEach((n) => {
    prereqsOf(n).forEach((pid) => {
      const from = pos.get(pid);
      const to = pos.get(n.id);
      if (from && to) edges.push({ from, to, done: nodes.find((x) => x.id === pid)?.status === 'completed', key: `${pid}-${n.id}` });
    });
  });

  return (
    <div className="bg-slate-50 dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800 rounded-xl p-4 sm:p-6 mt-4">
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h4 className="text-xs font-bold text-slate-900 dark:text-zinc-100 uppercase tracking-wider">
            Directed Prerequisite Lineage Graph (DAG)
          </h4>
          <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
            Layered by dependency depth. Branches show clearances that unlock (or require) several others.
          </p>
        </div>
        <div className="flex items-center gap-3 text-[10px] font-semibold">
          <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-600" />Satisfied</span>
          <span className="inline-flex items-center gap-1 text-blue-700 dark:text-blue-400"><span className="w-2.5 h-2.5 rounded-sm bg-blue-600" />Ready</span>
          <span className="inline-flex items-center gap-1 text-zinc-500 dark:text-zinc-400"><span className="w-2.5 h-2.5 rounded-sm bg-zinc-300 dark:bg-zinc-600" />Locked</span>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${VB_WIDTH} ${height}`}
          className="w-full h-auto min-w-[640px]"
          role="img"
          aria-label="Prerequisite dependency graph"
        >
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" className="fill-slate-400 dark:fill-zinc-600" />
            </marker>
            <marker id="arrow-done" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#059669" />
            </marker>
          </defs>

          {/* Edges */}
          {edges.map(({ from, to, done, key }) => {
            const x1 = from.x;
            const y1 = from.y + NODE_H / 2;
            const x2 = to.x;
            const y2 = to.y - NODE_H / 2;
            const midY = (y1 + y2) / 2;
            return (
              <path
                key={key}
                d={`M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`}
                fill="none"
                strokeWidth={done ? 2.5 : 1.5}
                className={done ? '' : 'stroke-slate-300 dark:stroke-zinc-700'}
                stroke={done ? '#059669' : undefined}
                markerEnd={done ? 'url(#arrow-done)' : 'url(#arrow)'}
              />
            );
          })}

          {/* Nodes */}
          {nodes.map((n, idx) => {
            const p = pos.get(n.id);
            if (!p) return null;
            const s = STATUS[n.status] || STATUS.locked;
            const isSelected = selectedNodeId === n.id;
            const x = p.x - NODE_W / 2;
            const y = p.y - NODE_H / 2;
            const title = String(n.title || '').replace(/\([^)]*\)/g, '').trim();
            const shortTitle = title.length > 30 ? `${title.slice(0, 29)}…` : title;
            return (
              <g
                key={n.id}
                transform={`translate(${x}, ${y})`}
                onClick={() => onSelectNode && onSelectNode(n.id)}
                className="cursor-pointer"
                role="button"
                aria-label={`${title} — ${s.label}`}
              >
                <title>{`${n.code} · ${n.title}\nStatus: ${s.label}\nFee: ${n.fee || '—'} · SLA: ${n.estimatedDays || n.time || '—'}`}</title>
                <rect
                  width={NODE_W}
                  height={NODE_H}
                  rx="12"
                  fill={n.status === 'locked' ? 'var(--dag-locked-bg, #f4f4f5)' : s.fill}
                  className={n.status === 'locked' ? 'fill-zinc-100 dark:fill-zinc-800' : ''}
                  stroke={isSelected ? '#2563eb' : s.stroke}
                  strokeWidth={isSelected ? 3 : 1.5}
                />
                <text x="12" y="22" style={{ fontSize: 10, fontWeight: 700, fontFamily: 'monospace' }} className={n.status === 'locked' ? 'fill-zinc-500 dark:fill-zinc-400' : ''} fill={n.status === 'locked' ? undefined : s.text}>
                  {idx + 1}. {n.code}
                </text>
                <text x="12" y="40" style={{ fontSize: 11, fontWeight: 700 }} className={n.status === 'locked' ? 'fill-zinc-700 dark:fill-zinc-200' : ''} fill={n.status === 'locked' ? undefined : s.text}>
                  {shortTitle}
                </text>
                <text x={NODE_W - 12} y="22" textAnchor="end" style={{ fontSize: 9, fontWeight: 700 }} opacity="0.9" className={n.status === 'locked' ? 'fill-zinc-400 dark:fill-zinc-500' : ''} fill={n.status === 'locked' ? undefined : s.text}>
                  {s.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
