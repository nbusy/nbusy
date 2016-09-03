/**
 * Tests for environment configurations.
 */

const env = process.env.NODE_ENV
const confPath = '../config/config'

function getConf () {
  delete require.cache[require.resolve(confPath)]
  return require(confPath)
}

describe('config', () => {
  afterEach(() => {
    process.env.NODE_ENV = env
  })

  it('env=test', () => {
    var config = getConf()
    expect(config.app.port).toBe(3001)
  })

  it('env=dev', () => {
    process.env.NODE_ENV = 'development'
    var config = getConf()
    expect(config.app.port).toBe(3000)
  })
})
