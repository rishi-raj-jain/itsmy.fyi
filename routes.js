import { Router } from '@edgio/core'
import { CustomCacheKey } from '@edgio/core'

const router = new Router()

// Home page
router.match('/', ({ cache, removeUpstreamResponseHeader, proxy }) => {
  removeUpstreamResponseHeader('cache-control')
  cache({
    browser: false,
    edge: {
      maxAgeSeconds: 60 * 60,
      staleWhileRevalidateSeconds: 60 * 60 * 24 * 365,
    },
    key: new CustomCacheKey().excludeAllQueryParameters(),
  })
  proxy('web')
})

// Sitemap
router.match('/sitemap.xml', ({ cache, removeUpstreamResponseHeader, proxy }) => {
  removeUpstreamResponseHeader('cache-control')
  cache({
    browser: false,
    edge: {
      maxAgeSeconds: 60 * 60 * 24,
      staleWhileRevalidateSeconds: 60 * 60 * 24 * 365,
    },
    key: new CustomCacheKey().excludeAllQueryParameters(),
  })
  proxy('web')
})

// User path(s)
router.match('/me/:path', ({ cache, removeUpstreamResponseHeader, proxy }) => {
  removeUpstreamResponseHeader('cache-control')
  cache({
    browser: false,
    edge: {
      maxAgeSeconds: 1,
      staleWhileRevalidateSeconds: 60 * 60 * 24 * 365,
    },
    key: new CustomCacheKey().excludeAllQueryParameters(),
  })
  proxy('web')
})

router.match('/robots.txt', ({ cache, proxy }) => {
  cache({
    edge: {
      maxAgeSeconds: 60 * 60 * 24 * 365,
    },
    key: new CustomCacheKey().excludeAllQueryParameters(),
  })
  proxy('web')
})

router.match('/_astro/:path*', ({ cache, proxy }) => {
  cache({
    edge: {
      maxAgeSeconds: 60 * 60 * 24 * 365,
    },
    key: new CustomCacheKey().excludeAllQueryParameters(),
  })
  proxy('web')
})

router.match('/__astro/:path*', ({ cache, proxy }) => {
  cache({
    edge: {
      maxAgeSeconds: 60 * 60 * 24 * 365,
    },
    key: new CustomCacheKey().excludeAllQueryParameters(),
  })
  proxy('web')
})

router.match('/seo/:path*', ({ cache, proxy }) => {
  cache({
    edge: {
      maxAgeSeconds: 60 * 60 * 24 * 365,
    },
    key: new CustomCacheKey().excludeAllQueryParameters(),
  })
  proxy('web', { path: '/__astro/seo/:path*' })
})

export default router
