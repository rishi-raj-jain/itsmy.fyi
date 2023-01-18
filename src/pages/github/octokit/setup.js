import { Octokit } from '@octokit/rest'

export const octokit = new Octokit({
  auth: import.meta.env.GITHUB_API_TOKEN,
})
