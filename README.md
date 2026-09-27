# CivicRoute

CivicRoute is a municipal bureaucracy pipeline visualizer that models clearance dependencies and readiness across civic workflows.

## Project structure

```text
civicroute/
├── frontend/                 # React + Vite UI
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── data/             # Pipeline seed/configuration data
│   │   ├── utils/            # Graph and printing helpers
│   │   ├── styles/           # Shared CSS variables/animations
│   │   ├── App.jsx           # Application shell
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   └── ...                   # Vite/Tailwind configuration
├── backend/
│   ├── src/
│   │   └── server.js         # Express API entry point
│   └── package.json
├── python/
│   └── solver.py             # Dependency/topological solver
├── package.json              # Root development scripts
└── README.md
```

## Development

```bash
npm install
npm run dev
```

The root install script installs frontend dependencies. Backend can be started separately with:

```bash
npm run backend
```

## Why generated files are excluded

`node_modules/`, Vite `dist/` output, Python caches, and Git metadata are intentionally not part of the project source package. They can be regenerated locally and make the project unnecessarily large.
