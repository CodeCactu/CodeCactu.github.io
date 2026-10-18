import { defineConfig, fontProviders, memoryCache } from 'astro/config'
import svelte from "@astrojs/svelte"
import node from '@astrojs/node'

export default defineConfig({
  output: `server`,

  integrations: [
    svelte(),
  ],

  build: {
    assets: `assets`,
  },

  cache: {
    provider: memoryCache(),
  },

  adapter: node({
    mode: `standalone`,
  }),

  server: {
    port: 3000,
  },

  vite: {
    css: {
      modules: {
        generateScopedName: `_[hash:base64:5]-[local]`,
      },
    },
  },

  fonts: [
    {
      provider: fontProviders.google(),
      name: `Lato`,
      cssVariable: `--fontFamily-lato`,
    },
  ],
})
