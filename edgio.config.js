const { join } = require('path')
const { existsSync } = require('fs')

let includeFiles = {}

const depPath = join(process.cwd(), 'deps.json')

console.log({ depPath })
if (existsSync(depPath)) {
  includeFiles = require(depPath)
  console.log(includeFiles)
}

module.exports = {
  includeFiles,
  connector: '@edgio/astro',
  astro: {
    appPath: join(process.cwd(), 'dist', 'server', 'entry.mjs'),
  },
}
