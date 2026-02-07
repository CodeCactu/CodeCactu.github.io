import nextTs from "eslint-config-next/typescript"
import nextVitals from "eslint-config-next/core-web-vitals"
import eyeConfig from "eslint-config-eye"
import { defineConfig, globalIgnores } from "eslint/config"

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  ...eyeConfig,

  globalIgnores([
    `.next/**`,
    `out/**`,
    `build/**`,
    `next-env.d.ts`,
  ]),
])

export default eslintConfig
