# CivicRoute — Municipal Bureaucracy Path Visualizer

<div align="center">

![CivicRoute Logo](frontend/public/logo.png)

### Directed Acyclic Graph (DAG) Compliance Workbench for Urban Local Governance

[![React 18](https://img.shields.io/badge/React-18.3.1-blue.svg?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.0.1-646CFF.svg?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.16-38B2AC.svg?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933.svg?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.22.3-black.svg?logo=express&logoColor=white)](https://expressjs.com/)
[![Google Gemini AI](https://img.shields.io/badge/Google_Gemini-2.5_Flash-orange.svg?logo=google&logoColor=white)](https://ai.google.dev/)
[![Python](https://img.shields.io/badge/Python-3.10+-3776AB.svg?logo=python&logoColor=white)](https://www.python.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

*A production-ready compliance intelligence workbench that models bureaucratic prerequisite dependencies, calculates citizen readiness, and synthesizes verifiable clearance pathways for municipal and state services.*

</div>

---

## 🏛️ Overview

Navigating urban governance and commercial licensing across municipal corporations (such as the **Brihanmumbai Municipal Corporation / MCGM**) is historically plagued by hidden prerequisite bottlenecks, circular paperwork dependencies, and ambiguous turnaround times. 

**CivicRoute** transforms opaque bureaucratic procedures into a verifiable **Directed Acyclic Graph (DAG)**. It maps every statutory clearance stage, verifies prerequisite lineage, calculates live readiness scores, indexes official `.gov.in` gateways with Gazette circular citations, and outputs high-contrast, counter-ready physical compliance action dockets for municipal Citizen Facilitation Centers (CFC).

---

## 📸 Visual Tour

### 1. Main Compliance Workbench Overview
The command omnibar, statutory metric summary ribbon, horizontal topological milestone pipeline, and physical compliance enclosures desk:

![CivicRoute Compliance Workbench](docs/screenshots/workbench_overview.png)

---

### 2. Multi-Tab Milestone Inspection Drawer
Inspect mandatory upstream prerequisites, statutory fee challans, Right to Services (RTS) act SLAs, interactive document enclosure checklists, and verified `.gov.in` gateway endpoints:

![Milestone Inspection Drawer](docs/screenshots/step_drawer_open.png)

---

### 3. Tabular Clearance Directory & DAG View
Flexible layout visualization modes including the high-density Tabular List with concrete status iconography (`Satisfied`, `Ready to File`, `Locked`) and topological DAG graph trees:

![Tabular Clearance Directory](docs/screenshots/tabular_directory.png)

---

## ⚡ Core Features

- **Integrated Command Omnibar**: Single-field civic intent search bar with instant `Enter` key execution and pre-configured quick seeds (*Gumasta License, FSSAI Food License, Property Tax Mutation, Rooftop Solar Net-Metering, Commercial Water Connection, Fire NOC*).
- **Live Portal Verification (real, not decorative)**: Each official `.gov.in` link is checked live by the backend — genuine government domain, HTTPS, reachability, real TLS certificate details, and a real content hash — surfaced as honest *Reachable / Unreachable / Not verified* badges. Requests are restricted to a government-domain allowlist (SSRF-safe) and cached.
- **Shareable Pathways**: Copy a link that encodes the selected pathway and your completed milestones so anyone can open the same roadmap and progress (no server-side storage).
- **PDF & Print Export**: Download the citizen action docket as a real PDF (`jsPDF` + `html2canvas`) or print it via the high-contrast print stylesheet.
- **Single Source of Truth**: All pipeline definitions live in `backend/seeds/` and are served over the API, with a bundled frontend fallback for offline use — no data duplication/drift.
- **Topological Milestone Pipeline**: Horizontal roadmap with explicit overflow protection, continuous SVG connector rails, and dynamic prerequisite lock/unlock cascading.
- **Physical Enclosures Desk**: Dedicated side desk for mandatory physical municipal submissions—notarized ₹100 stamp paper indemnity bonds, municipal zero-dues clearance receipts, and registered cooperative housing society (CHS) NOCs.
- **Multi-Tab Step Drawer**: Slide-out drawer displaying upstream dependency lineage jump-links, RTS Act turnaround guarantees, interactive document check-off, and gazette circular hashes.
- **Multi-Layout Lineage Switcher**: Toggle effortlessly between **Horizontal Roadmap**, **Tabular Directory**, and **DAG Graph** views.
- **Clerk & Steward Audit Portal**: Restricted administrative module for data stewards to calibrate statutory fees, update SLA timelines, and verify gazette circular hashes.
- **Printable Citizen Action Docket**: Browser-native print stylesheet that generates clean, high-contrast physical dockets for citizen counter submissions.
- **Fail-Safe Live AI Resolution**: Express backend integrating Google Gemini 2.5 (`@google/genai`) with automatic graceful fallback to verified local DAG definitions when offline.

---

## 🛠️ Complete Tech Stack

| Layer | Technologies | Description |
| :--- | :--- | :--- |
| **Frontend Framework** | **React 18.3.1**, **Vite 6.0.1** | Component-driven SPA with fast HMR |
| **Styling & Design System** | **Tailwind CSS 3.4.16**, **Vanilla CSS** | Warm neutral institutional palette (`#f1f2f4`), custom typography |
| **Icons & Visuals** | **Lucide React 0.468** | High-density status icons, chevrons, institutional badges |
| **Backend API** | **Node.js (ES Modules)**, **Express 4.22.3** | REST API service for dynamic clearance roadmap synthesis |
| **AI / Intent Engine** | **Google Gemini 2.5 Flash** (`@google/genai`) | LLM prompt engineering with structured JSON schema enforcement |
| **Graph & Dependency Logic** | **JavaScript DAG Engine**, **Python 3 Solver** | In-degree topological sorting (Kahn's algorithm) & cycle detection |
| **Printing & Export** | **CSS `@media print` engine** | High-contrast printable municipal compliance dockets |

---

## 📂 Repository Structure

```text
civicroute/
├── backend/                        # Express API Backend
│   ├── src/
│   │   ├── server.js               # API server: hardened middleware, routes, Gemini + failover
│   │   ├── pipelines.js            # Seed loader, catalog, fee summing, keyword matcher
│   │   └── verify.js               # Honest URL verification (SSRF-safe, TLS + hash, cached)
│   ├── seeds/                      # Canonical pipeline definitions (single source of truth)
│   ├── .env.example                # Template for environment variables
│   ├── package.json                # Backend deps (@google/genai, express, helmet, morgan, rate-limit)
│   └── README.md
├── frontend/                       # React + Vite Frontend
│   ├── public/
│   │   ├── favicon.ico             # CivicRoute favicon
│   │   ├── favicon.png
│   │   └── logo.png                # Official emblem & brand mark
│   ├── src/
│   │   ├── components/
│   │   │   ├── AdminModal.jsx      # Clerk & Data Steward console (live URL audit)
│   │   │   ├── Footer.jsx          # Footer with honest, non-impersonating links
│   │   │   ├── Header.jsx          # Ward switcher, theme, Share / Docket / PDF actions
│   │   │   ├── MilestoneCanvas.jsx # 12-col workbench & physical enclosures desk
│   │   │   ├── MilestoneList.jsx   # Multi-view roadmap / tabular / DAG switcher
│   │   │   ├── MilestoneTree.jsx   # True branching SVG DAG (fan-out / fan-in)
│   │   │   ├── PrintDocket.jsx     # Printable counter-ready compliance docket
│   │   │   ├── SearchConsole.jsx   # Command omnibar, metric ribbon & readiness bar
│   │   │   ├── StepDrawer.jsx      # Multi-tab inspection drawer (real provenance)
│   │   │   ├── ToastStack.jsx      # Stackable toast notifications
│   │   │   ├── VerificationBadge.jsx # Honest verification status badge
│   │   │   └── WelcomeCatalog.jsx  # Catalog directory (fed by the API)
│   │   ├── data/
│   │   │   └── pipelines.js        # Bundled offline fallback pipelines
│   │   ├── hooks/
│   │   │   ├── useToasts.js        # Toast state
│   │   │   └── useVerification.js  # Live URL verification state
│   │   ├── styles/                 # animations.css, variables.css
│   │   ├── utils/
│   │   │   ├── api.js              # Single API client (catalog, resolve, verify) + offline fallback
│   │   │   ├── dagResolver.js      # Topological resolution & readiness math
│   │   │   ├── printUtils.js       # Print + real PDF export
│   │   │   └── shareState.js       # Encode/decode shareable pathway links
│   │   ├── config.js               # VITE_API_URL-driven API base URL
│   │   ├── App.jsx                 # Core application shell & state coordinator
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json                # Frontend dependencies
│   ├── tailwind.config.js          # Tailwind CSS styling configuration
│   └── vite.config.js              # Vite bundler configuration
├── python/
│   └── solver.py                   # Standalone Python topological sort engine
├── docs/
│   └── screenshots/                # Application documentation screenshots
├── package.json                    # Monorepo root automation scripts
├── LICENSE                         # MIT License
└── README.md                       # Comprehensive project documentation
```

---

## 🚀 How to Run Manually on Any Device

Follow these instructions to clone, configure, and run CivicRoute on macOS, Linux, or Windows.

### Prerequisites

Ensure you have the following installed:
- **Node.js**: `v18.0.0` or higher ([Download Node.js](https://nodejs.org/))
- **npm**: `v9.0.0` or higher (bundled with Node.js)
- **Git**: ([Download Git](https://git-scm.com/))
- *(Optional)* **Python 3**: For running the standalone topological solver script.

---

### Step 1: Clone the Repository

Open your terminal or command prompt:

```bash
git clone https://github.com/Aditya099pat/civicroute.git
cd civicroute
```

---

### Step 2: Configure Environment Variables

1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Create your `.env` configuration file:
   - On **Linux / macOS**:
     ```bash
     cp .env.example .env
     ```
   - On **Windows (PowerShell)**:
     ```powershell
     Copy-Item .env.example .env
     ```
3. Open `.env` in any text editor and configure it:
   ```env
   PORT=5000
   GEMINI_API_KEY=your_gemini_api_key_here
   GEMINI_MODEL=gemini-2.5-flash
   GEMINI_FALLBACK_MODEL=gemini-2.0-flash
   CORS_ORIGIN=http://localhost:5173
   ALLOWED_VERIFY_HOSTS=.gov.in,.gov,.nic.in
   ```
   > 💡 *Note: If you do not have a Gemini API key, you can leave it blank. CivicRoute automatically fails over to its verified local municipal pipeline database without crashing.*

   *(Optional)* To point the frontend at a non-default backend, copy `frontend/.env.example` to `frontend/.env` and set `VITE_API_URL`.

4. Return to the project root:
   ```bash
   cd ..
   ```

---

### Step 3: Install Dependencies

You can install all dependencies from the root directory with:

```bash
npm run install:backend
npm run install:frontend
```

Alternatively, install manually inside each folder:

```bash
# Install backend dependencies
cd backend && npm install && cd ..

# Install frontend dependencies
cd frontend && npm install && cd ..
```

---

### Step 4: Run the Application

#### Option A: Run in Two Terminals (Recommended for Development)

**Terminal 1 — Start the Backend API (Port 5000):**
```bash
npm run backend
```
*(Or `cd backend && npm run dev`)*

You will see:
```text
CivicRoute Backend running on port 5000
Health check available at http://localhost:5000/health
```

**Terminal 2 — Start the Frontend Dev Server (Port 5173):**
```bash
npm run dev
```
*(Or `cd frontend && npm run dev`)*

You will see:
```text
  VITE v6.0.1  ready in 320 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

---

#### Option B: Access from Mobile or Other Devices on Local Network (LAN)

To access CivicRoute from another device on the same Wi-Fi network (e.g., your smartphone, tablet, or another laptop):

1. Start the frontend with the `--host` flag:
   ```bash
   npm --prefix frontend run dev -- --host
   ```
2. Vite will display your local IP address:
   ```text
   ➜  Local:   http://localhost:5173/
   ➜  Network: http://192.168.1.15:5173/
   ```
3. Open `http://<YOUR_LOCAL_IP>:5173/` in any browser on your connected device.

---

### Step 5: (Optional) Run the Standalone Python Solver

If you want to test the topological sorting and cycle detection engine directly in Python:

```bash
python python/solver.py
```

Output:
```text
Topological Clearance Order: ['1', '2', '3', '4', '5']
Ready next when [1] is completed: ['2']
```

---

## 🧪 Validating the Production Build

To verify that the frontend compiles cleanly for production:

```bash
npm run build
```

To preview the built production bundle locally:

```bash
npm run preview
```

---

## 📡 API Reference

### Health Check
- **Endpoint**: `GET /api/health` (alias: `GET /health`)
- **Response**:
  ```json
  {
    "status": "healthy",
    "service": "CivicRoute Backend API",
    "version": "1.1.0",
    "uptimeSeconds": 42,
    "aiConfigured": true,
    "timestamp": "2026-09-28T01:00:00.000Z"
  }
  ```

### Pipeline Catalog (single source of truth)
- **Endpoint**: `GET /api/pipelines` — metadata list for the directory UI.
- **Endpoint**: `GET /api/pipelines/:key` — a full pipeline (e.g. `/api/pipelines/cloud_kitchen`).
- The frontend consumes these and falls back to a bundled copy of the same seeds when the backend is offline, so the two never drift.

### Live URL Verification (honest trust signals)
- **Endpoint**: `POST /api/verify-urls`
- **Request Body**: `{ "urls": ["https://foscos.fssai.gov.in", "https://incometax.gov.in"] }`
- Returns only **observed facts** per URL — whether the host is a genuine government domain, HTTPS, reachable (HTTP status), real TLS certificate details, and a real content hash. Requests are restricted to an allowlist of government domain suffixes (SSRF protection), and results are cached for 30 minutes.
- **Response** (per URL):
  ```json
  {
    "results": {
      "https://foscos.fssai.gov.in": {
        "hostname": "foscos.fssai.gov.in",
        "isHttps": true,
        "isGovDomain": true,
        "reachable": true,
        "statusCode": 200,
        "tls": { "protocol": "TLSv1.3", "issuer": "…", "validTo": "…", "trusted": true },
        "contentHash": "sha256:…",
        "verified": true,
        "checkedAt": "2026-09-28T01:00:00.000Z"
      }
    }
  }
  ```

### Generate Regulatory Pipeline
- **Endpoint**: `POST /api/generate-path`
- **Request Body**:
  ```json
  {
    "query": "Commercial rooftop solar net-metering",
    "location": "Mumbai (MCGM Ward K-West)"
  }
  ```
- **Response Schema**:
  ```json
  {
    "task": "Commercial Rooftop Solar Grid-Tie & Net-Metering Setup",
    "jurisdiction": "Brihanmumbai Municipal Corporation (MCGM) & MSEDCL/BEST",
    "totalFee": "₹4,250",
    "nodes": [
      {
        "id": "1",
        "code": "SLR-01",
        "title": "Structural Roof Stability & No-Objection Certificate",
        "department": "MCGM Building Proposal Dept / Licensed Structural Engineer",
        "fee": "₹1,500",
        "estimatedDays": "5-7 Days",
        "status": "available",
        "prerequisites": [],
        "documentsRequired": [
          "Structural Stability Certificate by Registered Engineer",
          "Property Tax Zero-Dues Receipt",
          "Building Plan Sanction Copy"
        ],
        "officialUrl": "https://autodcr.mcgm.gov.in"
      }
    ],
    "edges": [
      { "from": "1", "to": "2" }
    ]
  }
  ```

---

## 🛡️ License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for complete details.

---

<div align="center">
  <sub>Developed for Transparent, Accountable, and Frictionless Urban Governance.</sub>
</div>
