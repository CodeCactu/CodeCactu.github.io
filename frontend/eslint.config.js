import astro from 'eslint-plugin-astro'
import eslintConfigEye from 'eslint-config-eye'
import { defineConfig } from 'eslint/config'

export default defineConfig(
  {
    ignores: [
      `dist/`,
      `.astro/`,
      `node_modules/`,
    ],
  },

  ...astro.configs.recommended,
  ...eslintConfigEye,
)
