# Tech stack

- Runtime/package manager: Bun (Dockerfiles use `oven/bun`; `bun.lock` in both modules).
- TypeScript strict everywhere (frontend extends `astro/tsconfigs/strict`; TS ^6).
- Backend: Bun.serve, `bun:sqlite`, zod 4, formidable, node-fetch.
- Frontend: Astro ^7 (SSR, node adapter), Svelte ^5 (runes), @tanstack/query-core, sharp, TypeScript 6 (7 waits for `@astrojs/check`). Scripts run Astro on Bun's runtime.
- Lint: Oxlint (native rules + JS plugins `@stylistic`, `eslint-plugin-spaces`, `sonarjs`, `import-x` for import order): the rules of the author's `eslint-config-eye` in the shared root `oxlint.eye.ts` (style in `mem:conventions`). Runs on Bun (`bunx --bun oxlint`) so its TS config loads on any Node.
- Tests: only `frontend/src/lib/core/functions/stringUtils.test.ts`, written against `node:test` + `node:assert`.
- Demos (`project/demo`): vanilla HTML/CSS/JS, canvas pixel rendering; Python/Node export scripts in `tools/`.
