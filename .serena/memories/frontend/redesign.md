# Frontend redesign (port of project/demo/v3)

Plan + status: `frontend/REDESIGN.md` (steps 1-8, slice table mapping v3 functions to target slices, data the backend lacks, open decisions, legacy list).
- Reference = `project/demo/v3/` (`index.html` home, `jam.html` CactuJam); behaviour/look to match, code not to copy (classic global scripts).
- Legacy to replace, not extend: `layouts/SquaresOverlayLayout`, `layouts/RootLayout`, `pages/_utils/CactuBanner`, `features/dynamicBackgrounds`, `features/tierLadder`, `pages/cactu-jam/_utils/GamesTable.svelte`, `lib/core/flow/*.astro`, Lato.
- Home hero/roster -> `pages/_home/`; jam header/terms/board -> beside `pages/cactu-jam/index.astro`; `features/cactuJam/` holds only the edition data/phase both pages show.
- Not served by the backend: edition metadata (`features/cactuJam/edition.ts`), category/rating texts (jam page + translation dictionary).
- Mark finished steps in REDESIGN.md, not here.
