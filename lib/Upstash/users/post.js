import redis from '../setup'

export async function postUserInfo(data) {
  try {
    await redis.hset('profiles', data.slug, JSON.stringify(data))
    return { code: 1 }
  } catch (e) {
    const error = e.message || e.toString()
    console.log(error)
    return {
      code: 0,
      error,
    }
  }
}
