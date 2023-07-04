export const json = (body, status) => {
  return new Response(body ? JSON.stringify(body) : body, {
    headers: {
      status,
      'content-type': 'application/json',
    },
  })
}
