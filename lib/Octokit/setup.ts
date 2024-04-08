import { getENV } from '~/env'
import { Octokit } from '@octokit/rest'

const auth = getENV('GITHUB_API_TOKEN')

export const octokit = new Octokit({ auth })
