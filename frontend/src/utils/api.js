import { INITIAL_PIPELINES, searchOrSynthesizePipeline } from "../data/pipelines";
import { apiUrl } from "../config";

/**
 * Single API client for the CivicRoute backend.
 * Every call degrades gracefully to local verified definitions when the
 * backend is unreachable, so the app keeps working fully offline.
 */

const DEFAULT_TIMEOUT_MS = 12000;

async function requestJson(url, options = {}, timeoutMs = DEFAULT_TIMEOUT_MS) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    if (!response.ok) {
      throw new Error(`Server returned HTTP ${response.status}`);
    }
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}

/** Sum "₹1,500"-style fee strings into a "₹3,000" total. */
export function sumFees(nodes = []) {
  let total = 0;
  let sawAmount = false;
  for (const node of nodes) {
    const match = String(node.fee || "").match(/([\d,]+(?:\.\d+)?)/);
    if (match) {
      const value = parseFloat(match[1].replace(/,/g, ""));
      if (!Number.isNaN(value)) {
        total += value;
        sawAmount = true;
      }
    }
  }
  if (!sawAmount) return null;
  return `₹${total.toLocaleString("en-IN")}`;
}

/** Normalize a raw backend/seed payload into the frontend pipeline shape. */
export function normalizePipeline(data, query = "") {
  const nodes = data.nodes || [];
  return {
    id: data.id || nodes[0]?.code || "CIV-LIVE",
    title: data.task || data.title || query,
    jurisdiction: data.jurisdiction || "Mumbai Municipal Corporation (MCGM)",
    totalFee: data.totalFee || sumFees(nodes) || "Statutory Fee Schedule Attached",
    primaryDept: data.primaryDept || nodes[0]?.department || "Municipal Facilitation Desk",
    cycleTime: data.cycleTime || "14 - 21 Business Days",
    nodes,
    edges: data.edges || [],
    telemetry: data.telemetry || null,
  };
}

/**
 * Resolve a civic intent into a DAG pipeline via the backend, falling back to
 * local synthesis when the endpoint is unreachable.
 */
export async function fetchBureaucracyPath(query, location = "Mumbai, Maharashtra") {
  try {
    const data = await requestJson(apiUrl("generate-path"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, location }),
    });
    return { pipeline: normalizePipeline(data, query), isOfflineFallback: false };
  } catch (err) {
    console.warn(`[API] Live endpoint unreachable (${err.message}). Using local seed.`);
    const match = searchOrSynthesizePipeline(query, INITIAL_PIPELINES);
    const fallback = match?.pipeline || INITIAL_PIPELINES.cloud_kitchen;
    return {
      pipeline: normalizePipeline(
        { ...fallback, telemetry: { engine: "Offline Client Cache", isFallback: true } },
        query
      ),
      matchKey: match?.key || null,
      isDynamic: !!match?.isDynamic,
      isOfflineFallback: true,
    };
  }
}

/** Fetch the pipeline catalog (metadata list). Falls back to bundled seeds. */
export async function fetchPipelineCatalog() {
  try {
    const data = await requestJson(apiUrl("pipelines"), {}, 6000);
    return { catalog: data.pipelines || data, isOfflineFallback: false };
  } catch (err) {
    console.warn(`[API] Catalog unreachable (${err.message}). Using bundled seeds.`);
    const catalog = Object.entries(INITIAL_PIPELINES).map(([key, p]) => ({
      key,
      id: p.id,
      title: p.title,
      jurisdiction: p.jurisdiction,
      primaryDept: p.primaryDept,
      totalFee: p.totalFee,
      cycleTime: p.cycleTime,
      stageCount: p.nodes?.length || 0,
    }));
    return { catalog, isOfflineFallback: true };
  }
}

/**
 * Live-verify a set of official URLs. Returns a map of url -> verification
 * result. When the backend is down, returns null so callers can show an
 * honest "not verified" state rather than a fabricated one.
 */
export async function verifyUrls(urls = []) {
  const unique = [...new Set(urls.filter(Boolean))];
  if (!unique.length) return {};
  try {
    const data = await requestJson(
      apiUrl("verify-urls"),
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls: unique }),
      },
      15000
    );
    return data.results || {};
  } catch (err) {
    console.warn(`[API] Verification unreachable (${err.message}).`);
    return null;
  }
}
