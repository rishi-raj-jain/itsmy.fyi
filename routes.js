// This file was automatically added by edgio init.
// You should commit this file to source control.

import { load } from 'cheerio'
import { astroRoutes } from '@edgio/astro'
import { minifyOptions } from 'minifyOptions'
import esImport from '@edgio/core/utils/esImport'
import { CustomCacheKey, Router } from '@edgio/core'

const paths = ['/u/:path']

const router = new Router({ indexPermalink: true })

paths.forEach((i) => {
  router.match(i, ({ cache, removeUpstreamResponseHeader, renderWithApp }) => {
    removeUpstreamResponseHeader('cache-control')
    cache({
      edge: {
        maxAgeSeconds: 1,
        staleWhileRevalidateSeconds: 60 * 60 * 24 * 365,
      },
      browser: false,
      key: new CustomCacheKey().excludeAllQueryParameters(),
    })
    renderWithApp({
      transformResponse: async (res, req) => {
        let statusCodeOriginal = res.statusCode
        try {
          if (res.getHeader('content-type').includes('html')) {
            const $ = load(res.body)
            const { minify } = await esImport('html-minifier')
            res.body = minify($.html(), minifyOptions)
          }
        } catch (e) {
          console.log(e.message || e.toString())
          res.statusCode = statusCodeOriginal
        }
      },
    })
  })
})

router.use(astroRoutes)

export default router
