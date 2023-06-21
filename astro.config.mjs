import tailwind from '@astrojs/tailwind'
import vercel from '@astrojs/vercel/edge'
import { defineConfig } from 'astro/config'

export default defineConfig({
  output: 'server',
  adapter: vercel(),
  integrations: [tailwind()],
})
