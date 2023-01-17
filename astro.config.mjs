import node from '@astrojs/node'
import tailwind from '@astrojs/tailwind'
import { defineConfig } from 'astro/config'

export default defineConfig({
  output: 'server',
  adapter: node({
    mode: 'standalone',
  }),
  integrations: [
    tailwind(),
    {
      name: 'minify-html',
      hooks: {
        'astro:build:done': async ({}) => {
          const appDir = process.cwd()
          const { computeDependencies } = await import(`${appDir}/computeDependencies.mjs`)
          await computeDependencies([`${appDir}/deps.mjs`], 'deps')
        },
      },
    },
  ],
})
