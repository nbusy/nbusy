const config = require('config')
const mongo = require('mongo')
const seed = require('seed')

describe('mongo', () => {
  it('connect()', async () => {
    await mongo.connect(config.mongo.url)
    await mongo.connect(config.mongo.url)
    await mongo.connect(config.mongo.url)
    await mongo.db.close()
  })

  it('seed()', async () => {
    await mongo.connect(config.mongo.url)
    await mongo.seed(true)
    const c = await mongo.users.count()
    expect(c).toBe(seed.users.length)
    await mongo.db.close()
  })

  it('getNextSequence()', async () => {
    await mongo.connect(config.mongo.url)
    await mongo.seed(true)
    const c = await mongo.incrementAndGetCounter('userId')
    expect(c).toBe(seed.users.length + 1)
    await mongo.db.close()
  })
})
