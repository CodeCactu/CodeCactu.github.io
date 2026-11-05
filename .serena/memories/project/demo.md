# project/demo (redesign prototypes)

- `project/demo/README.md` is the authoritative guide (layout, version freezing, how to start a new version) — read it first.
- Static, no build: open HTML via `file://`. Classic scripts sharing globals (no ES modules), so `<script>` order matters.
- `lib/` = live shared code; `v1/`, `v2/` frozen; `v3/` in progress. Each version has its own copies of shared files; changes go to `lib/` first, then copied on purpose.
- `world.js` locates sprite sheets at `../../characters/` relative to itself -> version folders must stay at the same depth.
- Generated output is not kept (git-ignored): `screenshots/` from `tools/shoot.sh`, `project/brand/smooth/` from `tools/export-brand.py` (byte-identical reruns; `uv run --with fonttools --with brotli python tools/export-brand.py`). Screenshots: `tools/shoot.sh` (headless Edge or Chrome, `BROWSER` overrides); `tools/frame.html?page=...&width=&height=` for fixed viewports.
- v3 design rules: pixel art only inside zones (hero world, portraits, avatar), everything else smooth; colours driven by registered CSS custom props (`--void`, `--glow`, `--edge`, `--earth`) set per character by `tintPage`; `?character=<id>` selects a character.
- v3 has several pages sharing one frame: shared rail/logo/trail/colours/sky art live in `v3/shell.js` (loaded before the page script); page scripts are `main.js` (home) and `jam.js` (CactuJam voting). Nav links carry `data-page` so `?character=` survives navigation.
- Interaction testing: `playwright-core` with `channel:'msedge'` works (no repo dependency; install in a temp dir). Native image drag must be blocked on draggable thumbnails or pointer events get cancelled.
- Comments in demo code are long descriptive prose about design intent; keep that style when editing.
