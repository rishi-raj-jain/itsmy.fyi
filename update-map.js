require('dotenv').config()
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args))

console.log(process.env.GITHUB_CONTEXT)
