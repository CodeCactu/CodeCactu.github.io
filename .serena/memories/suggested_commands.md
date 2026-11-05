# Suggested commands

Run each module from its own folder.

- Backend dev: `cd backend; bun install; bun run dev` (= `bun --watch app.ts`, port 3001; needs `backend/.env` and `data/db.sqlite`).
- Frontend dev: `cd frontend; bun install; bun run dev` (astro dev, port 3000). Build `bun run build`, preview `bun run preview`.
- Lint: `bunx eslint .` in `backend/` or `frontend/` (add `--fix` to autofix style).
- Frontend test: `bun test src/lib/core/functions/stringUtils.test.ts` from `frontend/`.
- Demo screenshots: `sh project/demo/tools/shoot.sh` (POSIX shell; drives headless Edge or Chrome, override with `BROWSER=<path>`).
