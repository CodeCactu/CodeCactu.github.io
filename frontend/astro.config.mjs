import { defineConfig, fontProviders } from 'astro/config'
import svelte from '@astrojs/svelte'

export default defineConfig({
  integrations: [
    svelte({
      compilerOptions:{
        runes: true
      }
    })
  ],

  vite: {
    css: {
      modules: {
        generateScopedName: `_[hash:base64:5]-[local]`
      }
    }
  },

  server: {
    port: 3000,
  },

  fonts:[
    {
      provider: fontProviders.google(),
      name: `Lato`,
      cssVariable: `--fontFamily-lato`,
    }
  ],
})
