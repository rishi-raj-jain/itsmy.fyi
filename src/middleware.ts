import { getENV } from '@/lib/env'

export function onRequest({ request }) {
  if (request.headers.get('edgio') !== getENV('EDGIO_HEADER')) {
    return new Response(null, {
      status: 403,
    })
  }
}
