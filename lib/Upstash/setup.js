import Redis from 'ioredis'
import { getENV } from '@/lib/env'

const redis = new Redis(getENV('UPSTASH_DB'))

export default redis
