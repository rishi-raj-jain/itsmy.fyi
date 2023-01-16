import { Octokit } from '@octokit/core'

const octokit = new Octokit({
  auth: import.meta.env.GITHUB_API_TOKEN,
})

export async function getUserItems(slug) {
  const resp = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}{?ref}', {
    owner: 'rishi-raj-jain',
    repo: 'itsyour.page',
    path: 'jsons/' + slug + '.json',
    ref: 'jsons',
  })
  if (resp.status === 200) {
    return resp.data
  } else {
    console.log(JSON.stringify(resp.status))
    console.log(JSON.stringify(resp))
  }
}
