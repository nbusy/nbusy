'use strict';

/**
 * Users related utilities like in memory user cache, etc.
 */

var mongo = require('../config/mongo');

var users = yield mongo.posts.find(
    {},
    {email: 1, name: 1}).toArray();

users.forEach(function (user) {
  user.picture =  'api/users/' + user._id + '/picture';
});

exports.users = users;

exports.resolve = function (user) {
  if (typeof user === 'number') {
    return users[user];
  } else if (Array.isArray(user)) {
  }
};