/**
 * MongoDB module with named collections.
 */

const mongodb = require('mongodb')

/**
 * Opens a new connection to the mongo database, closing the existing one if exists.
 */
exports.connect = async function (url) {
  if (exports.db) {
    console.log('closing existing mongodb connection:', await exports.db.close())
  }

  // export mongo db instance
  const db = exports.db = await mongodb.MongoClient.connect(url)

  // export default collections
  exports.counters = await db.collection('counters')
  exports.users = await db.collection('users')
}

/**
 * Generates sequential integer IDs for collection auto increment fields.
 */
exports.incrementAndGetCounter = async function (counterName) {
  const results = await mongodb.counters.findAndModify(
    {_id: counterName},
    [],
    {$inc: {seq: 1}},
    {new: true}
  )
  return results.value.seq
}
