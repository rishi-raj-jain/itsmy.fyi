import { Redis } from '@upstash/redis'
import { Ratelimit } from '@upstash/ratelimit'

// Create a new ratelimiter, that allows 3 requests per 60 seconds
export const ratelimit = (number, time) =>
  import.meta.env.UPSTASH_REDIS_REST_URL
    ? new Ratelimit({
        redis: Redis.fromEnv(),
        limiter: Ratelimit.fixedWindow(number, time),
      })
    : undefined
