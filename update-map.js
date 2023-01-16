require("dotenv").config();
const matter = require("gray-matter");

const validateBody = (body) => {
  try {
    const { data } = matter(body);
    if (!(typeof data.name === "string")) {
      return false;
    }
    if (!(typeof data.slug === "string")) {
      return false;
    }
    if (!(typeof data.image === "string")) {
      return false;
    }
    if (!Array.isArray(data.links)) {
      return false;
    }
    if (!Array.isArray(data.socials)) {
      return false;
    }
    const { name, slug, image, links, socials } = data;
    return { name, slug, image, links, socials };
  } catch (e) {
    console.log(e);
    return false;
  }
};

const validateEvent = (context) => {
  try {
    if (!(typeof context.event.issue.number === "number")) {
      return false;
    }
    return {
      ...validateBody(context.event.issue.body),
      issue: context.event.issue.number,
    };
  } catch (e) {
    console.log(e);
    return false;
  }
};

const context = JSON.parse(process.env.GITHUB_CONTEXT);

const data = validateEvent(context);

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
  const { Octokit } = require("@octokit/rest");

  // Initialize octokit
  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
  });

  async function getFileContent(owner, repo, path) {
    try {
      const { fileData } = await octokit.repos.getContents({
        owner,
        repo,
        path,
      });
      return fileData.content;
    } catch (err) {
      console.error(err);
    }
  }

  async function deleteFile(owner, repo, path, message) {
    try {
      const { data } = await octokit.repos.getCommit({
        owner,
        repo,
        ref: "HEAD",
      });

      const { sha } = data.commit.tree;

      await octokit.repos.deleteFile({
        owner,
        repo,
        path,
        message,
        sha,
        branch: "HEAD",
      });
      console.log(`File ${path} has been deleted from ${owner}/${repo}`);
    } catch (err) {
      console.error(err);
    }
  }

  async function writeJsonToFile(owner, repo, path, message, jsonData) {
    try {
      const content = Buffer.from(JSON.stringify(jsonData)).toString("base64");
      const { data } = await octokit.repos.getCommit({
        owner,
        repo,
        ref: "HEAD",
      });
      const { sha } = data.commit.tree;
      await octokit.repos.createOrUpdateFileContents({
        owner,
        repo,
        path,
        message,
        content,
        sha,
        branch: "HEAD",
      });
      console.log(`JSON data written to file ${path} in ${owner}/${repo}`);
    } catch (err) {
      console.error(err);
    }
  }

  // Get file content for the slug from data
  getFileContent(
    context.repository_owner,
    context.event.repository.name,
    `jsons/${data.slug}.json`
  ).then(async (fileContent) => {
    console.log(fileContent);
    console.log(typeof fileContent);
    // In case the file already exists
    if (fileContent) {
      console.log("File does exist.");
      // Parse the base64 content to JSON
      const fileContentJSON = JSON.parse(
        Buffer.from(fileContent, "base64").toString()
      );
      // evaulate if the issue number matches
      if (fileContentJSON.issue === data.issue) {
        // If the event was closed
        // Remove the file
        if (context.event.action === "closed") {
          // Delete the file
          await deleteFile(
            context.repository_owner,
            context.event.repository.name,
            `jsons/${data.slug}.json`,
            `Issue ${data.issue} was closed.`
          );
        } else {
          // If the event was edited
          // Update the file
          await writeJsonToFile(
            context.repository_owner,
            context.event.repository.name,
            `jsons/${data.slug}.json`,
            `Issue ${data.issue} was edited.`,
            data
          );
        }
      } else {
        // If the event number doesn't match
        // Do nothing
      }
    } else {
      // If there is no file
      // and the issue was not closed
      if (context.event.action !== "closed") {
        console.log("File does not exist.");
        // Write a file
        // Update the file
        await writeJsonToFile(
          context.repository_owner,
          context.event.repository.name,
          `jsons/${data.slug}.json`,
          `Issue ${data.issue} was created.`,
          data
        );
      }
    }
  });
}
