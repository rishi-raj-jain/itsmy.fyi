import tailwind from '@astrojs/tailwind'
import { defineConfig } from 'astro/config'
import vercel from '@astrojs/vercel/serverless'

export default defineConfig({
  output: 'server',
  adapter: vercel(),
  integrations: [tailwind()],
})
