# CivicRoute Backend

Node.js / Express API for CivicRoute — pipeline catalog, AI path synthesis (Google
Gemini with verified-seed failover), and honest live URL verification.

## Getting Started

### Install dependencies
```bash
npm install
```

### Configure environment
```bash
cp .env.example .env   # then edit values (Windows: Copy-Item .env.example .env)
```

| Variable | Purpose |
| :--- | :--- |
| `PORT` | Port the API listens on (default `5000`). |
| `GEMINI_API_KEY` | Google Gemini key. Blank ⇒ verified-seed fallback mode. |
| `GEMINI_MODEL` / `GEMINI_FALLBACK_MODEL` | Primary / fallback model IDs. |
| `CORS_ORIGIN` | Comma-separated allowed origins, or `*`. |
| `ALLOWED_VERIFY_HOSTS` | Allowlist of host suffixes `/api/verify-urls` may contact (SSRF protection). |

### Run
```bash
npm run dev     # node --watch
# or: npm start
```

## Endpoints

| Method | Path | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` (`/health`) | Liveness, version, uptime, AI-configured flag. |
| `GET` | `/api/pipelines` | Catalog metadata for all seed pipelines. |
| `GET` | `/api/pipelines/:key` | Full pipeline by key (e.g. `cloud_kitchen`). |
| `POST` | `/api/generate-path` | Resolve a civic intent into a DAG (Gemini + seed failover). |
| `POST` | `/api/verify-urls` | Live-verify official URLs (HTTPS, gov domain, reachability, TLS, hash). |

Rate limiting (30 req/min per IP), `helmet` security headers, `morgan` logging, and a
256 KB JSON body limit are applied to all `/api/*` routes. Pipeline definitions live in
`seeds/` and are the single source of truth shared with the frontend.
