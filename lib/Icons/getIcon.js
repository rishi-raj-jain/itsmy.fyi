import { logos } from './logo'

export const icon = (name) => {
  try {
    const listOfIcons = logos.find((i) => i.shortname.includes(name)).files
    const ifIcon = listOfIcons.find((i) => i.includes('icon'))
    return `https://cdn.svgporn.com/logos/${ifIcon ?? listOfIcons[0]}`
  } catch (e) {
    console.log(e.message || e.toString())
    return null
  }
}
