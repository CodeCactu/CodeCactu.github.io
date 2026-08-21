import { defineConfig, fontProviders } from 'astro/config'

export default defineConfig({
  vite: {
    css: {
      modules: {
        generateScopedName: `_[hash:base64:5]-[local]`
      }
    }
  },
  fonts:[
    {
      provider: fontProviders.google(),
      name: `Lato`,
      cssVariable: `--fontFamily-lato`,
    }
  ]
})
