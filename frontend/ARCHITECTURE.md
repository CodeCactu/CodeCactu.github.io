# Frontend architecture

The rules for how the frontend's code is split. They hold for all new code. Code that predates them (listed in
`REDESIGN.md`, "Legacy") is replaced, not extended.

Stack: Astro (server output) with Svelte 5, TypeScript strict, run with **Bun**. UI text is Polish first.

## Principles

**Strategic programming** (Ousterhout, *A Philosophy of Software Design*): working code is not enough, the design is the
product. Every change leaves the structure a little better than it found it.

- **Deep modules.** A module hides a lot behind a small interface. Prefer one function `createPixelWorld( target, scene )`
  over ten exported helpers the caller has to sequence.
- **Information hiding.** A slice's internals (state shape, helper functions, DOM structure) never leak into its interface.
  Other code imports a slice only through its `index.ts`.
- **General-purpose lower layers, special-purpose upper layers.** `lib/` knows nothing about Cactu; features combine `lib/` with
  Cactu's look and data for the whole app; a page holds what only that page needs. Keeping single-use code out of
  `features/` and `lib/` keeps them small and truly reusable.
- **Define errors out of existence.** Prefer interfaces where the wrong call cannot be made (a closed union of variants, a
  function that accepts every input) over checks and thrown errors.
- **Design it twice** for every large piece (the drag engine, the world renderer, the shell): sketch two interfaces and keep
  the simpler one.
- **Comments describe what and why**, at the level of the interface; the code describes how. Keep them up to date with
  the code they describe.
- **Code style** is enforced by Oxlint with the rules of `eslint-config-eye` (`../oxlint.config.ts`, one config for
  the whole repository): `bun run lint` from the repository root (`lint:fix` to fix). Types: `bun run check` (`astro check` and `svelte-check`). The rules are also in the
  Serena memory `conventions`.

## Directory layout

```
src/
  config.ts             server-only configuration (imports @fet/serverOnly)
  config.client.ts      configuration safe for the browser too (inlined into the page by config.astro)
  config.astro          writes the client config into the page
  lib/                  code reusable across different apps: general purpose, headless
  features/             code reusable across this app: vertical slices, everything about one thing in one folder
  layouts/              Astro layouts: the page frames (html, head, the app shell)
  pages/                Astro routes, each with the code meant only for it beside its index.astro
```

Where code goes is decided by who uses it:

| Used by | Goes in |
| --- | --- |
| One page only | `pages/`, beside that page's `index.astro` |
| More than one page, or the layouts | `features/` |
| Any app, not only Cactu | `lib/` |

