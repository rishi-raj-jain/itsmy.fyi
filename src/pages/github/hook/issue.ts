import { json } from '~/GitHub/json'
import { slug } from 'github-slugger'
import { ratelimit } from '~/Upstash/ratelimit'
import { createComment } from '~/GitHub/comment'
import { generateString } from '~/GitHub/generateString'
import { validateEvent, verifySignature } from '~/GitHub/validate'
import { deleteUserInfo, getUserInfo, postUserInfo } from '~/Upstash/users'

const rateLimiter = ratelimit(3, '60 s')

export async function POST({ request }) {
  let limit = 9999,
    remaining = 9999
  const context = await request.json()
  // if not a suitable event
  if (!['closed', 'edited', 'opened'].includes(context.action.toLowerCase())) return json({ message: 'Event not supported.' }, 403)

  // if not a verified call
  if (!verifySignature(context, request.headers.get('X-Hub-Signature-256'))) return json({ message: 'Forbidden.' }, 403)

  // if rate limited
  if (rateLimiter) {
    const result = await rateLimiter.limit(context.sender.login)
    limit = result.limit
    remaining = result.remaining
    if (!result.success) {
      const message = 'Too many updates in 1 minute. Please try again in a few minutes.'
      await createComment(context, message)
      return json({ message }, 429)
    }
  }

  const data = validateEvent(context)

  // if no data
  if (data === false) return json(null, 403)

  // if error in data
  if (data.error) {
    const message = [
      "Bad luck! Here's what we found breaking in your data:\n\n",
      '```markdown\n' + data.error + '\n```',
      `\n\nFeel free to edit the issue again in case you've already got a link, else please re-try by creating a [new issue](https://github.com/rishi-raj-jain/itsmy.fyi/issues/new?assignees=&labels=&template=itsyour.page-profile-data.yml&title=itsmy.fyi+-+%7BINSERT+NAME%7D+%28Optional%29) for now.`,
    ]
      .join('')
      .toString()
    await createComment(context, message)
    return json({ message }, 400)
  }

  const sluggedSlug = slug(data.slug)

  // Get file content for the slug from data
  const fileContent = await getUserInfo(sluggedSlug)
  const ifFileExists = fileContent.code === 1

  // If an issue is opened
  if (context.action === 'opened') {
    // If the file already exists, suggest another slug
    if (ifFileExists) {
      const message = [
        "Bad luck! Try with a new slug? Here's a suggestion for you:\n\n",
        '```markdown\nslug: ' + `${sluggedSlug}-${generateString(3)}` + '\n```',
        "\n\nI promise I'll handle this better, but you'd have to create a [new issue](https://github.com/rishi-raj-jain/itsmy.fyi/issues/new?assignees=&labels=&template=itsyour.page-profile-data.yml&title=itsmy.fyi+-+%7BINSERT+NAME%7D+%28Optional%29) for now.",
      ]
        .join('')
        .toString()
      await createComment(context, message)
      return json({ message }, 409)
    }
    // If the file doesn't exist, create the new profile succesffully
    else {
      const { code } = await postUserInfo({ ...data, slug: sluggedSlug, issue: context.issue.number, via_github: 1 })
      // If the file is created successfully, comment with the profile link
      if (code === 1) {
        const message = `Thanks for using [itsmy.fyi](https://itsmy.fyi). Visit your [profile here ↗︎](https://itsmy.fyi/me/${sluggedSlug}).\n\nUsage:\nRemaining edits for next 1 minute: ${remaining}`
        await createComment(context, message)
        return json({ message }, 200)
      }
      // If the file is not created successfully, comment with the re-try method
      else {
        const message = `Oops, some error occured while creating your profile. Try again by editing the issue?\n\nUsage:\nRemaining edits for next 1 minute: ${remaining}`
        await createComment(context, message)
        return json({ message }, 500)
      }
    }
  }
  // If an issue is closed
  else if (context.action === 'closed') {
    // If the file exists
    if (ifFileExists) {
      // Only if the issue matches
      if (fileContent.issue === context.issue.number) {
        // Delete the file
        const { code } = await deleteUserInfo(data.slug)
        if (code === 1) {
          const message = `Thanks for using [itsmy.fyi](https://itsmy.fyi). Succesfully deleted your profile.`
          await createComment(context, message)
          return json({ message }, 200)
        } else {
          const message = `Oops! There was an error in deleting your profile. Can you go ahead and just mention that in Discussions?`
          await createComment(context, message)
          return json({ message }, 500)
        }
      }
    }
  }

  // If an issue is edited
  else if (context.action === 'edited') {
    // If the file exists
    if (ifFileExists) {
      // Only if the issue matches
      if (fileContent.issue === context.issue.number) {
        const { code } = await postUserInfo({ ...fileContent, ...data, slug: sluggedSlug })
        if (code === 1) {
          const message = `Thanks for using [itsmy.fyi](https://itsmy.fyi). Visit your [profile here ↗︎](https://itsmy.fyi/me/${sluggedSlug}).\n\nUsage:\nRemaining edits for next 1 minute: ${remaining}`
          await createComment(context, message)
          return json({ message }, 200)
        }
      } else return json(null, 409)
    } else {
      const message = `Thanks for using [itsmy.fyi](https://itsmy.fyi). To claim a new slug, please create another [issue here](https://github.com/rishi-raj-jain/itsmy.fyi/issues/new/choose).\n\nUsage:\nRemaining edits for next 1 minute: ${remaining}`
      await createComment(context, message)
      return json({ message }, 200)
    }
  }
}
