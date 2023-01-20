import { Octokit } from '@octokit/rest'

const auth = import.meta.env.GITHUB_API_TOKEN ?? process.env.GITHUB_API_TOKEN

export const octokit = new Octokit({ auth })
