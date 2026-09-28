import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

import { getCatalog, getPipeline, matchSeed, sumFees } from './pipelines.js';
import { verifyUrls } from './verify.js';
import { buildAskSystemPrompt, buildAskContents } from './assistant.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const VERSION = '1.1.0';
const START_TIME = Date.now();
const PRIMARY_MODEL = process.env.GEMINI_MODEL || 'gemini-flash-latest';
const FALLBACK_MODEL = process.env.GEMINI_FALLBACK_MODEL || 'gemini-3.8-flash';

// ---- Security & platform middleware --------------------------------------
app.use(helmet());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

const corsOrigin = process.env.CORS_ORIGIN || '*';
app.use(
  cors({
    origin: corsOrigin === '*' ? '*' : corsOrigin.split(',').map((s) => s.trim()),
  })
);
app.use(express.json({ limit: '256kb' }));

const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please slow down.' },
});
app.use('/api/', apiLimiter);

// ---- Gemini client (optional) --------------------------------------------
let ai = null;
if (process.env.GEMINI_API_KEY) {
  try {
    ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  } catch (err) {
    console.warn('[CivicRoute Backend] Failed to initialize GoogleGenAI:', err.message);
  }
}

const civicGraphSchema = {
  type: Type.OBJECT,
  properties: {
    task: { type: Type.STRING, description: 'Normalized civic or commercial activity name' },
    jurisdiction: { type: Type.STRING, description: 'Target municipal ward or city department' },
    nodes: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING, description: "Sequential ID: '1', '2', '3', etc." },
          code: { type: Type.STRING, description: "Short regulatory reference code, e.g., 'DOC-8812'" },
          title: { type: Type.STRING, description: 'Official name of the certificate, NOC, or license' },
          department: { type: Type.STRING, description: 'Responsible municipal or state department' },
          officeType: {
            type: Type.STRING,
            enum: ['Online', 'Physical Ward Office', 'Hybrid'],
            description: 'How the citizen applies',
          },
          estimatedDays: { type: Type.STRING, description: "Estimated SLA turnaround, e.g., '3-5 Days'" },
          fee: { type: Type.STRING, description: "Official statutory government fee, e.g., '₹1,500'" },
          officialUrl: { type: Type.STRING, description: 'Direct authentic .gov or .gov.in URL' },
          documentsRequired: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'Specific documentation enclosures required',
          },
          prerequisites: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'Array of node IDs that MUST be approved prior to this node',
          },
        },
        required: [
          'id', 'code', 'title', 'department', 'officeType',
          'estimatedDays', 'fee', 'officialUrl', 'documentsRequired', 'prerequisites',
        ],
      },
    },
  },
  required: ['task', 'jurisdiction', 'nodes'],
};

// ---- DAG helpers ----------------------------------------------------------
function computeEdges(nodes) {
  const edges = [];
  for (const node of nodes) {
    const prereqs = node.prerequisites || node.prereqs || [];
    if (Array.isArray(prereqs)) {
      for (const parentId of prereqs) {
        edges.push({ id: `e${parentId}-${node.id}`, source: String(parentId), target: String(node.id) });
      }
    }
  }
  return edges;
}

function initializeStatuses(nodes) {
  return nodes.map((node) => {
    const prereqs = node.prerequisites || node.prereqs || [];
    return { ...node, status: !prereqs || prereqs.length === 0 ? 'available' : 'locked' };
  });
}

async function generateWithModel(model, systemPrompt, userQuery, userLocation) {
  const response = await ai.models.generateContent({
    model,
    contents: `Map out the complete civic compliance roadmap for: ${userQuery} in ${userLocation}`,
    config: {
      systemInstruction: systemPrompt,
      responseMimeType: 'application/json',
      responseSchema: civicGraphSchema,
      temperature: 0.2,
    },
  });
  return response;
}

// ---- Routes ---------------------------------------------------------------

// Catalog of verified seed pipelines (single source of truth for the UI).
app.get('/api/pipelines', (req, res) => res.json({ pipelines: getCatalog() }));

app.get('/api/pipelines/:key', (req, res) => {
  const pipeline = getPipeline(req.params.key);
  if (!pipeline) return res.status(404).json({ error: 'Pipeline not found' });
  return res.json(pipeline);
});

// Honest live verification of official portal URLs.
app.post('/api/verify-urls', async (req, res) => {
  const { urls } = req.body || {};
  if (!Array.isArray(urls) || urls.length === 0) {
    return res.status(400).json({ error: 'Provide a non-empty "urls" array.' });
  }
  try {
    const results = await verifyUrls(urls);
    return res.json({ results });
  } catch (err) {
    console.error('[Verify Error]', err.message);
    return res.status(500).json({ error: 'Verification failed.', details: err.message });
  }
});

