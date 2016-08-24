/**
 * MongoDB module with named collections.
 */

const mongodb = require('mongodb')

const MongoClient = mongodb.MongoClient

// extending and exposing top mongodb namespace like this is not optimal but it saves the user from one extra require();
module.exports = mongodb

/**
 * Opens a new connection to the mongo database, closing the existing one if exists.
 */
mongodb.connect = async function (url) {
  if (mongodb.db) {
    console.log('closing existing mongodb connection:', await mongodb.db.close())
  }

  // export mongo db instance
  const db = mongodb.db = await MongoClient.connect(url)

  // export default collections
  mongodb.counters = db.collection('counters')
  mongodb.users = db.collection('users')
}

/**
 * Retrieves the next sequence number for the given counter (indicated by @counterName).
 * Useful for generating sequential integer IDs for certain collections (i.e. user collection).
 */
mongodb.getNextSequence = async function (counterName) {
  const results = await mongodb.counters.findAndModify( // todo: rewrite using async: http://mongodb.github.io/node-mongodb-native/2.2/reference/ecmascript6/crud/
    {_id: counterName},
    [],
    {$inc: {seq: 1}},
    {new: true}
  )
  return results.value.seq
}
