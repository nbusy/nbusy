/**
 * MongoDB module with named collections.
 */

const mongodb = require('mongodb'),
  MongoClient = mongodb.MongoClient,
  config = require('./config');

// extending and exposing top mongodb namespace like this is not optimal but it saves the user from one extra require();
module.exports = mongodb;

/**
 * Opens a new connection to the mongo database, closing the existing one if exists.
 */
mongodb.connect = async function () {
  if (mongodb.db) {
    console.log(await mongodb.db.close());
  }

  // export mongo db instance
  const db = mongodb.db = await MongoClient.connect(config.mongo.url);

  // export default collections
  mongodb.counters = db.collection('counters');
  mongodb.users = db.collection('users');
  mongodb.posts = db.collection('messages');
};

/**
 * Retrieves the next sequence number for the given counter (indicated by @counterName).
 * Useful for generating sequential integer IDs for certain collections (i.e. user collection).
 */
mongodb.getNextSequence = async function (counterName) {
  const results = await mongodb.counters.findAndModify(
    {_id: counterName},
    [],
    {$inc: {seq: 1}},
    {new: true}
  );
  return results.value.seq;
};
