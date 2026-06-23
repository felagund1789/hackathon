# GitHub Copilot Enterprise Hackathon

This repository contains the frontend hackathon challenge workspace and supporting guidance.

## Table of Contents

- [Repository Layout](#repository-layout)
- [Quick Start](#quick-start)
- [Run the Frontend Challenge](#run-the-frontend-challenge)
- [Verified Frontend Commands](#verified-frontend-commands)
- [Troubleshooting](#troubleshooting)
- [Copilot Workflow References](#copilot-workflow-references)

## Repository Layout

- `challenges/challenge-4-frontend/`: React + TypeScript frontend challenge app
- `tracks/`: Track overview and stage-by-stage challenge instructions
- `docs/`: Copilot usage, prompt engineering, and MCP server guidance
- `TROUBLESHOOTING.md`: Expanded troubleshooting reference

Start with [tracks/challenge-4-frontend-track.md](tracks/challenge-4-frontend-track.md).

If this is your first time in this workspace, read [tracks/getting-started.md](tracks/getting-started.md) first.

## Quick Start

1. Open the repository in VS Code.
2. Open the challenge folder:

	```bash
	cd challenges/challenge-4-frontend
	```

3. Install dependencies:

	```bash
	npm install
	```

4. Start development server:

	```bash
	npm run dev
	```

5. Open the local URL shown by Vite (default port is 5173).

## Run the Frontend Challenge

The challenge app is a React 18 + TypeScript task dashboard using Vite and Tailwind CSS.

Verified from source and config:

- Entry point: `src/main.tsx`
- Router and pages: `src/App.tsx`
- Routes:
  - `/` (Dashboard)
  - `/kanban` (Kanban board)
  - `/tasks` (Task list)
  - `/tasks/:id` (Task detail)
- Dev server config: `vite.config.ts` (host `0.0.0.0`, port `5173`)

## Verified Frontend Commands

Run these commands from `challenges/challenge-4-frontend/`.

| Command | Purpose |
|---|---|
| `npm run dev` | Start Vite development server |
| `npm run build` | Type-check with `tsc` and build production assets |
| `npm run preview` | Preview the production build |
| `npm run test` | Run Vitest |
| `npm run test:coverage` | Run Vitest with coverage |

## Troubleshooting

For full platform and Copilot troubleshooting, see [TROUBLESHOOTING.md](TROUBLESHOOTING.md).

Quick fixes for the frontend challenge:

1. Dependency install issues

	```bash
	rm -rf node_modules package-lock.json
	npm install
	```

2. Dev server does not start

	- Confirm you are in `challenges/challenge-4-frontend/`
	- Re-run `npm run dev`
	- If another process holds the port, stop it and restart

3. TypeScript build failures

	```bash
	npm run build
	```

	Fix reported TypeScript errors first, then rerun build.

4. Test command fails

	```bash
	npm run test
	```

	Rerun with coverage to check broader failures:

	```bash
	npm run test:coverage
	```

## Copilot Workflow References

- [tracks/challenge-4-frontend-track.md](tracks/challenge-4-frontend-track.md)
- [docs/copilot-guide.md](docs/copilot-guide.md)
- [docs/prompt-engineering.md](docs/prompt-engineering.md)
- [docs/mcp-servers.md](docs/mcp-servers.md)
