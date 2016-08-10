// todo: add test for getNextSequence()

// todo: http://mongodb.github.io/node-mongodb-native/2.2/reference/ecmascript6/crud/

// jest.enableAutomock();

const mongo = require('../config/mongo');
const mongoSeed = require('../config/mongo-seed');

describe('mongo', () => {
  beforeEach(() => {
    mongoSeed.seed(true);
  });

  describe('connect()', () => {
    it('should connect', async () => {
      await mongo.connect('mongodb://localhost:27017/koan-test');
    });

    it('should disconnect existing connection', async () => {

    });
  });

  describe('getNextSequence()', () => {
    it('should increment and get counter', async () => {

    });
  });
});