Code moves down a level when a second user appears (a page's component needed by another page moves to a feature), never
in advance.

Aliases (`tsconfig.json`): `@lib/*` = `src/lib/*`, `@fet/*` = `src/features/*`, `@/*` = `src/*`.

### Dependency direction

```
pages  →  layouts  →  features  →  lib
```

- `lib/` imports only `lib/` and npm packages. Never `@fet/` or `@/`.
- A feature imports `lib/`, and other features only through their `index.ts`. No import cycles between features.
- Layouts and pages import features and lib. Nothing imports a page or its files, not even another page.

## `lib/`: headless, general purpose

`lib/` is a local package: code that would make sense in any project, with no styling and no Cactu knowledge. It could be
moved to its own npm package without changes.

- Allowed: framework-free functions and classes, types, Svelte components and actions that provide behaviour only (no
  visual CSS; structural styles only where the behaviour needs them, e.g. `position` for a drag ghost).
- Not allowed: colours, fonts, spacing, copy text, imports from features, knowledge of the backend.
- Each folder in `lib/` is a module with an `index.ts`: `lib/core/` (functions, types), `lib/prepareConfig/`, and new ones
  such as `lib/cellShapes/` or `lib/dragDrop/` (see `REDESIGN.md`).

## `features/`: vertical slices

One folder per slice, named after what it is about (`auth`, `cast`, `pixelWorld`), not after a technical layer. Only code
used by more than one page (or by the layouts) belongs here.

```
features/<slice>/
  index.ts                 the slice's public interface: re-exports its components, functions and types
  <Thing>.svelte           a component
  <Thing>.module.css       its styles (same name as the component)
  <thing>.svelte.ts        shared reactive state (Svelte runes)
  <thing>.ts               logic without UI
  _translation/            the slice's texts: <name>.<language>.yml, and the generated index.ts
  <subfolder>/             a larger part of the slice, same rules
```

- **Svelte for every component.** Every component, in particular every `controls` and `flow` component, is a `.svelte`
  file. `.astro` is only for pages (`index.astro`) and layouts. A Svelte
  component works in an Astro page (rendered on the server, hydrated with a `client:*` directive when interactive) and in
  plain TypeScript (`mount( Component, { target, props } )` from `svelte`), so game logic or a canvas engine can create UI.
- A component gets everything through props: callbacks for events (`onSelect`), snippets for content (`children`). No
  reliance on Astro context or on global DOM it did not create.
- Logic that is not about rendering lives in `.ts` next to the component (a canvas engine, a shape generator), so it can be
  tested and used without Svelte.
- Shared reactive state: runes in `*.svelte.ts` (see `features/auth/authRune.svelte.ts`). The loading state convention:
  `undefined` = not initialised, `null` = no data, a `Promise` = loading, a value = loaded.

### The base slices

| Slice | Holds |
| --- | --- |
| `theme/` | The design system's semantic tokens: colours, typography, spacing, radii, motion, as CSS custom properties; fonts (`theme/font/`); the per-character tint (setting the tokens from the shown character). Components use only semantic tokens, never raw values |
| `controls/` | Things you act on: `Button`, `Link`, `IconButton`, `Chip`, `SegmentedChoice`, nav items |
| `flow/` | Things that arrange content: `Row`, `Column(s)`, `Stack`, `Popover`, `Sheet`, `Accordion`, `Loader` |
| `translation/` | The translation utilities, no texts: supported languages, `createTranslator`, the markdown processor for long translated texts, the language switch |
| `backends/` | One folder per API (`backends/cactu/`): typed fetch functions and TanStack queries mapping the API, nothing else |
| `serverOnly/` | Import it to make a module throw when bundled for the browser |

The app's other slices (`auth`, `cast`, `pixelWorld`, ...) are listed in `REDESIGN.md`.

### Styling

- CSS Modules next to the component (`Thing.module.css`, imported as `classes`); class names `camelCase`, states as
  `isSomething`. Scoped names come from the Vite config.
- Cascade layers declared once in the root layout: `reset, theme, lib, features, layout`. Feature CSS goes in `features`.
- Tokens: primitives (`--palette-*`) only inside `theme/`; everything else uses semantic tokens (`--color-surface`,
  `--color-text-soft`, `--glow`, `--radius-round`, `--gap-columns`, `--font-display`, ...). The per-character tokens are
  registered with `@property`, so they transition when the character changes.

## `pages/` and `layouts/`

- A page's `index.astro` loads its data on the server (`await loadThings()` in the frontmatter), sets caching with
  `Astro.cache.set(...)` and composes the page from features and its own components.
- Code meant only for that page (components, their styles, logic, data, texts) sits beside its `index.astro`, under the same
  rules as a slice (texts in `_translation/`): `.svelte` components, `.module.css` styles, logic in `.ts`. A larger page groups it in subfolders.
- Astro turns every `.astro`, `.md`, `.ts` and `.js` file in `pages/` into a route. Page code that is not a route is
  therefore named with a leading `_` (`_boardRules.ts`) or kept in a `_` folder; `.svelte` and `.css` files are never
  routes and need no prefix.
- The home page is `pages/index.astro`, at the root of `pages/`; its own code goes in `pages/_home/`, so it does not mix
  with the other routes.
- Layouts own `<html>`, `<head>` (fonts, favicon, client config, the no-flash tint script) and the app shell.

## Configuration

- `config.ts`: server-only values; it imports `@fet/serverOnly`, so bundling it for the browser fails loudly.
- `config.client.ts`: values the browser may see; `config.astro` writes them into the page as `window.clientConfig`.
- Both use `prepareConfig` (`lib/prepareConfig`). Read env vars nowhere else.

## Translation

- Texts are vertical too: each slice or page owns its texts in `_translation/<name>.<language>.yml` (the `_` keeps the
  folder out of Astro's routes). `features/translation/` holds only the utilities: the languages (`languages.ts`; Polish
  is the default and, for now, the only one) and `createTranslator`.
- The files have the shape POEditor imports and exports (checked by importing one): nested keys, `{{name}}` placeholders,
  and a plural as a key holding its CLDR forms (`gameCount: { one, few, many, other }` in Polish; `other` required), the
  form chosen by the `count` parameter. No language root key (`pl:`).
  No i18n library: `Intl.PluralRules` and `Intl.NumberFormat` do the language rules.
- `bun run translations:generate` (also run by `bun run check`) writes `_translation/index.ts` beside the YAML files: their
  texts in every language and one type for all languages, from the default language's file. Generated: do not edit,
  commit it. A slice uses it as `const t = createTranslator( translation )`; keys are typed, a key with plural forms
  requires `count`, and a missing language falls back to the default one.
- Exchange with POEditor (`frontend/translations/translations.ts`): `translations:collect` merges the slices of each group
  (`GROUPS` in the script) into `translations/<group>.<language>.yml` to upload; `translations:update` splits the files
  downloaded from POEditor (same names) back into the slices, comments kept. Add a new slice's path to a group.
- YAML imports go through `tools/yaml.ts` (a Vite plugin, wired in `astro.config.mjs`); `bun test` imports YAML natively.
- New UI text goes into its slice's `_translation/`, never hard-coded in a component, so a second language needs no
  component changes.
- Long texts (rules, descriptions) are markdown in the YAML files, rendered by the translation slice's markdown processor.

## Backends

- `features/backends/cactu/` mirrors the backend API (`backend/src/features/*/endpoints.ts`): one file per resource,
  exporting `loadX` (plain fetch, usable on the server), `queryX` (TanStack query for the client) and `saveX`.
- `fetchCactu( urn, init )` prefixes `clientConfig.BACKEND_ORIGIN`; credentialed calls pass `credentials:"include"`.
- Data the backend does not serve yet lives where it is used (a feature if several pages need it, otherwise the page), in
  one clearly named file (e.g. `features/cactuJam/edition.ts`), so moving it to an endpoint later changes one place.

## Bun

- Install and run with Bun: `bun install`, `bun run dev`, `bun run build`, `bun run check`, `bun test` (lint from the root);
  production runs `bun dist/server/entry.mjs`
  (see `Dockerfile`).
- Scripts call Astro through Bun's runtime (`bunx --bun astro dev`), not Node.
- Tests use `bun test` (`*.test.ts` next to the code).
- `bun.lock` is the lockfile.
- `overrides` in `package.json` pins `@emnapi/runtime` to the 1.x that `@astrojs/check`'s wasm `astro2tsx` needs (rolldown's
  optional wasm binding would otherwise hoist a 2.0 beta and crash `astro check`); drop it once the two agree.
