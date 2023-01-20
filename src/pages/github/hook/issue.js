import { slug } from 'github-slugger'
import { ratelimit } from '../ratelimit'
import { validateEvent } from './validate'
import { octokit } from '../octokit/setup'
import { generateString } from './generateString'
import { getUserInfo } from '../upstash/users/get'
import { postUserInfo } from '../upstash/users/post'
import { deleteUserInfo } from '../upstash/users/delete'

const rateLimiter = ratelimit(3, '60 s')

export async function post({ request }) {
  let limit = 9999,
    remaining = 9999
  const context = await request.json()
  if (!['closed', 'edited', 'opened'].includes(context.action.toLowerCase())) {
    return {
      body: JSON.stringify({
        message: 'Event not supported.',
      }),
    }
  }
  if (rateLimiter) {
    const result = await rateLimiter.limit(context.sender.login)
    limit = result.limit
    remaining = result.remaining
    if (!result.success) {
      return {
        headers: {
          'X-RateLimit-Limit': limit,
          'X-RateLimit-Remaining': remaining,
        },
        body: JSON.stringify({
          message: 'Too many updates in 1 minute. Please try again in a few minutes.',
        }),
      }
    }
  }
  const data = validateEvent(context)

  const sluggedSlug = slug(data.slug)

  // Get file content for the slug from data
  const fileContent = await getUserInfo(sluggedSlug)
  const ifFileExists = fileContent.code === 1

  // If an issue is opened
  if (context.action === 'opened') {
    // If the file already exists, suggest another slug
    if (ifFileExists) {
      await octokit.rest.issues.createComment({
        owner: context.repository.owner.login,
        repo: context.repository.name,
        issue_number: data.issue,
        body: `Bad luck! Try with a new slug? Here's a suggestion for you: ${sluggedSlug}-${generateString(
          3
        )}.\n\nUsage:\nRemaining edits for next 1 minute: ${remaining}`,
      })
    }
    // If the file doesn't exist, create the new profile succesffully
    else {
      const { code } = await postUserInfo(data)
      // If the file is created successfully, comment with the profile link
      if (code === 1) {
        await octokit.rest.issues.createComment({
          owner: context.repository.owner.login,
          repo: context.repository.name,
          issue_number: data.issue,
          body: `Thanks for using [itsmy.fyi](https://itsmy.fyi). Visit your [profile here ↗︎](https://itsmy.fyi/me/${sluggedSlug}).\n\nUsage:\nRemaining edits for next 1 minute: ${remaining}`,
        })
      }
      // If the file is not created successfully, comment with the re-try method
      else {
        await octokit.rest.issues.createComment({
          owner: context.repository.owner.login,
          repo: context.repository.name,
          issue_number: data.issue,
          body: `Oops, some error occured while creating your profile. Try again by editing the issue?\n\nUsage:\nRemaining edits for next 1 minute: ${remaining}`,
        })
      }
    }
  }
  // If an issue is closed
  else if (context.action === 'closed') {
    // If the file exists
    if (ifFileExists) {
      // Only if the issue matches
      if (fileContent.issue === data.issue) {
        // Delete the file
        const { code } = await deleteUserInfo(data.slug)
        if (code === 1) {
          await octokit.rest.issues.createComment({
            owner: context.repository.owner.login,
            repo: context.repository.name,
            issue_number: data.issue,
            body: `Thanks for using [itsmy.fyi](https://itsmy.fyi). Succesfully deleted your profile.`,
          })
        } else {
          await octokit.rest.issues.createComment({
            owner: context.repository.owner.login,
            repo: context.repository.name,
            issue_number: data.issue,
            body: `Oops! There was an error in deleting your profile. Can you go ahead and just mention that in Discussions?`,
          })
        }
      }
    }
  }
  // If an issue is edited
  else if (context.action === 'edited') {
    // If the file exists
    if (ifFileExists) {
      // Only if the issue matches
      if (fileContent.issue === data.issue) {
        const { code } = await postUserInfo(data)
        if (code === 1) {
          await octokit.rest.issues.createComment({
            owner: context.repository.owner.login,
            repo: context.repository.name,
            issue_number: data.issue,
            body: `Thanks for using [itsmy.fyi](https://itsmy.fyi). Visit your [profile here ↗︎](https://itsmy.fyi/me/${sluggedSlug}).\n\nUsage:\nRemaining edits for next 1 minute: ${remaining}`,
          })
        }
      }
    } else {
      await octokit.rest.issues.createComment({
        owner: context.repository.owner.login,
        repo: context.repository.name,
        issue_number: data.issue,
        body: `Thanks for using [itsmy.fyi](https://itsmy.fyi). To claim a new slug, please create another [issue here](https://github.com/rishi-raj-jain/itsmy.fyi/issues/new/choose).\n\nUsage:\nRemaining edits for next 1 minute: ${remaining}`,
      })
    }
  }
}
