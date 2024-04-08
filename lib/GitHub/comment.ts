import { octokit } from '~/Octokit/setup'

export const createComment = async (context, body) => {
  await octokit.rest.issues.createComment({
    owner: context.repository.owner.login,
    repo: context.repository.name,
    issue_number: context.issue.number,
    body,
  })
}
