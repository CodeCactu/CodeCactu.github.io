# Backend

- Entry `backend/app.ts`: `Bun.serve` with `routes` map; all routes under `/api/*` plus `/uploads/games/:gameId/:filename`.
  Handlers wrapped `withCors( ... )` and, for user-scoped routes, `withCors( withAuth( handler ) )`; handler signature `(req:Bun.BunRequest, user:User)`.
- CORS allowlist in `src/features/server/index.ts`. New frontend origins must be added there.
- Errors: JSON `{ code:"UPPER_SNAKE" }` + HTTP status (`getApiError( code, status )`).
- Request validation with zod (`z.object(...).safeParse`), 400 `BAD_REQUEST` on failure.
- DB: `bun:sqlite`, `src/db.ts` opens `data/db.sqlite` relative to CWD -> run from `backend/`. DB and uploads (except `uploads/games/*/about.json`) are gitignored.
- Auth: Discord OAuth (`src/features/auth/discord`, `src/features/discord`); session token in HttpOnly cookie `sessionToken`, plus readable `sessionExpiresAt` cookie.
- Secrets via env: `CACTU_CLIENT_ID`, `CACTU_CLIENT_SECRET`, `CACTU_BOT_TOKEN` (`src/config.ts`).
- Games: `src/features/games/` (`Game.ts`, votes, comments, categories); game folders in `uploads/games/<discordUserId>-<name>/`.
- Docker: `oven/bun` image, `bun run app.ts`.
