module.exports = {
  connector: './',
  backends: {
    web: {
      hostHeader: process.env.VERCEL_DEPLOYMENT,
      domainOrIp: process.env.VERCEL_DEPLOYMENT,
      disableCheckCert: true,
    },
  },
}
