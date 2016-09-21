const fetch = require('node-fetch')

exports.tokeninfo = async (token) => {
  const res = await fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${token}`)
  return res.status < 400
}
