/**
 * Seed data for mongo database.
 */

const mongo = require('./mongo-cols')
const config = require('./config')

const ObjectID = mongo.ObjectID
const now = new Date()

function getTime (h) {
  return new Date(new Date(now).setHours(now.getHours() + h))
}

// declare the seed data
const users = [
  {
    _id: 1,
    email: 'morgan@nbusy.herokuapp.com',
    password: config.app.pass,
    name: 'Morgan the Almighty',
    chats: [
      {
        _id: new ObjectID(),
        peers: [{_id: 2, name: 'Chuck Norris', picture: '/api/users/2/picture'}],
        sent: getTime(-26)
      }
    ]
  },
  {
    _id: 2,
    email: 'chuck@nbusy.herokuapp.com',
    password: config.app.pass,
    name: 'Chuck Norris'
  }
]

/**
 * Populates the database with seed data.
 * @param overwrite Overwrite existing database even if it is not empty.
 */
function * seed (overwrite) {
  var count = yield mongo.users.count({}, {limit: 1})
  if (overwrite || count === 0) {
    // first remove any leftover data in collections
    var collerrmsg = 'ns not found' /* indicates 'collection not found' error in mongo which is ok */
    for (var collection in mongo) {
      if (mongo[collection].drop) {
        try {
          yield mongo[collection].drop()
        } catch (err) {
          if (err.message !== collerrmsg) {
            throw err
          }
        }
      }
    }

    // now populate collections with fresh data
    yield mongo.counters.insert({_id: 'userId', seq: users.length})
    yield mongo.users.insert(users)
  }
}

// export seed data and seed function
seed.users = users
module.exports = seed
