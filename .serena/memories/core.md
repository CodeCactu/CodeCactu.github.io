# Core

Cactu community site: Discord-login, CactuJam game jam listing + voting/comments. UI text is Polish.
Monorepo, no root package.json; each module installs/runs separately.

## Source map
- `backend/` — Bun HTTP API (port 3001), SQLite. Details: `mem:backend/core`.
- `frontend/` — Astro SSR + Svelte 5 site (port 3000 dev/prod config). Current code: `mem:frontend/core`; target architecture for new code: `mem:frontend/architecture`; redesign port plan: `mem:frontend/redesign`.
- `project/` — design work, not shipped: `brand/` (generated brand exports, not kept: `demo/tools/export-brand.py` recreates them), `characters/` (sprite sheets per character),
  `demo/` (static HTML prototypes of the home page redesign), `references/` (screenshots). Details: `mem:project/demo`.

## Invariants
- Files/dirs prefixed `_` are private and gitignored (e.g. `backend/_release.sh`, `backend/_calcVotes.ts`); don't commit or rely on them.
  Exception: `frontend/src/pages/**/_utils/` (Astro ignores `_` dirs as routes; these are tracked).
- `.env` files exist in both modules; never print/commit them.
- Path aliases in both modules: `@fet/*` -> `src/features/*`, `@lib/*` -> `src/lib/*`, `@/*` -> `src/*`.

## Further memories
- Stack, versions, package manager: `mem:tech_stack`
- Dev/build/lint commands: `mem:suggested_commands`; this machine's shell and paths (local, not committed): `mem:local/environment`
- Code style rules (strict, user-defined): `mem:conventions`
- What to run before declaring a task done: `mem:task_completion`
