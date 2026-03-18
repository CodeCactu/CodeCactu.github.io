import { defineConfig } from 'astro/config'

export default defineConfig({
  vite: {
    css: {
      modules: {
        generateScopedName: `_[hash:base64:5]-[local]`
      }
    }
  }
})
