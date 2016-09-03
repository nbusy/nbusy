/**
 * Tests for environment configurations.
 */

const config = require('../config/config')
const env = process.env.NODE_ENV

describe('config', () => {
  afterEach(() => {
    process.env.NODE_ENV = env
  })

  it('env=test', () => {
    expect(config.app.env).toBe('test')
    expect(config.app.port).toBe(3001)
  })

  it('env=dev', () => {
    process.env.NODE_ENV = 'dev'
    const conf = config.init()
    expect(conf.app.env).toBe('dev')
    expect(conf.app.port).toBe(3000)
  })

  it('env=prod', () => {
    process.env.NODE_ENV = 'prod'
    process.env.MONGODB_URI = 'somemongo'
    process.env.PORT = 9000
    const conf = config.init()
    expect(conf.app.env).toBe('prod')
    expect(conf.app.port).toBe('9000')
    expect(conf.mongo.url).toBe('somemongo')
  })
})
