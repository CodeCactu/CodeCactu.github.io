# Redesign: porting the v3 prototype

The site's new look is designed in a static prototype, `project/demo/v3/` (open `index.html` and `jam.html` from disk;
`project/demo/README.md` describes it). This file is the plan for building it for real in `frontend/`, following
`ARCHITECTURE.md`. Work through the steps in order, one or two per session; tick them off and note decisions here.

The prototype is the visual and behavioural reference, not code to copy: its scripts are classic browser scripts sharing
globals. Port each part into typed modules with small interfaces, keeping the behaviour and the look.

## What the prototype is

- **The frame** (both pages): the "void" (near-black page background, tinted per character), a sticky **rail** on the left
  (the logo's signet, the main navigation, the account at the bottom), the full logo in the top left corner, which folds into
  the signet on scroll, and a smooth **pointer trail** on the void. On phones the rail becomes a bottom tab bar.
- **Zones**: pixel art appears only inside zones, holes in the void cut in blocks of `12 × 3` px cells with corners rounded
  like the cactu font's letters (`curves.js`: `traceCells`, `roundedPath`), with a soft inner shadow. Everything outside
  zones is smooth.
- **Pixel worlds** (`world.js`): a canvas scene per character: sky with dithered gradient, stars, sky art (auroras, glowing
  bodies), drifting lines and clouds, far and near hills, ground, props, walking or floating character sprites, parallax with
  the pointer, a pixel pointer trail with per-character sparks. Its darkest layers have a lightness floor (`shell.js`,
  `LIGHTNESS_FLOOR`) so zone edges read against the void.
- **Characters** (`cast.js`): the cast (`CHARACTERS`), each with a night scene (`NIGHT`: sky base, glow, terrain, colours,
  props, characters), scenery (`SCENERY`) and sky art (`shell.js`, `SKY_ART`). The **shown character** (`?character=`, kept in
  `sessionStorage`, default `evolveye`) tints the whole page (`--void`, `--glow`, `--edge`, `--earth`) and picks the worlds.
- **Home** (`index.html`, `main.js`): the hero, a large zone shaped around the logo, the rail and the cast panel; the cast
  list (roster) on the right selects the shown character; a chip links to the running CactuJam.
- **CactuJam** (`jam.html`, `jam.js`, `jam.css`): a low band zone with the title in a pocket of void at its bottom left
  ("Więcej miejsca" header); the edition's terms ("Zasady edycji": theme, extra themes, duration, assets rule); three
  columns: instructions with the vote's progress, the source list of games, the category tier tables (drag and drop, only
  logged in); clicking a game opens its card anchored over the instructions (CSS anchor positioning) with a description,
  rating buttons per category (voting without dragging, keyboard friendly) and a comment field.
  Kept for later, not shown: the "Panel" header (`?header=panel`), the title on a pixel panel floating in the band's sky,
  with real selectable text over it (`panelImage`, `panelLayout`).

## Target slices

