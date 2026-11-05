# Tech stack

- Runtime/package manager: Bun (Dockerfiles use `oven/bun`; `bun.lockb` backend, `bun.lock` frontend). `package-lock.json` files also exist but Bun is primary.
- TypeScript strict everywhere (frontend extends `astro/tsconfigs/strict`; TS ^6).
- Backend: Bun.serve, `bun:sqlite`, zod 4, formidable, node-fetch.
- Frontend: Astro ^7 (SSR, node adapter), Svelte ^5 (runes), nanostores, @tanstack/query-core, vanjs-core, sharp. Node >= 22.12.
- Lint: ESLint 9 flat config with the author's own `eslint-config-eye` (encodes the style in `mem:conventions`); frontend adds `eslint-plugin-astro`.
- Tests: only `frontend/src/lib/core/functions/stringUtils.test.ts`, written against `node:test` + `node:assert`.
- Demos (`project/demo`): vanilla HTML/CSS/JS, canvas pixel rendering; Python/Node export scripts in `tools/`.
