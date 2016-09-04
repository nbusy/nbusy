/**
 * MongoDB module with named collections.
 */

const mongodb = require('mongodb')

/**
 * Opens a new connection to the mongo database, closing the existing one if exists.
 */
exports.connect = async function (url) {
  if (exports.db) {
    await exports.db.close()
  }

  // export mongo db instance
  exports.db = await mongodb.MongoClient.connect(url)

  // export default collections
  exports.counters = await exports.db.collection('counters')
  exports.users = await exports.db.collection('users')
}

/**
 * Generates sequential integer IDs for collection auto increment fields.
 */
exports.incrementAndGetCounter = async function (counterName) {
  const results = await mongodb.counters.findOneAndUpdate(
    {_id: counterName},
    {$inc: {seq: 1}},
    {returnNewDocument: true}
  )
  return results.value.seq
}
