require('babel-register');
const promisifyAll = require('bluebird').promisifyAll;
const asyncFun = require('./asyncFun');

console.log('top level: ', asyncFun.asyncResult);
