import eyeConfig from "eslint-config-eye"
import { defineConfig, globalIgnores } from "eslint/config"

const eslintConfig = defineConfig([
  ...eyeConfig,

  globalIgnores([
    `out/**`,
    `build/**`,
  ]),
])

export default eslintConfig
