import { Octokit } from '@octokit/core'

const octokit = new Octokit({
  auth: import.meta.env.GITHUB_API_TOKEN,
})

export async function getUserItems(slug) {
  let resp
  if (import.meta.env.GITHUB_API_TOKEN) {
    console.log(JSON.stringify(import.meta.env.GITHUB_API_TOKEN))
    // ex. https://api.github.com/repos/rishi-raj-jain/itsyour.page/contents/jsons%2Frishi-raj-jain.json?ref=main
    resp = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}{?ref}', {
      owner: 'rishi-raj-jain',
      repo: 'itsyour.page',
      path: 'jsons/' + slug + '.json',
      ref: 'main'
    })
  } else {
    // Define 1-click logic
  }
  if (resp.status === 200) {
    return resp.data
  } else {
    console.log(JSON.stringify(resp.status))
    console.log(JSON.stringify(resp))
  }
}
