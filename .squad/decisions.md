# Squad Decisions

## Active Decisions

### 2026-04-28: MkDocs and GitHub Pages docs publishing shape (consolidated)

**By:** Rusty, Basher, Danny

**What:** Use plain MkDocs for the documentation site with a small curated entry layer, a root-level docs dependency manifest, and a dedicated GitHub Pages workflow. Keep the docs build command the same locally and in CI with `mkdocs build --strict`.

**Why:** This keeps the docs stack small, avoids unnecessary theme or plugin churn, and gives the team one validation path for both local work and Pages deployment. The curated entry layer can shape the reader flow without requiring a heavy second documentation system.

## Governance

- All meaningful changes require team consensus
- Document architectural decisions here
- Keep history focused on work, decisions focused on direction
