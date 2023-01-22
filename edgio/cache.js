import { CustomCacheKey } from '@edgio/core'

export const cacheConfig = (maxAgeSeconds, excludeAllQueries = false) => ({
  edge: {
    maxAgeSeconds,
    staleWhileRevalidateSeconds: 60 * 60 * 24 * 365,
  },
  browser: false,
  ...(excludeAllQueries ? { key: new CustomCacheKey().excludeAllQueryParameters() } : {}),
})
