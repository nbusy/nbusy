const fetch = require('node-fetch')

exports.tokeninfo = async (token, db) => {
  const res = await fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${token}`)
  if (res.status >= 300) {
    throw new Error('authentication failed')
  }

  const body = await res.json()

  if (db) {
    // persist user details
    return body
  }

  return body
}
