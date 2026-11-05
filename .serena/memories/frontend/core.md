# Frontend

Target structure and rules for new code: `mem:frontend/architecture`. The redesign port (plan, what is legacy): `mem:frontend/redesign`.
Below: the current (pre-redesign) code.

- Astro 7, `output: server`, `@astrojs/node` standalone adapter, port 3000; Svelte 5 islands (`client:load`).
- Pages: `src/pages/index.astro`, `src/pages/cactu-jam/`. Page-local components in `_utils/`.
- Layouts: `src/layouts/RootLayout` (normalize/prose/row css), `src/layouts/SquaresOverlayLayout` (the current site's square-block overlay look).
- Features: `src/features/<feature>/` (auth, backends/cactu, controls, dynamicBackgrounds, flow, theme, tierLadder). Shared helpers `src/lib/core/`.
- Styling: CSS Modules `*.module.css` imported as `classes`; scoped name `_[hash:base64:5]-[local]` (vite config). Global css vars like `--color-green`.
- Brand font "cactu" in `src/features/theme/font/`; Lato via Astro fonts API (`--fontFamily-lato`).
- Backend access: `fetchCactu( urn, { body } )` (`src/features/backends/cactu/fetchCactu.ts`) prefixes `clientConfig.BACKEND_ORIGIN` (env `BACKEND_ORIGIN`); TanStack query-core client in `backends/queryClient.ts`.
- Config: `prepareConfig` (`src/lib/prepareConfig`); `config.client.ts` (safe for browser) vs `config.ts` (imports `@fet/serverOnly`, server-only).
- Global reactive state as Svelte runes in `*.svelte.ts` (e.g. `features/auth/authRune.svelte.ts`).
- Server-side page caching: `Astro.cache.set({ maxAge, swr })` with `memoryCache()` provider.
