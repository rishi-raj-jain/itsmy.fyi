import { getENV } from '@/lib/env'
import { Redis } from '@upstash/redis'
import { Ratelimit } from '@upstash/ratelimit'

const url = getENV('UPSTASH_REDIS_REST_URL')
const token = getENV('UPSTASH_REDIS_REST_TOKEN')

export const ratelimit = (number, time) => {
  if (url && token) {
    return new Ratelimit({
      redis: new Redis({
        url,
        token,
      }),
      limiter: Ratelimit.fixedWindow(number, time),
    })
  }
  return
}
