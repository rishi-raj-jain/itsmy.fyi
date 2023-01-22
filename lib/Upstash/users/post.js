import redis from '../setup'

export async function postUserInfo(data) {
  try {
    await redis.hset('profiles', data.slug, JSON.stringify(data))
    return { code: 1 }
  } catch (e) {
    console.log(e.message || e.toString())
    return {
      code: 0,
    }
  }
}
