/**
 * MongoDB module with named collections.
 */

const mongodb = module.exports = require('mongodb')
const seed = require('./seed')

/**
 * Opens a new connection to the mongo database, closing the existing one if exists.
 */
mongodb.connect = async function (url) {
  if (mongodb.db) {
    await mongodb.db.close()
  }

  // export mongo db instance
  const db = mongodb.db = await mongodb.MongoClient.connect(url)

  // export default collections
  mongodb.counters = await db.collection('counters')
  mongodb.users = await db.collection('users')
}

/**
 * Populates the database with seed data.
 * @param overwrite - Overwrite existing database even if it is not empty.
 */
mongodb.seed = async function (overwrite) {
  var count = await mongodb.users.count({}, {limit: 1})
  if (overwrite || count === 0) {
    // first remove any leftover data in collections
    var collerrmsg = 'ns not found' /* indicates 'collection not found' error in mongo which is ok */
    for (var collection in mongodb) {
      if (mongodb[collection].drop) {
        try {
          await mongodb[collection].drop()
        } catch (err) {
          if (err.message !== collerrmsg) {
            throw err
          }
        }
      }
    }

    // now populate collections with fresh data
    await mongodb.counters.insertMany(seed.counters)
    await mongodb.users.insertMany(seed.users)
  }
}

/**
 * Generates sequential integer IDs for collection auto increment fields.
 */
mongodb.incrementAndGetCounter = async function (counterName) {
  const results = await mongodb.counters.findOneAndUpdate(
    {_id: counterName},
    {$inc: {seq: 1}},
    {returnOriginal: false}
  )

  return results.value.seq
}
