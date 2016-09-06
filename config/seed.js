/**
 * Seed data for mongo database.
 */

const mongodb = require('mongodb')
const config = require('./config')

const ObjectID = mongodb.ObjectID
const now = new Date()

function getTime (h) {
  return new Date(new Date(now).setHours(now.getHours() + h))
}

// declare the seed data
exports.users = [
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

exports.counters = [
  {
    _id: 'userId',
    seq: exports.users.length
  }
]
