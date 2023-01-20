import redis from '../setup'

export async function getUserSlugs() {
  try {
    const slugs = await redis.hkeys('profiles')
    return { slugs, code: 1 }
  } catch (e) {
    console.log(e.message || e.toString())
    return {
      code: 0,
    }
  }
}
