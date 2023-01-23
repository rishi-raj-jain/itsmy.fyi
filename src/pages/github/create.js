import { slug } from 'github-slugger'
import { ratelimit } from '@/lib/Upstash/ratelimit'
import { validateBody } from '@/lib/GitHub/validate'
import { generateString } from '@/lib/GitHub/generateString'
import { getUserInfo, postUserInfo } from '@/lib/Upstash/users'

// Rate limit 1 profile in a month via the web for a user
const ratelimitUser = ratelimit(1, '2592000 s')

// Rate limit total valid requests to be not more 1000 per hour
const ratelimitTotal = ratelimit(1000, '3600 s')

export async function post({ request }) {
  // Get client ip address
  const ipAddress = request.headers.get('x-0-client-ip')
  if (ipAddress) {
    try {
      // Parse the data as json
      const context = await request.json()
      if (!context.slug) {
        return new Response(JSON.stringify({ code: 0, message: `Invalid slug received.` }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        })
      }
      // Slugify the slug received
      const sluggedSlug = slug(context.slug)
      // Parse the body and check if it is valid
      const parsedBody = validateBody({ ...context, slug: sluggedSlug })
      // If there's error to body parsing, return with a message
      if (parsedBody.error) {
        return new Response(JSON.stringify({ code: 0, message: parsedBody.error }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        })
      } else {
        // No error in parsing the data
        // Get file content for the slug from data
        const fileContent = await getUserInfo(sluggedSlug)
        const ifFileExists = fileContent.code === 1
        // If the file already exists, suggest another slug
        if (ifFileExists) {
          const errorMessage = [`Bad luck! Try with a new slug? Here's a suggestion for you: ${sluggedSlug}-${generateString(3)}`]
          return new Response(JSON.stringify({ code: 0, message: errorMessage.join('').toString() }), {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
            },
          })
        }
        // If the file doesn't exist, create the new profile succesffully
        else {
          // Apply user rate limiting first
          const { success: userLimitRemains } = await ratelimitUser.limit(ipAddress)
          // If user rate limiting allows it
          if (userLimitRemains) {
            // Apply total rate limiting next
            const { success: totalLimitRemains } = await ratelimitTotal.limit('trial-homepage')
            if (totalLimitRemains) {
              // If total rate limiting allows it
              console.log('Creating the user', sluggedSlug)
              const { code, error: errorWithPostingUserInfo } = await postUserInfo({ ...parsedBody, slug: sluggedSlug, web: 1 })
              // If the file is created successfully, return with the profile link
              if (code === 1) {
                return new Response(
                  JSON.stringify({
                    code: 1,
                    message: `<span>Visit your <a href="https://itsmy.fyi/me/${sluggedSlug}" target="_blank">profile here ↗︎</a></span>`,
                  }),
                  {
                    status: 200,
                    headers: {
                      'Content-Type': 'application/json',
                    },
                  }
                )
              }
              // If the file is not created successfully, comment with the re-try method
              else {
                return new Response(JSON.stringify({ code: 0, message: errorWithPostingUserInfo }), {
                  status: 500,
                  headers: {
                    'Content-Type': 'application/json',
                  },
                })
              }
            }
            // If total rate limit doesn't allow it
            else {
              return new Response(
                JSON.stringify({
                  code: 0,
                  message: `<span>Hourly limit for all users exceeded. Please try again later.<br />To claim more profiles, please <a class="underline text-gray-400" href="https://github.com/rishi-raj-jain/itsmy.fyi/issues/new?assignees=&labels=&template=itsyour.page-profile-data.yml&title=itsmy.fyi+-+%7BINSERT+NAME%7D+%28Optional%29">click here.</a></span>`,
                }),
                {
                  status: 403,
                  headers: {
                    'Content-Type': 'application/json',
                  },
                }
              )
            }
          }
          // If user rate limit doesn't allow it
          else {
            return new Response(
              JSON.stringify({
                code: 0,
                message: `<span>You can't create more than one profile from the web in a month.<br />To claim more profiles, please <a class="underline text-gray-400" href="https://github.com/rishi-raj-jain/itsmy.fyi/issues/new?assignees=&labels=&template=itsyour.page-profile-data.yml&title=itsmy.fyi+-+%7BINSERT+NAME%7D+%28Optional%29">click here.</a></span>`,
              }),
              {
                status: 403,
                headers: {
                  'Content-Type': 'application/json',
                },
              }
            )
          }
        }
      }
    } catch (e) {
      // In case of any error, display the error occured on the server side
      const errorMessage = e.message || e.toString()
      console.log(errorMessage)
      return new Response(JSON.stringify({ code: 0, message: errorMessage }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      })
    }
  }
  // If the IP Address is not recevied, return with a 500
  else {
    return new Response(JSON.stringify({ code: 0, message: 'Your IP Address is non-identifiable.' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
}
