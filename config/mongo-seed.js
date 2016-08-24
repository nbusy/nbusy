/**
 * Seed data for mongo database.
 */

const mongo = require('./mongo')
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
        from: {_id: 2, name: 'Chuck Norris', picture: '/api/users/2/picture'},
        createdTime: getTime(-26),
        message: 'Also remember that, if you can read this, you are within range of Chuck!'
      },
      {
        _id: new ObjectID(),
        from: {_id: 1, name: 'Morgan the Almighty', picture: '/api/users/1/picture'},
        createdTime: getTime(-24),
        message: 'Ow yeah!'
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
    yield mongo.posts.insert(posts)
  }
}

// export seed data and seed function
seed.users = users
seed.posts = posts
module.exports = seed
