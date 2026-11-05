# Suggested commands

Run each module from its own folder.

- Backend dev: `cd backend; bun install; bun run dev` (= `bun --watch app.ts`, port 3001; needs `backend/.env` and `data/db.sqlite`).
- Frontend dev: `cd frontend; bun install; bun run dev` (astro dev on Bun's runtime, port 3000). Build `bun run build`, preview `bun run preview`.
- Type check: `bun run check` (frontend: astro check + svelte-check; backend: tsc --noEmit).
- Lint: `bun install; bun run lint` from the repository root, for both modules (`bun run lint:fix` to autofix; Oxlint, one root `oxlint.config.ts`; the root `package.json` holds only the lint tools).
- Frontend tests: `bun test` from `frontend/` (`node:test` API, `*.test.ts` next to the code).
- Translations (from `frontend/`): `bun run translations:generate` (typed `_translation/index.ts` per slice; also part of `check`), `translations:collect` / `translations:update` (exchange files for POEditor in `frontend/translations/`).
- Demo screenshots: `sh project/demo/tools/shoot.sh` (POSIX shell; drives headless Edge or Chrome, override with `BROWSER=<path>`).
