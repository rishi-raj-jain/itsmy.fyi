import { slug } from 'github-slugger'
import { json } from '~/GitHub/json'
import { ratelimit } from '~/Upstash/ratelimit'
import { validateBody } from '~/GitHub/validate'
import { generateString } from '~/GitHub/generateString'
import { getUserInfo, postUserInfo } from '~/Upstash/users'

// Rate limit 3 profiles in a week via the web for a user
const ratelimitUser = ratelimit(3, 7 * 24 * 60 * 60 + ' s')

const totalLimitRemains = true

const returnResponse = (statusCode, body, noJS = false) => {
  if (noJS) {
    return new Response(`<html><head></head><body>${body.message}</body></html>`, {
      status: statusCode,
      headers: {
        'content-type': 'text/html',
      },
    })
  }
  return json(body, statusCode)
}

export async function POST({ request }) {
  // Evaluate if no JS is there
  const requestURL = new URL(request.url)
  const noJS = Boolean(requestURL.searchParams.has('nojs') && requestURL.searchParams.get('nojs') === 'yes')
  // Get client ip address
  const ipAddress = request.headers.get('x-0-client-ip')
  // If the IP Address is not recevied, return with a 500
  if (!ipAddress) return returnResponse(500, { code: 0, message: 'Your IP Address is non-identifiable.' }, noJS)
  try {
    // Check if the form is submitted from the HTML directly (probably in the case of no JS environment)
    const ifPostForm = request.headers.get('content-type').includes('x-www-form-urlencoded')
    // Parse the data as json
    let context = ifPostForm ? await request.formData() : await request.json()
    // Parse the body in case of a form submitted through HTML directly
    if (ifPostForm) {
      const formObject = {}
      context.forEach((value, key) => {
        key = key.trim()
        value = value.trim()
        if (key === 'links' || key === 'socials') {
          if (value.length) {
            if (key in formObject) formObject[key][0].push(value)
            else formObject[key] = [[value]]
          }
        } else formObject[key] = value
      })
      if (!formObject['links']) formObject['links'] = []
      if (!formObject['socials']) formObject['socials'] = []
      context = formObject
    }
    if (!context.slug) return returnResponse(500, { code: 0, message: 'Invalid slug received.' }, noJS)
    // Slugify the slug received
    const sluggedSlug = slug(context.slug)
    // Parse the body and check if it is valid
    const parsedBody = validateBody({ ...context, slug: sluggedSlug })
    // If there's error to body parsing, return with a message
    if (parsedBody.error) return returnResponse(500, { code: 0, message: parsedBody.error }, noJS)
    // No error in parsing the data
    // Get file content for the slug from data
    const fileContent = await getUserInfo(sluggedSlug)
    const ifFileExists = fileContent.code === 1
    // If the file already exists, suggest another slug
    if (ifFileExists) {
      const errorMessage = [`Bad luck! Try with a new slug? Here's a suggestion for you: ${sluggedSlug}-${generateString(3)}`]
      return returnResponse(200, { code: 0, message: errorMessage.join('').toString() }, noJS)
    }
    // If the file doesn't exist, create the new profile succesffully
    else {
      // Apply user rate limiting first
      const { success: userLimitRemains } = await ratelimitUser.limit(ipAddress)
      // If user rate limiting allows it
      if (userLimitRemains) {
        // Apply total rate limiting next
        // const { success: totalLimitRemains } = await ratelimitTotal.limit('trial-homepage')
        if (totalLimitRemains) {
          // If total rate limiting allows it
          const { code, error: errorWithPostingUserInfo } = await postUserInfo({ ...parsedBody, slug: sluggedSlug, web: 1 })
          // If the file is created successfully, return with the profile link
          if (code === 1) {
            return returnResponse(
              200,
              {
                code: 1,
                message: `<span>Visit your <a class="text-blue-600 underline" href="https://itsmy.fyi/me/${sluggedSlug}" target="_blank">profile here ↗︎</a></span>`,
              },
              noJS,
            )
          }
          // If the file is not created successfully, comment with the re-try method
          else {
            return returnResponse(500, { code: 0, message: errorWithPostingUserInfo }, noJS)
          }
        }
        // If total rate limit doesn't allow it
        else {
          return returnResponse(
            403,
            {
              code: 0,
              message: `<span>Hourly limit for all users exceeded. Please try again later.<br />To claim more profiles, please <a class="underline text-gray-400" href="https://github.com/rishi-raj-jain/itsmy.fyi/issues/new?assignees=&labels=&template=itsyour.page-profile-data.yml&title=itsmy.fyi+-+%7BINSERT+NAME%7D+%28Optional%29">click here.</a></span>`,
            },
            noJS,
          )
        }
      }
      // If user rate limit doesn't allow it
      else {
        return returnResponse(
          403,
          {
            code: 0,
            message: `<span>You can't create more than one profile from the web in a month.<br />To claim more profiles, please <a class="underline text-gray-400" href="https://github.com/rishi-raj-jain/itsmy.fyi/issues/new?assignees=&labels=&template=itsyour.page-profile-data.yml&title=itsmy.fyi+-+%7BINSERT+NAME%7D+%28Optional%29">click here.</a></span>`,
          },
          noJS,
        )
      }
    }
  } catch (e) {
    // In case of any error, display the error occured on the server side
    const errorMessage = e.message || e.toString()
    console.log(errorMessage)
    return returnResponse(500, { code: 0, message: errorMessage }, noJS)
  }
}
