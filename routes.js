import { Router } from '@edgio/core'
import { CustomCacheKey } from '@edgio/core'

const router = new Router()

const getPath = (path) => {
  return {
    path,
    headers: {
      host: /itsmy\.fyi/,
    },
  }
}

router.match(getPath('/:path*'), ({ setRequestHeader }) => {
  setRequestHeader('edgio', process.env.EDGIO_HEADER)
})

router.match(getPath('/'), ({ cache, removeUpstreamResponseHeader, proxy }) => {
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

router.match(getPath('/sitemap.xml'), ({ cache, removeUpstreamResponseHeader, proxy }) => {
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

router.match(getPath('/me/:path'), ({ cache, removeUpstreamResponseHeader, proxy }) => {
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

router.match(getPath('/robots.txt'), ({ cache, proxy }) => {
  cache({
    browser: false,
    edge: {
      maxAgeSeconds: 60 * 60 * 24 * 365,
    },
    key: new CustomCacheKey().excludeAllQueryParameters(),
  })
  proxy('web')
})

router.match(getPath('/_astro/:path*'), ({ cache, proxy }) => {
  cache({
    browser: false,
    edge: {
      maxAgeSeconds: 60 * 60 * 24 * 365,
    },
    key: new CustomCacheKey().excludeAllQueryParameters(),
  })
  proxy('web')
})

router.match(getPath('/__astro/:path*'), ({ cache, proxy }) => {
  cache({
    browser: false,
    edge: {
      maxAgeSeconds: 60 * 60 * 24 * 365,
    },
    key: new CustomCacheKey().excludeAllQueryParameters(),
  })
  proxy('web')
})

router.match(getPath('/seo/:path*'), ({ cache, proxy }) => {
  cache({
    browser: false,
    edge: {
      maxAgeSeconds: 60 * 60 * 24 * 365,
    },
    key: new CustomCacheKey().excludeAllQueryParameters(),
  })
  proxy('web', { path: '/__astro/seo/:path*' })
})

router.match(getPath('/github/create'), ({ proxy }) => {
  proxy('web')
})

router.match(getPath('/github/hook/issue'), ({ proxy }) => {
  proxy('web')
})

router.match(getPath('/terms'), ({ proxy, cache }) => {
  cache({
    browser: false,
    edge: {
      maxAgeSeconds: 60 * 60 * 24 * 365,
    },
    key: new CustomCacheKey().excludeAllQueryParameters(),
  })
  proxy('web')
})

router.match(getPath('/privacy'), ({ proxy, cache }) => {
  cache({
    browser: false,
    edge: {
      maxAgeSeconds: 60 * 60 * 24 * 365,
    },
    key: new CustomCacheKey().excludeAllQueryParameters(),
  })
  proxy('web')
})

router.match(getPath('/pricing'), ({ proxy, cache }) => {
  cache({
    browser: false,
    edge: {
      maxAgeSeconds: 60 * 60 * 24 * 365,
    },
    key: new CustomCacheKey().excludeAllQueryParameters(),
  })
  proxy('web')
})

router.match(getPath('/changelog'), ({ proxy, cache }) => {
  cache({
    browser: false,
    edge: {
      maxAgeSeconds: 60 * 60 * 24 * 365,
    },
    key: new CustomCacheKey().excludeAllQueryParameters(),
  })
  proxy('web')
})

router.fallback(({ send, cache }) => {
  cache({
    edge: {
      maxAgeSeconds: 60 * 60 * 24 * 365,
    },
  })
  send('Blocked', 403)
})

export default router
