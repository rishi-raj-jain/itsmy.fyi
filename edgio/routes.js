// This file was automatically added by edgio init.
// You should commit this file to source control.

import { Router } from '@edgio/core'
import { cacheConfig } from './cache'
import { astroRoutes } from '@edgio/astro'
import { verifyPostData } from '@/lib/verifySignature'
import { transformResponse } from './transformResponse'

const router = new Router()

// Home page
router.match('/', ({ cache, removeUpstreamResponseHeader, renderWithApp }) => {
  removeUpstreamResponseHeader('cache-control')
  cache(cacheConfig(60 * 60, true))
  renderWithApp({ transformResponse })
})

// Sitemap
router.match('/sitemap.xml', ({ cache, removeUpstreamResponseHeader, renderWithApp }) => {
  removeUpstreamResponseHeader('cache-control')
  cache(cacheConfig(1, true))
  renderWithApp({ transformResponse })
})

// Astro's on the fly image path
router.match('/_image', ({ cache, removeUpstreamResponseHeader, renderWithApp }) => {
  removeUpstreamResponseHeader('cache-control')
  cache(cacheConfig(60 * 60 * 24 * 365))
  renderWithApp()
})

// User path(s)
router.match('/me/:path', ({ cache, removeUpstreamResponseHeader, renderWithApp }) => {
  removeUpstreamResponseHeader('cache-control')
  cache(cacheConfig(1, true))
  renderWithApp({ transformResponse })
})

// GitHub hooks to update and handle updates for user profile(s)
router.match('/github/hook/issue', ({ renderWithApp, compute, cache }) => {
  cache({ edge: false, browser: false })
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

router.use(astroRoutes)

export default router
