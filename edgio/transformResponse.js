import { minifyOptions } from 'minifyOptions'
import esImport from '@edgio/core/utils/esImport'

const minifyResponse = async (res) => {
  const contentType = res.getHeader('content-type')
  const toMinify = contentType.includes('/html') || contentType.includes('/xml')
  if (toMinify) {
    const { minify } = await esImport('html-minifier')
    res.body = minify(res.body.toString(), minifyOptions)
  }
}

export const transformResponse = async (res, req) => {
  let statusCodeOriginal = res.statusCode
  try {
    await minifyResponse(res)
  } catch (e) {
    console.log(e.message || e.toString())
    res.statusCode = statusCodeOriginal
  }
}
