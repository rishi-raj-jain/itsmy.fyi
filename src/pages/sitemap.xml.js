import { listFilenames } from './github/octokit/helpers'

export async function get({}) {
  const prefix = 'https://itsmy.fyi/'
  const slugs = (await listFilenames('rishi-raj-jain', 'itsmy.fyi', 'jsons')).map((i) => i.substring(0, i.indexOf('.json')))
  const sitemap = `
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <url><loc>${prefix}</loc></url>
        ${slugs.map((i) => `<url><loc>${prefix}${i}</loc></url>`).join('')}
    </urlset>
  `
  return new Response(sitemap, {
    status: 200,
    headers: {
      'Content-Type': 'text/xml',
    },
  })
}
