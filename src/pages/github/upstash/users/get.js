import redis from '../setup'

export async function getUserInfo(slug) {
  try {
    const userData = await redis.hget('profiles', slug)
    const parsedData = JSON.parse(userData)
    if (parsedData.slug === slug) {
      return { ...parsedData, code: 1 }
    }
    return {
      code: 0,
    }
  } catch (e) {
    console.log(e.message || e.toString())
    return {
      code: 0,
    }
  }
}
