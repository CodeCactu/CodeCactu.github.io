# Task completion

- Changed backend or frontend code: run `bunx eslint <changed files>` in that module; fix all reported issues (style rules are lint errors).
- Frontend changes affecting pages/build: `bun run build` in `frontend/` must succeed.
- Touched code with tests (`*.test.ts`): run `bun test` in that module.
- Redesign work: compare the result with `project/demo/v3` at 1920/1417/1100/390 px; tick the step in `frontend/REDESIGN.md`.
- No type-check script exists; rely on build + editor diagnostics (Serena `lsp.get_diagnostics_for_file`).
- Demo (`project/demo`) changes: no build/lint; verify by opening the page or re-rendering with `tools/shoot.sh`; update `project/demo/README.md` when layout/files change.
- Don't commit unless asked; never commit `_*` private files, `.env`, sqlite DBs or uploads.
