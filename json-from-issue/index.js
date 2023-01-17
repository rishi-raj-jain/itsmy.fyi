require('dotenv').config()
const matter = require('gray-matter')

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
    if (!(typeof context.event.issue.number === 'number')) {
      return false
    }
    const body = context.event.issue.body
    const start = body.indexOf('---\r\n')
    const end = body.lastIndexOf('\r\n---')
    return {
      ...validateBody(body.substring(start, end + 5)),
      issue: context.event.issue.number,
    }
  } catch (e) {
    console.log(e)
    return false
  }
}

const context = JSON.parse(process.env.GITHUB_CONTEXT)

const data = validateEvent(context)

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
  // Import octokit
  const { Octokit } = require('@octokit/rest')

  // Initialize octokit
  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
  })

  async function getFileContent(owner, repo, path) {
    try {
      const { data: fileData } = await octokit.repos.getContent({
        owner,
        repo,
        path,
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
      })
      console.log(`JSON data written to file ${path} in ${owner}/${repo}`)
      return true
    } catch (err) {
      console.error(err)
    }
  }

  const jsonPath = `jsons/${data.slug}.json`

  // Get file content for the slug from data
  getFileContent(context.repository_owner, context.event.repository.name, jsonPath).then(async (fileContent) => {
    // In case the file already exists
    if (fileContent && fileContent.content) {
      // Parse the base64 content to JSON
      const fileContentJSON = JSON.parse(Buffer.from(fileContent.content, 'base64').toString())
      // evaulate if the issue number matches
      if (fileContentJSON.issue === data.issue) {
        // If the event was closed
        // Remove the file
        if (context.event.action === 'closed') {
          // Delete the file
          await deleteFile(context.repository_owner, context.event.repository.name, jsonPath, `Issue ${data.issue} was closed.`, fileContent.sha)
        } else {
          // If the event was edited
          // Update the file
          await writeJsonToFile(
            context.repository_owner,
            context.event.repository.name,
            jsonPath,
            `Issue ${data.issue} was edited.`,
            data,
            fileContent.sha
          )
        }
      } else {
        // If the event number doesn't match
        // Do nothing
      }
    } else {
      // If there is no file
      // and the issue was not closed
      if (context.event.action !== 'closed') {
        // Write a file
        // Update the file
        const { data: commitData } = await octokit.repos.getCommit({
          owner: context.repository_owner,
          repo: context.event.repository.name,
        })
        const { sha } = commitData.commit.tree
        const success = await writeJsonToFile(
          context.repository_owner,
          context.event.repository.name,
          jsonPath,
          `Issue ${data.issue} was created.`,
          data,
          sha
        )
        if (success) {
          await octokit.issues.createComment({
            owner: context.repository_owner,
            repo: context.event.repository.name,
            issue_number: data.issue,
            body: `Thanks for using [itsyour.page](https://itsyour.page). Visit your [profile here ↗︎](https://itsyour.page/u/${data.slug})`,
          })
          await fetch(`https://itsyour.page/u/${data.slug}`)
        }
      }
    }
  })
}
