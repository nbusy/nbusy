'use strict';

/**
 * In-memory object cache. Destined to use Redis in the future.
 */

var mongo = require('../config/mongo');

exports.init = function *() {
  this.users = yield mongo.users.find({}, {email: 1, name: 1}).toArray();

  this.users.forEach(function (user) {
    user.picture =  'api/users/' + user._id + '/picture';
  });
};

exports.getUser = function (user) {
  return this.users[user];
};