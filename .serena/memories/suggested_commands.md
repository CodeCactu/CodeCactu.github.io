# Suggested commands

Run each module from its own folder.

- Backend dev: `cd backend; bun install; bun run dev` (= `bun --watch app.ts`, port 3001; needs `backend/.env` and `data/db.sqlite`).
- Frontend dev: `cd frontend; bun install; bun run dev` (astro dev on Bun's runtime, port 3000). Build `bun run build`, preview `bun run preview`.
- Type check: `bun run check` (frontend: astro check + svelte-check; backend: tsc --noEmit).
- Lint: `bun run lint` in `backend/` or `frontend/` (`bun run lint:fix` to autofix; Oxlint, config in each module's `oxlint.config.ts` + shared `oxlint.eye.ts`).
- Frontend tests: `bun test` from `frontend/` (`node:test` API, `*.test.ts` next to the code).
- Translations (from `frontend/`): `bun run translations:generate` (typed `_translation/index.ts` per slice; also part of `check`), `translations:collect` / `translations:update` (exchange files for POEditor in `frontend/translations/`).
- Demo screenshots: `sh project/demo/tools/shoot.sh` (POSIX shell; drives headless Edge or Chrome, override with `BROWSER=<path>`).
