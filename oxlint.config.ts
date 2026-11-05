/*
 * Oxlint for the whole repository (frontend/ and backend/): Evolveye's code style, the rules of eslint-config-eye.
 * One config and one copy of the JS plugins at the root, so the editor's single Oxlint process can lint both modules.
 * Run from here: `bun run lint` (`lint:fix` to fix).
 */

import { defineConfig } from "oxlint"
import sonarjs from "eslint-plugin-sonarjs"

type Severity = `off` | `warn` | `error`
type Rules = Record<string, Severity | [Severity, ...unknown[]]>

const correctnessRules:Rules = {
  "no-async-promise-executor": `off`,
  "no-compare-neg-zero": `off`,
  "no-constant-condition": `off`,
  "no-fallthrough": `off`,
  "no-redeclare": `off`,
  "no-unreachable": `off`,
  "no-dupe-class-members": `error`,
  "prefer-const": [ `error`, { destructuring:`all`, ignoreReadBeforeAssign:true } ],
  "no-unused-vars": [ `warn`, {
    args: `all`,
    caughtErrors: `all`,
    argsIgnorePattern: `^_`,
    caughtErrorsIgnorePattern: `^_`,
    destructuredArrayIgnorePattern: `^_`,
    varsIgnorePattern: `^_`,
    ignoreRestSiblings: true,
  } ],
  "typescript/method-signature-style": [ `error`, `property` ],
  "typescript/no-explicit-any": [ `error`, { fixToUnknown:false, ignoreRestArgs:false } ],
  "typescript/no-extra-non-null-assertion": `error`,
  "typescript/no-non-null-assertion": `off`,
  "import-order/order": [ `error`, {
    alphabetize: { order:`desc` },
    groups: [ `builtin`, `external`, `internal`, `parent`, `index`, `sibling`, `object`, `type` ],
  } ],
}

// Rules the old ESLint config took from ESLint's core or @stylistic/eslint-plugin-js: they check JavaScript only, so types
// keep their own spacing (`Keys[number]`, `{ name: string }`)
const jsStylisticRules:Rules = {
  "stylistic-js/array-bracket-newline": [ `error`, `consistent` ],
  "stylistic-js/array-bracket-spacing": [ `error`, `always` ],
  "stylistic-js/arrow-parens": [ `error`, `as-needed` ],
  "stylistic-js/block-spacing": `error`,
  "stylistic-js/comma-dangle": [ `error`, `always-multiline` ],
  "stylistic-js/comma-spacing": [ `error`, { before:false, after:true } ],
  "stylistic-js/computed-property-spacing": [ `error`, `always`, { enforceForClassMembers:false } ],
  "stylistic-js/eol-last": [ `error`, `always` ],
  "stylistic-js/function-call-spacing": [ `error`, `never` ],
  "stylistic-js/key-spacing": [ `error`, {
    singleLine: { beforeColon:false, afterColon:false },
    multiLine: { beforeColon:false, afterColon:true, mode:`minimum` },
  } ],
  "stylistic-js/no-whitespace-before-property": `error`,
  "stylistic-js/semi": [ `error`, `never` ],
  "stylistic-js/space-before-blocks": [ `error`, `always` ],
  "stylistic-js/space-before-function-paren": [ `error`, `never` ],
  "stylistic-js/space-unary-ops": [ `error`, { words:true, nonwords:false } ],
  "stylistic-js/spaced-comment": [ `error`, `always`, { block:{ balanced:true, exceptions:[ `\\` ] }, line:{ markers:[ `/` ] } } ],
}

