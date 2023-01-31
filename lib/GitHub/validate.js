import matter from 'gray-matter'

export const validateBody = (data) => {
  try {
    if ('disabled' in data && data.disabled === 'yes') {
      throw new Error(`Found disabled as yes, avoiding processing further.`)
    }
    if (!(typeof data.name === 'string')) {
      throw new Error(`Invalid 'name' received.`)
    }
    if (!(typeof data.slug === 'string')) {
      throw new Error(`Invalid 'slug' received.`)
    }
    if (!(typeof data.image === 'string')) {
      throw new Error(`Invalid 'image' received.`)
    }
    if (!Array.isArray(data.links)) {
      throw new Error(`Invalid 'links' received.`)
    }
    data.links.forEach((i) => {
      if (i.some((element) => typeof element !== 'string')) {
        throw new Error(`Invalid element inside 'links' array received.`)
      }
    })
    if (!Array.isArray(data.socials)) {
      throw new Error(`Invalid 'socials' received.`)
    }
    data.socials.forEach((i) => {
      if (i.some((element) => typeof element !== 'string')) {
        throw new Error(`Invalid element inside 'links' array received.`)
      }
    })
    const { name, slug, image, links, socials, og = {}, about = '', background = {}, ga = {}, icon } = data
    return { name, slug, image, links, socials, og, about, background, ga, icon }
  } catch (e) {
    console.error(e.message || e.toString())
    return { error: e.message || e.toString() }
  }
}

export const validateEvent = (context) => {
  try {
    if (!(typeof context.issue.number === 'number')) {
      return false
    }
    const body = context.issue.body
    const start = body.indexOf('---\r\n')
    const end = body.lastIndexOf('\r\n---')
    const { data } = matter(body.substring(start, end + 5))
    return {
      ...validateBody(data),
      issue: context.issue.number,
    }
  } catch (e) {
    console.error(e.message || e.toString())
    return { error: e.message || e.toString() }
  }
}
