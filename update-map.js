require("dotenv").config();
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const matter = require("gray-matter");

const validateBody = (body) => {
  try {
    console.log(matter(body))
    const { data } = matter(body);
    console.log(data)
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
    return data;
  } catch (e) {
    console.log(e);
    return false;
  }
};

const validateEvent = (context) => {
  try {
    if (!(typeof context.event.issue.number === "string")) {
      return false;
    }
    if (!(typeof context.event.issue.body === "string")) {
      return false;
    }
    return validateBody(context.event.issue.body);
  } catch (e) {
    console.log(e);
    return false;
  }
};

const context = JSON.parse(process.env.GITHUB_CONTEXT);

const data = validateEvent(context);

console.log(JSON.stringify(data));
