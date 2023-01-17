const { join } = require('path')
const { existsSync } = require('fs')

let includeFiles = {}

const depPath = join(process.cwd(), 'deps.json')
if (existsSync(depPath)) {
  includeFiles = require(depPath)
}

module.exports = {
  includeFiles,
  connector: '@edgio/astro',
  astro: {
    appPath: join(process.cwd(), 'dist', 'server', 'entry.mjs'),
  },
}
