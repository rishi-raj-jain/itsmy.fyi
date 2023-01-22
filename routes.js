// This file was automatically added by edgio init.
// You should commit this file to source control.

import { load } from 'cheerio'
import { astroRoutes } from '@edgio/astro'
import { minifyOptions } from 'minifyOptions'
import esImport from '@edgio/core/utils/esImport'
import { ratelimit } from '@/lib/Upstash/ratelimit'
import { CustomCacheKey, Router } from '@edgio/core'
import { verifyPostData } from '@/lib/verifySignature'

// Right now, record only 10 requests per month per user
// Enables us with concurrent 1000 users per day
const rateLimiter = ratelimit(10, '2628002 s')

const optimizePage = ({ cache, removeUpstreamResponseHeader, renderWithApp }) => {
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
        if (res.getHeader('content-type').includes('/html')) {
          const $ = load(res.body)
          const { minify } = await esImport('html-minifier')
          res.body = minify($.html(), minifyOptions)
        } else if (res.getHeader('content-type').includes('/xml')) {
          const { minify } = await esImport('html-minifier')
          res.body = minify(res.body.toString(), minifyOptions)
        }
      } catch (e) {
        console.log(e.message || e.toString())
        res.statusCode = statusCodeOriginal
      }
    },
  })
}

const router = new Router({ indexPermalink: true })

// Home page
router.match('/', ({ cache, removeUpstreamResponseHeader, renderWithApp }) => {
  removeUpstreamResponseHeader('cache-control')
  cache({
    edge: {
      maxAgeSeconds: 60 * 60,
      staleWhileRevalidateSeconds: 60 * 60 * 24 * 365,
    },
    browser: false,
    key: new CustomCacheKey().excludeAllQueryParameters(),
  })
  renderWithApp({
    transformResponse: async (res, req) => {
      let statusCodeOriginal = res.statusCode
      try {
        if (res.getHeader('content-type').includes('/html')) {
          const $ = load(res.body)
          const { minify } = await esImport('html-minifier')
          res.body = minify($.html(), minifyOptions)
        } else if (res.getHeader('content-type').includes('/xml')) {
          const { minify } = await esImport('html-minifier')
          res.body = minify(res.body.toString(), minifyOptions)
        }
      } catch (e) {
        console.log(e.message || e.toString())
        res.statusCode = statusCodeOriginal
      }
    },
  })
})

// Sitemap
router.match('/sitemap.xml', optimizePage)

// Astro's on the fly image path
router.match('/_image', ({ cache }) => {
  cache({
    edge: {
      maxAgeSeconds: 60 * 60 * 24 * 365,
    },
  })
})

// GitHub hooks to update and handle updates for user profile(s)
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

// User path(s)
router.match('/me/:path', ({ cache, removeUpstreamResponseHeader, renderWithApp }) => {
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
    path: '/u/:path',
    transformResponse: async (res, req) => {
      let statusCodeOriginal = res.statusCode
      try {
        if (res.getHeader('content-type').includes('/html')) {
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

// Track Analytics
// Currently In Demo
router.match('/u/:slug', ({ compute, renderWithApp, send }) => {
  compute(async (req, res) => {
    const { slug } = req.params
    if (slug && slug.length) {
      if (rateLimiter) {
        const result = await rateLimiter.limit(slug)
        if (result.success) {
          const headers = req.getHeaders()
          const analyticsObject = {}
          if (headers['x-0-browser']) {
            analyticsObject['browser'] = headers['x-0-browser']
          }
          if (headers['x-0-device']) {
            analyticsObject['device'] = headers['x-0-device']
          }
          if (headers['x-0-device-is-bot']) {
            analyticsObject['bot'] = headers['x-0-device-is-bot']
          }
          if (headers['x-0-geo-country-code']) {
            analyticsObject['country'] = headers['x-0-geo-country-code']
          }
          if (headers['sec-ch-ua-platform']) {
            analyticsObject['os'] = headers['sec-ch-ua-platform']
          }
          if (headers['referer']) {
            analyticsObject['referer'] = headers['referer']
          }
        }
      }
      return renderWithApp()
    } else {
      send('Invalid Request', 403)
    }
  })
})

router.use(astroRoutes)

export default router
