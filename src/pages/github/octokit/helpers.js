import { octokit } from './setup'

export async function getFileContent(owner, repo, path) {
  try {
    const { data: fileData } = await octokit.rest.repos.getContent({
      owner,
      repo,
      path,
      ref: 'main',
    })
    return fileData
  } catch (e) {
    console.error(e.message || e.toString())
  }
}

export async function deleteFile(owner, repo, path, message, sha) {
  try {
    await octokit.rest.repos.deleteFile({
      owner,
      repo,
      path,
      message,
      sha,
      ref: 'main',
    })
    console.log(`File ${path} has been deleted from ${owner}/${repo}`)
  } catch (e) {
    console.error(e.message || e.toString())
  }
}

export async function writeJsonToFile(owner, repo, path, message, jsonData, sha = undefined) {
  try {
    const content = Buffer.from(JSON.stringify(jsonData)).toString('base64')
    await octokit.rest.repos.createOrUpdateFileContents({
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
  } catch (e) {
    console.error(e.message || e.toString())
  }
}
