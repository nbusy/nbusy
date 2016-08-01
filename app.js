require('babel-register');

const promisifyAll = require('bluebird').promisifyAll,
  asyncFun = require('./asyncFun');

console.log('top level: ', asyncFun.asyncResult);
