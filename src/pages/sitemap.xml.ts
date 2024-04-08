import { getUserSlugs } from '~/Upstash/users'
import { SitemapStream, streamToPromise } from 'sitemap'

export async function GET() {
  try {
    const hostname = 'https://itsmy.fyi'
    const smStream = new SitemapStream({ hostname })
    const { code, slugs = [] } = await getUserSlugs()
    if (code === 1) {
      slugs.forEach((i) => {
        smStream.write({ url: `/me/${i}`, changefreq: 'daily', priority: 1 })
      })
      smStream.end()
      const sitemap = await streamToPromise(smStream)
      return new Response(sitemap, {
        headers: {
          'Content-Type': 'text/xml',
        },
      })
    }
  } catch (e: any) {
    const tmp = e.message || e.toString()
    console.log(tmp)
    return new Response(tmp, { status: 500 })
  }
}