| Slice | Holds | From the prototype |
| --- | --- | --- |
| `lib/cellShapes/` | Tracing filled cells into outlines, rounded paths, sliver removal; seeded random | `curves.js` (`traceCells`, `roundedPath`, `withoutSlivers`, ...), `utils.js` (`seeded`) |
| `lib/dragDrop/` | Headless pointer drag engine: press threshold, pointer capture, ghost, placeholder slot, FLIP reordering, edge autoscroll, click suppression after a drag, Escape to cancel; rules as callbacks (`canDrop`) | `jam.js` (`listenToDrags` ... `flip`) |
| `lib/core/color/` | Colour helpers: `mix`, lightness (CIE L*), lightness floor | `utils.js` (`mix`), `shell.js` (`withFloor`, `lightnessOf`), `world.js` (`hexToRgb`) |
| `theme/` | Tokens (`tokens.css`), fonts (cactu local; Atkinson Hyperlegible, JetBrains Mono, Tiny5 via Astro fonts), the character tint (`tintFor( character )`, `@property` registrations) and the inline no-flash tint script | `style.css` `:root`, `shell.js` (`ambientOf`, `tintPage`) |
| `controls/` | `Button`, `Link`, `NavItem`, `Chip` (the now chip, the voting deadline), `SegmentedChoice` (rating buttons), `IconButton` | `style.css`, `jam.css` |
| `flow/` | `Row`, `Columns`, `Stack`, `Popover` (incl. anchored), `Sheet` (phones' bottom sheet), `Loader`, `DefinitionRow` (the edition's terms) | `jam.css` (`.gameCard`, `.jamBrief`) |
| `icons/` | Icon components (move `src/icons/` here) | `shell.js` (`ICONS`) |
| `brand/` | The logo pieces (wordmark, signet, full logo), folding on scroll, the cactus avatar drawing | `brand.svg`, `brand-word.svg`, `signet.svg`, `shell.js` (`foldBrandOnScroll`), `world.js` (`drawCactusAvatar`) |
| `cast/` | The characters: ids, names, sprite sheets (imported as assets), scenes, sky art, trail sparks; the shown character as a rune (`shownCharacter.svelte.ts`: URL param, `sessionStorage`, links keep it) | `cast.js`, `shell.js` (`SKY_ART`, `TRAIL_SPARKS`, `shownCharacter`, `keepCharacterInLinks`), `project/characters/` |
| `pixelWorld/` | The canvas engine (`createPixelWorld( canvas, scene ) → { destroy }`), its layers as internal modules, sprite loading, the pixel trail and sparks, plates; `PixelWorld.svelte` mounting it | `world.js`, `shell.js` (`worldOptions`, `createSkyArt`, `trailRamp`) |
| `zones/` | `Zone.svelte`: a field whose shape comes from a function prop (cells → path), clipped content, the inner shadow, rebuilt on resize | `curves.js` (`prepareShapeSvg`), `main.js` (`watchField`, `buildField`), `jam.js` (`watchBand`, `buildBand`) |
| `shell/` | The app frame: `Rail`, `MainNav`, `AccountSlot`, `BrandHead`, the phone tab bar, `VoidTrail` (smooth pointer trail) | `shell.js` (`startShell`, `startTrail`), `style.css` |
| `auth/` | Session, the auth rune, the rail's account (avatar, name, level, login through Discord) | existing `features/auth/` + `style.css` (`.railAccount`) |
| `cactuJam/` | Only what both pages need about the running edition: its data (`edition.ts`: number, themes, dates, the voting deadline) and its phase ("głosowanie jeszcze 2 dni"), shown by the home page's chip and the jam page | `index.html` (`.nowChip`), `jam.html` (`.jamPhase`, `.jamBrief`) |
| `translation/` | Polish dictionaries for all of the above, plural helper | `jam.js` (`plural`), every UI text |

Layout: `layouts/AppLayout/` replaces `RootLayout` + `SquaresOverlayLayout`.

### Page code

Code used by one page only stays with that page (`ARCHITECTURE.md`, "Where code goes"):

| Page | Its own code | From the prototype |
| --- | --- | --- |
| `pages/index.astro`, code in `pages/_home/` | The hero shape around the logo, the rail and the cast panel; the cast panel with the roster; selecting a character | `main.js` (`createHeroShape`, `clearances`, `buildCastPanel`, `fillRoster`, `selectCharacter`) |
| `pages/cactu-jam/index.astro`, code beside it | The band header (band shape, title pocket, the optional panel), the edition's terms, the voting board (source list, tier tables, game card, progress, saved state, comments) on `backends/cactu` and `auth`, the board's drag rules on `lib/dragDrop` | `jam.js`, `jam.css`, `jam.html` |

If a piece of a page is later needed elsewhere (say the game card on a results page), it moves to a feature then.

## Steps

Each step ends with `bun run lint` and `bun run check` clean, `bun test` and `bun run build` passing, and the result compared with the prototype at 1920,
1417, 1100 and 390 px wide.

