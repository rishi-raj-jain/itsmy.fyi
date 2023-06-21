import redis from '../setup'

export async function getUserInfo(slug) {
  try {
    const parsedData = await redis.hget('profiles', slug)
    if (parsedData.slug === slug) {
      return { ...parsedData, code: 1 }
    }
    return {
      code: 0,
      error: "slug doesn't match for the user.",
    }
  } catch (e) {
    const error = e.message || e.toString()
    console.log(error)
    return {
      code: 0,
      error,
    }
  }
}
