// This file was automatically added by edgio init.
// You should commit this file to source control.

import crypto from 'crypto'
import { load } from 'cheerio'
import { astroRoutes } from '@edgio/astro'
import { minifyOptions } from 'minifyOptions'
import esImport from '@edgio/core/utils/esImport'
import { CustomCacheKey, Router } from '@edgio/core'

const paths = ['/u/:path']

const router = new Router({ indexPermalink: true })

const verifyPostData = (signature256, body) => {
  try {
    const sig = Buffer.from(signature256, 'utf8')
    const hmac = crypto.createHmac('sha256', process.env.GITHUB_WEBHOOK_SECRET)
    const digest = Buffer.from('sha256=' + hmac.update(body).digest('hex'), 'utf8')
    if (sig.length !== digest.length || !crypto.timingSafeEqual(digest, sig)) {
      return false
    }
    return true
  } catch (e) {
    console.log(e.message || e.toString())
    return false
  }
}

router.match('/github/hook/issue', ({ renderWithApp, compute }) => {
  compute((req, res) => {
    if (req.method.toLowerCase() === 'post') {
      if (req.getHeader('Content-Type').toLowerCase() === 'application/json') {
        if (verifyPostData(req.getHeader('X-Hub-Signature-256'), req.rawBody)) {
          return renderWithApp()
        }
      }
    }
  })
})

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
