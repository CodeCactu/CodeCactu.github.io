import { defineConfig } from "oxlint"
import sonarjs from "eslint-plugin-sonarjs"
import createEyeConfig from "../oxlint.eye.ts"

export default defineConfig({
  ...createEyeConfig( sonarjs ),
  ignorePatterns: [ `dist/`, `.astro/`, `node_modules/` ],
})
