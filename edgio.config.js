// This file was automatically added by edgio init.
// You should commit this file to source control.

const { join } = require('path')

module.exports = {
  connector: '@edgio/astro',
  backends: {
    self: {
      hostHeader: 'itsmy.fyi',
      domainOrIp: 'itsmy.fyi',
      disableCheckCert: true,
    },
  },
  astro: {
    appPath: join(process.cwd(), 'dist', 'server', 'entry.mjs'),
  },
}
