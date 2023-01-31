import crypto from 'crypto'
import { getENV } from '@/lib/env'

export const verifyPostData = (signature256, body) => {
  try {
    const sig = Buffer.from(signature256, 'utf8')
    const hmac = crypto.createHmac('sha256', getENV('GITHUB_WEBHOOK_SECRET'))
    const digest = Buffer.from('sha256=' + hmac.update(body).digest('hex'), 'utf8')
    if (sig.length !== digest.length || !crypto.timingSafeEqual(digest, sig)) {
      return false
    }
    return true
  } catch (e) {
    console.log(e.message || e.toString())
    return false
  }
}
