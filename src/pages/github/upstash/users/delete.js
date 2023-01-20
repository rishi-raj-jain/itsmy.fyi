import redis from '../setup'

export async function deleteUserInfo(slug) {
  try {
    await redis.hdel('profiles', slug)
    return { code: 1 }
  } catch (e) {
    console.log(e.message || e.toString())
    return {
      code: 0,
    }
  }
}
