const fetch = require('node-fetch')

exports.tokeninfo = async (token) => {
  const res = await fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${token}`)
  if (res.status >= 300) {
    throw 'authentication failed'
  }

  return await res.json()
}