const stylisticRules:Rules = {
  "@stylistic/arrow-spacing": [ `error`, { before:true, after:true } ],
  "@stylistic/indent": [ `error`, 2, { SwitchCase:1 } ],
  "@stylistic/jsx-quotes": [ `error`, `prefer-double` ],
  "@stylistic/keyword-spacing": [ `error`, { before:true, after:true } ],
  "@stylistic/member-delimiter-style": [ `error`, {
    multiline: { delimiter:`none`, requireLast:true },
    singleline: { delimiter:`comma`, requireLast:false },
  } ],
  "@stylistic/no-extra-semi": `error`,
  "@stylistic/object-curly-spacing": [ `error`, `always` ],
  "@stylistic/quotes": [ `error`, `backtick` ],
  "@stylistic/space-infix-ops": `error`,
  "@stylistic/template-tag-spacing": [ `error`, `never` ],
  "@stylistic/type-generic-spacing": `error`,
  "@stylistic/type-annotation-spacing": [ `error`, {
    before: false,
    after: true,
    overrides: {
      arrow: { before:true, after:true },
      colon: { before:false, after:false },
      parameter: { before:false, after:false },
      variable: { before:false, after:false },
      property: { before:false, after:true },
      returnType: { before:false, after:true },
    },
  } ],
}

const spacesRules:Rules = {
  "spaces/double-spaces-in-for": `error`,
  "spaces/space-in-arrow-functions-parens": [ `error`, `never` ],
  "spaces/space-in-calls": [ `error`, `always` ],
  "spaces/space-in-constructors": [ `error`, `always` ],
  "spaces/space-in-functions-parens": [ `error`, `always` ],
  "spaces/space-in-loops-and-ifs": [ `error`, `never` ],
}

const sonarRules:Rules = {
  "sonarjs/todo-tag": `off`,
  "sonarjs/arguments-usage": `error`,
  "sonarjs/array-constructor": `error`,
  "sonarjs/class-prototype": `error`,
  "sonarjs/pseudo-random": `off`,
  "sonarjs/no-dead-store": `off`,
  "sonarjs/no-nested-assignment": `off`,
  "sonarjs/no-nested-template-literals": `off`,
  "sonarjs/no-nested-conditional": `off`,
  "sonarjs/redundant-type-aliases": `off`,
  "sonarjs/no-redundant-boolean": `off`,
  "sonarjs/unused-import": `off`,
  "sonarjs/cognitive-complexity": `off`,
  "sonarjs/slow-regex": `off`,
  "sonarjs/regex-complexity": `off`,
  "sonarjs/empty-string-repetition": `off`,
  "sonarjs/no-nested-functions": [ `error`, { threshold:6 } ],
  "sonarjs/no-unused-vars": `off`,
  "sonarjs/no-use-of-empty-return-value": `off`,
  "sonarjs/super-linear-regex": `off`,
  "sonarjs/no-redundant-optional": `off`,
}

const sonarRecommended = sonarjs.configs?.recommended as { rules: Rules } | undefined

export default defineConfig({
  plugins: [ `eslint`, `typescript`, `unicorn`, `oxc`, `import` ],
  jsPlugins: [
    `@stylistic/eslint-plugin`,
    { name:`stylistic-js`, specifier:`@stylistic/eslint-plugin-js` },
    `eslint-plugin-spaces`,
    `eslint-plugin-sonarjs`,
    // The name "import" belongs to Oxlint's native plugin, which has no "order" rule
    { name:`import-order`, specifier:`eslint-plugin-import-x` },
  ],
  settings: {
    // The path aliases (tsconfig.json) are this project's code, not packages
    "import-x/internal-regex": `^@(fet|lib)?/`,
  },
  rules: {
    ...correctnessRules,
    ...jsStylisticRules,
    ...stylisticRules,
    ...spacesRules,
    ...sonarRecommended?.rules,
    ...sonarRules,
  },
  overrides: [
    // Their script blocks are indented inside <script>, which the indent rule cannot offset
    { files:[ `**/*.svelte`, `**/*.astro` ], rules:{ "@stylistic/indent":`off` } },
  ],
  ignorePatterns: [
    `**/node_modules/`,
    // The prototypes of the redesign: plain browser scripts, not held to the code style
    `project/`,
    `frontend/dist/`,
    `frontend/.astro/`,
    `backend/uploads/`,
    `backend/data/`,
  ],
})
