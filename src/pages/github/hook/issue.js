import fetch from 'node-fetch'
import matter from 'gray-matter'
import { Redis } from '@upstash/redis'
import { Octokit } from '@octokit/rest'
import { Ratelimit } from '@upstash/ratelimit'

const octokit = new Octokit({
  auth: import.meta.env.GITHUB_API_TOKEN,
})

const validateBody = (body) => {
  try {
    const { data } = matter(body)
    if (data.hasOwnProperty('disabled') && data.disabled === 'yes') {
      process.exit(1)
    }
    if (!(typeof data.name === 'string')) {
      return false
    }
    if (!(typeof data.slug === 'string')) {
      return false
    }
    if (!(typeof data.image === 'string')) {
      return false
    }
    if (!Array.isArray(data.links)) {
      return false
    }
    if (!Array.isArray(data.socials)) {
      return false
    }
    const { name, slug, image, links, socials, og = {}, about = '' } = data
    return { name, slug, image, links, socials, og, about }
  } catch (e) {
    console.log(e)
    return false
  }
}

const validateEvent = (context) => {
  try {
    if (!(typeof context.issue.number === 'number')) {
      return false
    }
    const body = context.issue.body
    const start = body.indexOf('---\r\n')
    const end = body.lastIndexOf('\r\n---')
    return {
      ...validateBody(body.substring(start, end + 5)),
      issue: context.issue.number,
    }
  } catch (e) {
    console.log(e)
    return false
  }
}

// Create a new ratelimiter, that allows 3 requests per 60 seconds
const ratelimit = import.meta.env.UPSTASH_REDIS_REST_URL
  ? new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.fixedWindow(3, '60 s'),
    })
  : undefined

export async function post({ request }) {
  // Rate Limiter Code
  let limit = 9999,
    remaining = 9999
  if (ratelimit) {
    const identifier = request.headers.get('x-0-client-ip')
    const result = await ratelimit.limit(identifier)
    limit = result.limit
    remaining = result.remaining
    if (!result.success) {
      return {
        headers: {
          'X-RateLimit-Limit': result.limit,
          'X-RateLimit-Remaining': result.remaining,
        },
        body: JSON.stringify({
          message: 'Too many updates in 1 minute. Please try again in a few minutes.',
        }),
      }
    }
  }
  const context = await request.json()
  const map = { closed: 1, edited: 1, opened: 1 }
  if (!map.hasOwnProperty(context.action.toLowerCase())) {
    return {
      headers: {
        'X-RateLimit-Limit': limit,
        'X-RateLimit-Remaining': remaining,
      },
      body: JSON.stringify({
        message: 'Event not supported.',
      }),
    }
  }
  const data = validateEvent(context)
  console.log(JSON.stringify(data))

  // Issue: Edited/Created
  // Check if the slug already exists
  // and then match the issue number
  // If issue_number doesn't match
  // Discard the issue change
  // Else push the change
  // in case slug doesn't exist
  // Create file with the name github-slugger(slug).json
  // Write data as the data there

  // Issue: Deleted
  // Check if the slug already exists
  // Look if the issue number
  // matches and then delete the json

  if (data.issue) {
    async function getFileContent(owner, repo, path) {
      try {
        const { data: fileData } = await octokit.repos.getContent({
          owner,
          repo,
          path,
          ref: 'main',
        })
        return fileData
      } catch (err) {
        console.error(err)
      }
    }

    async function deleteFile(owner, repo, path, message, sha) {
      try {
        await octokit.repos.deleteFile({
          owner,
          repo,
          path,
          message,
          sha,
          ref: 'main',
        })
        console.log(`File ${path} has been deleted from ${owner}/${repo}`)
      } catch (err) {
        console.error(err)
      }
    }

    async function writeJsonToFile(owner, repo, path, message, jsonData, sha) {
      try {
        const content = Buffer.from(JSON.stringify(jsonData)).toString('base64')
        await octokit.repos.createOrUpdateFileContents({
          owner,
          repo,
          path,
          message,
          content,
          sha,
          ref: 'main',
        })
        console.log(`JSON data written to file ${path} in ${owner}/${repo}`)
        return true
      } catch (err) {
        console.error(err)
      }
    }

    const jsonPath = `jsons/${data.slug}.json`

    // Get file content for the slug from data
    const fileContent = await getFileContent(context.sender.login, context.repository.name, jsonPath)
    // In case the file already exists
    if (fileContent && fileContent.content) {
      // Parse the base64 content to JSON
      const fileContentJSON = JSON.parse(Buffer.from(fileContent.content, 'base64').toString())
      // evaulate if the issue number matches
      if (fileContentJSON.issue === data.issue) {
        // If the event was closed
        // Remove the file
        if (context.action === 'closed') {
          // Delete the file
          await deleteFile(context.sender.login, context.repository.name, jsonPath, `Issue ${data.issue} was closed.`, fileContent.sha)
          return {
            headers: {
              'X-RateLimit-Limit': limit,
              'X-RateLimit-Remaining': remaining,
            },
          }
        } else {
          // If the event was edited
          // Update the file
          await writeJsonToFile(context.sender.login, context.repository.name, jsonPath, `Issue ${data.issue} was edited.`, data, fileContent.sha)
          return {
            headers: {
              'X-RateLimit-Limit': limit,
              'X-RateLimit-Remaining': remaining,
            },
          }
        }
      } else {
        // If the event number doesn't match
        // Do nothing
      }
    } else {
      // If there is no file
      // and the issue was not closed
      if (context.action !== 'closed') {
        // Write a file
        // Update the file
        const { data: commitData } = await octokit.repos.getCommit({
          owner: context.sender.login,
          repo: context.repository.name,
          ref: 'main',
        })
        const { sha } = commitData.commit.tree
        const success = await writeJsonToFile(context.sender.login, context.repository.name, jsonPath, `Issue ${data.issue} was created.`, data, sha)
        if (success) {
          await octokit.issues.createComment({
            owner: context.sender.login,
            repo: context.repository.name,
            issue_number: data.issue,
            body: `Thanks for using [itsmy.fyi](https://itsmy.fyi). Visit your [profile here ↗︎](https://itsmy.fyi/u/${data.slug})`,
          })
          await fetch(`https://itsmy.fyi/u/${data.slug}`)
        }
        return {
          headers: {
            'X-RateLimit-Limit': limit,
            'X-RateLimit-Remaining': remaining,
          },
        }
      }
    }
  }
}
