import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SEEDS_DIR = path.join(__dirname, '..', 'seeds');

/** Sum "₹1,500"-style fee strings into a "₹3,000" total. */
export function sumFees(nodes = []) {
  let total = 0;
  let sawAmount = false;
  for (const node of nodes) {
    const match = String(node.fee || '').match(/([\d,]+(?:\.\d+)?)/);
    if (match) {
      const value = parseFloat(match[1].replace(/,/g, ''));
      if (!Number.isNaN(value)) {
        total += value;
        sawAmount = true;
      }
    }
  }
  return sawAmount ? `₹${total.toLocaleString('en-IN')}` : null;
}

/** Load and normalize every seed JSON from disk (once, cached). */
let cache = null;
export function loadPipelines() {
  if (cache) return cache;
  const map = {};
  try {
    for (const file of fs.readdirSync(SEEDS_DIR)) {
      if (!file.endsWith('.json')) continue;
      try {
        const raw = JSON.parse(fs.readFileSync(path.join(SEEDS_DIR, file), 'utf-8'));
        const key = raw.key || file.replace(/\.json$/, '');
        map[key] = normalize(key, raw);
      } catch (err) {
        console.error(`[Seed Parse Error] ${file}:`, err.message);
      }
    }
  } catch (err) {
    console.error('[Seeds] Failed to read seeds directory:', err.message);
  }
  cache = map;
  return map;
}

function normalize(key, raw) {
  const nodes = raw.nodes || [];
  return {
    key,
    id: raw.id || nodes[0]?.code || 'CIV-SEED',
    title: raw.title || raw.task || key,
    task: raw.task || raw.title || key,
    jurisdiction: raw.jurisdiction || 'Mumbai Municipal Corporation (MCGM)',
    totalFee: raw.totalFee || sumFees(nodes) || 'Statutory Fee Schedule Attached',
    primaryDept: raw.primaryDept || nodes[0]?.department || 'Municipal Facilitation Desk',
    cycleTime: raw.cycleTime || '14 - 21 Business Days',
    nodes,
    edges: raw.edges || [],
  };
}

/** Lightweight catalog metadata for the welcome directory. */
export function getCatalog() {
  return Object.values(loadPipelines()).map((p) => ({
    key: p.key,
    id: p.id,
    title: p.title,
    jurisdiction: p.jurisdiction,
    primaryDept: p.primaryDept,
    totalFee: p.totalFee,
    cycleTime: p.cycleTime,
    stageCount: p.nodes.length,
  }));
}

export function getPipeline(key) {
  return loadPipelines()[key] || null;
}

/** Keyword router used as the AI failover. Mirrors the frontend matcher. */
export function matchSeed(query = '') {
  const q = query.toLowerCase();
  const pipelines = loadPipelines();
  const rules = [
    [['solar', 'rooftop', 'msedcl', 'net meter', 'net-meter', 'pv'], 'rooftop_solar'],
    [['gumasta', 'shop act', 'establishment'], 'gumasta_license'],
    [['cloud kitchen', 'bakery', 'food business'], 'cloud_kitchen'],
    [['fssai', 'restaurant', 'food'], 'fssai_license'],
    [['fire', 'cfo', 'extinguisher', 'noc'], 'fire_noc'],
    [['property', 'tax', 'mutation', 'sac'], 'property_tax'],
    [['water', 'plumber', 'tapping', 'pipeline'], 'water_connection'],
  ];
  for (const [keywords, key] of rules) {
    if (keywords.some((kw) => q.includes(kw)) && pipelines[key]) return pipelines[key];
  }
  return pipelines.cloud_kitchen || Object.values(pipelines)[0] || null;
}
