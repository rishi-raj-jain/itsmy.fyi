import { Redis } from '@upstash/redis'
import { Ratelimit } from '@upstash/ratelimit'

let auth = {}

if (import.meta && import.meta.env) {
  auth = {
    url: import.meta.env.UPSTASH_REDIS_REST_URL,
    token: import.meta.env.UPSTASH_REDIS_REST_TOKEN,
  }
} else if (process.env) {
  auth = {
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  }
}

// Create a new ratelimiter, that allows 3 requests per 60 seconds
export const ratelimit = (number, time) =>
  auth && auth.hasOwnProperty('url') && auth.url
    ? new Ratelimit({
        redis: new Redis(auth),
        limiter: Ratelimit.fixedWindow(number, time),
      })
    : undefined
