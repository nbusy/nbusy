/**
 * Tests for environment configurations.
 */

const confPath = '../config/config'

describe('config', () => {
  beforeEach(() => {
    delete require.cache[require.resolve(confPath)]
  })

  it('env=test', () => {
    const config = require(confPath)
    expect(config.app.port).toBe(3001)
  })
})
