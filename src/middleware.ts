import { getENV } from '@/lib/env'
import { defineMiddleware } from 'astro/middleware'

/**
 * @type {import("astro").MiddlewareResponseHandler}
 */
// `context` and `next` are automatically typed
export const onRequest = defineMiddleware(async (context, next) => {
  if (context.request.headers.get('edgio') !== getENV('EDGIO_HEADER')) {
    return new Response(null, {
      status: 403,
    })
  }
  const response = await next()
  console.log(response)
  if (response) {
    return new Response(response.body, {
      status: response.status,
      headers: response.headers,
    })
  }
})
