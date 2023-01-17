import fs from 'fs'
import { nodeFileTrace } from '@vercel/nft'

/**
* Exports a function to write a json that computes dependencies required by given paths
* @param paths List of paths for which dependencies need to be computed
* @param filename Name of the file to write json to
* @returns void
*/
export async function computeDependencies(paths= [], name = 'deps') {
  // the whole app inside index.js,
  // include other paths that are
  // not bundled with your app builds
  const files = paths
  // Compute file trace
  const { fileList } = await nodeFileTrace(files)
  // Store set of packages
  let packages = {}
  fileList.forEach((i) => {
    if (i.includes('node_modules/')) {
      let temp = i.replace('node_modules/', '')
      temp = temp.substring(0, temp.indexOf('/'))
      packages[`node_modules/${temp}`] = true
    } else {
      packages[i] = true
    }
  })
  // Sort the set of packages by name (for easier difference comparison with git)
  packages = Object.keys(packages)
    .sort()
    .reduce((obj, key) => {
      obj[key] = packages[key]
      return obj
    }, {})
  // Dump the list of the computed packages for further references while deploying the app
  fs.writeFileSync(`./${name}.json`, JSON.stringify(packages, null, 2), 'utf-8')
}