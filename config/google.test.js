const google = require('./google')

describe('google', () => {
  it('tokeninfo', async () => {
    const res = await google.tokeninfo('falsetoken')
    expect(res).toBe(false)
  })
})
