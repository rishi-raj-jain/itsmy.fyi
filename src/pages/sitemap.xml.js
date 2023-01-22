import { getUserSlugs } from '@/lib/Upstash/users'

export async function get({}) {
  const prefix = 'https://itsmy.fyi'
  const { code, slugs = [] } = await getUserSlugs()
  if (code === 1) {
    const sitemap = `
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <url><loc>${prefix}</loc></url>
        ${slugs.map((i) => `<url><loc>${prefix}/me/${i}</loc></url>`).join('')}
    </urlset>
  `
    return new Response(sitemap, {
      status: 200,
      headers: {
        'Content-Type': 'text/xml',
      },
    })
  } else {
    return new Response(null, {
      status: 404,
      location: '/404',
      headers: {
        'Content-Type': 'text/html',
      },
    })
  }
}
