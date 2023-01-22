import { slug } from 'github-slugger'
import { octokit } from '@/lib/Octokit/setup'
import { ratelimit } from '@/lib/Upstash/ratelimit'
import { validateEvent } from '@/lib/GitHub/validate'
import { generateString } from '@/lib/GitHub/generateString'
import { deleteUserInfo, getUserInfo, postUserInfo } from '@/lib/Upstash/users'

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

  if (data.error) {
    const errorMessage = [
      "Bad luck! Here's what we found breaking in your data:\n\n",
      '```markdown\n' + data.error + '\n```',
      "\n\nI promise I'll handle this better, but you'd have to create a [new issue](https://github.com/rishi-raj-jain/itsmy.fyi/issues/new?assignees=&labels=&template=itsyour.page-profile-data.yml&title=itsmy.fyi+-+%7BINSERT+NAME%7D+%28Optional%29) for now.",
    ]
    await octokit.rest.issues.createComment({
      owner: context.repository.owner.login,
      repo: context.repository.name,
      issue_number: data.issue,
      body: errorMessage.join('').toString(),
    })
    return
  }

  const sluggedSlug = slug(data.slug)

  // Get file content for the slug from data
  const fileContent = await getUserInfo(sluggedSlug)
  const ifFileExists = fileContent.code === 1

  // If an issue is opened
  if (context.action === 'opened') {
    // If the file already exists, suggest another slug
    if (ifFileExists) {
      const errorMessage = [
        "Bad luck! Try with a new slug? Here's a suggestion for you:\n\n",
        '```markdown\nslug: ' + `${sluggedSlug}-${generateString(3)}` + '\n```',
        "\n\nI promise I'll handle this better, but you'd have to create a [new issue](https://github.com/rishi-raj-jain/itsmy.fyi/issues/new?assignees=&labels=&template=itsyour.page-profile-data.yml&title=itsmy.fyi+-+%7BINSERT+NAME%7D+%28Optional%29) for now.",
      ]
      await octokit.rest.issues.createComment({
        owner: context.repository.owner.login,
        repo: context.repository.name,
        issue_number: data.issue,
        body: errorMessage.join('').toString(),
      })
      return
    }
    // If the file doesn't exist, create the new profile succesffully
    else {
      const { code } = await postUserInfo({ ...data, slug: sluggedSlug })
      // If the file is created successfully, comment with the profile link
      if (code === 1) {
        await octokit.rest.issues.createComment({
          owner: context.repository.owner.login,
          repo: context.repository.name,
          issue_number: data.issue,
          body: `Thanks for using [itsmy.fyi](https://itsmy.fyi). Visit your [profile here ↗︎](https://itsmy.fyi/me/${sluggedSlug}).\n\nUsage:\nRemaining edits for next 1 minute: ${remaining}`,
        })
        return
      }
      // If the file is not created successfully, comment with the re-try method
      else {
        await octokit.rest.issues.createComment({
          owner: context.repository.owner.login,
          repo: context.repository.name,
          issue_number: data.issue,
          body: `Oops, some error occured while creating your profile. Try again by editing the issue?\n\nUsage:\nRemaining edits for next 1 minute: ${remaining}`,
        })
        return
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
          return
        } else {
          await octokit.rest.issues.createComment({
            owner: context.repository.owner.login,
            repo: context.repository.name,
            issue_number: data.issue,
            body: `Oops! There was an error in deleting your profile. Can you go ahead and just mention that in Discussions?`,
          })
          return
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
        const { code } = await postUserInfo({ ...data, slug: sluggedSlug })
        if (code === 1) {
          await octokit.rest.issues.createComment({
            owner: context.repository.owner.login,
            repo: context.repository.name,
            issue_number: data.issue,
            body: `Thanks for using [itsmy.fyi](https://itsmy.fyi). Visit your [profile here ↗︎](https://itsmy.fyi/me/${sluggedSlug}).\n\nUsage:\nRemaining edits for next 1 minute: ${remaining}`,
          })
          return
        }
      }
    } else {
      await octokit.rest.issues.createComment({
        owner: context.repository.owner.login,
        repo: context.repository.name,
        issue_number: data.issue,
        body: `Thanks for using [itsmy.fyi](https://itsmy.fyi). To claim a new slug, please create another [issue here](https://github.com/rishi-raj-jain/itsmy.fyi/issues/new/choose).\n\nUsage:\nRemaining edits for next 1 minute: ${remaining}`,
      })
      return
    }
  }
}
