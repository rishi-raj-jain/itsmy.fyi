import fetch from 'node-fetch'

let auth

if (import.meta && import.meta.env) {
  auth = import.meta.env.TWITTER_AUTH_TOKEN
} else if (process.env) {
  auth = process.env.TWITTER_AUTH_TOKEN
}

export const getAuthorInfo = (tweets, author_id) => {
  return tweets.includes.users.find((user) => user.id === author_id)
}

export const getMedia = (tweets, media_id) => {
  return tweets.includes.media.find((media) => media.media_key === media_id)
}

export const getTweet = async (id) => {
  if (!auth) {
    console.log(`TWITTER_AUTH_TOKEN not found.`)
    return { data: [] }
  }
  const queryParams = new URLSearchParams({
    ids: (typeof id === 'string' ? [id] : id).join(','),
    'tweet.fields': 'attachments,author_id,created_at',
    'media.fields': 'preview_image_url,url',
    expansions: 'attachments.media_keys,author_id',
    'user.fields': 'profile_image_url,username,verified_type',
  })
  const response = await fetch(`https://api.twitter.com/2/tweets?${queryParams}`, {
    headers: {
      Authorization: `Bearer ${auth}`,
    },
  })
  if (response.ok) {
    return await response.json()
  }
  console.log(await response.statusText)
  return { data: [] }
}
