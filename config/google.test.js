const google = require('./google')

describe('google', () => {
  it('tokeninfo', async () => {
    // todo: https://github.com/facebook/jest/issues/1377
    let gotErr = false
    try {
      await google.tokeninfo('falsetoken')
    } catch (err) {
      expect(err).toEqual(new Error('authentication failed'))
      gotErr = true
    }
    expect(gotErr).toBe(true)
  })
})
