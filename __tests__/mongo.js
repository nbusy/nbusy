const mongocols = require('../config/mongo-cols')

describe('mongo', () => {
  beforeEach(async () => {
    // todo: seed database
  })

  describe('connect()', () => {
    it('should connect', async () => {
      await mongocols.connect('mongodb://localhost:27017/nbusy-test')
      await mongocols.db.close()
    })

    it('should disconnect existing connection', async () => {

    })
  })

  describe('CRUD', () => {
    // todo: http://mongodb.github.io/node-mongodb-native/2.2/reference/ecmascript6/crud/
  })

  describe('getNextSequence()', () => {
    it('should increment and get counter', async () => {

    })
  })
})
