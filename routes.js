// This file was automatically added by edgio init.
// You should commit this file to source control.

import { load } from 'cheerio'
import { astroRoutes } from '@edgio/astro'
import { minifyOptions } from 'minifyOptions'
import esImport from '@edgio/core/utils/esImport'
import { CustomCacheKey, Router } from '@edgio/core'
import { verifyPostData } from './src/pages/github/verifySignature'

const optimizePage = ({ cache, removeUpstreamResponseHeader, renderWithApp, removeRequestHeader }) => {
  removeRequestHeader('ITS-MY-PROTECTION')
  removeUpstreamResponseHeader('cache-control')
  cache({
    edge: {
      maxAgeSeconds: 1,
      staleWhileRevalidateSeconds: 60 * 60 * 24 * 365,
    },
    browser: false,
    key: new CustomCacheKey().excludeAllQueryParameters(),
  })
  renderWithApp({
    transformResponse: async (res, req) => {
      let statusCodeOriginal = res.statusCode
      try {
        if (res.getHeader('content-type').includes('html')) {
          const $ = load(res.body)
          const { minify } = await esImport('html-minifier')
          res.body = minify($.html(), minifyOptions)
        }
      } catch (e) {
        console.log(e.message || e.toString())
        res.statusCode = statusCodeOriginal
      }
    },
  })
}

const router = new Router({ indexPermalink: true })

router.match('/_image', ({ cache }) => {
  cache({
    edge: {
      maxAgeSeconds: 60 * 60 * 24 * 365,
    },
  })
})

router.match('/launch', ({ redirect }) => {
  redirect('https://twitter.com/rishi_raj_jain_/status/1616100171137560577')
})

router.match('/me/:slug', ({ compute, redirect, send }) => {
  compute((req, res) => {
    const { slug } = req.params
    if (slug && slug.length) {
      const headers = req.getHeaders()
      const analyticsObject = {}
      if (headers['x-0-browser']) {
        analyticsObject['browser'] = headers['x-0-browser']
      }
      if (headers['x-0-device']) {
        analyticsObject['device'] = headers['x-0-device']
      }
      if (headers['x-0-device-is-bot']) {
        analyticsObject['bot'] = headers['x-0-device-is-bot']
      }
      if (headers['x-0-geo-country-code']) {
        analyticsObject['country'] = headers['x-0-geo-country-code']
      }
      if (headers['sec-ch-ua-platform']) {
        analyticsObject['os'] = headers['sec-ch-ua-platform']
      }
      if (headers['referer']) {
        analyticsObject['referer'] = headers['referer']
      }
      console.log(JSON.stringify(analyticsObject))
      req.setHeader('ITS-MY-PROTECTION', process.env.GITHUB_WEBHOOK_SECRET)
      return redirect('/u/:path')
    } else {
      send('Invalid Request', 403)
    }
  })
})

router.match('/github/hook/issue', ({ renderWithApp, compute }) => {
  compute((req, res) => {
    if (req.method.toLowerCase() === 'post') {
      if (req.getHeader('Content-Type').toLowerCase() === 'application/json') {
        if (verifyPostData(req.getHeader('X-Hub-Signature-256'), req.rawBody)) {
          return renderWithApp()
        }
      }
    }
  })
})

router.match('/', optimizePage)

router.match({ path: '/u/:path', headers: { 'ITS-MY-PROTECTION': process.env.GITHUB_WEBHOOK_SECRET } }, optimizePage)

router.match({ path: '/u/:path' }, ({ send }) => {
  send('Blocked', 403)
})

router.use(astroRoutes)

export default router
