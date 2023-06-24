import redis from './setup'
import { Ratelimit } from '@upstash/ratelimit'

export const ratelimit = (number, time) => {
  return new Ratelimit({
    redis,
    limiter: Ratelimit.fixedWindow(number, time),
  })
}
