import fetch from 'node-fetch'
import { Octokit } from '@octokit/core'

let auth

if (import.meta && import.meta.env) {
  auth = import.meta.env.GITHUB_API_TOKEN
} else if (process.env) {
  auth = process.env.GITHUB_API_TOKEN
}

const octokit = new Octokit({ auth })

export async function getUserItems(slug) {
  let resp
  if (auth) {
    // ex. https://api.github.com/repos/rishi-raj-jain/itsmy.fyi/contents/jsons%2Frishi-raj-jain.json?ref=main
    resp = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}{?ref}', {
      owner: 'rishi-raj-jain',
      repo: 'itsmy.fyi',
      path: 'jsons/' + slug + '.json',
      ref: 'main',
    })
    if (resp.status === 200) {
      return resp.data
    }
  } else {
    // Define 1-click logic
    resp = await fetch(`https://api.github.com/repos/rishi-raj-jain/itsmy.fyi/contents/jsons%2F${slug}.json?ref=main`)
    if (resp.status === 200) {
      return await resp.json()
    }
  }
  console.log(JSON.stringify(resp.status))
  console.log(JSON.stringify(resp))
}
