import redis from '../setup'

type UserProfile = null | {
  slug: string
  issue: null | number
}

export async function getUserInfo(slug) {
  try {
    const parsedData: UserProfile = await redis.hget('profiles', slug)
    if (parsedData?.slug === slug) return { ...parsedData, code: 1 }
    return {
      code: 0,
      issue: null,
      error: "slug doesn't match for the user.",
    }
  } catch (e) {
    const error = e.message || e.toString()
    console.log(error)
    return {
      error,
      code: 0,
      issue: null,
    }
  }
}
