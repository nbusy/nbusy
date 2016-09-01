const mongo = require('../config/mongo-cols')

describe('mongo', () => {
  beforeEach(async () => {
    // todo: seed database
  })

  describe('connect()', () => {
    it('should connect', async () => {
      await mongo.connect('mongodb://localhost:27017/koan-test')
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
