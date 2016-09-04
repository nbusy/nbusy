const config = require('../config/config')
const mongocols = require('../config/mongo-cols')

describe('mongo', () => {
  describe('connect()', () => {
    it('should connect', async () => {
      await mongocols.connect(config.mongo.url)
      await mongocols.db.close()
    })

    it('should disconnect existing connection', async () => {
      await mongocols.connect(config.mongo.url)
      await mongocols.connect(config.mongo.url)
      await mongocols.connect(config.mongo.url)
      await mongocols.db.close()
    })
  })

  describe('getNextSequence()', () => {
    it('should increment and get counter', async () => {

    })
  })

  describe('seed()', () => {
    // todo: http://mongodb.github.io/node-mongodb-native/2.2/reference/ecmascript6/crud/
  })
})
