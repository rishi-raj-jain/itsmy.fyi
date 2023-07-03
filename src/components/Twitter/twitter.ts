export const getAuthorInfo = (tweets, author_id) => {
  return tweets.includes.users.find((user) => user.id === author_id)
}

export const getMedia = (tweets, media_id) => {
  return tweets.includes.media.find((media) => media.media_key === media_id)
}
