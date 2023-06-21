import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: import.meta.env['UPSTASH_REDIS_REST_URL'],
  token: import.meta.env['UPSTASH_REDIS_REST_TOKEN'],
})

export default redis