// Grounded assistant: answer a question about one clearance step.
app.post('/api/ask', async (req, res) => {
  const { question, pipeline, node, history } = req.body || {};
  if (!question || typeof question !== 'string' || !question.trim()) {
    return res.status(400).json({ error: 'Provide a "question".' });
  }
  if (question.length > 500) {
    return res.status(400).json({ error: 'Question too long (max 500 characters).' });
  }
  if (!ai || !process.env.GEMINI_API_KEY) {
    return res.status(200).json({
      answer: 'The AI assistant is offline (no API key configured). Please check the official portal linked on this step for authoritative guidance.',
      offline: true,
    });
  }
  try {
    const systemInstruction = buildAskSystemPrompt({ pipeline: pipeline || {}, node: node || {} });
    const contents = buildAskContents(question.trim(), history);
    let response;
    try {
      response = await ai.models.generateContent({
        model: PRIMARY_MODEL,
        contents,
        config: { systemInstruction, temperature: 0.3 },
      });
    } catch (e1) {
      response = await ai.models.generateContent({
        model: FALLBACK_MODEL,
        contents,
        config: { systemInstruction, temperature: 0.3 },
      });
    }
    return res.status(200).json({ answer: response.text, offline: false });
  } catch (error) {
    console.error('[Ask Error]', error.message);
    return res.status(200).json({
      answer: 'I could not reach the assistant right now. Please refer to the official portal linked on this step.',
      offline: true,
    });
  }
});

// Resolve a civic intent into a DAG, with graceful seed failover.
app.post('/api/generate-path', async (req, res) => {
  const { query, location } = req.body || {};
  const userQuery = (typeof query === 'string' && query.trim()) || 'Register a small business';
  const userLocation = (typeof location === 'string' && location.trim()) || 'Mumbai, Maharashtra';

  if (userQuery.length > 300) {
    return res.status(400).json({ error: 'Query too long (max 300 characters).' });
  }

  const startTime = Date.now();

  try {
    if (!ai || !process.env.GEMINI_API_KEY) {
      throw new Error('Missing or unconfigured GEMINI_API_KEY.');
    }

    const systemPrompt = `You are an elite Municipal Bureaucracy Path Compiler and Regulatory Auditor for Indian civic bodies.
Analyze the user's civic or commercial goal: "${userQuery}" in jurisdiction "${userLocation}".
Deconstruct this task into a strict Directed Acyclic Graph (DAG) representing the complete legal sequence of forms, NOCs, licenses, and prerequisites.

Strict Requirements:
1. Prerequisites: Child clearances MUST list the exact 'id's of parent clearance nodes required before filing.
2. Official Provenance: All 'officialUrl' fields must link to real, authentic government websites (preferably .gov.in or .gov, such as aaplesarkar.mahaonline.gov.in, foscos.fssai.gov.in, portal.mcgm.gov.in, or incometax.gov.in). Do not invent fictitious domains.
3. Realistic Fees & SLAs: Provide actual Indian Rupee amounts and processing days based on government citizen charters.
4. Output must strictly conform to the provided JSON schema.`;

    let response;
    let engineModel = PRIMARY_MODEL;
    try {
      response = await generateWithModel(PRIMARY_MODEL, systemPrompt, userQuery, userLocation);
    } catch (e1) {
      console.warn(`[Gemini ${PRIMARY_MODEL}] notice: ${e1.message}. Falling back to ${FALLBACK_MODEL}...`);
      engineModel = FALLBACK_MODEL;
      response = await generateWithModel(FALLBACK_MODEL, systemPrompt, userQuery, userLocation);
    }

    const parsedData = JSON.parse(response.text);
    const nodesWithStatus = initializeStatuses(parsedData.nodes);
    const edges = computeEdges(nodesWithStatus);

    return res.status(200).json({
      task: parsedData.task,
      title: parsedData.task,
      jurisdiction: parsedData.jurisdiction,
      totalFee: sumFees(nodesWithStatus) || 'Statutory Fee Schedule Attached',
      primaryDept: nodesWithStatus[0]?.department || 'Municipal Facilitation Desk',
      cycleTime: '14 - 21 Business Days',
      nodes: nodesWithStatus,
      edges,
      telemetry: {
        parserLatencyMs: Date.now() - startTime,
        engine: `Gemini (${engineModel})`,
        isFallback: false,
      },
    });
  } catch (error) {
    console.warn(`[Resolver Error] Using pre-compiled failover seed: ${error.message}`);
    const fallbackData = matchSeed(userQuery);
    if (fallbackData) {
      return res.status(200).json({
        ...fallbackData,
        telemetry: {
          parserLatencyMs: Date.now() - startTime,
          engine: 'Verified Seed Failover',
          isFallback: true,
        },
      });
    }
    return res.status(500).json({
      error: 'Failed to resolve municipal path and no cached seed was available.',
      details: error.message,
    });
  }
});

// Health checks (both paths for compatibility).
function health(req, res) {
  res.json({
    status: 'healthy',
    service: 'CivicRoute Backend API',
    version: VERSION,
    uptimeSeconds: Math.round((Date.now() - START_TIME) / 1000),
    aiConfigured: !!ai,
    timestamp: new Date().toISOString(),
  });
}
app.get('/api/health', health);
app.get('/health', health);

app.listen(PORT, () => {
  console.log(`[CivicRoute Backend] Running on http://localhost:${PORT} (v${VERSION})`);
  console.log(`  Health: http://localhost:${PORT}/api/health`);
});
