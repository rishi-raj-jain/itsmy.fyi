import matter from 'gray-matter'

const validateBody = (body) => {
  try {
    const { data } = matter(body)
    if (data.hasOwnProperty('disabled') && data.disabled === 'yes') {
      process.exit(1)
    }
    if (!(typeof data.name === 'string')) {
      return false
    }
    if (!(typeof data.slug === 'string')) {
      return false
    }
    if (!(typeof data.image === 'string')) {
      return false
    }
    if (!Array.isArray(data.links)) {
      return false
    }
    if (!Array.isArray(data.socials)) {
      return false
    }
    const { name, slug, image, links, socials, og = {}, about = '' } = data
    return { name, slug, image, links, socials, og, about }
  } catch (e) {
    console.error(e.message || e.toString())
    return false
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
    return {
      ...validateBody(body.substring(start, end + 5)),
      issue: context.issue.number,
    }
  } catch (e) {
    console.error(e.message || e.toString())
    return false
  }
}
