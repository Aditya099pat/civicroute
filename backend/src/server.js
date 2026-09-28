import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: '*' }));
app.use(express.json());

// Initialize Google Gen AI client safely
let ai = null;
if (process.env.GEMINI_API_KEY) {
  try {
    ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  } catch (err) {
    console.warn("[CivicRoute Backend] Failed to initialize GoogleGenAI:", err.message);
  }
}

// Enforced Output Schema for Gemini
const civicGraphSchema = {
  type: Type.OBJECT,
  properties: {
    task: { type: Type.STRING, description: "Normalized civic or commercial activity name" },
    jurisdiction: { type: Type.STRING, description: "Target municipal ward or city department" },
    nodes: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING, description: "Sequential ID: '1', '2', '3', etc." },
          code: { type: Type.STRING, description: "Short regulatory reference code, e.g., 'DOC-8812'" },
          title: { type: Type.STRING, description: "Official name of the certificate, NOC, or license" },
          department: { type: Type.STRING, description: "Responsible municipal or state department" },
          officeType: {
            type: Type.STRING,
            enum: ["Online", "Physical Ward Office", "Hybrid"],
            description: "How the citizen applies"
          },
          estimatedDays: { type: Type.STRING, description: "Estimated SLA turnaround, e.g., '3-5 Days'" },
          fee: { type: Type.STRING, description: "Official statutory government fee, e.g., '₹1,500'" },
          officialUrl: { type: Type.STRING, description: "Direct authentic .gov or .gov.in URL" },
          documentsRequired: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Specific documentation enclosures required"
          },
          prerequisites: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Array of node IDs that MUST be approved prior to this node"
          }
        },
        required: [
          "id", "code", "title", "department", "officeType",
          "estimatedDays", "fee", "officialUrl", "documentsRequired", "prerequisites"
        ]
      }
    }
  },
  required: ["task", "jurisdiction", "nodes"]
};

// Topological Edge Calculator
function computeEdges(nodes) {
  const edges = [];
  for (const node of nodes) {
    const prereqs = node.prerequisites || node.prereqs || [];
    if (Array.isArray(prereqs)) {
      for (const parentId of prereqs) {
        edges.push({
          id: `e${parentId}-${node.id}`,
          source: String(parentId),
          target: String(node.id)
        });
      }
    }
  }
  return edges;
}

// Initial status initializer: root nodes (no prerequisites) become 'available', all others become 'locked'
function initializeStatuses(nodes) {
  return nodes.map((node) => {
    const prereqs = node.prerequisites || node.prereqs || [];
    const isRoot = !prereqs || prereqs.length === 0;
    return {
      ...node,
      status: isRoot ? "available" : "locked"
    };
  });
}

function getFallbackSeed(query = '') {
  const q = query.toLowerCase();

  let seedFile = 'food_business.json';
  if (q.includes('solar') || q.includes('rooftop') || q.includes('msedcl') || q.includes('net meter') || q.includes('net-meter') || q.includes('pv')) {
    seedFile = 'rooftop_solar.json';
  } else if (q.includes('gumasta') || q.includes('shop') || q.includes('establishment')) {
    seedFile = 'gumasta_license.json';
  } else if (q.includes('fssai') || q.includes('food') || q.includes('bakery') || q.includes('restaurant')) {
    seedFile = 'fssai_license.json';
  } else if (q.includes('fire') || q.includes('noc')) {
    seedFile = 'fire_noc.json';
  } else if (q.includes('property') || q.includes('tax') || q.includes('mutation')) {
    seedFile = 'property_tax.json';
  } else if (q.includes('water') || q.includes('plumber') || q.includes('tapping') || q.includes('pipeline')) {
    seedFile = 'water_connection.json';
  }

  const filePath = path.join(__dirname, '..', 'seeds', seedFile);
  try {
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }
  } catch (err) {
    console.error(`[Seed Parse Error] in ${seedFile}:`, err.message);
  }

  // Final emergency fallback if the requested file had a syntax error
  const fallbackDefault = path.join(__dirname, '..', 'seeds', 'food_business.json');
  try {
    if (fs.existsSync(fallbackDefault)) {
      return JSON.parse(fs.readFileSync(fallbackDefault, 'utf-8'));
    }
  } catch (e) {
    console.error("Default seed also failed:", e.message);
  }

  return null;
}

// Core Resolver Route
app.post('/api/generate-path', async (req, res) => {
  const { query, location } = req.body;
  const userQuery = query || 'Register a small business';
  const userLocation = location || 'Mumbai, Maharashtra';

  const startTime = Date.now();

  try {
    if (!ai || !process.env.GEMINI_API_KEY) {
      throw new Error("Missing or unconfigured GEMINI_API_KEY.");
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
    try {
      response = await ai.models.generateContent({
        model: 'gemini-flash-latest',
        contents: `Map out the complete civic compliance roadmap for: ${userQuery} in ${userLocation}`,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: 'application/json',
          responseSchema: civicGraphSchema,
          temperature: 0.2
        }
      });
    } catch (e1) {
      console.warn(`[Gemini Flash-Latest] notice: ${e1.message}. Falling back to gemini-3.8-flash...`);
      response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Map out the complete civic compliance roadmap for: ${userQuery} in ${userLocation}`,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: 'application/json',
          responseSchema: civicGraphSchema,
          temperature: 0.2
        }
      });
    }

    const parsedData = JSON.parse(response.text);

    // Compute dynamic edges and initial statuses
    const nodesWithStatus = initializeStatuses(parsedData.nodes);
    const edges = computeEdges(nodesWithStatus);

    const latency = Date.now() - startTime;

    return res.status(200).json({
      task: parsedData.task,
      jurisdiction: parsedData.jurisdiction,
      nodes: nodesWithStatus,
      edges,
      telemetry: {
        parserLatencyMs: latency,
        engine: 'Gemini Flash (Structured Schema)',
        isFallback: false
      }
    });

  } catch (error) {
    console.warn(`[Resolver Error] Using pre-compiled failover seed: ${error.message}`);

    const fallbackData = getFallbackSeed(userQuery);
    if (fallbackData) {
      return res.status(200).json({
        ...fallbackData,
        telemetry: {
          parserLatencyMs: Date.now() - startTime,
          engine: 'Verified Seed Fallover',
          isFallback: true
        }
      });
    }

    return res.status(500).json({
      error: "Failed to resolve municipal path and no cached seed was available.",
      details: error.message
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`[CivicRoute Backend] Running on http://localhost:${PORT}`);
});