import fetch from 'node-fetch'
import { Octokit } from '@octokit/core'

const octokit = new Octokit({
  auth: import.meta.env.GITHUB_API_TOKEN,
})

export async function getUserItems(slug) {
  let resp
  if (import.meta.env.GITHUB_API_TOKEN) {
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
