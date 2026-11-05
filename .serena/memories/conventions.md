# Conventions

User-enforced style (also in `eslint-config-eye`, run by Oxlint through the root `oxlint.config.ts`); apply to all TS/JS/Svelte/Astro:
- Spaces inside call/definition/index parens & brackets: `fn( a, b )`, `arr[ i ]`; sole object/array arg hugs: `fn({ a:1 })`.
- Dense inline objects `{ a:1, b:2 }`; destructuring with inner spaces `const { a } = x`.
- Param types without space after colon: `fn( req:Bun.BunRequest )`.
- Strings: template literals by default (also for imports' non-path strings, keys, CSS values); double quotes only where impossible.
- Guards one line, no braces: `if (!x) return`, placed directly under the variable they check; blank line between groups.
- Lambdas: `x => ...` without parens for a single plain param; `(a, b) =>` with no inner spaces.
- `type` over `interface`; `function` declarations over const arrows; no nested named functions (use a function variable inside).
- No `void` operator; no return type annotations unless required.
- Loading state encoding: `undefined` = not initialized, `null` = no data, `Promise` = loading, value = loaded (see `authRune.svelte.ts`).
- Descriptive names (no abbreviations except ctx, i, etc.). File order: imports, types, constants, main export, helpers.
- Code grouped into small blank-line-separated sections; comment directly above the group.

Project patterns:
- Feature-folder organisation (`src/features/<name>/`), imports via `@fet/`, `@lib/`, `@/` aliases.
- Backend endpoints named `<verb><Thing>Endpoint`; API errors `{ code }` in UPPER_SNAKE.
- Frontend styles in co-located `*.module.css` (PascalCase file name matching the component).
