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
    process.env.NODE_ENV = 'development'
    config.init()
    expect(config.app.env).toBe('development')
    expect(config.app.port).toBe(3000)
  })
})
