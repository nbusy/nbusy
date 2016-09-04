const config = require('../config/config')
const mongocols = require('../config/mongo-cols')
const mongoseed = require('../config/mongo-seed')

describe('mongo', () => {
  it('connect()', async () => {
    await mongocols.connect(config.mongo.url)
    await mongocols.connect(config.mongo.url)
    await mongocols.connect(config.mongo.url)
    await mongocols.db.close()
  })

  it('seed()', async () => {
    await mongocols.connect(config.mongo.url)
    await mongoseed(true)
    await mongocols.db.close()
  })

  it('getNextSequence()', async () => {
    await mongocols.connect(config.mongo.url)
    await mongoseed(true)
    const c = await mongocols.incrementAndGetCounter('userId')
    expect(c).toBe(mongoseed.users.length)
    await mongocols.db.close()
  })
})
