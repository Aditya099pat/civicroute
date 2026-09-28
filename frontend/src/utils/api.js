import { PIPELINES, searchOrSynthesizePipeline } from "../data/pipelines";

const API_BASE_URL = "http://localhost:5000/api";

/**
 * Sends intent query to the backend and returns the resolved DAG.
 */
export async function fetchBureaucracyPath(query, location = "Mumbai, Maharashtra") {
    try {
        const response = await fetch(`${API_BASE_URL}/generate-path`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ query, location }),
        });

        if (!response.ok) {
            throw new Error(`Server returned HTTP ${response.status}`);
        }

        const data = await response.json();
        return { data, isOfflineFallback: false };
    } catch (err) {
        console.warn(`[API Warning] Live endpoint unreachable (${err.message}). Using local seed.`);

        const match = searchOrSynthesizePipeline(query, PIPELINES);
        const fallbackData = match?.pipeline || PIPELINES.cloud_kitchen;

        return {
            data: {
                task: fallbackData.title,
                jurisdiction: fallbackData.jurisdiction,
                nodes: fallbackData.nodes,
                edges: fallbackData.edges || [],
                telemetry: {
                    parserLatencyMs: 45,
                    engine: "Offline Client Cache (Safe Fallback)",
                    isFallback: true,
                },
            },
            isOfflineFallback: true,
        };
    }
}