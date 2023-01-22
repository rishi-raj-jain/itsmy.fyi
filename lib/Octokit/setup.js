import { Octokit } from '@octokit/rest'

let auth

if (import.meta && import.meta.env) {
  auth = import.meta.env.GITHUB_API_TOKEN
} else if (process.env) {
  auth = process.env.GITHUB_API_TOKEN
}

export const octokit = new Octokit({ auth })
