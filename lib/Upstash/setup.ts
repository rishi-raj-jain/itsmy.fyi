import { getENV } from '../env'
import { Redis } from '@upstash/redis'

export default new Redis({
  url: getENV('UPSTASH_REDIS_REST_URL'),
  token: getENV('UPSTASH_REDIS_REST_TOKEN'),
})
