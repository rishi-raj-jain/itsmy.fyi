const { join } = require('path')

module.exports = {
  connector: '@edgio/astro',
  astro: {
    appPath: join(process.cwd(), 'dist', 'server', 'entry.mjs'),
  },
  includeFiles: {
    'node_modules/html-minifier/**/*': true,
    'node_modules/camel-case/**/*': true,
    'node_modules/clean-css/**/*': true,
    'node_modules/commander/**/*': true,
    'node_modules/he/**/*': true,
    'node_modules/relateurl/**/*': true,
    'node_modules/uglify-js/**/*': true,
    'node_modules/param-case/**/*': true,
  },
}
