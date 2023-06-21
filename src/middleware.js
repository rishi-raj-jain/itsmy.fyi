import { getENV } from '@/lib/env'

export function onRequest({ request }, next) {
  if (request.headers.get('edgio') !== getENV('EDGIO_HEADER')) {
    return new Response(null, {
      status: 403,
    })
  }
  return next()
}
