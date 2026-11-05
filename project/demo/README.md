# Cactu demos

Static prototypes of the Cactu home page and brand. No build step: open the HTML files straight from disk (`file://`).
Scripts are classic scripts sharing globals (ES modules do not load from `file://`), so their order in the page matters.

## Layout

| Path | What it is |
| --- | --- |
| `lib/` | **Live** shared code: `brand.js` (logo, plates, signet), `world.js` (pixel worlds, sprites, props), `cactu-font.js` (the full cactu font, embedded), `smooth/` (the vector signet and banner pieces). Used by `brand-smooth.html` and by the next version. |
| `brand-smooth.html` | The smooth (vector) brand from the frontend (`lib/smooth/`: signet and its ASCII marks, copied from `frontend/src/pages/_utils/CactuBanner/svg/`): the logo as it is, the chosen hybrid logo "Niebo" (smooth signet and wordmark over the favourite pixel logo's exact sky from `lib/brand.js`: `STATIC_LINES`, `STARS` and the `dots` ending, no ground; left out below 72 px), options for the wordmark's ending in the favicon's shape and colours, hybrid favicons on a 16 px grid next to the current one with experiments around the ring, smooth replacements for its ASCII marks, three composed proposals and plain lockups. No configurator yet |
| `v3/index-phones.html` | v3 on three phones: start, another character's world, scrolled (`?static` for screenshots) |
| `v1/` | **Frozen** version 1: light, all pixel (`index.html`, `page.js`), and `zine.html` built on it (with its own copy of the frontend's `Banner-logo.svg`) |
| `v2/` | **Frozen** version 2: night with stepped pixel fields, a world per character, the cast panel |
| `v3/` | Version 3 (in progress): `index.html` is the home page's header (the logo in the void's corner folding into a sticky signet, the hero cut as a hole in blocks like the current site with a sticky rail of void on its left (signet, navigation, account) and the cast list in a column against its straight right side); `jam.html` is the CactuJam voting page in the same frame. Pixels only inside zones. See "v3 files" below |
| `tools/` | `frame.html` (fixed-size viewport for screenshots), `shoot.sh` (renders everything to `screenshots/`), `export-brand.py` (exports the chosen smooth brand to `project/brand/smooth/`, see below) |
| `screenshots/` | Output of `tools/shoot.sh`, created when it runs; not kept (git-ignored) |

Sprite sheets come from `project/characters/`. `world.js` finds them relative to its own file (two folders up), so a copy of it
works from any folder at the same depth (`lib/`, `v1/`, `v2/`, `v3/`…).

## Versions are frozen

Each `vN/` folder has its own copies of the shared files it uses, so changes in `lib/` never change an older version.
Fixes that should reach a frozen version have to be copied into its folder on purpose.

### v2 files

| File | Contents |
| --- | --- |
| `index.html` | Markup |
| `style.css` | All styles |
| `utils.js` | `mix()` (hex colours), `seeded()` (seeded random) |
| `cast.js` | Characters, their stand-in sprites (`STAND_INS`, `drawStandIn`), props (`PROPS`), night worlds (`NIGHT`), scenery (`SCENERY`) |
| `main.js` | The page: fields (`buildField`, `createShape`, `paintFill`, `paintEarth`), the hero (`buildHero`, `showHero`), the dock, the cast panel, walkers, portals, small things |

Key ideas: one unit of every pixel field is `P = 3` CSS px; the hero world is drawn at 2 px; the brand's dark navy
(`BRAND_DARK`, the dark plate of `brand.js`) is the base of the page, and the selected character adds its accents and its
own night in the worlds. `?character=<id>` picks the character, `?gradient=off` turns off the background gradient.

### v3 files

| File | Contents |
| --- | --- |
| `index.html`, `main.js` | Home page: the hero (`createHeroShape`, `showHero`) and the cast list |
| `jam.html`, `jam.css`, `jam.js` | CactuJam voting: a band of the character's world with the title in a pocket of void, the instruction (a game's card opens over it with CSS anchor positioning), the source list of games and the categories' tier tables with pointer drag and drop (FLIP animations, autoscroll at the window's edges). The card votes too, without dragging. Votes and comments are kept in `localStorage`. `?guest` starts logged out (the account button switches), `?empty` starts without votes. The games, their authors and the edition's terms are made up (the real ones come from the backend and are not committed) |
| `shell.js` | The frame every v3 page shares: icons, logo folding, pointer trail, XP pills, the void's colours (`tintPage`), worlds' sky art (`worldOptions`, `createSkyArt`). Links marked `data-page` keep `?character=`, and the shown character is kept for the session (`shownCharacter`) |
| `style.css` | The shared frame and the home page; `jam.css` only adds the jam page |
| `curves.js`, `utils.js`, `cast.js` | Zone outlines (`traceCells`, `roundedPath`), `mix`/`seeded`, the cast and night scenes |

Script order on every v3 page: `cactu-font.js`, `world.js`, `brand.js`, `utils.js`, `cast.js`, `curves.js`, `shell.js`, then the page's script.

