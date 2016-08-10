/**
 * Seed data for mongo database.
 */

const mongo = require('./mongo');
const config = require('./config');

const ObjectID = mongo.ObjectID;

// declare the seed data
const users = [
  {
    _id: 1,
    email: 'morgan@nbusy.herokuapp.com',
    password: config.app.pass,
    name: 'Morgan the Almighty',
  },
  {
    _id: 2,
    email: 'chuck@nbusy.herokuapp.com',
    password: config.app.pass,
    name: 'Chuck Norris',

  },
];

const now = new Date();
function getTime(h) {
  return new Date(new Date(now).setHours(now.getHours() + h));
}

var posts = [
  {
    _id: new ObjectID(),
    from: {_id: 1, name: 'Morgan the Almighty', picture: '/api/users/1/picture'},
    message: 'Hi there! This is a sample post demonstrating a KOAN app. KOAN is a simple boilerplate for building full-stack JavaScript Web applications using Koa, AngularJS, and Node.js. It utilizes WebSockets to provide real-time communication between servers and clients, and MongoDB is used for data persistence. There are also numerous Grunt tasks pre-bundled and configured to facilitate development and testing. You can open this site in multiple browser tabs and post something to see how real-time communication works. You can also browse the project’s GitHub page to start building KOAN apps yourself.',
    createdTime: getTime(-97),
    updatedTime: getTime(-24),
    comments: [
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
  }
];

/**
 * Populates the database with seed data.
 * @param overwrite Overwrite existing database even if it is not empty.
 */
function *seed(overwrite) {
  var count = yield mongo.users.count({}, {limit: 1});
  if (overwrite || count === 0) {
    // first remove any leftover data in collections
    var collerrmsg = 'ns not found' /* indicates 'collection not found' error in mongo which is ok */;
    for (var collection in mongo) {
      if (mongo[collection].drop) {
        try {
          yield mongo[collection].drop();
        } catch (err) {
          if (err.message !== collerrmsg) {
            throw err;
          }
        }
      }
    }

    // now populate collections with fresh data
    yield mongo.counters.insert({_id: 'userId', seq: users.length});
    yield mongo.users.insert(users);
    yield mongo.posts.insert(posts);
  }
}

// export seed data and seed function
seed.users = users;
seed.posts = posts;
module.exports = seed;
