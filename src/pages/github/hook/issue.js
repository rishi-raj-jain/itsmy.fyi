import fetch from 'node-fetch'
import { slug } from 'github-slugger'
import { ratelimit } from '../ratelimit'
import { validateEvent } from './validate'
import { octokit } from '../octokit/setup'
import { generateString } from './generateString'
import { deleteFile, getFileContent, writeJsonToFile } from '../octokit/helpers'

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
  if (ratelimit) {
    const result = await ratelimit.limit(context.sender.login)
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

  const jsonPath = `jsons/${sluggedSlug}.json`

  // Get file content for the slug from data
  const fileContent = await getFileContent(context.repository.owner.login, context.repository.name, jsonPath)
  const ifFileExists = fileContent && fileContent.content

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
      const success = await writeJsonToFile(
        context.repository.owner.login,
        context.repository.name,
        jsonPath,
        `Issue ${data.issue} was created.`,
        data
      )
      // If the file is created successfully, comment with the profile link
      if (success) {
        await octokit.rest.issues.createComment({
          owner: context.repository.owner.login,
          repo: context.repository.name,
          issue_number: data.issue,
          body: `Thanks for using [itsmy.fyi](https://itsmy.fyi). Visit your [profile here ↗︎](https://itsmy.fyi/u/${sluggedSlug}).\n\nUsage:\nRemaining edits for next 1 minute: ${remaining}`,
        })
        await fetch(`https://itsmy.fyi/u/${sluggedSlug}`)
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
      // Parse the base64 content to JSON
      const fileContentJSON = JSON.parse(Buffer.from(fileContent.content, 'base64').toString())
      // Only if the issue matches
      if (fileContentJSON.issue === data.issue) {
        // Delete the file
        await deleteFile(context.repository.owner.login, context.repository.name, jsonPath, `Issue ${data.issue} was closed.`, fileContent.sha)
        await octokit.rest.issues.createComment({
          owner: context.repository.owner.login,
          repo: context.repository.name,
          issue_number: data.issue,
          body: `Thanks for using [itsmy.fyi](https://itsmy.fyi). Succesfully deleted your profile.`,
        })
      }
    }
  }
  // If an issue is edited
  else if (context.action === 'edited') {
    // If the file exists
    if (ifFileExists) {
      // Parse the base64 content to JSON
      const fileContentJSON = JSON.parse(Buffer.from(fileContent.content, 'base64').toString())
      // Only if the issue matches
      if (fileContentJSON.issue === data.issue) {
        await writeJsonToFile(
          context.repository.owner.login,
          context.repository.name,
          jsonPath,
          `Issue ${data.issue} was edited.`,
          data,
          fileContent.sha
        )
        await octokit.rest.issues.createComment({
          owner: context.repository.owner.login,
          repo: context.repository.name,
          issue_number: data.issue,
          body: `Thanks for using [itsmy.fyi](https://itsmy.fyi). Visit your [profile here ↗︎](https://itsmy.fyi/u/${sluggedSlug}).\n\nUsage:\nRemaining edits for next 1 minute: ${remaining}`,
        })
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
