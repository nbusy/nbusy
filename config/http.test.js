const fetch = require('node-fetch')
const http = require('./http')

describe('http', () => {
  beforeEach(async () => {
    await http.listen()
  })

  afterEach(async () => {
    await http.close()
  })

  it('opens/closes synchronously', async () => {
    expect(http.server.listening).toBe(true)
    await http.close()
    expect(http.server.listening).toBe(false)
    await http.listen()
    expect(http.server.listening).toBe(true)
  })

  it('replies all requests with 426', async () => {
    const res = await fetch('http://localhost:3001')
    expect(res.status).toBe(426)
  })
})