1. [x] **Groundwork.** Scripts through Bun (`bunx --bun astro ...`); remove `package-lock.json`; decide on unused dependencies
   (`nanostores`, `vanjs-core`); cascade layers; `translation/` with the Polish dictionary and a `t()` helper. Library
   versions are updated in a separate pass, not here.
   Done: scripts run on Bun (Astro 7 needs Node 22.22+, Bun avoids that), `package-lock.json` removed, `nanostores` and
   `vanjs-core` removed (unused), dead React/Next leftovers removed; the layers `reset, theme, lib, features, layout` declared
   in `RootLayout.css` (move to `AppLayout` in step 5); `features/translation/` with the utilities (`createTranslator`,
   languages), texts owned by slices in `_translation/<name>.<language>.yml` (POEditor's YAML shape, plurals as nested forms),
   types and POEditor exchange by `translations/translations.ts`; plurals by `Intl.PluralRules`; markdown for long texts comes with the first long text. Tooling: Oxlint replaced ESLint; `bun run check`.
2. **Theme.** Tokens from the prototype's `style.css` and `jam.css` (`--void`, `--glow`, `--edge`, `--earth`, ink colours,
   `--card`, radii, `--column-gap:28px`, fonts); the character tint with `@property`; the inline script in the layout's
   `<head>` that applies the shown character's tint before the first paint (SSR does not know `sessionStorage`).
3. **lib.** `cellShapes`, `core/color`, `dragDrop`, each with `bun test` tests for its pure parts.
4. **Characters and worlds.** `cast/` (data typed, sprites imported), `pixelWorld/` (engine split into layer modules, one
   public `createPixelWorld`), `PixelWorld.svelte`.
5. **Frame.** `zones/`, `brand/`, `shell/`, `auth` account, `AppLayout`; navigation keeps `?character=`; the void trail.
   Decide whether to keep `ClientRouter` view transitions (the rail and trail canvas could persist across pages).
6. **Home.** `pages/_home/`: the hero, the roster; the now chip from `features/cactuJam`; replaces `CactuBanner` and the old
   layout on `/`.
7. **CactuJam.** The page's own code beside `pages/cactu-jam/index.astro`: header, terms, board on the real API (games, categories, votes, comments, session); the drag
   rules from the prototype (copy from the list, move within a category only, drop on the list to remove); the anchored
   card; phones (list as a bottom strip, card as a sheet). Replaces `tierLadder/` and `GamesTable.svelte`.
8. **Cleanup.** Remove the legacy code below; update `ARCHITECTURE.md` and the Serena memories.

## Data the backend does not serve yet

Kept in `features/cactuJam/edition.ts` (used by both pages) until an endpoint exists:

- The edition: number, theme, extra themes (at least one required), duration, the assets rule, the voting deadline. The
  real values come from the edition's announcement on Discord; the prototype's are made up, as are its games and authors
  (the real ones come from `/api/games`). Real jam data is not committed: in code it comes from the backend, or from a
  file filled in at release time.
- Category labels, descriptions and the text of every rating, per category id (`theme`, `readability`, `impressions`,
  `realisation`, `rules`, `bonus`); the backend serves only `name` and `highestValue`. They are used by the jam page only,
  so they stay with it (its texts in the translation dictionary); today they are in `pages/cactu-jam/_utils/GamesTable.svelte`.

Votes are `Record<categoryId, Record<ratingValue, gameId[]>>`, as the backend stores them (`PUT /api/games/votes/@my`).

## Open decisions

- Keep or drop `ClientRouter` (view transitions).
- English as a second language now or later (the structure supports both).
- The "Panel" header: keep its code with the jam page behind an option, or drop it.
- Where the game thumbnails come from (uploads via the backend's `/uploads/games/:gameId/:filename`; the prototype draws
  stand-ins).

## Legacy (replace, do not extend)

`layouts/SquaresOverlayLayout/`, `layouts/RootLayout/` (its parts move to `AppLayout` and `theme`),
`pages/_utils/CactuBanner/`, `features/dynamicBackgrounds/` (`CactuBlinkingLines`, `CactuShadyTrail`),
`features/tierLadder/`, `pages/cactu-jam/_utils/GamesTable.svelte`, `lib/core/flow/*.astro` (become Svelte in `flow/`),
the Lato font, `src/icons/` (moves to `features/icons/`).
