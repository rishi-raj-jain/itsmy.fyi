import { Redis } from '@upstash/redis'
import { Ratelimit } from '@upstash/ratelimit'

let auth

if (import.meta && import.meta.env) {
  auth = import.meta.env.UPSTASH_REDIS_REST_URL
} else if (process.env) {
  auth = process.env.UPSTASH_REDIS_REST_URL
}

// Create a new ratelimiter, that allows 3 requests per 60 seconds
export const ratelimit = (number, time) =>
  auth
    ? new Ratelimit({
        redis: Redis.fromEnv(),
        limiter: Ratelimit.fixedWindow(number, time),
      })
    : undefined
