const fetch = require('node-fetch')
const httpServer = require('./http-server')

describe('httpServer', () => {
  beforeEach(async () => {
    await httpServer.listen()
  })

  afterEach(async () => {
    await httpServer.close()
  })

  it('opens/closes synchronously', async () => {
    expect(httpServer.server.listening).toBe(true)
    await httpServer.close()
    expect(httpServer.server.listening).toBe(false)
    await httpServer.listen()
    expect(httpServer.server.listening).toBe(true)
  })

  it('replies all requests with 426', async () => {
    const res = await fetch('http://127.0.0.1:3001')
    expect(res.status).toBe(426)
  })
})
