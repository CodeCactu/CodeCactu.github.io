# Frontend architecture (target)

Authoritative: `frontend/ARCHITECTURE.md` (read before writing frontend code). Invariants:
- Astro + Svelte 5, run with Bun (`bunx --bun astro ...`, `bun test`, prod `bun dist/server/entry.mjs`).
- Placement by who uses it: one page only -> beside that page's `index.astro` (home: `pages/_home/`); several pages/layouts -> `features/`; any app -> `lib/`. Move down a level only when a second user appears; nothing imports a page's files.
- In `pages/`, every `.astro/.md/.ts/.js` file is a route: page code that is not a route gets a `_` prefix (`_rules.ts`, `_state.svelte.ts`) or a `_` folder; `.svelte`/`.css` need none.
- Every component is `.svelte` (esp. `controls/`, `flow/`); `.astro` only for pages (`index.astro`) and layouts.
  Components take everything via props (callbacks, snippets) so plain TS can `mount()` them (game logic, canvas engines).
- Vertical slices `src/features/<slice>/` with `index.ts` as the only import surface for other slices; logic in `.ts` beside components; runes in `*.svelte.ts`.
- Dependency direction pages -> layouts -> features -> lib. `src/lib/` = headless, general-purpose, no styling, no `@fet/`/`@/` imports (shareable like an npm package).
- Base slices: `theme` (semantic tokens, fonts, character tint), `controls`, `flow`, `translation` (pl default; no hard-coded UI text), `backends/<api>` (loadX/queryX/saveX), `serverOnly`.
- `config.ts` server-only (imports `@fet/serverOnly`), `config.client.ts` browser-safe (inlined via `config.astro`); env read only through `prepareConfig`.
- Strategic programming (Ousterhout): deep modules, information hiding, define errors out of existence, design big pieces twice.