## Starting the next version

1. Copy the version to start from: `cp -r v2 v3` (or start empty and take only what is needed).
2. Replace its copies of `brand.js`, `world.js`, `cactu-font.js` with the ones from `lib/` (`cp lib/{brand,world,cactu-font}.js v3/`),
   so it starts from the newest shared code.
3. Shared changes go to `lib/` first, then get copied into the version being worked on.
4. Add its views to `tools/shoot.sh`, e.g. `shoot v3-desktop "tools/frame.html?page=v3/index.html&width=1920&height=1080" 1920,1080`.

### v3 files

Started from v2 (`cast.js`, `utils.js`) with `brand.js`, `world.js`, `cactu-font.js` from `lib/`. Only the header exists so far;
`.page` has `min-height: 200vh` to try the sticky rail while scrolling, and a stand-in footer (`.pageFooter`) shows where the rail stops.

| File | Contents |
| --- | --- |
| `index.html` | Markup: the scrolling logo (`.brandHead`), the rail (`.rail`: the sticky signet, the main navigation `.mainNav`, the account `.railAccount`), the hero with the cast list (`.castPanel`), a stand-in footer |
| `style.css` | All styles |
| `signet.svg` | The original vector signet, copied from `frontend/src/pages/_utils/CactuBanner/svg/Banner-logo.svg` (its dots clipped to the cactus) |
| `favicon-{16,32,192}.png` | The chosen favicon ("Łagodniej, drobniejsze piksele (32)"), written by `tools/export-brand.py` (from `project/brand/smooth/`): 16 from its 16 grid, linked as PNGs only so a 16 px tab uses it; 192 also as the touch icon |
| `curves.js` | Zone edges: shapes in cells of `G = 12` px, traced (`traceCells`, optionally every loop) and drawn as SVG paths with corners rounded like the cactu letters (`roundedPath`, `CURVE`) |
| `main.js` | The page: the hero's hole (`buildField`, `createHeroShape`, `clearances`), the hero world with its sky art (`SKY_ART`, `createSkyArt`) and the brand's stage (`BRAND_STAGES`, `showBrandStage`, `STAGE_PAINTERS`), the cast list, small things |

