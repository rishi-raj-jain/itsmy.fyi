import imagemin from 'imagemin'
import imageminJpegtran from 'imagemin-jpegtran'

export const getBase64ImageUrl = async (imageUrl, width = 50) => {
  try {
    if (imageUrl.startsWith('https:')) {
      const response = await fetch(`https://opt.moovweb.net/?img=${imageUrl}&width=${width}`)
      const buffer = await response.arrayBuffer()
      const minified = await imagemin.buffer(Buffer.from(buffer), {
        plugins: [imageminJpegtran({ progressive: true })],
      })
      const base64 = Buffer.from(minified).toString('base64')
      return { data: `data:image/jpeg;base64,${base64}` }
    }
    return {}
  } catch (e) {
    console.log(e.message || e.toString())
    return {}
  }
}
