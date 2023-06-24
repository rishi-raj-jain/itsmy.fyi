import { Router } from '@edgio/core'
import { CustomCacheKey } from '@edgio/core'

const router = new Router()

router.match('/', ({ cache, removeUpstreamResponseHeader, proxy, setRequestHeader }) => {
  setRequestHeader('edgio', process.env.EDGIO_HEADER)
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

router.match('/sitemap.xml', ({ cache, removeUpstreamResponseHeader, proxy, setRequestHeader }) => {
  setRequestHeader('edgio', process.env.EDGIO_HEADER)
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

router.match('/me/:path', ({ cache, removeUpstreamResponseHeader, proxy, setRequestHeader }) => {
  setRequestHeader('edgio', process.env.EDGIO_HEADER)
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

router.match('/robots.txt', ({ cache, proxy, setRequestHeader }) => {
  setRequestHeader('edgio', process.env.EDGIO_HEADER)
  cache({
    browser: false,
    edge: {
      maxAgeSeconds: 60 * 60 * 24 * 365,
    },
    key: new CustomCacheKey().excludeAllQueryParameters(),
  })
  proxy('web')
})

router.match('/_astro/:path*', ({ cache, proxy, setRequestHeader }) => {
  setRequestHeader('edgio', process.env.EDGIO_HEADER)
  cache({
    browser: false,
    edge: {
      maxAgeSeconds: 60 * 60 * 24 * 365,
    },
    key: new CustomCacheKey().excludeAllQueryParameters(),
  })
  proxy('web')
})

router.match('/__astro/:path*', ({ cache, proxy, setRequestHeader }) => {
  setRequestHeader('edgio', process.env.EDGIO_HEADER)
  cache({
    browser: false,
    edge: {
      maxAgeSeconds: 60 * 60 * 24 * 365,
    },
    key: new CustomCacheKey().excludeAllQueryParameters(),
  })
  proxy('web')
})

router.match('/seo/:path*', ({ cache, proxy, setRequestHeader }) => {
  setRequestHeader('edgio', process.env.EDGIO_HEADER)
  cache({
    browser: false,
    edge: {
      maxAgeSeconds: 60 * 60 * 24 * 365,
    },
    key: new CustomCacheKey().excludeAllQueryParameters(),
  })
  proxy('web', { path: '/__astro/seo/:path*' })
})

router.match('/github/create', ({ proxy, setRequestHeader }) => {
  setRequestHeader('edgio', process.env.EDGIO_HEADER)
  proxy('web')
})

router.match('/github/hook/issue', ({ proxy, setRequestHeader }) => {
  setRequestHeader('edgio', process.env.EDGIO_HEADER)
  proxy('web')
})

export default router