Key ideas: **pixels live only inside zones** (the hero's world, portraits, the avatar); everything else is smooth. The hero is a
hole in the void cut in blocks of `HOLE_BLOCK = 3` cells (36 px, the current site's squares). Its height (`--hero-height` in `style.css`) is rounded down to whole blocks (`--block`), so it ends on the edges' own grid, and it is known in CSS before any script runs. Its left edge is cut in blocks as a
keyhole of void following one smooth curve (`curveThrough` over points taken from `clearances()`): wide at the top right,
running diagonally past the full logo down to its narrowest beside the signet's column, staying narrow down to about three
blocks above the navigation, then rising in a short straight diagonal into the navigation's corner (there rows only step in, never out, so the world keeps that room), sloping out past
the navigation and sweeping wide into the bottom edge (a stepped quarter circle of `corner`
blocks). The rail's things are always kept clear (`nearest`). Every block row steps a block in or out around that curve, at most two blocks
from the row above and never three rows in one straight line. On the right the scene ends in a straight line against the cast list's column. Everything stays clear of the rail's
column and the cast list (`clearances()` measures them); lone blocks sit one block away from it on both sides; the bottom is bitten in short runs of uneven depth, so it never runs straight for long (on phones the logo lies over the hero's top left and the void comes down around it: three or four blocks under the logo, stepping every two blocks, and two blocks beyond it, so the world reaches up beside the logo; the hero fills the screen down to the tab bar), and climbs in the bottom right
corner. Corners use `HOLE_CURVE`, the letters' rule seen from the void (the void's corners wide, the world's tight); the world is clipped with `clip-path: path( evenodd, … )` and the void casts a soft inner shadow (`.holeShadow`).

The logo lives in the void, not in the world: the final logo with its pixel sky's coloured lines spread up the sky
(`v3/brand.svg`, a copy of `cactu-logo-dark-lines-spread.svg` that `tools/export-brand.py` writes: the vector signet, the wordmark's outlines, the pixel rhombus
ending and the lines, no stars) at half size, so its pixels stay whole, in the top left corner (`BRAND` in `main.js`).
While the page scrolls the wordmark, the ending and the lines scroll away with the void (`.brandHead`: `v3/brand-word.svg`,
the same logo without its signet), while the sticky signet over the logo's own stays and shrinks to 58 px over the first
80 px of scrolling (`foldBrandOnScroll`), following the scroll position rather than a timer, so a fast scroll never leaves
the logo over the world.

On phones the whole logo lies over the hero's top left, in the void that comes down around it. The hero is pure world; when the character changes,
the old world fades out and the new one in.
The worlds are more vibrant: skies lit by the character's colour towards the horizon, hill tops catching that light, and sky
art per world (`SKY_ART`): drifting auroras, glowing suns, shooting stars. `world.js` gained a `backdrop` option for it.

The rail (`.rail`) is the void's left column inside the page, so whatever sticks in it stops above the footer. Its things
line up on the signet's left edge: the signet at the top; the navigation (`.mainNav`, 152 px wide), which starts at the
hero's bottom left (its margin is calculated in CSS from `--hero-height` and its fixed `--nav-height`, so it does not jump while the page loads), scrolls up with the hero and then sticks right below the
signet; and the account (`.railAccount`) sticking to the window's bottom. The navigation is a plain list of `.navItem` rows: soft
hover, the current page tinted with a green stroke on the window's edge, a small pulsing light for the live CactuJam instead
of a "trwa" tag, and the pages to come dimmed under their own "Wkrótce" heading instead of a tag on every row. On phones it
becomes a tab bar at the bottom with the account on its right. The cast list (`.castPanel`) is a plain column against the scene, a slightly lifted night colour
(`--cast-bg`) drawn by `buildCastPanel` in the hero's own cells (`shape.isBlock`), traced from past its left side so that side meets the bottom square, so the void's bites along the header's bottom
run on under the list in one ragged edge. Inside: the title "Postacie" in cactu and full-width rows, running the column's full height, (from the scene's edge to the
window's) with pixel portraits and names (each character's description only in its tooltip, so the column is just six blocks, 216 px, wide), the selected one tinted in its character's colour. The cast is shuffled on every visit and the first character's world is shown; a character chosen before the page was refreshed (kept in `?character=`) comes first instead. Choosing one does not reorder the list until the next refresh; clicking the chosen character again takes the choice back and shows the default world again. On phones the signet hides, the navigation becomes
a bottom tab bar and the cast a band as wide as the screen along the hero's bottom, in the same rows as on wide screens
scrolling sideways, cut by the void's bites like the column (the world's ground stands above it).

## Screenshots

`sh tools/shoot.sh` renders every view with a headless Chromium browser (Edge or Chrome: `$BROWSER`, else found on the PATH or in the Windows registry). One view:
`msedge --headless=new --allow-file-access-from-files --virtual-time-budget=12000 --window-size=1920,1080 --screenshot=out.png "file:///…/project/demo/tools/frame.html?page=v2/index.html&character=ranfisz&width=1920&height=1080"`
(`frame.html` takes `page`, `width`, `height`, `scroll`; other parameters go to the page; it turns transitions off).

## Exporting the brand

`python tools/export-brand.py` exports the final smooth brand chosen in `brand-smooth.html` (`FINAL`: the "Niebo" logo ending
"Romb z dużą gwiazdką", with the navy star on light, and the favicon "Łagodniej, drobniejsze piksele (32)") to `project/brand/smooth/`.
The folder is not kept: run the script to create it (the output is byte for byte the same every time). Without fontTools and brotli
installed, `uv run --with fonttools --with brotli python tools/export-brand.py` provides them. The same run rewrites the copies the
prototype versions keep (`VERSION_COPIES` in the script: v3's `brand.svg`, `brand-word.svg` and favicons):

| Files | What they are |
| --- | --- |
| `cactu-logo-{dark,light}.svg` and `…-transparent.svg` | The logo on its background, and without it. The pixel sky is crisp rectangles, the cactus the vector signet, the wordmark outlines of the cactu font (no font needed) |
| `cactu-logo-…@{1,2,4}x.png` | The same as PNG, 596 × 234 px at 1x |
| `cactu-logo-core.svg` and `…@{1,2,4}x.png` | Only the signet, the wordmark and the pixel ending, cropped to them on a transparent background (522 × 158 px at 1x), for placing on other backgrounds; the v3 hero uses it |
| `cactu-logo-word.svg` | The same box without the signet: the wordmark and the ending alone, to lay over the signet or move apart from it |
| `cactu-logo-dark-sky-word.svg` | The dark transparent logo (its pixel sky and wordmark) without the signet, in the same box |
| `cactu-logo-dark-lines.svg`, `cactu-logo-dark-lines-word.svg` | The dark transparent logo with the sky's lines but no stars (the ending keeps its own star), whole and without the signet |
| `cactu-logo-dark-lines-spread.svg`, `…-spread-word.svg` | The same with the lines moved up and down (`spread_lines`) to fill more of the sky evenly, from halfway up to the top of the cactus down to the lowest line |
| `favicon.svg` (= `favicon-32-grid.svg`), `favicon-16-grid.svg` | The favicon on its 32 grid, and on the 16 grid for 16 px |
| `favicon-{16,32,64,128,192,256,512}.png` | PNG favicons: 16 from the 16 grid, the rest whole multiples of the 32 grid |

It opens `brand-smooth.html?export` in a headless Chromium browser, found like in `shoot.sh` (the page draws the chosen logo exactly as shown and writes its geometry and
pixels into `<pre id="export">`), builds the SVGs with fontTools, and renders the PNGs with sharp from `frontend/node_modules`
(`tools/export-brand-png.cjs`). Needs Python with fontTools and brotli, and Node.

