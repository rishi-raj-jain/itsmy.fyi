import Redis from 'ioredis'

let REDIS_DB

if (import.meta && import.meta.env) {
  REDIS_DB = import.meta.env.UPSTASH_DB
} else if (process.env) {
  REDIS_DB = process.env.UPSTASH_DB
}

const redis = new Redis(REDIS_DB)

export default redis
