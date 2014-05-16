'use strict';

var route = require('koa-route'),
    parse = require('co-body'),
    _ = require('lodash'),
    mongo = require('../config/mongo'),
    ws = require('../config/ws'),
    cache = require('../util/cache'),
    ObjectID = mongo.ObjectID;

// register koa routes
exports.init = function (app) {
  app.use(route.get('/api/chats', listChats));
  app.use(route.post('/api/chats', createChat));
  app.use(route.post('/api/chats/:chatId/messages', createMessage));
};

/**
 * Lists last 25 chats with the last message in each chat.
 */
function *listChats() {
  var user = this.user,
      chats = yield mongo.chats.find(
      {},
      {updatedTime: 1, participants: 1, title: 1, messages: {$slice: -1 /* only get last message in a chat */}},
      {limit: 15, sort: {updateTime: -1}} /* only get last 15 chats by last updated */)
      .toArray();

  chats.forEach(function (chat) {
    chat.id = chat._id;
    delete chat._id;
    chat.lastMessage = chat.messages[0].message;

    if (!chat.title) { // then this is a one-to-one chat
      var otherPerson = _.filter(chat.participants, function (participant) {
        return participant !== user.id;
      })[0];
      otherPerson = cache.getUser(otherPerson);
      chat.title = otherPerson.name;
      chat.picture = otherPerson.picture;
    } else { // then this is a group chat
      chat.picture = '/images/users.jpg';
    }
  });

  this.body = {
    data: chats,
    paging: {
      previous: '',
      next: ''
    }
  };
}

/**
 * Saves a new post in the database after proper validations.
 */
function *createChat() {
  // it is best to validate post body with something like node-validator here, before saving it in the database..
  var post = yield parse(this);
  post.from = this.user;
  post.createdTime = new Date();
  var results = yield mongo.posts.insert(post);

  this.status = 201;
  this.body = results[0]._id.toString(); // we need .toString() here to return text/plain response

  // now notify everyone about this new post
  post.id = post._id;
  delete post._id;
  ws.notify('posts.created', post);
}

/**
 * Appends a new comment to a given post.
 * @param postId - Post ID.
 */
function *createMessage(postId) {
  postId = new ObjectID(postId);
  var comment = yield parse(this);
  var commentId = new ObjectID();

  // update post document with the new comment
  comment = {_id: commentId, from: this.user, createdTime: new Date(), message: comment.message};
  var result = yield mongo.posts.update(
      {_id: postId},
      {$push: {comments: comment}}
  );

  this.status = 201;
  this.body = commentId.toString(); // we need .toString() here to return text/plain response

  // now notify everyone about this new comment
  comment.id = comment._id;
  comment.postId = postId;
  delete comment._id;
  ws.notify('posts.comments.created', comment);
}